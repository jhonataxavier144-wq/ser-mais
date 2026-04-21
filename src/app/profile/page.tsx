import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { adminDb } from "@/lib/firebase-admin";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const userDoc = await adminDb.collection("users").doc(userId).get();
  
  // Fetch stats
  const enrollmentsSnap = await adminDb.collection("enrollments").where("userId", "==", userId).get();
  const certsSnap = await adminDb.collection("enrollments")
    .where("userId", "==", userId)
    .where("progress", "==", 100)
    .get();

  const user = { 
    id: userDoc.id, 
    ...userDoc.data(),
    enrollmentsCount: enrollmentsSnap.size,
    certificatesCount: certsSnap.size
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--off-white)' }}>
      <Sidebar user={user} />
      
      <main style={{ marginLeft: 'var(--sidebar-w)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'white', padding: '14px 36px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--gray-light)', position: 'sticky', top: 0, zIndex: 40 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>Meu Perfil</h1>
        </div>

        <div style={{ padding: '32px 36px' }}>
          <ProfileForm user={user} />
        </div>
      </main>
    </div>
  );
}
