import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AdminEnrollmentsTable from "@/components/AdminEnrollmentsTable";

export default async function AdminEnrollmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  const enrollmentsSnapshot = await adminDb.collection("enrollments").get();
  const enrollments = await Promise.all(
    enrollmentsSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const userDoc = await adminDb.collection("users").doc(data.userId).get();
      const courseDoc = await adminDb.collection("courses").doc(data.courseId).get();
      return {
        id: doc.id,
        userId: data.userId,
        courseId: data.courseId,
        userName: userDoc.exists ? userDoc.data()?.name : "Aluno removido",
        userEmail: userDoc.exists ? userDoc.data()?.email : "",
        courseTitle: courseDoc.exists ? courseDoc.data()?.title : "Curso removido",
        courseCategory: courseDoc.exists ? courseDoc.data()?.category : "",
        progress: data.progress || 0,
        completedLessons: (data.completedLessons || []).length,
        createdAt: data.createdAt || "",
      };
    })
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--off-white)' }}>
      <Sidebar user={session.user} />
      
      <main style={{ marginLeft: 'var(--sidebar-w)', flex: 1, padding: '32px 36px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800 }}>Matrículas</h1>
          <p style={{ fontSize: '14px', color: 'var(--gray)', marginTop: '4px' }}>{enrollments.length} matrículas ativas</p>
        </div>

        <AdminEnrollmentsTable enrollments={enrollments} />
      </main>
    </div>
  );
}
