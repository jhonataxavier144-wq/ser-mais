"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";

import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't show public navbar on dashboard/profile pages
  const isAppPage = pathname?.startsWith("/dashboard") || pathname?.startsWith("/profile") || pathname?.startsWith("/course") || pathname?.startsWith("/admin");
  if (isAppPage) return null;

  return (
    <nav className={scrolled ? "glass scrolled" : "glass"} style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: scrolled ? '12px 60px' : '18px 60px',
      transition: 'all 0.3s',
      boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.08)' : 'none',
      background: scrolled ? 'rgba(255,255,255,0.8)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none'
    }}>
      <Link href="/" className="nav-logo" style={{
        fontFamily: 'var(--font-display)',
        fontSize: '28px',
        fontWeight: 800,
        color: 'var(--green)',
        letterSpacing: '-1px',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        SER<span style={{ color: 'var(--black)' }}>+</span>
      </Link>

      <ul className="nav-links" style={{
        display: 'flex',
        gap: '36px',
        listStyle: 'none'
      }}>
        <li><Link href="#como-funciona" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--gray-dark)', textDecoration: 'none' }}>Como funciona</Link></li>
        <li><Link href="#cursos" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--gray-dark)', textDecoration: 'none' }}>Cursos</Link></li>
        <li><Link href="#depoimentos" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--gray-dark)', textDecoration: 'none' }}>Depoimentos</Link></li>
      </ul>

      <div className="nav-cta" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {session ? (
          <Link href="/dashboard" className="btn btn-primary">
            Ir para Dashboard
          </Link>
        ) : (
          <>
            <Link href="/login" className="btn btn-outline">
              <LogIn size={16} />
              Entrar
            </Link>
            <Link href="/register" className="btn btn-primary">
              <UserPlus size={16} />
              Criar conta
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
