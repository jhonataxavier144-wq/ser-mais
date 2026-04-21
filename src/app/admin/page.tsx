import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebase-admin";
import Sidebar from "@/components/Sidebar";
import { Users, BookOpen, GraduationCap, Plus, TrendingUp, BarChart3, Clock } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  const usersCount = (await adminDb.collection("users").get()).size;
  const coursesCount = (await adminDb.collection("courses").get()).size;
  const enrollmentsSnapshot = await adminDb.collection("enrollments").get();
  const enrollmentsCount = enrollmentsSnapshot.size;
  const completedCount = enrollmentsSnapshot.docs.filter(d => d.data().progress === 100).length;
  const avgProgress = enrollmentsCount > 0 
    ? Math.round(enrollmentsSnapshot.docs.reduce((s, d) => s + (d.data().progress || 0), 0) / enrollmentsCount) 
    : 0;

  // Recent enrollments
  const recentEnrollments = enrollmentsSnapshot.docs
    .sort((a, b) => (b.data().createdAt || "").localeCompare(a.data().createdAt || ""))
    .slice(0, 5);

  const recentData = await Promise.all(
    recentEnrollments.map(async (doc) => {
      const d = doc.data();
      const userDoc = await adminDb.collection("users").doc(d.userId).get();
      const courseDoc = await adminDb.collection("courses").doc(d.courseId).get();
      return {
        id: doc.id,
        userName: userDoc.exists ? userDoc.data()?.name : "Aluno removido",
        courseTitle: courseDoc.exists ? courseDoc.data()?.title : "Curso removido",
        progress: d.progress || 0,
        createdAt: d.createdAt || "",
      };
    })
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--off-white)' }}>
      <Sidebar user={session.user} />
      
      <main style={{ marginLeft: 'var(--sidebar-w)', flex: 1, padding: '32px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800 }}>Painel Administrativo</h1>
            <p style={{ fontSize: '14px', color: 'var(--gray)', marginTop: '4px' }}>Visão geral da plataforma SER+</p>
          </div>
          <Link href="/admin/courses/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Novo Curso
          </Link>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '36px' }}>
          {[
            { icon: Users, label: "Alunos", value: usersCount, color: "#4F46E5", bg: "#EEF2FF" },
            { icon: BookOpen, label: "Cursos", value: coursesCount, color: "var(--green)", bg: "var(--green-light)" },
            { icon: GraduationCap, label: "Matrículas", value: enrollmentsCount, color: "#0891B2", bg: "#ECFEFF" },
            { icon: TrendingUp, label: "Conclusões", value: completedCount, color: "#D97706", bg: "#FFFBEB" },
          ].map(s => (
            <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={22} />
              </div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--gray)', marginTop: '2px' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Quick Actions */}
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Ações Rápidas</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: "Gerenciar Cursos", href: "/admin/courses", icon: BookOpen, desc: "Criar, editar e excluir" },
                { label: "Gestão de Alunos", href: "/admin/students", icon: Users, desc: "Visualizar e gerenciar" },
                { label: "Matrículas", href: "/admin/enrollments", icon: GraduationCap, desc: "Acompanhar progresso" },
                { label: "Novo Curso", href: "/admin/courses/new", icon: Plus, desc: "Adicionar conteúdo" },
              ].map(a => (
                <Link key={a.label} href={a.href} style={{
                  padding: '16px', borderRadius: '12px', border: '1.5px solid var(--gray-light)',
                  display: 'flex', flexDirection: 'column', gap: '8px', textDecoration: 'none', color: 'inherit',
                  transition: 'all 0.2s'
                }}>
                  <a.icon size={20} color="var(--green)" />
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>{a.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--gray)' }}>{a.desc}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>Atividade Recente</h3>
              <Link href="/admin/enrollments" style={{ fontSize: '12px', color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>Ver tudo →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentData.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--gray)', padding: '20px', fontSize: '13px' }}>Nenhuma atividade recente.</div>
              ) : (
                recentData.map(r => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--gray-light)' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Users size={14} color="var(--green)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.userName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--gray)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.courseTitle}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: r.progress === 100 ? 'var(--green)' : 'var(--gray-dark)' }}>{r.progress}%</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Average Progress */}
        <div className="card" style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <BarChart3 size={20} color="var(--green)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700 }}>Progresso Médio dos Alunos</h3>
          </div>
          <div style={{ height: '12px', background: 'var(--gray-light)', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--green), #00C853)', width: `${avgProgress}%`, borderRadius: '6px', transition: 'width 0.5s' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--gray)' }}>
            <span>{avgProgress}% média geral</span>
            <span>{completedCount} de {enrollmentsCount} concluídos</span>
          </div>
        </div>
      </main>
    </div>
  );
}
