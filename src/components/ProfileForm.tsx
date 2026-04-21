"use client";

import { useState } from "react";
import { User, Camera, Save, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileForm({ user }: { user: any }) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    nascimento: user.nascimento ? new Date(user.nascimento).toISOString().split('T')[0] : "",
    genero: user.genero || "",
    cidade: user.cidade || "",
    estado: user.estado || "",
    origem: user.origem || ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: "✅ Perfil atualizado com sucesso!" });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: "❌ Erro ao salvar. Tente novamente." });
      }
    } catch (err) {
      setMessage({ type: 'error', text: "❌ Erro na conexão." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
      {/* COLUNA ESQUERDA: foto + stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px 24px', textAlign: 'center', borderBottom: '1px solid var(--gray-light)' }}>
            <div style={{ position: 'relative', width: '110px', height: '110px', marginBottom: '16px' }}>
              <div style={{ width: '110px', height: '110px', borderRadius: '50%', border: '4px solid var(--green-mid)', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {user.image ? <img src={user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={48} color="var(--green)" />}
              </div>
              <label htmlFor="foto-input" style={{ position: 'absolute', bottom: '4px', right: '4px', width: '30px', height: '30px', borderRadius: '50%', background: 'var(--green)', color: 'white', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Camera size={14} />
              </label>
              <input type="file" id="foto-input" accept="image/*" style={{ display: 'none' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--black)', marginBottom: '4px' }}>{formData.name || "—"}</div>
            <div style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '12px' }}>{user.email}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--green-light)', color: 'var(--green-dark)', padding: '5px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: 600 }}>
              ⭐ Nível {user.nivel} · {user.xp} XP
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--gray-light)' }}>
            <div style={{ background: 'white', padding: '18px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: 'var(--green)', lineHeight: 1, marginBottom: '4px' }}>{user.certificatesCount || 0}</div>
              <div style={{ fontSize: '11px', color: 'var(--gray)' }}>Certificados</div>
            </div>
            <div style={{ background: 'white', padding: '18px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: 'var(--green)', lineHeight: 1, marginBottom: '4px' }}>{user.enrollmentsCount || 0}</div>
              <div style={{ fontSize: '11px', color: 'var(--gray)' }}>Cursos</div>
            </div>
            <div style={{ background: 'white', padding: '18px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: 'var(--green)', lineHeight: 1, marginBottom: '4px' }}>{user.streak}</div>
              <div style={{ fontSize: '11px', color: 'var(--gray)' }}>Dias seguidos</div>
            </div>
            <div style={{ background: 'white', padding: '18px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: 'var(--green)', lineHeight: 1, marginBottom: '4px' }}>{user.xp}</div>
              <div style={{ fontSize: '11px', color: 'var(--gray)' }}>XP total</div>
            </div>
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA: formulário */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card">
          <div style={{ padding: '0 0 18px 0', borderBottom: '1px solid var(--gray-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700 }}>Editar Perfil</h3>
          </div>

          {message && (
            <div style={{ 
              padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px',
              background: message.type === 'success' ? 'var(--green-light)' : '#FFEBEE',
              color: message.type === 'success' ? 'var(--green-dark)' : '#c62828',
              border: `1px solid ${message.type === 'success' ? 'var(--green-mid)' : '#ffcdd2'}`
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-dark)' }}>Nome completo *</label>
                <input type="text" id="name" value={formData.name} onChange={handleChange} style={{ padding: '11px 14px', borderRadius: '10px', border: '1.5px solid var(--gray-light)', fontSize: '14px', outline: 'none' }} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-dark)' }}>Data de nascimento</label>
                <input type="date" id="nascimento" value={formData.nascimento} onChange={handleChange} style={{ padding: '11px 14px', borderRadius: '10px', border: '1.5px solid var(--gray-light)', fontSize: '14px', outline: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-dark)' }}>E-mail</label>
                <input type="email" value={user.email} disabled style={{ padding: '11px 14px', borderRadius: '10px', border: '1.5px solid var(--gray-light)', fontSize: '14px', background: 'var(--off-white)', color: 'var(--gray)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-dark)' }}>Gênero</label>
                <select id="genero" value={formData.genero} onChange={handleChange} style={{ padding: '11px 14px', borderRadius: '10px', border: '1.5px solid var(--gray-light)', fontSize: '14px', outline: 'none' }}>
                  <option value="">Prefiro não informar</option>
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                  <option value="nao-binario">Não-binário</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-dark)' }}>Cidade</label>
                <input type="text" id="cidade" value={formData.cidade} onChange={handleChange} placeholder="Ex: Rio de Janeiro" style={{ padding: '11px 14px', borderRadius: '10px', border: '1.5px solid var(--gray-light)', fontSize: '14px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-dark)' }}>Estado</label>
                <select id="estado" value={formData.estado} onChange={handleChange} style={{ padding: '11px 14px', borderRadius: '10px', border: '1.5px solid var(--gray-light)', fontSize: '14px', outline: 'none' }}>
                  <option value="">Selecione...</option>
                  {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-dark)' }}>Como você ficou sabendo da SER+?</label>
              <select id="origem" value={formData.origem} onChange={handleChange} style={{ padding: '11px 14px', borderRadius: '10px', border: '1.5px solid var(--gray-light)', fontSize: '14px', outline: 'none' }}>
                <option value="">Selecione...</option>
                <option value="indicacao">Indicação de amigo</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="centro-academico">Centro Acadêmico</option>
                <option value="projeto-social">Projeto Social</option>
                <option value="google">Google / Pesquisa</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={loading} className="btn btn-primary">
                <Save size={16} />
                {loading ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
