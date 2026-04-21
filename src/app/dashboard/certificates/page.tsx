import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";
import Sidebar from "@/components/Sidebar";
import { GraduationCap, Award, Download } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CertificatesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Fetch enrollments that are 100% complete
  const enrollmentsSnapshot = await adminDb.collection("enrollments")
    .where("userId", "==", userId)
    .where("progress", "==", 100)
    .get();
  
  const completedCourses = await Promise.all(
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

  const certificates = completedCourses.filter(e => e.course !== null);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--off-white)' }}>
      <Sidebar user={session.user} />
      
      <main style={{ marginLeft: 'var(--sidebar-w)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'white', padding: '14px 36px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--gray-light)', position: 'sticky', top: 0, zIndex: 40 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>Meus Certificados</h1>
        </div>

        <div style={{ padding: '32px 36px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {certificates.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px', background: 'white', borderRadius: '24px', border: '1.5px solid var(--gray-light)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '8px' }}>Nenhum certificado ainda</h3>
                <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>Conclua 100% de um curso para liberar seu certificado de conclusão.</p>
                <Link href="/dashboard" className="btn btn-primary">Ver Meus Cursos</Link>
              </div>
            ) : (
              certificates.map((cert) => (
                <div key={cert.id} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                   <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--green-light)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                     <Award size={40} />
                   </div>
                   <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{cert.course?.title}</h4>
                   <p style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '24px' }}>Concluído em {new Date(cert.createdAt).toLocaleDateString('pt-BR')}</p>
                   
                   <Link 
                    href={`/course/${cert.courseId}/certificate`} 
                    className="btn btn-primary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                   >
                     <Download size={16} /> Baixar Certificado
                   </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
