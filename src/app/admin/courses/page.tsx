import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebase-admin";
import Sidebar from "@/components/Sidebar";
import AdminCoursesTable from "@/components/AdminCoursesTable";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminCoursesPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  const coursesSnapshot = await adminDb.collection("courses").get();
  const courses = await Promise.all(
    coursesSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const enrollSnap = await adminDb.collection("enrollments").where("courseId", "==", doc.id).get();
      const completedSnap = enrollSnap.docs.filter(d => d.data().progress === 100);
      return {
        id: doc.id,
        title: data.title || "",
        category: data.category || "",
        thumbnail: data.thumbnail || "",
        published: data.published !== false, // default true
        enrollmentCount: enrollSnap.size,
        completedCount: completedSnap.length,
        modulesCount: (data.modules || []).length,
        lessonsCount: (data.modules || []).reduce((a: number, m: any) => a + (m.lessons?.length || 0), 0),
        createdAt: data.createdAt || "",
      };
    })
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--off-white)' }}>
      <Sidebar user={session.user} />
      
      <main style={{ marginLeft: 'var(--sidebar-w)', flex: 1, padding: '32px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800 }}>Gerenciar Cursos</h1>
            <p style={{ fontSize: '14px', color: 'var(--gray)', marginTop: '4px' }}>{courses.length} cursos cadastrados</p>
          </div>
          <Link href="/admin/courses/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Novo Curso
          </Link>
        </div>

        <AdminCoursesTable courses={courses} />
      </main>
    </div>
  );
}
