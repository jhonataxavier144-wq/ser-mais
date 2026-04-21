"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, FileText, Brain } from "lucide-react";
import Link from "next/link";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = use(params);
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await fetch(`/api/admin/courses/${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setCourse({
          ...data,
          materials: data.materials || "",
          quizUrl: data.quizUrl || ""
        });
      } else {
        router.push("/admin");
      }
      setLoading(false);
    };
    fetchCourse();
  }, [courseId, router]);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    try {
      const storageRef = ref(storage, `thumbnails/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setCourse({ ...course, thumbnail: downloadURL });
    } catch (err) {
      console.error(err);
      alert("Erro no upload da thumbnail.");
    } finally {
      setSaving(false);
    }
  };

  const handleVideoUpload = async (mIdx: number, lIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    try {
      const storageRef = ref(storage, `videos/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const newModules = [...course.modules];
      newModules[mIdx].lessons[lIdx].videoUrl = downloadURL;
      setCourse({ ...course, modules: newModules });
    } catch (err) {
      console.error(err);
      alert("Erro no upload do vídeo.");
    } finally {
      setSaving(false);
    }
  };

  const addModule = () => {
    setCourse({
      ...course,
      modules: [...course.modules, { id: generateId(), title: `Novo Módulo`, lessons: [{ id: generateId(), title: "Nova Aula", videoUrl: "" }] }]
    });
  };

  const removeModule = (mIdx: number) => {
    const newModules = [...course.modules];
    newModules.splice(mIdx, 1);
    setCourse({ ...course, modules: newModules });
  };

  const addLesson = (mIdx: number) => {
    const newModules = [...course.modules];
    newModules[mIdx].lessons.push({ id: generateId(), title: `Nova Aula`, videoUrl: "" });
    setCourse({ ...course, modules: newModules });
  };

  const removeLesson = (mIdx: number, lIdx: number) => {
    const newModules = [...course.modules];
    newModules[mIdx].lessons.splice(lIdx, 1);
    setCourse({ ...course, modules: newModules });
  };

  const updateLesson = (mIdx: number, lIdx: number, field: string, value: string) => {
    const newModules = [...course.modules];
    newModules[mIdx].lessons[lIdx][field] = value;
    setCourse({ ...course, modules: newModules });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        alert("Erro ao salvar curso.");
      }
    } catch (err) {
      alert("Erro na conexão.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Carregando...</div>;
  if (!course) return null;

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '100vh', padding: '40px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray)', textDecoration: 'none', marginBottom: '24px' }}>
          <ArrowLeft size={18} /> Voltar para o Painel
        </Link>
        
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, marginBottom: '32px' }}>Editar Curso</h1>

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '20px' }}>Informações Básicas</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Thumbnail</label>
                <div style={{ 
                  width: '100%', aspectRatio: '16/9', borderRadius: '12px', background: 'var(--gray-light)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                  position: 'relative', border: '2px dashed var(--gray)'
                }}>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--gray)' }}>S/ Imagem</span>
                  )}
                  <label style={{ position: 'absolute', inset: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', color: 'white', opacity: course.thumbnail ? 0 : 1, transition: 'opacity 0.2s' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>Alterar</span>
                    <input type="file" accept="image/*" onChange={handleThumbnailUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600 }}>Título do Curso</label>
                    <input 
                      type="text" 
                      value={course.title} 
                      onChange={(e) => setCourse({ ...course, title: e.target.value })} 
                      required 
                      style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid var(--gray-light)', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600 }}>Categoria</label>
                    <input 
                      type="text" 
                      value={course.category} 
                      onChange={(e) => setCourse({ ...course, category: e.target.value })} 
                      required 
                      style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid var(--gray-light)', outline: 'none' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600 }}>Descrição</label>
                  <textarea 
                    value={course.description} 
                    onChange={(e) => setCourse({ ...course, description: e.target.value })} 
                    required 
                    placeholder="Breve resumo do que o aluno vai aprender..."
                    style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid var(--gray-light)', outline: 'none', minHeight: '80px' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--gray-light)', paddingTop: '24px', marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={16} /> Materiais Complementares (Links ou Texto)
                </label>
                <textarea 
                  value={course.materials} 
                  onChange={(e) => setCourse({ ...course, materials: e.target.value })} 
                  placeholder="Ex: [PDF da Aula](http://...) ou links úteis"
                  style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid var(--gray-light)', outline: 'none', minHeight: '100px', fontSize: '13px' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Brain size={16} /> Link do Quiz Final (Google Forms, Typeform, etc)
                </label>
                <input 
                  type="text"
                  value={course.quizUrl} 
                  onChange={(e) => setCourse({ ...course, quizUrl: e.target.value })} 
                  placeholder="https://forms.gle/..."
                  style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid var(--gray-light)', outline: 'none', fontSize: '13px' }}
                />
                <p style={{ fontSize: '11px', color: 'var(--gray)' }}>O quiz será liberado para o aluno após a conclusão de todas as aulas.</p>
              </div>
            </div>
          </div>

          {course.modules.map((module: any, mIdx: number) => (
            <div key={mIdx} className="card" style={{ marginBottom: '24px', borderLeft: '4px solid var(--green)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <input 
                  type="text" 
                  value={module.title} 
                  onChange={(e) => {
                    const newModules = [...course.modules];
                    newModules[mIdx].title = e.target.value;
                    setCourse({ ...course, modules: newModules });
                  }}
                  style={{ fontFamily: 'var(--font-display)', fontSize: '18px', border: 'none', background: 'transparent', outline: 'none', fontWeight: 700, color: 'var(--black)', flex: 1 }}
                />
                <button type="button" onClick={() => removeModule(mIdx)} style={{ background: 'transparent', border: 'none', color: 'var(--gray)', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {module.lessons.map((lesson: any, lIdx: number) => (
                  <div key={lIdx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'end', background: 'var(--off-white)', padding: '12px', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gray)' }}>Título da Aula</label>
                      <input 
                        type="text" 
                        value={lesson.title} 
                        onChange={(e) => updateLesson(mIdx, lIdx, "title", e.target.value)}
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--gray-light)', outline: 'none', fontSize: '13px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gray)' }}>URL do Vídeo ou Upload</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="text" 
                          value={lesson.videoUrl} 
                          onChange={(e) => updateLesson(mIdx, lIdx, "videoUrl", e.target.value)}
                          placeholder="Link ou Upload"
                          style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--gray-light)', outline: 'none', fontSize: '13px' }}
                        />
                        <label style={{ padding: '8px 12px', background: 'var(--green-light)', color: 'var(--green-dark)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>↑</span>
                          <input type="file" accept="video/*" onChange={(e) => handleVideoUpload(mIdx, lIdx, e)} style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeLesson(mIdx, lIdx)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '8px' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addLesson(mIdx)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px dashed var(--green)', color: 'var(--green)', padding: '8px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', justifyContent: 'center' }}
                >
                  <Plus size={16} /> Adicionar Aula
                </button>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            <button 
              type="button" 
              onClick={addModule}
              style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '2px solid var(--green)', color: 'var(--green)', background: 'transparent', fontWeight: 700, cursor: 'pointer' }}
            >
              Adicionar Módulo
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="btn btn-primary" 
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Save size={18} /> {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
