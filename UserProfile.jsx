import { useState } from "react";

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
// Field names match the database schema exactly.
// When backend is ready, replace these objects with data fetched from the API.

const sampleStudent = {
  profileid: "1234567",
  role: "student",
  name: "Nadia Gonsalves",
  department: "Electrical & Computer Engineering",
  title: "BASc Engineering, first year",
  research_interests: ["Machine Learning", "UX Design", "Open Source", "EdTech"],
  bio: "Passionate about building accessible software and exploring the intersection of AI and education. Currently seeking summer internships in full-stack development.",
  skills: ["Python", "React", "SQL", "TensorFlow"],
  connections: ["p2", "p3", "s2"],
  verified: false,
  openings: 0,
  // UI-only fields (not in DB yet)
  email: "a.mensah@university.edu",
  phone: "+1 (416) 555-0192",
};

const sampleProfessor = {
  profileid: "23823291",
  role: "professor",
  name: "Prof. Deepa Kundur",
  department: "Electrical & Computer Engineering",
  title: "Professor & Chair",
  research_interests: ["Cybersecurity", "Smart Grid", "Cyber-Physical Systems", "Signal Processing"],
  bio: "Chair of ECE at UofT. Holds the Canada Research Chair in Cybersecurity of Critical Infrastructure. Research spans smart grid security and cyber-physical systems.",
  skills: ["Signal Processing", "Network Security", "Machine Learning"],
  connections: ["p2", "p4", "s1"],
  verified: true,
  openings: 2,
  // UI-only fields (not in DB yet)
  email: "d.kundur@university.edu",
  phone: "+1 (416) 555-0340",
};

// ── Change to `sampleProfessor` to preview professor view ──
const user = sampleProfessor;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const roleConfig = {
  student: {
    badge: "Student",
    badgeColor: "#6ea8c9",
    accentColor: "#c9a96e",
    tagsLabel: "Interests",
    skillsLabel: "Skills",
  },
  professor: {
    badge: "Faculty",
    badgeColor: "#BF6987",
    accentColor: "#9e7bca",
    tagsLabel: "Research Interests",
    skillsLabel: "Expertise",
  },
};

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("overview");
  const config = roleConfig[user.role]; //this makes sure the correct setting is used depending on the role (student or prof)
  const accent = config.accentColor;

  //to get the intial of the name, ignores prefix Prof or Dr
  const initials = user.name
    .replace(/^(Prof\.|Dr\.)\s*/i, "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,600;0,800;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .tab-btn {
          background: none; border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 10px 20px; cursor: pointer; color: #666;
          border-bottom: 2px solid transparent; transition: all 0.2s;
        }
        .tab-btn:hover { color: ${accent}; }
        .tab-btn.active { color: ${accent}; border-bottom-color: ${accent}; }

        .skill-bar-fill {
          height: 100%; border-radius: 4px;
          background: linear-gradient(90deg, ${accent}, ${accent}bb);
          transition: width 1s ease;
        }
        .tag {
          display: inline-block;
          background: ${accent}18; color: ${accent};
          border: 1px solid ${accent}33; border-radius: 20px;
          padding: 5px 14px; font-size: 12px; font-weight: 500;
          letter-spacing: 0.04em; margin: 4px;
        }
        .connect-btn {
          background: ${accent}; color: #0d0d12; border: none;
          border-radius: 8px; padding: 10px 24px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          font-weight: 600; letter-spacing: 0.06em; cursor: pointer;
          transition: opacity 0.2s; flex: 1;
        }
        .connect-btn:hover { opacity: 0.85; }
        .msg-btn {
          background: transparent; color: ${accent};
          border: 1px solid ${accent}44; border-radius: 8px;
          padding: 10px 24px; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; letter-spacing: 0.06em;
          cursor: pointer; transition: all 0.2s; flex: 1;
        }
        .msg-btn:hover { background: ${accent}12; }
        .stat-card { transition: border-color 0.2s; }
        .stat-card:hover { border-color: ${accent}44 !important; }
        .skill-tag {
          display: inline-block; background: rgba(255,255,255,0.04);
          color: #ccc; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px; padding: 6px 14px; font-size: 13px;
          margin: 4px; transition: all 0.2s;
        }
        .skill-tag:hover { border-color: ${accent}44; color: ${accent}; }
      `}</style>

      {/* Header */}
      <div style={styles.headerStrip}>
        <span style={styles.headerLabel}>UOFTVERSE</span>
        <span style={{ ...styles.headerDot, background: accent }} />
        <span style={styles.headerLabel}>PROFILE</span>
        <span style={{ flex: 1 }} />
        <span style={{ ...styles.rolePill, background: config.badgeColor + "18", color: config.badgeColor, border: `1px solid ${config.badgeColor}33` }}>
          {config.badge}
        </span>
      </div>

      <div style={styles.container}>
        {/* ── SIDEBAR ── */}
        <aside style={styles.sidebar}>
          <div style={styles.avatarWrapper}>
            <div style={{ ...styles.avatarRing, background: `conic-gradient(${accent} 0%, ${accent}66 50%, ${accent} 100%)` }} />
            <div style={{ ...styles.avatar, color: accent }}>{initials}</div>
            <div style={styles.statusDot} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <h1 style={styles.name}>{user.name}</h1>
            {user.verified && <span style={styles.verifiedBadge}>✓ Verified</span>}
          </div>
          <p style={styles.titleText}>{user.title}</p>
          <p style={styles.department}>{user.department}</p>

          <div style={{ marginTop: 10 }}>
            <span style={{ ...styles.badge, background: config.badgeColor + "18", color: config.badgeColor, border: `1px solid ${config.badgeColor}33` }}>
              {config.badge}
            </span>
          </div>

          <div style={styles.divider} />

          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <button className="connect-btn">Connect</button>
            <button className="msg-btn">Message</button>
          </div>

          {/* Info — mirrors DB fields */}
          <div style={styles.infoList}>
            {[
              { label: "Profile ID",   value: user.profileid },
              { label: "Role",         value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
              { label: "Email",        value: user.email },
              { label: "Phone",        value: user.phone },
              { label: "Connections",  value: `${user.connections.length} connections` },
              ...(user.role === "professor" && user.openings > 0
                ? [{ label: "Research Openings", value: `${user.openings} open position${user.openings > 1 ? "s" : ""}` }]
                : []),
            ].map((item) => (
              <div key={item.label} style={styles.infoRow}>
                <span style={styles.infoLabel}>{item.label}</span>
                <span style={{ ...styles.infoValue, ...(item.label === "Research Openings" ? { color: "#4ade80" } : {}) }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div style={styles.divider} />

          {/* Connections stat */}
          <div style={{ ...styles.statHighlight, borderColor: accent + "33", background: accent + "0e" }}>
            <span style={{ ...styles.statBigNum, color: accent }}>{user.connections.length}</span>
            <span style={styles.statSmallLabel}>Connections</span>
          </div>

          {/* Research openings banner — professors only */}
          {user.role === "professor" && user.openings > 0 && (
            <div style={styles.openingsBanner}>
              <span style={{ fontSize: 18 }}>🔬</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#4ade80" }}>
                  {user.openings} Research Opening{user.openings > 1 ? "s" : ""}
                </p>
                <p style={{ fontSize: 11, color: "#888", marginTop: 2 }}>Accepting student applications</p>
              </div>
            </div>
          )}
        </aside>

        {/* ── MAIN ── */}
        <main style={styles.main}>
          <div style={styles.tabs}>
            {["overview"].map((tab) => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div style={styles.tabContent}>
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Bio</h2>
                <p style={styles.bio}>{user.bio}</p>
              </section>

              <div style={styles.statsGrid}>
                {[
                  { label: "Connections",       value: user.connections.length },
                  { label: config.tagsLabel,    value: user.research_interests.length },
                  { label: "Skills",            value: user.skills.length },
                  user.role === "professor"
                    ? { label: "Openings", value: user.openings }
                    : { label: "Verified",  value: user.verified ? "✓" : "—" },
                ].map((s) => (
                  <div key={s.label} className="stat-card" style={styles.statCard}>
                    <span style={styles.statValue}>{s.value}</span>
                    <span style={styles.statLabel}>{s.label}</span>
                  </div>
                ))}
              </div>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>{config.tagsLabel}</h2>
                <div style={{ marginTop: 10 }}>
                  {user.research_interests.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>{config.skillsLabel}</h2>
                <div style={{ marginTop: 10 }}>
                  {user.skills.map((s) => <span key={s} className="skill-tag">{s}</span>)}
                </div>
              </section>
            </div>
          )}

          {/* INTERESTS / RESEARCH INTERESTS — maps to `research_interests` */}


          {/* SKILLS / EXPERTISE — maps to `skills` */}

        </main>
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = {
  page: { minHeight: "100vh", background: "#0d0d12", fontFamily: "'DM Sans', sans-serif", color: "#e0ddd6" },
  headerStrip: { display: "flex", alignItems: "center", gap: 10, padding: "12px 40px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" },
  headerLabel: { fontSize: 10, letterSpacing: "0.18em", color: "#555", fontWeight: 500 },
  headerDot: { width: 4, height: 4, borderRadius: "50%" },
  rolePill: { fontSize: 11, letterSpacing: "0.08em", fontWeight: 600, padding: "3px 12px", borderRadius: 20 },
  container: { display: "flex", maxWidth: 1100, margin: "0 auto", padding: "40px 24px" },
  sidebar: { width: 290, flexShrink: 0, paddingRight: 40, borderRight: "1px solid rgba(255,255,255,0.06)" },
  avatarWrapper: { position: "relative", width: 80, height: 80, marginBottom: 20 },
  avatarRing: { position: "absolute", inset: -3, borderRadius: "50%", opacity: 0.6 },
  avatar: { position: "relative", width: 80, height: 80, borderRadius: "50%", background: "#1e1b14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontFamily: "'Fraunces', serif", fontWeight: 600, border: "2px solid #0d0d12" },
  statusDot: { position: "absolute", bottom: 3, right: 3, width: 12, height: 12, borderRadius: "50%", background: "#4ade80", border: "2px solid #0d0d12" },
  name: { fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: "#f0ece2", lineHeight: 1.2 },
  verifiedBadge: { fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: "#4ade80", background: "#4ade8018", border: "1px solid #4ade8033", borderRadius: 20, padding: "2px 8px" },
  titleText: { fontSize: 13, color: "#aaa", marginTop: 4, fontWeight: 400 },
  department: { fontSize: 12, color: "#666", marginTop: 2, fontWeight: 300 },
  badge: { display: "inline-block", borderRadius: 4, padding: "3px 10px", fontSize: 11, letterSpacing: "0.08em", fontWeight: 600 },
  divider: { height: 1, background: "rgba(255,255,255,0.06)", margin: "20px 0" },
  infoList: { display: "flex", flexDirection: "column", gap: 12 },
  infoRow: { display: "flex", flexDirection: "column", gap: 2 },
  infoLabel: { fontSize: 10, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" },
  infoValue: { fontSize: 13, color: "#ccc", fontWeight: 400 },
  statHighlight: { display: "flex", flexDirection: "column", alignItems: "center", padding: "16px", border: "1px solid", borderRadius: 10, gap: 4, marginBottom: 12 },
  statBigNum: { fontFamily: "'Fraunces', serif", fontSize: 42, fontWeight: 800, lineHeight: 1 },
  statSmallLabel: { fontSize: 11, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" },
  openingsBanner: { display: "flex", alignItems: "center", gap: 12, padding: "14px", background: "#4ade8010", border: "1px solid #4ade8030", borderRadius: 10, marginTop: 4 },
  main: { flex: 1, paddingLeft: 40 },
  tabs: { display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 32 },
  tabContent: { display: "flex", flexDirection: "column", gap: 32 },
  section: {},
  sectionTitle: { fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: "#f0ece2", marginBottom: 12, fontStyle: "italic" },
  dbNote: { fontSize: 12, color: "#555", marginBottom: 4 },
  bio: { fontSize: 14, color: "#999", lineHeight: 1.75, maxWidth: 560 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 },
  statCard: { padding: "16px 12px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  statValue: { fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 700, color: "#f0ece2" },
  statLabel: { fontSize: 11, color: "#666", letterSpacing: "0.08em", textTransform: "uppercase" },
  skillRow: { marginBottom: 20 },
  skillMeta: { display: "flex", justifyContent: "space-between", marginBottom: 6 },
  skillName: { fontSize: 13, color: "#ccc", fontWeight: 500 },
  skillTrack: { height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" },
};
