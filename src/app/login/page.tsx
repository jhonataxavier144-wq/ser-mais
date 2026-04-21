"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("E-mail ou senha incorretos.");
      } else {
        const session = await getSession();
        if ((session?.user as any)?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError("Ocorreu um erro ao entrar.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* LADO ESQUERDO - Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--black) 0%, #0d3320 50%, var(--black) 100%)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,156,59,0.15), transparent)', top: '-100px', right: '-100px' }}></div>
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,156,59,0.1), transparent)', bottom: '-80px', left: '-80px' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '380px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '52px', fontWeight: 800, color: 'var(--green)', marginBottom: '24px', letterSpacing: '-1px' }}>SER+</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: 'white', marginBottom: '16px', lineHeight: 1.2 }}>Sua jornada de aprendizado começa aqui</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>Cursos gratuitos de desenvolvimento pessoal e profissional para quem quer crescer.</p>
          <div style={{ display: 'flex', gap: '32px', marginTop: '48px', justifyContent: 'center' }}>
            {[
              { val: "+1.200", label: "Alunos" },
              { val: "18", label: "Cursos" },
              { val: "100%", label: "Gratuito" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: 'var(--green)' }}>{s.val}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LADO DIREITO - Form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', flex: 1, minWidth: '320px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Mobile logo */}
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--green)' }} className="mobile-only-logo">SER+</span>
          </div>
          
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: 'var(--black)', marginBottom: '6px' }}>Bem-vindo de volta 👋</h1>
          <p style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '32px' }}>Entre na sua conta para continuar aprendendo.</p>

          {error && (
            <div style={{ background: '#FEF2F2', color: '#DC2626', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #FECACA' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Google Login */}
          <button 
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              padding: '14px 24px', borderRadius: '14px', border: '1.5px solid var(--gray-light)',
              background: 'white', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500,
              color: 'var(--black)', cursor: 'pointer', transition: 'all 0.22s',
              boxShadow: '0 1px 6px rgba(0,0,0,0.04)', marginBottom: '20px',
              opacity: googleLoading ? 0.6 : 1
            }}
            onMouseOver={e => !googleLoading && (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
            onMouseOut={e => (e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.04)')}
          >
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            {googleLoading ? "Conectando..." : "Continuar com Google"}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', color: 'var(--gray)', fontSize: '12px' }}>
            <span style={{ flex: 1, height: '1px', background: 'var(--gray-light)' }}></span>
            ou entre com e-mail
            <span style={{ flex: 1, height: '1px', background: 'var(--gray-light)' }}></span>
          </div>

          <form onSubmit={handleCredentialsLogin}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gray-dark)' }}>E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                style={{ padding: '13px 16px', borderRadius: '12px', border: '1.5px solid var(--gray-light)', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gray-dark)' }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '13px 44px 13px 16px', borderRadius: '12px', border: '1.5px solid var(--gray-light)', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', padding: '4px'
                }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', padding: '14px', borderRadius: '14px', fontSize: '15px', fontWeight: 600, border: 'none', cursor: 'pointer',
                background: loading ? 'var(--gray)' : 'var(--green)', color: 'white',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(0,156,59,0.3)',
                transition: 'all 0.2s'
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--gray)' }}>
            Não tem conta? <Link href="/register" style={{ color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>Criar conta grátis</Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/admin/login" style={{ fontSize: '11px', color: 'var(--gray)', textDecoration: 'none', opacity: 0.4 }}>Acesso Administrativo</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .mobile-only-logo { display: none; }
        @media (max-width: 768px) {
          div:first-child > div:first-child { display: none !important; }
          .mobile-only-logo { display: inline !important; }
        }
      `}</style>
    </div>
  );
}
