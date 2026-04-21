import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AdminStudentsTable from "@/components/AdminStudentsTable";

export default async function AdminStudentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  const usersSnapshot = await adminDb.collection("users").get();
  const students = await Promise.all(
    usersSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const enrollmentsSnap = await adminDb.collection("enrollments").where("userId", "==", doc.id).get();
      const completedCount = enrollmentsSnap.docs.filter(d => d.data().progress === 100).length;

      return {
        id: doc.id,
        name: data.name || "Sem nome",
        email: data.email || "",
        image: data.image || "",
        role: data.role || "STUDENT",
        nivel: data.nivel || 1,
        xp: data.xp || 0,
        enrollmentsCount: enrollmentsSnap.size,
        certificatesCount: completedCount,
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
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800 }}>Gestão de Alunos</h1>
            <p style={{ fontSize: '14px', color: 'var(--gray)', marginTop: '4px' }}>{students.length} alunos cadastrados</p>
          </div>
        </div>

        <AdminStudentsTable students={students} />
      </main>
    </div>
  );
}
