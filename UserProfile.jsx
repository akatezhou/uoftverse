import { useState, useEffect } from "react";

const LAMBDA_URL = "https://rdiue4s3any4wrmug3te72saim0dkual.lambda-url.us-west-2.on.aws";

const PROXIES = [
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
];

const FALLBACK = {
  id: "profile_s1",
  role: "student",
  name: "Noah Balatbat",
  department: "Electrical & Computer Engineering",
  title: "1st Year Undergraduate",
  research_interests: ["AI", "Robotics", "Chip Design"],
  bio: "ECE student interested in machine learning and robotics research.",
  skills: ["Python", "AWS", "React"],
  verified: true,
  openings: 0,
  email: "noah@student.utoronto.ca",
};

const roleConfig = {
  student:   { badge: "Student", accentColor: "#1a3a5c", tagsLabel: "Interests",         skillsLabel: "Skills"    },
  professor: { badge: "Faculty", accentColor: "#1a3a5c", tagsLabel: "Research Interests", skillsLabel: "Expertise" },
};

function Skeleton({ width = "100%", height = 14, radius = 6, style = {} }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",
      backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite", ...style,
    }} />
  );
}

async function fetchWithFallback(signal) {
  const attempts = [
    () => fetch(LAMBDA_URL, { signal }),
    ...PROXIES.map(proxy => () => fetch(proxy(LAMBDA_URL), { signal })),
  ];

  for (const attempt of attempts) {
    try {
      const res = await attempt();
      const text = await res.text();
      if (!res.ok) continue;
      const data = JSON.parse(text);

      const profile =
        data?.user ?? data?.profile ?? data?.Item ?? data?.data ??
        (typeof data?.body === "string" ? JSON.parse(data.body) :
         typeof data?.body === "object" ? data.body : null) ??
        data;

      if (!profile || typeof profile !== "object" || Array.isArray(profile)) continue;

      profile.research_interests = profile.research_interests ?? [];
      profile.skills   = profile.skills   ?? [];
      profile.role     = profile.role     ?? "student";
      profile.openings = profile.openings ?? 0;

      return profile;
    } catch (err) {
      if (err.name === "AbortError") throw err;
    }
  }
  return null;
}

export default function UserProfile() {
  const [user,      setUser]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const controller = new AbortController();
    fetchWithFallback(controller.signal)
      .then(profile => setUser(profile ?? FALLBACK))
      .catch(err => { if (err.name !== "AbortError") setUser(FALLBACK); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const config  = roleConfig[user?.role] ?? roleConfig.student;
  const accent  = config.accentColor;
  const initials = user
    ? user.name.replace(/^(Prof\.|Dr\.)\s*/i, "").split(" ").map(n => n[0]).slice(0, 2).join("")
    : "";

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .loaded { animation: fadeIn 0.35s ease both; }
        .tab-btn {
          background: none; border: none; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 10px 20px; cursor: pointer;
          color: #999; border-bottom: 2px solid transparent; transition: all 0.2s;
        }
        .tab-btn:hover  { color: ${accent}; }
        .tab-btn.active { color: ${accent}; border-bottom-color: ${accent}; }
        .tag {
          display: inline-block; background: ${accent}12; color: ${accent};
          border: 1px solid ${accent}44; border-radius: 20px;
          padding: 5px 14px; font-size: 12px; font-weight: 500;
          letter-spacing: 0.04em; margin: 4px; font-family: 'DM Sans', sans-serif;
        }
        .connect-btn {
          background: ${accent}; color: #fff; border: none; border-radius: 8px;
          padding: 10px 24px; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.2s; flex: 1;
        }
        .connect-btn:hover { opacity: 0.85; }
        .msg-btn {
          background: transparent; color: ${accent}; border: 1px solid ${accent}66;
          border-radius: 8px; padding: 10px 24px; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; flex: 1;
        }
        .msg-btn:hover { background: ${accent}08; }
        .stat-card { transition: border-color 0.2s; }
        .stat-card:hover { border-color: ${accent}55 !important; }
        .skill-tag {
          display: inline-block; background: #f5f5f5; color: #333;
          border: 1px solid #ddd; border-radius: 6px; padding: 6px 14px;
          font-size: 13px; margin: 4px; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .skill-tag:hover { border-color: ${accent}66; color: ${accent}; }
      `}</style>

      {/* HEADER */}
      <div style={styles.headerStrip}>
        <span style={styles.headerLabel}>UOFTVERSE</span>
        <span style={{ ...styles.headerDot, background: accent }} />
        <span style={styles.headerLabel}>PROFILE</span>
        <span style={{ flex: 1 }} />
        {user && (
          <span style={{ ...styles.rolePill, background: accent+"12", color: accent, border: `1px solid ${accent}44` }}>
            {config.badge}
          </span>
        )}
      </div>

      <div style={styles.container}>
        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Skeleton width={80} height={80} radius={40} />
              <Skeleton width="70%" height={22} />
              <Skeleton width="50%" height={14} />
              <Skeleton width="60%" height={14} />
              <div style={{ height: 1, background: "#e5e5e5", margin: "8px 0" }} />
              <Skeleton height={36} radius={8} />
              <Skeleton height={14} /><Skeleton height={14} /><Skeleton height={14} />
            </div>
          ) : (
            <div className="loaded">
              <div style={styles.avatarWrapper}>
                <div style={{ ...styles.avatarRing, background: `conic-gradient(${accent} 0%, ${accent}55 50%, ${accent} 100%)` }} />
                <div style={{ ...styles.avatar, color: accent, background: "#e8eef5" }}>{initials}</div>
                <div style={styles.statusDot} />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <h1 style={styles.name}>{user.name}</h1>
                {user.verified && <span style={styles.verifiedBadge}>✓ Verified</span>}
              </div>
              <p style={styles.titleText}>{user.title}</p>
              <p style={styles.department}>{user.department}</p>
              <div style={{ marginTop: 10 }}>
                <span style={{ ...styles.badge, background: accent+"12", color: accent, border: `1px solid ${accent}44` }}>
                  {config.badge}
                </span>
              </div>

              <div style={styles.divider} />

              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <button className="connect-btn">Connect</button>
                <button className="msg-btn">Message</button>
              </div>

              <div style={styles.infoList}>
                {[
                  { label: "Profile ID", value: user.id },
                  { label: "Role",       value: user.role?.charAt(0).toUpperCase() + user.role?.slice(1) },
                  { label: "Email",      value: user.email },
                  ...(user.role === "professor" && user.openings > 0
                    ? [{ label: "Research Openings", value: `${user.openings} open position${user.openings > 1 ? "s" : ""}` }]
                    : []),
                ].map(item => (
                  <div key={item.label} style={styles.infoRow}>
                    <span style={styles.infoLabel}>{item.label}</span>
                    <span style={{ ...styles.infoValue, ...(item.label === "Research Openings" ? { color: "#2e9e5b" } : {}) }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {user.role === "professor" && user.openings > 0 && (
                <>
                  <div style={styles.divider} />
                  <div style={styles.openingsBanner}>
                    <span style={{ fontSize: 18 }}>🔬</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#2e9e5b" }}>
                        {user.openings} Research Opening{user.openings > 1 ? "s" : ""}
                      </p>
                      <p style={{ fontSize: 11, color: "#888", marginTop: 2 }}>Accepting student applications</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </aside>

        {/* MAIN */}
        <main style={styles.main}>
          <div style={styles.tabs}>
            <button className={`tab-btn ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
              Overview
            </button>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <Skeleton width="30%" height={20} style={{ marginBottom: 12 }} />
                <Skeleton height={14} style={{ marginBottom: 6 }} />
                <Skeleton height={14} style={{ marginBottom: 6 }} />
                <Skeleton width="80%" height={14} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {[1,2,3].map(i => <Skeleton key={i} height={80} radius={10} />)}
              </div>
              <div>
                <Skeleton width="25%" height={20} style={{ marginBottom: 12 }} />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[1,2,3,4].map(i => <Skeleton key={i} width={90} height={28} radius={20} />)}
                </div>
              </div>
            </div>
          ) : (
            activeTab === "overview" && (
              <div className="loaded" style={styles.tabContent}>
                <section>
                  <h2 style={styles.sectionTitle}>Bio</h2>
                  <p style={styles.bio}>{user.bio}</p>
                </section>

                <div style={styles.statsGrid}>
                  {[
                    { label: config.tagsLabel, value: user.research_interests.length },
                    { label: "Skills",          value: user.skills.length },
                    user.role === "professor"
                      ? { label: "Openings", value: user.openings }
                      : { label: "Verified",  value: user.verified ? "✓" : "—" },
                  ].map(s => (
                    <div key={s.label} className="stat-card" style={styles.statCard}>
                      <span style={styles.statValue}>{s.value}</span>
                      <span style={styles.statLabel}>{s.label}</span>
                    </div>
                  ))}
                </div>

                <section>
                  <h2 style={styles.sectionTitle}>{config.tagsLabel}</h2>
                  <div style={{ marginTop: 10 }}>
                    {user.research_interests.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </section>

                <section>
                  <h2 style={styles.sectionTitle}>{config.skillsLabel}</h2>
                  <div style={{ marginTop: 10 }}>
                    {user.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                  </div>
                </section>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  page:          { minHeight: "100vh", background: "#ffffff", fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a" },
  headerStrip:   { display: "flex", alignItems: "center", gap: 10, padding: "12px 40px", borderBottom: "1px solid #e5e5e5", background: "#fafafa" },
  headerLabel:   { fontSize: 10, letterSpacing: "0.18em", color: "#aaa", fontWeight: 500 },
  headerDot:     { width: 4, height: 4, borderRadius: "50%" },
  rolePill:      { fontSize: 11, letterSpacing: "0.08em", fontWeight: 600, padding: "3px 12px", borderRadius: 20 },
  container:     { display: "flex", maxWidth: 1100, margin: "0 auto", padding: "40px 24px" },
  sidebar:       { width: 290, flexShrink: 0, paddingRight: 40, borderRight: "1px solid #e5e5e5" },
  avatarWrapper: { position: "relative", width: 80, height: 80, marginBottom: 20 },
  avatarRing:    { position: "absolute", inset: -3, borderRadius: "50%", opacity: 0.6 },
  avatar:        { position: "relative", width: 80, height: 80, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, border: "2px solid #fff" },
  statusDot:     { position: "absolute", bottom: 3, right: 3, width: 12, height: 12, borderRadius: "50%", background: "#2e9e5b", border: "2px solid #fff" },
  name:          { fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, color: "#111", lineHeight: 1.2 },
  verifiedBadge: { fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: "#2e9e5b", background: "#2e9e5b18", border: "1px solid #2e9e5b33", borderRadius: 20, padding: "2px 8px" },
  titleText:     { fontSize: 13, color: "#555", marginTop: 4, fontWeight: 400 },
  department:    { fontSize: 12, color: "#888", marginTop: 2, fontWeight: 300 },
  badge:         { display: "inline-block", borderRadius: 4, padding: "3px 10px", fontSize: 11, letterSpacing: "0.08em", fontWeight: 600 },
  divider:       { height: 1, background: "#e5e5e5", margin: "20px 0" },
  infoList:      { display: "flex", flexDirection: "column", gap: 12 },
  infoRow:       { display: "flex", flexDirection: "column", gap: 2 },
  infoLabel:     { fontSize: 10, color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase" },
  infoValue:     { fontSize: 13, color: "#333", fontWeight: 400 },
  openingsBanner:{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: "#2e9e5b10", border: "1px solid #2e9e5b30", borderRadius: 10, marginTop: 4 },
  main:          { flex: 1, paddingLeft: 40 },
  tabs:          { display: "flex", borderBottom: "1px solid #e5e5e5", marginBottom: 32 },
  tabContent:    { display: "flex", flexDirection: "column", gap: 32 },
  sectionTitle:  { fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 600, color: "#111", marginBottom: 12 },
  bio:           { fontSize: 14, color: "#555", lineHeight: 1.75, maxWidth: 560 },
  statsGrid:     { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 },
  statCard:      { padding: "16px 12px", background: "#fafafa", border: "1px solid #e5e5e5", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  statValue:     { fontFamily: "'DM Sans', sans-serif", fontSize: 30, fontWeight: 700, color: "#111" },
  statLabel:     { fontSize: 11, color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase" },
};
