import { useState } from "react";

const COLORS = {
  bg: "#0A0E1A",
  surface: "#111827",
  card: "#1A2235",
  border: "#1E2D45",
  accent: "#4F8EF7",
  accentGlow: "#4F8EF740",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  text: "#E8EDF5",
  muted: "#6B7A99",
  highlight: "#C8D8FF",
};

const styles = {
  app: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: COLORS.bg,
    color: COLORS.text,
    minHeight: "100vh",
    display: "flex",
  },
  sidebar: {
    width: 220,
    background: COLORS.surface,
    borderRight: `1px solid ${COLORS.border}`,
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  logo: {
    padding: "24px 20px 20px",
    borderBottom: `1px solid ${COLORS.border}`,
    marginBottom: 8,
  },
  logoText: { fontSize: 18, fontWeight: 700, color: COLORS.accent, letterSpacing: "-0.5px" },
  logoSub: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  navItem: (active) => ({
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 20px", cursor: "pointer",
    background: active ? `${COLORS.accent}18` : "transparent",
    borderLeft: active ? `3px solid ${COLORS.accent}` : "3px solid transparent",
    color: active ? COLORS.accent : COLORS.muted,
    fontSize: 14, fontWeight: active ? 600 : 400,
    transition: "all 0.15s", userSelect: "none",
  }),
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar: {
    background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`,
    padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  pageTitle: { fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" },
  avatar: {
    width: 36, height: 36, borderRadius: "50%",
    background: `linear-gradient(135deg, ${COLORS.accent}, #7C3AED)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
  },
  content: { flex: 1, padding: "28px", overflowY: "auto" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 },
  statCard: { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "20px 22px" },
  statLabel: { fontSize: 12, color: COLORS.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" },
  statValue: { fontSize: 28, fontWeight: 700, letterSpacing: "-1px" },
  statDelta: (up) => ({ fontSize: 12, color: up ? COLORS.success : COLORS.danger, marginTop: 4 }),
  card: { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "20px 22px", marginBottom: 20 },
  cardTitle: { fontSize: 15, fontWeight: 600, marginBottom: 16 },
  badge: (type) => {
    const map = {
      published: { bg: "#22C55E20", color: COLORS.success },
      draft: { bg: "#6B7A9920", color: COLORS.muted },
      ongoing: { bg: "#4F8EF720", color: COLORS.accent },
      completed: { bg: "#7C3AED20", color: "#A78BFA" },
      free: { bg: "#22C55E20", color: COLORS.success },
      paid: { bg: "#F59E0B20", color: COLORS.warning },
      vip: { bg: "#EC489920", color: "#F472B6" },
    };
    const s = map[type] || map.draft;
    return {
      display: "inline-block", padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, textTransform: "capitalize",
    };
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 600,
    color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.5px",
    borderBottom: `1px solid ${COLORS.border}`,
  },
  td: { padding: "13px 14px", fontSize: 13, borderBottom: `1px solid ${COLORS.border}20`, verticalAlign: "middle" },
  btn: (variant = "primary") => ({
    padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer",
    fontSize: 13, fontWeight: 600,
    background: variant === "primary" ? COLORS.accent : COLORS.card,
    color: variant === "primary" ? "#fff" : COLORS.text,
    border: variant === "ghost" ? `1px solid ${COLORS.border}` : "none",
    transition: "all 0.15s",
  }),
  input: {
    width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
    borderRadius: 8, padding: "10px 14px", color: COLORS.text, fontSize: 14, outline: "none", boxSizing: "border-box",
  },
  label: { fontSize: 12, color: COLORS.muted, marginBottom: 6, display: "block", fontWeight: 500 },
  formGroup: { marginBottom: 16 },
};

const mockEvents = [
  { id: 1, title: "TechConf 2026", date: "Apr 10, 2026", venue: "Auditorium A", capacity: 300, registered: 218, status: "published", category: "Conference" },
  { id: 2, title: "React Workshop", date: "Apr 18, 2026", venue: "Lab 3", capacity: 50, registered: 47, status: "published", category: "Workshop" },
  { id: 3, title: "AI Seminar", date: "May 2, 2026", venue: "Hall B", capacity: 150, registered: 0, status: "draft", category: "Seminar" },
  { id: 4, title: "Cultural Fest", date: "Mar 28, 2026", venue: "Open Ground", capacity: 1000, registered: 763, status: "ongoing", category: "Festival" },
  { id: 5, title: "Alumni Meet", date: "Feb 15, 2026", venue: "Convention Ctr", capacity: 200, registered: 200, status: "completed", category: "Conference" },
];

const mockRegistrations = [
  { id: 1, name: "Priya Sharma", email: "priya@example.com", event: "TechConf 2026", ticket: "paid", date: "Mar 20", status: "confirmed" },
  { id: 2, name: "Rahul Verma", email: "rahul@example.com", event: "React Workshop", ticket: "vip", date: "Mar 19", status: "confirmed" },
  { id: 3, name: "Anita Roy", email: "anita@example.com", event: "Cultural Fest", ticket: "free", date: "Mar 18", status: "confirmed" },
  { id: 4, name: "Dev Patel", email: "dev@example.com", event: "TechConf 2026", ticket: "paid", date: "Mar 17", status: "confirmed" },
  { id: 5, name: "Sneha K.", email: "sneha@example.com", event: "React Workshop", ticket: "paid", date: "Mar 16", status: "pending" },
];

function Dashboard() {
  const stats = [
    { label: "Total Events", value: "24", delta: "+3 this month", up: true },
    { label: "Registrations", value: "1,228", delta: "+142 this week", up: true },
    { label: "Active Users", value: "843", delta: "+28 today", up: true },
    { label: "Completion Rate", value: "94%", delta: "-2% vs last", up: false },
  ];
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>Welcome back 👋</div>
        <div style={{ color: COLORS.muted, fontSize: 14, marginTop: 4 }}>Here's what's happening with your events today.</div>
      </div>
      <div style={styles.grid4}>
        {stats.map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statLabel}>{s.label}</div>
            <div style={styles.statValue}>{s.value}</div>
            <div style={styles.statDelta(s.up)}>{s.delta}</div>
          </div>
        ))}
      </div>
      <div style={styles.grid2}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Upcoming Events</div>
          {mockEvents.filter(e => e.status !== "completed").slice(0, 4).map(ev => (
            <div key={ev.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}20` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{ev.title}</div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>{ev.date} · {ev.venue}</div>
              </div>
              <span style={styles.badge(ev.status)}>{ev.status}</span>
            </div>
          ))}
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Registration Overview</div>
          {mockEvents.slice(0, 4).map(ev => (
            <div key={ev.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                <span>{ev.title}</span>
                <span style={{ color: COLORS.muted }}>{ev.registered}/{ev.capacity}</span>
              </div>
              <div style={{ background: COLORS.border, borderRadius: 4, height: 6 }}>
                <div style={{ width: `${Math.min((ev.registered / ev.capacity) * 100, 100)}%`, background: ev.registered / ev.capacity > 0.9 ? COLORS.danger : COLORS.accent, height: 6, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>Recent Registrations</div>
        <table style={styles.table}>
          <thead>
            <tr>{["Attendee", "Event", "Ticket", "Date", "Status"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {mockRegistrations.slice(0, 4).map(r => (
              <tr key={r.id}>
                <td style={styles.td}><div style={{ fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11, color: COLORS.muted }}>{r.email}</div></td>
                <td style={styles.td}>{r.event}</td>
                <td style={styles.td}><span style={styles.badge(r.ticket)}>{r.ticket}</span></td>
                <td style={styles.td}>{r.date}</td>
                <td style={styles.td}><span style={styles.badge(r.status === "confirmed" ? "published" : "draft")}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Events() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", date: "", venue: "", capacity: "", category: "Conference" });
  const filtered = mockEvents.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div><div style={{ fontSize: 20, fontWeight: 700 }}>Events</div><div style={{ color: COLORS.muted, fontSize: 13 }}>Manage all events</div></div>
        <button style={styles.btn("primary")} onClick={() => setShowForm(!showForm)}>+ Create Event</button>
      </div>
      {showForm && (
        <div style={{ ...styles.card, borderColor: COLORS.accent + "50" }}>
          <div style={styles.cardTitle}>Create New Event</div>
          <div style={styles.grid2}>
            {[["Event Title", "title", "text", "TechConf 2026"], ["Venue", "venue", "text", "Auditorium A"], ["Date", "date", "date", ""], ["Capacity", "capacity", "number", "300"]].map(([label, key, type, ph]) => (
              <div key={key} style={styles.formGroup}>
                <label style={styles.label}>{label}</label>
                <input type={type} style={styles.input} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select style={styles.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {["Conference", "Workshop", "Seminar", "Festival"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={styles.btn("primary")}>Save Draft</button>
            <button style={styles.btn("ghost")} onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      <div style={styles.card}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <input style={{ ...styles.input, maxWidth: 280 }} placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <table style={styles.table}>
          <thead><tr>{["Event", "Category", "Date", "Venue", "Capacity", "Registered", "Status", "Actions"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(ev => (
              <tr key={ev.id}>
                <td style={styles.td}><span style={{ fontWeight: 600 }}>{ev.title}</span></td>
                <td style={styles.td}>{ev.category}</td>
                <td style={styles.td}>{ev.date}</td>
                <td style={styles.td}>{ev.venue}</td>
                <td style={styles.td}>{ev.capacity}</td>
                <td style={styles.td}>{ev.registered}</td>
                <td style={styles.td}><span style={styles.badge(ev.status)}>{ev.status}</span></td>
                <td style={styles.td}>
                  <button style={{ ...styles.btn("ghost"), padding: "5px 10px", fontSize: 12 }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Registrations() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}><div style={{ fontSize: 20, fontWeight: 700 }}>Registrations</div><div style={{ color: COLORS.muted, fontSize: 13 }}>View all attendee registrations</div></div>
      <div style={styles.grid4}>
        {[{ label: "Total", value: "1,228", color: COLORS.accent }, { label: "Confirmed", value: "1,159", color: COLORS.success }, { label: "Pending", value: "69", color: COLORS.warning }, { label: "Cancelled", value: "12", color: COLORS.danger }].map(s => (
          <div key={s.label} style={{ ...styles.statCard, borderLeft: `3px solid ${s.color}` }}>
            <div style={styles.statLabel}>{s.label}</div>
            <div style={{ ...styles.statValue, fontSize: 22, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={styles.card}>
        <table style={styles.table}>
          <thead><tr>{["Attendee", "Event", "Ticket Type", "Registered", "Status"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
          <tbody>
            {mockRegistrations.map(r => (
              <tr key={r.id}>
                <td style={styles.td}><div style={{ fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11, color: COLORS.muted }}>{r.email}</div></td>
                <td style={styles.td}>{r.event}</td>
                <td style={styles.td}><span style={styles.badge(r.ticket)}>{r.ticket}</span></td>
                <td style={styles.td}>{r.date}</td>
                <td style={styles.td}><span style={styles.badge(r.status === "confirmed" ? "published" : "draft")}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "attendee" });
  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "40px 36px", width: 380, boxShadow: `0 0 60px ${COLORS.accentGlow}` }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.accent }}>⬡ EventHub</div>
          <div style={{ fontSize: 14, color: COLORS.muted, marginTop: 6 }}>{isLogin ? "Sign in to your account" : "Create a new account"}</div>
        </div>
        {!isLogin && (
          <div style={styles.formGroup}><label style={styles.label}>Full Name</label><input style={styles.input} placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
        )}
        <div style={styles.formGroup}><label style={styles.label}>Email</label><input style={styles.input} placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
        <div style={styles.formGroup}><label style={styles.label}>Password</label><input type="password" style={styles.input} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
        {!isLogin && (
          <div style={styles.formGroup}><label style={styles.label}>Role</label>
            <select style={styles.input} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="attendee">Attendee</option><option value="organizer">Organizer</option>
            </select>
          </div>
        )}
        <button style={{ ...styles.btn("primary"), width: "100%", padding: "12px", marginTop: 4 }} onClick={onLogin}>{isLogin ? "Sign In" : "Create Account"}</button>
        <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: COLORS.muted }}>
          {isLogin ? "No account?" : "Have an account?"}{" "}
          <span style={{ color: COLORS.accent, cursor: "pointer", fontWeight: 600 }} onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Sign Up" : "Sign In"}</span>
        </div>
      </div>
    </div>
  );
}

function RegistrationModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", ticket: "free" });
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000090", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "32px 36px", width: 420 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <div><div style={{ fontSize: 17, fontWeight: 700 }}>Register for TechConf 2026</div><div style={{ fontSize: 12, color: COLORS.muted }}>Step {step} of 2</div></div>
          <button style={{ ...styles.btn("ghost"), padding: "4px 10px" }} onClick={onClose}>✕</button>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {[1, 2].map(s => <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= step ? COLORS.accent : COLORS.border }} />)}
        </div>
        {step === 1 ? (
          <>
            <div style={styles.formGroup}><label style={styles.label}>Full Name</label><input style={styles.input} placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div style={styles.formGroup}><label style={styles.label}>Email</label><input style={styles.input} placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <button style={{ ...styles.btn("primary"), width: "100%", padding: "11px" }} onClick={() => setStep(2)}>Continue →</button>
          </>
        ) : (
          <>
            <div style={styles.formGroup}><label style={styles.label}>Ticket Type</label>
              {["free", "paid", "vip"].map(t => (
                <div key={t} onClick={() => setForm({ ...form, ticket: t })} style={{ padding: "12px 14px", borderRadius: 8, border: `1px solid ${form.ticket === t ? COLORS.accent : COLORS.border}`, background: form.ticket === t ? `${COLORS.accent}15` : "transparent", cursor: "pointer", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{t}</span>
                  <span style={{ color: COLORS.muted }}>{t === "free" ? "₹0" : t === "paid" ? "₹499" : "₹999"}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...styles.btn("ghost"), flex: 1 }} onClick={() => setStep(1)}>← Back</button>
              <button style={{ ...styles.btn("primary"), flex: 2, padding: "11px" }} onClick={onClose}>✓ Confirm</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function BrowseEvents({ onRegister }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}><div style={{ fontSize: 20, fontWeight: 700 }}>Browse Events</div><div style={{ color: COLORS.muted, fontSize: 13 }}>Discover and register for upcoming events</div></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {mockEvents.filter(e => e.status !== "completed").map(ev => (
          <div key={ev.id} style={{ ...styles.card, marginBottom: 0 }}>
            <div style={{ height: 80, borderRadius: 8, marginBottom: 14, background: `linear-gradient(135deg, ${COLORS.accent}30, #7C3AED30)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
              {ev.category === "Conference" ? "🎤" : ev.category === "Workshop" ? "🛠" : ev.category === "Festival" ? "🎉" : "📚"}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{ev.title}</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 10 }}>{ev.date} · {ev.venue}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={styles.badge(ev.status)}>{ev.status}</span>
              <span style={{ fontSize: 12, color: COLORS.muted }}>{ev.capacity - ev.registered} seats left</span>
            </div>
            <button style={{ ...styles.btn("primary"), width: "100%", padding: "9px" }} onClick={onRegister}>Register Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("login");
  const [activePage, setActivePage] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "events", label: "Events", icon: "📅" },
    { id: "registrations", label: "Registrations", icon: "📋" },
    { id: "browse", label: "Browse Events", icon: "◉" },
    { id: "users", label: "Users", icon: "👥" },
  ];

  if (page === "login") return <AuthPage onLogin={() => setPage("app")} />;

  return (
    <div style={styles.app}>
      {showModal && <RegistrationModal onClose={() => setShowModal(false)} />}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoText}>⬡ EventHub</div>
          <div style={styles.logoSub}>Management System</div>
        </div>
        {navItems.map(item => (
          <div key={item.id} style={styles.navItem(activePage === item.id)} onClick={() => setActivePage(item.id)}>
            <span style={{ fontSize: 14 }}>{item.icon}</span>{item.label}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ padding: "12px 0", borderTop: `1px solid ${COLORS.border}` }}>
          <div style={styles.navItem(false)} onClick={() => setPage("login")}>↩ Sign Out</div>
        </div>
      </div>
      <div style={styles.main}>
        <div style={styles.topbar}>
          <div style={styles.pageTitle}>{navItems.find(n => n.id === activePage)?.label}</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 20 }}>🔔</span>
            <div style={styles.avatar}>SK</div>
          </div>
        </div>
        <div style={styles.content}>
          {activePage === "dashboard" && <Dashboard />}
          {activePage === "events" && <Events />}
          {activePage === "registrations" && <Registrations />}
          {activePage === "browse" && <BrowseEvents onRegister={() => setShowModal(true)} />}
          {activePage === "users" && <div style={styles.card}><div style={styles.cardTitle}>Users</div><div style={{ color: COLORS.muted }}>User management — Milestone 3</div></div>}
        </div>
      </div>
    </div>
  );
}
