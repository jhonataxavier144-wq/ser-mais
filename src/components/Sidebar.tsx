"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Target, Trophy, GraduationCap, User, LogOut, BarChart3, ClipboardList, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Principal", items: [
    { name: "Início", href: "/dashboard", icon: Home },
    { name: "Meus Cursos", href: "/dashboard/courses", icon: BookOpen },
    { name: "Catálogo", href: "/catalog", icon: Target },
  ]},
  { label: "Progresso", items: [
    { name: "Conquistas", href: "/dashboard/achievements", icon: Trophy },
    { name: "Certificados", href: "/dashboard/certificates", icon: GraduationCap },
  ]},
  { label: "Conta", items: [
    { name: "Meu Perfil", href: "/profile", icon: User },
  ]},
  { label: "Administração", items: [
    { name: "Painel Admin", href: "/admin", icon: BarChart3, adminOnly: true },
    { name: "Cursos", href: "/admin/courses", icon: BookOpen, adminOnly: true },
    { name: "Alunos", href: "/admin/students", icon: User, adminOnly: true },
    { name: "Matrículas", href: "/admin/enrollments", icon: ClipboardList, adminOnly: true },
  ]}
];

export default function Sidebar({ user }: { user?: any }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile hamburger */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-menu-btn"
          style={{ display: 'flex' }}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

      {/* Overlay */}
      {isMobile && mobileOpen && (
        <div className="sidebar-overlay active" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`sidebar-desktop ${mobileOpen ? 'open' : ''}`}
        style={{
          width: '240px',
          background: 'var(--black)',
          height: '100vh',
          position: 'fixed',
          left: 0, top: 0,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          transition: 'transform 0.3s ease',
          transform: isMobile && !mobileOpen ? 'translateX(-100%)' : 'translateX(0)',
        }}
      >
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <Link href="/dashboard" style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 800,
            color: 'var(--green)',
            textDecoration: 'none'
          }}>SER+</Link>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {navItems.map((group) => {
            const visibleItems = group.items.filter((item: any) => !item.adminOnly || user?.role === "ADMIN");
            if (visibleItems.length === 0) return null;
            return (
              <div key={group.label}>
                <div style={{
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.2)',
                  padding: '0 10px',
                  margin: '16px 0 6px'
                }}>{group.label}</div>
                {visibleItems.map((item: any) => {
                  const Icon = item.icon;
                  const active = item.href === "/admin" 
                    ? pathname === "/admin" 
                    : pathname === item.href || (item.adminOnly && pathname.startsWith(item.href + "/"));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        color: active ? 'white' : 'rgba(255,255,255,0.5)',
                        fontSize: '13.5px',
                        textDecoration: 'none',
                        background: active ? 'var(--green)' : 'transparent',
                        transition: 'all 0.15s',
                        marginBottom: '1px',
                        fontWeight: active ? 500 : 400
                      }}
                    >
                      <Icon size={18} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            );
          })}
          
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '10px',
              color: 'rgba(255,255,255,0.35)',
              fontSize: '12px',
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              width: '100%',
              marginTop: '8px',
              transition: 'all 0.15s',
              textAlign: 'left'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,0,0,0.1)';
              e.currentTarget.style.color = '#ff6b6b';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = 'rgba(255,255,255,0.35)';
            }}
          >
            <LogOut size={16} />
            Sair
          </button>
        </nav>

        <div style={{
          padding: '16px 20px 20px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--green), #00C853)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            flexShrink: 0,
            overflow: 'hidden',
            color: 'white'
          }}>
            {user?.image ? <img src={user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name?.[0] || "?"}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || "Usuário"}</div>
            <div style={{ fontSize: '11px', color: 'var(--green)', marginTop: '2px' }}>⭐ Nível {user?.nivel || 1}</div>
          </div>
        </div>
      </aside>
    </>
  );
}
