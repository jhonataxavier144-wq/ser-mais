import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";
import Sidebar from "@/components/Sidebar";
import { BookOpen, GraduationCap, Trophy, Play } from "lucide-react";
import Link from "next/link";

import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const userId = (session?.user as any)?.id;

  // Fetch user data
  const userDoc = await adminDb.collection("users").doc(userId).get();
  const user = userDoc.data();

  // Fetch enrollments
  const enrollmentsSnapshot = await adminDb.collection("enrollments")
    .where("userId", "==", userId)
    .get();
  
  const enrollmentsWithCourses = await Promise.all(
    enrollmentsSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      if (!data.courseId) return null;
      
      const courseDoc = await adminDb.collection("courses").doc(data.courseId).get();
      return {
        id: doc.id,
        ...data,
        course: courseDoc.exists ? { id: courseDoc.id, ...courseDoc.data() } : null
      } as any;
    })
  );

  const enrollments = enrollmentsWithCourses.filter(e => e.course !== null);

  const certificatesCount = enrollments.filter(e => e.progress === 100).length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--off-white)' }}>
      <Sidebar user={user} />
      
      <main style={{ marginLeft: 'var(--sidebar-w)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'white', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--gray-light)', position: 'sticky', top: 0, zIndex: 40 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>Início</h1>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Welcome Card */}
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, var(--green) 0%, #00C853 100%)', 
            color: 'white', 
            marginBottom: '32px',
            border: 'none'
          }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '8px' }}>Olá, {user?.name?.split(' ')[0] || "Estudante"}! 👋</h2>
            <p style={{ opacity: 0.9, fontSize: '16px' }}>Continue de onde você parou ou explore novos conhecimentos no catálogo.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--green-light)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={24} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{enrollments.length || 0}</div>
                <div style={{ fontSize: '13px', color: 'var(--gray)' }}>Cursos inscritos</div>
              </div>
            </div>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--green-light)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={24} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{certificatesCount}</div>
                <div style={{ fontSize: '13px', color: 'var(--gray)' }}>Certificados</div>
              </div>
            </div>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--green-light)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={24} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{user?.xp || 0}</div>
                <div style={{ fontSize: '13px', color: 'var(--gray)' }}>XP Total</div>
              </div>
            </div>
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '20px' }}>Meus Cursos</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {enrollments.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'var(--gray)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
                <p>Você ainda não se inscreveu em nenhum curso.</p>
                <Link href="/catalog" className="btn btn-primary" style={{ marginTop: '20px' }}>Explorar Catálogo</Link>
              </div>
            ) : (
              enrollments.map((enrollment) => (
                <div key={enrollment.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                   <div style={{ height: '140px', background: 'var(--green-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                     <BookOpen size={48} color="var(--green)" />
                   </div>
                   <div style={{ padding: '20px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--green)', textTransform: 'uppercase', marginBottom: '4px' }}>{enrollment.course?.category || "Curso"}</div>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>{enrollment.course?.title || "Sem título"}</h4>
                      <div style={{ height: '6px', background: 'var(--gray-light)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                        <div style={{ height: '100%', background: 'var(--green)', width: `${enrollment.progress}%` }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'var(--gray)' }}>{enrollment.progress}% concluído</span>
                        <Link href={`/course/${enrollment.courseId}`} className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '12px' }}>
                          <Play size={14} fill="white" /> Continuar
                        </Link>
                      </div>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
