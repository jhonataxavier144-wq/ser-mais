"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
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
        setError("Credenciais administrativas incorretas.");
      } else {
        const session = await getSession();
        if ((session?.user as any)?.role === "ADMIN") {
          router.push("/admin");
        } else {
          setError("Acesso negado. Esta conta não possui privilégios de administrador.");
        }
      }
    } catch (err) {
      setError("Ocorreu um erro no servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '16px', background: 'var(--green)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            boxShadow: '0 0 30px rgba(0,255,102,0.2)'
          }}>
            <Shield size={32} color="white" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'white', fontSize: '28px', fontWeight: 800 }}>Admin Login</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>Painel de Gestão SER+</p>
        </div>

        <div style={{ background: '#141414', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          {error && (
            <div style={{ background: 'rgba(255,77,77,0.1)', color: '#ff4d4d', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '24px', border: '1px solid rgba(255,77,77,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>E-mail Corporativo</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sermais.com.br"
                  required
                  style={{ width: '100%', padding: '14px 16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Chave de Acesso</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '14px 16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none' }}
                />
                <Lock size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--green)', 
                color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Autenticando..." : "Entrar no Painel"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href="/login" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
            Voltar para área do aluno
          </Link>
        </div>
      </div>
    </div>
  );
}
