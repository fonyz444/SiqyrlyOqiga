import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column", fontFamily: "var(--font-sans, system-ui, -apple-system, sans-serif)" }}>
      {/* ── Top Navigation ── */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="8" cy="8" r="4" fill="#1a1a1a" />
            <circle cx="20" cy="8" r="4" fill="#1a1a1a" />
            <circle cx="8" cy="20" r="4" fill="#1a1a1a" />
            <circle cx="20" cy="20" r="4" fill="#1a1a1a" />
          </svg>
        </div>

        {/* Nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "2px", backgroundColor: "#f3f4f6", borderRadius: "9999px", padding: "4px 6px" }}>
          {["Overview", "How it works", "Privacy and terms", "FAQ"].map((item) => (
            <Link
              key={item}
              href="#"
              style={{ padding: "6px 16px", fontSize: "13px", fontWeight: 500, color: "#4b5563", borderRadius: "9999px", textDecoration: "none", transition: "all 0.15s" }}
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div style={{ width: "28px" }} />
      </header>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 40px 40px", gap: "80px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        {/* Left side — Text + Auth */}
        <div style={{ flex: "0 0 420px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{ fontSize: "38px", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.15, letterSpacing: "-0.02em", margin: 0 }}>
            Welcome to MediTale
          </h1>
          <p style={{ fontSize: "30px", fontWeight: 300, color: "#9ca3af", lineHeight: 1.2, margin: "4px 0 0 0" }}>
            Your AI storyteller for kids
          </p>

          <div style={{ marginTop: "40px", maxWidth: "380px" }}>
            {/* Google button */}
            <Link
              href="/auth"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                width: "100%",
                padding: "12px 24px",
                border: "1px solid #d1d5db",
                borderRadius: "9999px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#374151",
                textDecoration: "none",
                backgroundColor: "#fff",
                boxSizing: "border-box",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l3.56-2.77.01-.53z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Link>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>or</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
            </div>

            {/* Email input */}
            <input
              type="email"
              placeholder="yourname@email.com"
              style={{
                width: "100%",
                padding: "12px 20px",
                border: "1px solid #d1d5db",
                borderRadius: "9999px",
                fontSize: "14px",
                color: "#374151",
                outline: "none",
                boxSizing: "border-box",
                backgroundColor: "#fff",
              }}
            />

            {/* Continue button */}
            <Link
              href="/auth"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: "12px 24px",
                backgroundColor: "#1a1a1a",
                color: "#fff",
                borderRadius: "9999px",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                marginTop: "12px",
                boxSizing: "border-box",
              }}
            >
              Continue with email
            </Link>

            {/* Terms */}
            <p style={{ fontSize: "12px", color: "#9ca3af", lineHeight: 1.6, marginTop: "16px" }}>
              By signing up, you agree to the{" "}
              <Link href="#" style={{ color: "#9ca3af", textDecoration: "underline" }}>Terms of Use</Link>,{" "}
              <Link href="#" style={{ color: "#9ca3af", textDecoration: "underline" }}>Privacy Notice</Link>,
              and <Link href="#" style={{ color: "#9ca3af", textDecoration: "underline" }}>Cookie Notice</Link>.
            </p>
          </div>
        </div>

        {/* Right side — Product Mockup */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: "640px" }}>
            {/* Laptop body */}
            <div style={{
              backgroundColor: "#1a1a1a",
              borderRadius: "16px",
              padding: "12px 12px 0",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}>
              {/* Camera */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#333" }} />
              </div>
              {/* Screen */}
              <div style={{
                backgroundColor: "#111",
                borderRadius: "8px 8px 0 0",
                padding: "24px",
                minHeight: "360px",
              }}>
                {/* App header row */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                  <div style={{ display: "flex", gap: "2px" }}>
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#666" }} />
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#666" }} />
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#666" }} />
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#666" }} />
                  </div>
                  <span style={{ color: "#555", fontSize: "11px", fontWeight: 500 }}>MediTale</span>
                </div>

                {/* Greeting */}
                <div style={{ marginBottom: "24px", marginLeft: "8px" }}>
                  <p style={{ color: "#888", fontSize: "12px", margin: "0 0 2px" }}>Hello, Alikhan</p>
                  <p style={{ color: "#a78bfa", fontSize: "15px", fontWeight: 500, margin: 0 }}>How can I help you today?</p>
                </div>

                {/* Cards grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  {/* Card 1 */}
                  <div style={{
                    backgroundColor: "#2d1f3d",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid rgba(139,92,246,0.2)",
                  }}>
                    <div style={{ fontSize: "20px", marginBottom: "8px" }}>🦁</div>
                    <p style={{ color: "#e0e0e0", fontSize: "11px", fontWeight: 600, margin: "0 0 4px", lineHeight: 1.3 }}>Brave Lion&apos;s Adventure</p>
                    <p style={{ color: "#a78bfa", fontSize: "10px", margin: 0 }}>3 chapters</p>
                  </div>

                  {/* Card 2 */}
                  <div style={{
                    backgroundColor: "#2d2517",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid rgba(245,158,11,0.2)",
                  }}>
                    <div style={{ fontSize: "20px", marginBottom: "8px" }}>🐉</div>
                    <p style={{ color: "#e0e0e0", fontSize: "11px", fontWeight: 600, margin: "0 0 4px", lineHeight: 1.3 }}>Magic Dragon&apos;s Quest</p>
                    <p style={{ color: "#fbbf24", fontSize: "10px", margin: 0 }}>5 chapters</p>
                  </div>

                  {/* Card 3 */}
                  <div style={{
                    backgroundColor: "#1a2e1a",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid rgba(34,197,94,0.2)",
                  }}>
                    <div style={{ fontSize: "20px", marginBottom: "8px" }}>🧙</div>
                    <p style={{ color: "#e0e0e0", fontSize: "11px", fontWeight: 600, margin: "0 0 4px", lineHeight: 1.3 }}>Wizard&apos;s Spell</p>
                    <p style={{ color: "#4ade80", fontSize: "10px", margin: 0 }}>4 chapters</p>
                  </div>

                  {/* Stats row */}
                  <div style={{
                    gridColumn: "1 / -1",
                    backgroundColor: "#1e1e1e",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    gap: "32px",
                  }}>
                    <div>
                      <p style={{ color: "#666", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>Stories</p>
                      <p style={{ color: "#fff", fontSize: "18px", fontWeight: 700, margin: 0 }}>12</p>
                    </div>
                    <div>
                      <p style={{ color: "#666", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>Languages</p>
                      <p style={{ color: "#fff", fontSize: "16px", margin: 0 }}>🇰🇿 🇷🇺 🇬🇧</p>
                    </div>
                    <div>
                      <p style={{ color: "#666", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>Exported</p>
                      <p style={{ color: "#fff", fontSize: "18px", fontWeight: 700, margin: 0 }}>8</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Laptop base */}
            <div style={{ height: "12px", backgroundColor: "#2a2a2a", borderRadius: "0 0 8px 8px", margin: "0 48px" }} />
            <div style={{ height: "4px", backgroundColor: "#3a3a3a", borderRadius: "0 0 4px 4px", margin: "0 96px" }} />
          </div>
        </div>
      </main>
    </div>
  );
}
