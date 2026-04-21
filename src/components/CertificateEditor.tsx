"use client";

import { useState, useRef, useEffect } from "react";
import { Save, Move, Type, Image as ImageIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CertificateEditor({ course }: { course: any }) {
  const [template, setTemplate] = useState({
    image: course.certificateImage || "",
    x: course.certNameX || 50,
    y: course.certNameY || 50,
    fontSize: course.certFontSize || 30,
    color: course.certFontColor || "#000000"
  });
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || e.buttons !== 1) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    
    setTemplate({ ...template, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const storageRef = ref(storage, `certificates/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setTemplate({ ...template, image: downloadURL });
    } catch (err) {
      console.error(err);
      alert("Erro no upload para o Firebase.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/courses/${course.id}/certificate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(template),
      });
      if (res.ok) {
        alert("Configurações do certificado salvas!");
        router.refresh();
      }
    } catch (err) {
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Template do Certificado</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input 
                type="text" 
                value={template.image} 
                onChange={(e) => setTemplate({ ...template, image: e.target.value })}
                placeholder="https://exemplo.com/certificado.jpg"
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1.5px solid var(--gray-light)', fontSize: '13px' }}
              />
              <span style={{ fontSize: '12px', color: 'var(--gray)' }}>ou</span>
              <label style={{ 
                padding: '10px 16px', borderRadius: '8px', background: 'var(--green-light)', 
                color: 'var(--green-dark)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' 
              }}>
                <Plus size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Upload
                <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
              </label>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--gray)' }}>Dica: Use uma imagem horizontal (1920x1080 ideal).</p>
          </div>

          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            style={{ 
              position: 'relative', 
              width: '100%', 
              aspectRatio: '1.414/1', // A4 Landscape
              background: '#eee',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '2px dashed var(--gray-light)',
              cursor: 'crosshair'
            }}
          >
            {template.image ? (
              <>
                <img src={template.image} alt="Template" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                <div style={{ 
                  position: 'absolute', 
                  top: `${template.y}%`, 
                  left: `${template.x}%`, 
                  transform: 'translate(-50%, -50%)',
                  fontSize: `${template.fontSize}px`,
                  color: template.color,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  textShadow: '0 0 4px rgba(255,255,255,0.8)'
                }}>
                  NOME DO ALUNO
                </div>
                <div style={{
                  position: 'absolute',
                  top: `${template.y}%`,
                  left: `${template.x}%`,
                  width: '12px', height: '12px',
                  background: 'var(--green)',
                  borderRadius: '50%',
                  border: '2px solid white',
                  transform: 'translate(-50%, -50%)'
                }}></div>
              </>
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--gray)' }}>
                <ImageIcon size={48} style={{ marginBottom: '12px' }} />
                <p>Insira a URL da imagem acima para começar</p>
              </div>
            )}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--gray)', textAlign: 'center', marginTop: '12px' }}>
            Clique e arraste sobre a imagem para posicionar o nome.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '20px' }}>Configurações</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray)' }}>Tamanho da Fonte</label>
              <input 
                type="range" min="10" max="100" 
                value={template.fontSize} 
                onChange={(e) => setTemplate({ ...template, fontSize: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--green)' }}
              />
              <div style={{ textAlign: 'right', fontSize: '12px' }}>{template.fontSize}px</div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray)' }}>Cor do Texto</label>
              <input 
                type="color" 
                value={template.color} 
                onChange={(e) => setTemplate({ ...template, color: e.target.value })}
                style={{ width: '100%', height: '40px', borderRadius: '8px', border: '1.5px solid var(--gray-light)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ padding: '12px', background: 'var(--off-white)', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--gray)', marginBottom: '4px' }}>Posição X: {template.x}%</div>
              <div style={{ fontSize: '11px', color: 'var(--gray)' }}>Posição Y: {template.y}%</div>
            </div>

            <button 
              onClick={handleSave}
              disabled={loading || !template.image}
              className="btn btn-primary" 
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px' }}
            >
              <Save size={18} /> {loading ? "Salvando..." : "Salvar Template"}
            </button>
          </div>
        </div>

        <div className="card" style={{ background: 'var(--green-light)', border: '1px solid var(--green-mid)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--green-dark)', marginBottom: '8px' }}>Instruções</h4>
          <p style={{ fontSize: '12px', color: 'var(--green-dark)', lineHeight: 1.5 }}>
            O nome do aluno será renderizado dinamicamente nesta posição exata quando ele concluir o curso.
          </p>
        </div>
      </div>
    </div>
  );
}
