import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";
import Sidebar from "@/components/Sidebar";
import CatalogContent from "@/components/CatalogContent";

export default async function CatalogPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const coursesSnapshot = await adminDb.collection("courses").get();
  const allCourses = coursesSnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter((c: any) => c.published !== false); // Only show published courses

  const enrollmentsSnapshot = userId 
    ? await adminDb.collection("enrollments").where("userId", "==", userId).get()
    : null;
  
  const enrolledIds = enrollmentsSnapshot 
    ? enrollmentsSnapshot.docs.map(doc => doc.data().courseId)
    : [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--off-white)' }}>
      <Sidebar user={session?.user} />
      
      <main style={{ marginLeft: 'var(--sidebar-w)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <CatalogContent allCourses={allCourses} enrolledIds={enrolledIds} />
      </main>
    </div>
  );
}
