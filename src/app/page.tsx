import Link from "next/link";
import { ArrowRight, CheckCircle2, Trophy, Target, Star, Users, BookOpen, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero" style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        padding: '120px 60px 80px',
        gap: '60px',
        background: 'var(--off-white)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="hero-content">
          <div className="hero-tag" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--green-light)',
            color: 'var(--green-dark)',
            padding: '6px 16px',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: 500,
            marginBottom: '24px'
          }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--green)', borderRadius: '50%' }}></span>
            100% gratuito para você
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(42px, 5vw, 68px)',
            fontWeight: 800,
            lineHeight: 1.05,
            color: 'var(--black)',
            marginBottom: '24px'
          }}>
            Aprenda,<br />
            cresça e<br />
            <span style={{ color: 'var(--green)', position: 'relative' }}>SER+</span>
          </h1>
          <p style={{
            fontSize: '17px',
            lineHeight: '1.7',
            color: 'var(--gray)',
            maxWidth: '480px',
            marginBottom: '40px',
            fontWeight: 300
          }}>
            Uma plataforma de cursos gratuita focada em desenvolvimento pessoal e profissional. Transforme sua trajetória com conteúdo de qualidade, certificados reconhecidos e uma comunidade que acredita em você.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/login" className="btn btn-primary" style={{ fontSize: '15px', padding: '14px 32px' }}>
              Quero começar grátis <ArrowRight size={18} />
            </Link>
            <Link href="#cursos" className="btn btn-outline" style={{ fontSize: '15px', padding: '14px 32px' }}>
              Ver cursos
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '40px', marginTop: '56px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--green)', lineHeight: 1 }}>+1.200</div>
              <div style={{ fontSize: '13px', color: 'var(--gray)', marginTop: '4px' }}>Alunos ativos</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--green)', lineHeight: 1 }}>18</div>
              <div style={{ fontSize: '13px', color: 'var(--gray)', marginTop: '4px' }}>Cursos disponíveis</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--green)', lineHeight: 1 }}>100%</div>
              <div style={{ fontSize: '13px', color: 'var(--gray)', marginTop: '4px' }}>Gratuito</div>
            </div>
          </div>
        </div>

        <div className="hero-visual" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="card" style={{ width: '340px', position: 'relative', zIndex: 2 }}>
            <div style={{
              width: '100%', height: '160px',
              background: 'linear-gradient(135deg, var(--green) 0%, #00C853 100%)',
              borderRadius: '16px', marginBottom: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '48px', color: 'white'
            }}>
              <BookOpen size={64} />
            </div>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '8px' }}>Carreira & Profissional</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--black)', marginBottom: '12px', lineHeight: 1.3 }}>Como construir seu currículo e se destacar no mercado</h3>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--gray)', marginBottom: '20px' }}>
              <span>📹 12 aulas</span>
              <span>⏱ 4h 30min</span>
            </div>
            <div style={{ height: '6px', background: 'var(--gray-light)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--green), #00C853)', width: '65%' }}></div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--gray)' }}>65% concluído</div>
          </div>
          
          <div style={{
            position: 'absolute', top: '-30px', right: '0px', zIndex: 3,
            background: 'white', borderRadius: '16px', padding: '16px 20px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)'
          }}>
            <Trophy size={24} color="var(--green)" />
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--black)' }}>Certificado emitido!</div>
            <div style={{ fontSize: '11px', color: 'var(--gray)' }}>Desenvolvimento Pessoal</div>
          </div>

          <div style={{
            position: 'absolute', bottom: '-20px', left: '0px', zIndex: 3,
            background: 'white', borderRadius: '16px', padding: '16px 20px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)'
          }}>
            <Target size={24} color="var(--green)" />
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--black)' }}>Nova aula disponível</div>
            <div style={{ fontSize: '11px', color: 'var(--gray)' }}>Inteligência Emocional · Módulo 3</div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section style={{ padding: '48px 60px', background: 'white', borderBottom: '1px solid var(--gray-light)' }}>
        <p style={{ textAlign: 'center', fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '32px' }}>Parceiros e instituições que confiam na SER+</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '60px', flexWrap: 'wrap' }}>
          {["Centro Acadêmico USP", "Projeto Jovem+", "Instituto Carioca", "SOU NOS", "Educação Viva"].map(p => (
            <div key={p} style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--gray)', opacity: 0.5 }}>{p}</div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '120px 60px', background: 'var(--off-white)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '16px' }}>Simples assim</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 800, color: 'var(--black)', lineHeight: 1.15, marginBottom: '16px' }}>Como a SER+<br />funciona?</h2>
            <p style={{ fontSize: '16px', color: 'var(--gray)', lineHeight: '1.7', maxWidth: '480px', fontWeight: 300 }}>Em poucos minutos você já está aprendendo. Sem mensalidade, sem cartão de crédito.</p>

            <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '36px' }}>
              {[
                { n: 1, t: "Crie sua conta", d: "Cadastre-se com seu Google ou e-mail em menos de 1 minuto. Sem burocracia." },
                { n: 2, t: "Escolha um curso", d: "Navegue pelo catálogo e escolha o que faz mais sentido para a sua jornada agora." },
                { n: 3, t: "Aprenda no seu ritmo", d: "Vídeo-aulas, materiais em PDF e quizzes práticos. Aprenda quando e onde quiser." },
                { n: 4, t: "Conquiste seu certificado", d: "Ao concluir, receba seu certificado digital para compartilhar no LinkedIn e currículo." }
              ].map(step => (
                <div key={step.n} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--green)', color: 'white', fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step.n}</div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{step.t}</h3>
                    <p style={{ fontSize: '15px', color: 'var(--gray)', lineHeight: 1.6 }}>{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--green)', borderRadius: '32px', padding: '48px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
            {[
              { i: "🧠", t: "Inteligência Emocional", s: "8 módulos · 3h 20min", b: "Novo" },
              { i: "💼", t: "Mercado de Trabalho", s: "12 módulos · 5h 10min", b: "Popular" },
              { i: "🌱", t: "Autoconhecimento", s: "6 módulos · 2h 45min", b: "Em breve" },
              { i: "🗣️", t: "Comunicação Assertiva", s: "10 módulos · 4h 00min", b: "Popular" }
            ].map(c => (
              <div key={c.t} style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', color: 'white' }}>
                <div style={{ fontSize: '28px', width: '52px', height: '52px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.i}</div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{c.t}</h4>
                  <p style={{ fontSize: '12px', opacity: 0.7 }}>{c.s}</p>
                </div>
                <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.25)', borderRadius: '100px', padding: '4px 12px', fontSize: '11px', fontWeight: 600 }}>{c.b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CURSES GRID */}
      <section id="cursos" style={{ padding: '120px 60px', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '56px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '16px' }}>Catálogo</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 800, color: 'var(--black)', lineHeight: 1.15 }}>Cursos em destaque</h2>
          </div>
          <Link href="/login" className="btn btn-outline">Ver todos os cursos <ArrowRight size={18} /></Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
          {[
            { c: "Desenvolvimento Pessoal", t: "Inteligência Emocional na Prática", d: "Aprenda a identificar e gerenciar suas emoções para ter melhores relacionamentos e resultados.", m: "📹 8 aulas · ⏱ 3h 20min", co: "green", i: "🧠" },
            { c: "Carreira", t: "Como se Destacar no Mercado de Trabalho", d: "Estratégias práticas para construir sua carreira, montar currículo e arrasar nas entrevistas.", m: "📹 12 aulas · ⏱ 5h 10min", co: "teal", i: "💼" },
            { c: "Comunicação", t: "Comunicação Assertiva e Liderança", d: "Desenvolva sua capacidade de se comunicar com clareza, confiança e impacto em qualquer situação.", m: "📹 10 aulas · ⏱ 4h 00min", co: "lime", i: "🗣️" }
          ].map(course => (
            <div key={course.t} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '52px', background: `var(--${course.co})`, position: 'relative', color: 'white' }}>
                {course.i}
                <span style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', color: 'var(--green-dark)', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 700 }}>GRÁTIS</span>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '8px' }}>{course.c}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{course.t}</h3>
                <p style={{ fontSize: '14px', color: 'var(--gray)', lineHeight: 1.6, marginBottom: '20px' }}>{course.d}</p>
                <div style={{ paddingTop: '16px', borderTop: '1px solid var(--gray-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--gray)' }}>{course.m}</span>
                  <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '15px' }}>Grátis</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--black)', color: 'white', padding: '64px 60px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '60px', marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="footer-brand">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'var(--green)', marginBottom: '16px' }}>SER+</div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '260px' }}>Plataforma de cursos gratuita focada em desenvolvimento pessoal e profissional para todos.</p>
          </div>
          {[
            { t: "Plataforma", l: ["Cursos", "Como funciona", "Certificados", "Parceiros"] },
            { t: "Empresa", l: ["Sobre nós", "Blog", "Contato", "Imprensa"] },
            { t: "Legal", l: ["Termos de uso", "Privacidade", "Cookies"] }
          ].map(col => (
            <div key={col.t}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>{col.t}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {col.l.map(link => <li key={link}><Link href="#" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
          <span>© 2026 SER+ Plataforma de Cursos. Todos os direitos reservados.</span>
          <span>Feito com 💚 para o Brasil</span>
        </div>
      </footer>
    </main>
  );
}
