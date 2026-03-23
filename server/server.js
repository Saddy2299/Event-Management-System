// ============================================================
//  EventHub — Event Management System Backend API
//  Stack: Node.js + Express + MongoDB (Mongoose) + JWT
// ============================================================

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));

// ─── DATABASE ─────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/eventmanagement")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ─── MODELS ───────────────────────────────────────────────

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role:     { type: String, enum: ["admin", "organizer", "attendee"], default: "attendee" },
    phone:    { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
userSchema.pre("save", async function () {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 12);
});
const User = mongoose.model("User", userSchema);

const sessionSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  speaker:   { type: String },
  startTime: { type: Date, required: true },
  endTime:   { type: Date, required: true },
  location:  { type: String },
});

const eventSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String },
    date:        { type: Date, required: true },
    endDate:     { type: Date },
    venue:       { type: String, required: true },
    capacity:    { type: Number, required: true, min: 1 },
    category:    { type: String, enum: ["conference", "workshop", "seminar", "festival"], required: true },
    status:      { type: String, enum: ["draft", "published", "ongoing", "completed", "cancelled"], default: "draft" },
    organizer:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sessions:    [sessionSchema],
    tags:        [String],
  },
  { timestamps: true }
);
const Event = mongoose.model("Event", eventSchema);

const registrationSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event:       { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    ticketType:  { type: String, enum: ["free", "paid", "vip"], default: "free" },
    qrCode:      { type: String },
    status:      { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    checkInTime: { type: Date },
  },
  { timestamps: true }
);
registrationSchema.index({ user: 1, event: 1 }, { unique: true });
const Registration = mongoose.model("Registration", registrationSchema);

// ─── HELPERS ──────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || "changeme_secret";
const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const ok  = (res, data, status = 200) => res.status(status).json({ success: true, data });
const err = (res, message, status = 400) => res.status(status).json({ success: false, message });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT) || 587,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

// ─── MIDDLEWARE ───────────────────────────────────────────
const protect = asyncHandler(async (req, res, next) => {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) return err(res, "Not authorized.", 401);
  const decoded = jwt.verify(h.split(" ")[1], JWT_SECRET);
  req.user = await User.findById(decoded.id);
  if (!req.user) return err(res, "User not found.", 401);
  next();
});

const restrictTo = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : err(res, "No permission.", 403);

// ─── AUTH ROUTES ──────────────────────────────────────────
const authRouter = express.Router();

authRouter.post("/register", asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return err(res, "All fields required.");
  if (await User.findOne({ email })) return err(res, "Email already in use.");
  const user = await User.create({ name, email, password, role: role === "organizer" ? "organizer" : "attendee" });
  ok(res, { token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 201);
}));

authRouter.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return err(res, "Email and password required.");
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password)))
    return err(res, "Invalid credentials.", 401);
  ok(res, { token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}));

authRouter.get("/me", protect, asyncHandler(async (req, res) => ok(res, req.user)));
authRouter.patch("/me", protect, asyncHandler(async (req, res) => {
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => ["name","phone"].includes(k)));
  ok(res, await User.findByIdAndUpdate(req.user._id, updates, { new: true }));
}));

app.use("/api/auth", authRouter);

// ─── EVENT ROUTES ─────────────────────────────────────────
const eventRouter = express.Router();

eventRouter.get("/", asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 10 } = req.query;
  const filter = { status: { $in: ["published", "ongoing"] } };
  if (category) filter.category = category;
  if (search)   filter.title = { $regex: search, $options: "i" };
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [events, total] = await Promise.all([
    Event.find(filter).populate("organizer", "name email").sort({ date: 1 }).skip(skip).limit(parseInt(limit)),
    Event.countDocuments(filter),
  ]);
  ok(res, { events, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
}));

eventRouter.get("/:id", asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate("organizer", "name email");
  if (!event) return err(res, "Event not found.", 404);
  ok(res, event);
}));

eventRouter.post("/", protect, restrictTo("organizer", "admin"), asyncHandler(async (req, res) => {
  const event = await Event.create({ ...req.body, organizer: req.user._id });
  ok(res, event, 201);
}));

eventRouter.patch("/:id", protect, restrictTo("organizer", "admin"), asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return err(res, "Event not found.", 404);
  if (req.user.role !== "admin" && event.organizer.toString() !== req.user._id.toString())
    return err(res, "Not your event.", 403);
  Object.keys(req.body).forEach(k => { event[k] = req.body[k]; });
  await event.save();
  ok(res, event);
}));

eventRouter.delete("/:id", protect, restrictTo("organizer", "admin"), asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return err(res, "Event not found.", 404);
  await event.deleteOne();
  ok(res, { message: "Deleted." });
}));

eventRouter.patch("/:id/publish", protect, restrictTo("organizer", "admin"), asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, { status: "published" }, { new: true });
  ok(res, event);
}));

eventRouter.get("/:id/registrations", protect, restrictTo("organizer", "admin"), asyncHandler(async (req, res) => {
  ok(res, await Registration.find({ event: req.params.id }).populate("user", "name email phone"));
}));

app.use("/api/events", eventRouter);

// ─── REGISTRATION ROUTES ──────────────────────────────────
const regRouter = express.Router();

regRouter.post("/", protect, asyncHandler(async (req, res) => {
  const { eventId, ticketType = "free" } = req.body;
  const event = await Event.findById(eventId);
  if (!event) return err(res, "Event not found.", 404);
  if (!["published","ongoing"].includes(event.status)) return err(res, "Registrations not open.");
  const count = await Registration.countDocuments({ event: eventId, status: { $ne: "cancelled" } });
  if (count >= event.capacity) return err(res, "Event is full.");
  if (await Registration.findOne({ user: req.user._id, event: eventId })) return err(res, "Already registered.");
  const qrCode = await QRCode.toDataURL(JSON.stringify({ userId: req.user._id, eventId }));
  const reg = await Registration.create({ user: req.user._id, event: eventId, ticketType, qrCode, status: "confirmed" });
  // Send confirmation email
  try {
    await transporter.sendMail({
      from: `"EventHub" <no-reply@eventhub.com>`,
      to: req.user.email,
      subject: `Registration Confirmed — ${event.title}`,
      html: `<h2>Registered for ${event.title}!</h2><p>Date: ${event.date}</p><p>Venue: ${event.venue}</p><p>Ticket: ${ticketType}</p>`
    });
  } catch(e) { console.warn("Email failed:", e.message); }
  ok(res, reg, 201);
}));

regRouter.get("/my", protect, asyncHandler(async (req, res) => {
  ok(res, await Registration.find({ user: req.user._id }).populate("event", "title date venue status"));
}));

regRouter.get("/:id", protect, asyncHandler(async (req, res) => {
  const reg = await Registration.findById(req.params.id).populate("user","name email").populate("event","title date venue");
  if (!reg) return err(res, "Not found.", 404);
  ok(res, reg);
}));

regRouter.patch("/:id/cancel", protect, asyncHandler(async (req, res) => {
  const reg = await Registration.findById(req.params.id);
  if (!reg) return err(res, "Not found.", 404);
  if (reg.user.toString() !== req.user._id.toString() && req.user.role !== "admin") return err(res, "Access denied.", 403);
  reg.status = "cancelled";
  await reg.save();
  ok(res, reg);
}));

regRouter.patch("/:id/checkin", protect, restrictTo("admin","organizer"), asyncHandler(async (req, res) => {
  const reg = await Registration.findByIdAndUpdate(req.params.id, { checkInTime: new Date() }, { new: true });
  ok(res, reg);
}));

app.use("/api/registrations", regRouter);

// ─── ADMIN ROUTES ─────────────────────────────────────────
const adminRouter = express.Router();
adminRouter.use(protect, restrictTo("admin"));

adminRouter.get("/stats", asyncHandler(async (req, res) => {
  const [totalEvents, totalUsers, totalRegs, recentRegs] = await Promise.all([
    Event.countDocuments(),
    User.countDocuments(),
    Registration.countDocuments({ status: "confirmed" }),
    Registration.find().sort({ createdAt: -1 }).limit(5).populate("user","name email").populate("event","title date"),
  ]);
  ok(res, { totalEvents, totalUsers, totalRegistrations: totalRegs, recentRegistrations: recentRegs });
}));

adminRouter.get("/users", asyncHandler(async (req, res) => ok(res, await User.find().sort({ createdAt: -1 }))));
adminRouter.patch("/users/:id/role", asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
  ok(res, user);
}));
adminRouter.delete("/users/:id", asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  ok(res, { message: "Deleted." });
}));

app.use("/api/admin", adminRouter);

// ─── ERROR HANDLER ────────────────────────────────────────
app.use((error, req, res, next) => {
  console.error(error);
  if (error.name === "JsonWebTokenError") return err(res, "Invalid token.", 401);
  if (error.name === "TokenExpiredError")  return err(res, "Token expired.", 401);
  if (error.code === 11000) return err(res, "Duplicate value.");
  err(res, error.message || "Server error.", 500);
});

// ─── START ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

module.exports = app;
