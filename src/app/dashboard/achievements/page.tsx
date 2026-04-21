import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";
import Sidebar from "@/components/Sidebar";
import { Trophy, Star, Zap, Target, Award, Flame } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AchievementsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const userDoc = await adminDb.collection("users").doc(userId).get();
  const user = userDoc.data();

  const achievements = [
    { title: "Primeiros Passos", desc: "Inscreveu-se no seu primeiro curso", icon: Target, unlocked: true },
    { title: "Maratonista", desc: "Concluiu 5 aulas em um único dia", icon: Flame, unlocked: (user?.xp || 0) > 250 },
    { title: "Mestre da Teoria", desc: "Concluiu seu primeiro curso 100%", icon: Award, unlocked: (user?.xp || 0) > 500 },
    { title: "Acima da Média", desc: "Alcançou o Nível 5", icon: Zap, unlocked: (user?.nivel || 1) >= 5 },
    { title: "Colecionador", desc: "Ganhou 3 certificados", icon: Trophy, unlocked: false },
    { title: "Estrela Guia", desc: "Ajudou 5 colegas na comunidade", icon: Star, unlocked: false },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--off-white)' }}>
      <Sidebar user={user} />
      
      <main style={{ marginLeft: 'var(--sidebar-w)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'white', padding: '14px 36px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--gray-light)', position: 'sticky', top: 0, zIndex: 40 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>Conquistas e Medalhas</h1>
        </div>

        <div style={{ padding: '32px 36px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', 
            borderRadius: '24px', 
            padding: '40px', 
            color: 'white',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Seu Progresso</h2>
              <p style={{ opacity: 0.7, fontSize: '16px' }}>Você desbloqueou {achievements.filter(a => a.unlocked).length} de {achievements.length} conquistas.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--green)', lineHeight: 1 }}>{user?.xp || 0}</div>
              <div style={{ fontSize: '14px', opacity: 0.6 }}>XP TOTAL</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {achievements.map((ach, idx) => {
              const Icon = ach.icon;
              return (
                <div key={idx} className="card" style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center',
                  padding: '32px 24px',
                  opacity: ach.unlocked ? 1 : 0.5,
                  filter: ach.unlocked ? 'none' : 'grayscale(100%)',
                  background: ach.unlocked ? 'white' : 'rgba(255,255,255,0.5)'
                }}>
                  <div style={{ 
                    width: '70px', 
                    height: '70px', 
                    borderRadius: '50%', 
                    background: ach.unlocked ? 'var(--green-light)' : 'var(--gray-light)', 
                    color: ach.unlocked ? 'var(--green)' : 'var(--gray)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <Icon size={32} />
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>{ach.title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: 1.5 }}>{ach.desc}</p>
                  
                  {!ach.unlocked && (
                    <div style={{ marginTop: '16px', fontSize: '11px', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Bloqueado
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
