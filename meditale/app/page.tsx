'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ArrowRight, ArrowDown, BookOpen, Sparkles, Heart, Zap, Download } from "lucide-react"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setIsLoggedIn(true)
        setUserName(user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there")
      }
    }
    load()
  }, [])

  // ── Scroll-reveal via IntersectionObserver ──────────────────
  useEffect(() => {
    const selectors = ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    const targets = document.querySelectorAll<HTMLElement>(selectors)

    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target) // fire once per element
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ fontFamily: "var(--font-body)", backgroundColor: "var(--cream)", overflowX: "hidden" }}>
      {/* ─────── HEADER ─────── */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 48px",
        backgroundColor: "var(--cream)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid rgba(59,34,18,0.08)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg, var(--coral), var(--yellow))",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
          }}>📖</div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "20px", color: "var(--brown)" }}>
            MediTale
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {["О нас", "Как это работает", "Примеры"].map(item => (
            <a key={item} href="#" style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href={isLoggedIn ? "/create" : "/auth"}
          className="btn-dark"
        >
          {isLoggedIn ? `Привет, ${userName}! 👋` : "Попробовать бесплатно"}
          <ArrowRight size={16} />
        </Link>
      </header>

      {/* ─────── HERO ─────── */}
      <section style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "80px 48px 100px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "64px",
        alignItems: "center",
      }}>
        {/* Left: Text */}
        <div className="animate-fade-up">
          <div className="sticker" style={{ marginBottom: "24px" }}>
            ✨ Для детей от 3 до 12 лет
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(52px, 6vw, 80px)",
            fontWeight: 900,
            lineHeight: 1.05,
            color: "var(--brown)",
            marginBottom: "32px",
          }}>
            Сказка —{" "}
            <span style={{ color: "var(--coral)" }}>
              лучший
              <br />доктор
            </span>{" "}
            для<br />малыша
          </h1>

          <p style={{
            fontSize: "18px",
            lineHeight: 1.7,
            color: "var(--text-muted)",
            marginBottom: "40px",
            maxWidth: "440px",
          }}>
            Когда ребёнку нужно идти к врачу, он боится. Мы создаём волшебные сказки, которые объясняют всё по-детски — просто и весело!
          </p>

          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Link href={isLoggedIn ? "/create" : "/auth"} className="btn-dark">
              Создать сказку <ArrowRight size={16} />
            </Link>
            <a
              href="#how"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                color: "var(--brown)", fontSize: "15px", fontWeight: 600, textDecoration: "none"
              }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                border: "1px solid rgba(59,34,18,0.8)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <ArrowDown size={18} strokeWidth={1.5} color="rgba(59,34,18,0.8)" />
              </div>
              Узнать больше
            </a>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="animate-fade-up delay-200" style={{ position: "relative", height: "480px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src="/hero.png"
            alt="Magical fairy tale illustration"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "32px",
              boxShadow: "0 24px 64px rgba(59,34,18,0.15)",
            }}
            className="animate-float"
          />

          {/* Float stickers */}
          <div style={{
            position: "absolute", top: "-15px", right: "20px",
            background: "var(--lime)", color: "var(--brown)",
            borderRadius: "12px", padding: "10px 18px",
            fontWeight: 700, fontSize: "14px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }} className="animate-fade-up delay-400 animate-float-slow">
            😊 Больше не страшно!
          </div>

          <div style={{
            position: "absolute", bottom: "-20px", left: "20px",
            background: "var(--white)", borderRadius: "12px",
            padding: "12px 18px", fontSize: "14px", fontWeight: 700,
            color: "var(--brown)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            display: "flex", alignItems: "center", gap: "8px",
          }} className="animate-fade-up delay-500 animate-float">
            <Heart size={16} fill="var(--coral)" stroke="var(--coral)" /> Ребёнок счастлив
          </div>
        </div>
      </section>

      {/* ─────── БОЛИ (Pain Points) ─────── */}
      <section id="how" style={{ backgroundColor: "var(--cream-dark)", padding: "100px 48px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: "64px" }}>
            <div className="sticker" style={{ marginBottom: "20px" }}>😰 Знакомо?</div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 900,
              color: "var(--brown)",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}>
              Поход к врачу —<br />
              <span style={{ color: "var(--coral)" }}>это всегда слёзы?</span>
            </h2>
            <p style={{ fontSize: "18px", color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto" }}>
              Вы не одни. Большинство родителей сталкиваются с этими проблемами каждый день.
            </p>
          </div>

          <div className="reveal-stagger" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}>
            {[
              {
                emoji: "😭",
                bg: "#fff1f0",
                title: "«Не пойду к врачу!»",
                desc: "Ребёнок кричит, плачет и прячется под кровать при одном упоминании больницы.",
              },
              {
                emoji: "❓",
                bg: "#fff8e1",
                title: "Не понимает зачем",
                desc: "Слова «укол», «анализ», «процедура» — звучат страшно. Малыш не понимает что происходит.",
              },
              {
                emoji: "😴",
                bg: "#f0fff4",
                title: "Стресс и плохой сон",
                desc: "Ожидание записи к врачу превращается в дни тревоги, плохого аппетита и кошмаров.",
              },
            ].map((item, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div style={{
                  background: "var(--white)",
                  borderRadius: "24px",
                  padding: "32px",
                  height: "100%",
                  boxShadow: "0 4px 24px rgba(59,34,18,0.07)",
                }}>
                  <div style={{
                    width: "64px", height: "64px",
                    borderRadius: "18px",
                    backgroundColor: item.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "32px",
                    marginBottom: "20px",
                  }}>
                    {item.emoji}
                  </div>
                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--brown)",
                    marginBottom: "12px",
                  }}>{item.title}</h3>
                  <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--text-muted)" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── ПРО ПРОДУКТ (About Product) ─────── */}
      <section style={{ padding: "100px 48px", backgroundColor: "var(--cream)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Top intro */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "center",
            marginBottom: "80px",
          }}>
            <div className="reveal-left">
              <div className="sticker" style={{ marginBottom: "24px" }}>🌟 Наше решение</div>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5vw, 54px)",
                fontWeight: 900,
                color: "var(--brown)",
                lineHeight: 1.1,
                marginBottom: "24px",
              }}>
                Как мы{" "}
                <span className="squiggle" style={{ color: "var(--coral)" }}>помогаем</span>
                <br />вашему малышу?
              </h2>
              <p style={{ fontSize: "17px", lineHeight: 1.8, color: "var(--text-muted)", marginBottom: "16px" }}>
                MediTale создаёт персональную сказку про вашего ребёнка — с его именем, любимыми персонажами и настоящим приключением!
              </p>
              <p style={{ fontSize: "17px", lineHeight: 1.8, color: "var(--text-muted)" }}>
                В сказке герой встречает добрых врачей, побеждает страх и становится самым храбрым на свете. Ребёнок не боится — он ждёт!
              </p>
            </div>

            {/* Feature card */}
            <div className="reveal-right" style={{
              background: "var(--forest)",
              borderRadius: "32px",
              padding: "48px",
              color: "var(--white)",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: "-30px", right: "-30px",
                width: "150px", height: "150px",
                borderRadius: "50%",
                backgroundColor: "rgba(168, 216, 74, 0.2)",
              }} />
              <div style={{ fontSize: "48px", marginBottom: "24px" }}>📚</div>
              <h3 style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 700,
                marginBottom: "16px",
                lineHeight: 1.2,
              }}>
                Сказка готова<br />за 30 секунд
              </h3>
              <p style={{ fontSize: "15px", lineHeight: 1.7, opacity: 0.85, marginBottom: "24px" }}>
                Вы рассказываете нам о ребёнке, а умный ИИ создаёт уникальную историю. Просто и быстро!
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {["С картинками", "На 3 языках", "Скачать PDF"].map(tag => (
                  <span key={tag} style={{
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: "8px",
                    padding: "6px 14px",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 4 feature boxes */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {[
              { emoji: "🎭", title: "Персональный герой", desc: "Ребёнок сам становится главным героем сказки", color: "#fde68a" },
              { emoji: "🎨", title: "Красивые картинки", desc: "ИИ рисует иллюстрации специально для вашей истории", color: "#bbf7d0" },
              { emoji: "🌍", title: "3 языка", desc: "Сказка на русском, казахском или английском", color: "#ddd6fe" },
              { emoji: "📥", title: "Скачать всегда", desc: "Сохраните как красивую книгу-PDF и читайте офлайн", color: "#fed7aa" },
            ].map((item, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div style={{
                  background: "var(--white)",
                  borderRadius: "20px",
                  padding: "28px 24px",
                  textAlign: "center",
                  boxShadow: "0 4px 20px rgba(59,34,18,0.07)",
                  height: "100%",
                }}>
                  <div style={{
                    width: "64px", height: "64px",
                    borderRadius: "50%",
                    backgroundColor: item.color,
                    margin: "0 auto 16px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "28px",
                  }}>
                    {item.emoji}
                  </div>
                  <h4 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "var(--brown)",
                    marginBottom: "8px",
                    borderBottom: "2px solid var(--coral)",
                    paddingBottom: "8px",
                  }}>{item.title}</h4>
                  <p style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--text-muted)" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── CALL TO ACTION ─────── */}
      <section style={{
        backgroundColor: "var(--brown)",
        padding: "100px 48px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorations */}
        <div style={{
          position: "absolute", top: "-60px", left: "-60px",
          width: "240px", height: "240px", borderRadius: "50%",
          backgroundColor: "rgba(168,216,74,0.15)",
        }} />
        <div style={{
          position: "absolute", bottom: "-40px", right: "15%",
          width: "180px", height: "180px", borderRadius: "50%",
          backgroundColor: "rgba(247,201,72,0.1)",
        }} />

        <div className="reveal" style={{
          maxWidth: "680px", margin: "0 auto",
          textAlign: "center",
          position: "relative", zIndex: 1,
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,255,255,0.12)", borderRadius: "999px",
            padding: "6px 18px", marginBottom: "28px",
            border: "1px solid rgba(255,255,255,0.2)",
          }}>
            <span style={{ color: "var(--yellow)", fontSize: "16px" }}>⭐</span>
            <span style={{ color: "var(--yellow)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Бесплатно для первой сказки
            </span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(38px, 5vw, 64px)",
            fontWeight: 900,
            color: "var(--white)",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}>
            Подарите малышу<br />
            <span style={{ color: "var(--lime)" }}>храбрость</span> сегодня
          </h2>
          <p style={{
            fontSize: "18px",
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.75)",
            marginBottom: "40px",
            maxWidth: "520px",
            margin: "0 auto 40px",
          }}>
            MediTale создаёт персональную сказку, в которой ваш ребёнок побеждает страх и становится самым храбрым на свете!
          </p>
          <Link href={isLoggedIn ? "/create" : "/auth"} className="btn-coral" style={{ fontSize: "17px", padding: "18px 44px" }}>
            {isLoggedIn ? "Создать новую сказку" : "Начать бесплатно"}
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ─────── FOOTER ─────── */}
      <footer style={{
        backgroundColor: "#2a1509",
        padding: "40px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "linear-gradient(135deg, var(--coral), var(--yellow))",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
          }}>📖</div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px", color: "var(--white)" }}>
            MediTale
          </span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
          MediTale — Healing stories for children
        </p>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Конфиденциальность", "Условия"].map(link => (
            <a key={link} href="#" style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", textDecoration: "none" }}>
              {link}
            </a>
          ))}
        </div>
      </footer>


    </div>
  )
}
