import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";
import Sidebar from "@/components/Sidebar";
import { BookOpen, Play } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MyCoursesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--off-white)' }}>
      <Sidebar user={session.user} />
      
      <main style={{ marginLeft: 'var(--sidebar-w)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'white', padding: '14px 36px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--gray-light)', position: 'sticky', top: 0, zIndex: 40 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>Meus Cursos</h1>
        </div>

        <div style={{ padding: '32px 36px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {enrollments.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px', background: 'white', borderRadius: '24px', border: '1.5px solid var(--gray-light)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '8px' }}>Nenhum curso ainda</h3>
                <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>Você ainda não se inscreveu em nenhum curso da nossa plataforma.</p>
                <Link href="/catalog" className="btn btn-primary">Explorar Catálogo</Link>
              </div>
            ) : (
              enrollments.map((enrollment) => (
                <div key={enrollment.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ height: '140px', background: 'var(--green-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', overflow: 'hidden' }}>
                      {enrollment.course?.thumbnail ? (
                        <img src={enrollment.course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <BookOpen size={48} color="var(--green)" />
                      )}
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
