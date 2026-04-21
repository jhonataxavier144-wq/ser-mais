import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import CertificateEditor from "@/components/CertificateEditor";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function AdminCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  const courseDoc = await adminDb.collection("courses").doc(id).get();
  
  if (!courseDoc.exists) {
    redirect("/admin");
  }

  const course = { id: courseDoc.id, ...courseDoc.data() } as any;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--off-white)' }}>
      <Sidebar user={session.user} />
      
      <main style={{ marginLeft: 'var(--sidebar-w)', flex: 1, padding: '32px 36px' }}>
        <div style={{ marginBottom: '32px' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray)', textDecoration: 'none', marginBottom: '16px', fontSize: '14px' }}>
            <ChevronLeft size={16} /> Voltar para o Painel
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800 }}>Template de Certificado</h1>
          <p style={{ color: 'var(--gray)', fontSize: '15px' }}>Configurando certificado para: <strong>{course.title}</strong></p>
        </div>

        <CertificateEditor course={course} />
      </main>
    </div>
  );
}
