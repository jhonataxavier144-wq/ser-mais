import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import CertificateViewer from "@/components/CertificateViewer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function CourseCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  
  const courseDoc = await adminDb.collection("courses").doc(id).get();
  if (!courseDoc.exists) redirect("/dashboard");
  
  const course = { id: courseDoc.id, ...courseDoc.data() };

  // Check if enrollment is 100%
  const enrollmentSnap = await adminDb.collection("enrollments")
    .where("userId", "==", userId)
    .where("courseId", "==", id)
    .get();

  if (enrollmentSnap.empty || enrollmentSnap.docs[0].data().progress < 100) {
    // Redirect to course if not completed
    redirect(`/course/${id}`);
  }

  const userDoc = await adminDb.collection("users").doc(userId).get();
  const user = userDoc.data();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--off-white)' }}>
      <Sidebar user={session.user} />
      
      <main style={{ marginLeft: 'var(--sidebar-w)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'white', padding: '14px 36px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--gray-light)', position: 'sticky', top: 0, zIndex: 40 }}>
          <Link href={`/course/${id}`} style={{ color: 'var(--gray)' }}><ArrowLeft size={20} /></Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>Certificado de Conclusão</h1>
        </div>

        <div style={{ padding: '60px 36px', display: 'flex', justifyContent: 'center' }}>
          <CertificateViewer course={course} user={user} />
        </div>
      </main>
    </div>
  );
}
