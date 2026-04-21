"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Edit, Trash2, Copy, Eye, EyeOff, BookOpen, Users, GraduationCap, MoreVertical, AlertTriangle } from "lucide-react";

interface Course {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  published: boolean;
  enrollmentCount: number;
  completedCount: number;
  modulesCount: number;
  lessonsCount: number;
  createdAt: string;
}

export default function AdminCoursesTable({ courses: initialCourses }: { courses: Course[] }) {
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCourses(courses.filter(c => c.id !== id));
        setDeleteModal(null);
      } else {
        alert("Erro ao excluir curso.");
      }
    } catch {
      alert("Erro de conexão.");
    } finally {
      setLoading(null);
    }
  };

  const handleTogglePublish = async (id: string, published: boolean) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });
      if (res.ok) {
        setCourses(courses.map(c => c.id === id ? { ...c, published: !published } : c));
      }
    } catch {
      alert("Erro de conexão.");
    } finally {
      setLoading(null);
      setActionMenu(null);
    }
  };

  const handleDuplicate = async (course: Course) => {
    setLoading(course.id);
    try {
      const detailRes = await fetch(`/api/admin/courses/${course.id}`);
      if (!detailRes.ok) { alert("Erro ao duplicar."); return; }
      const data = await detailRes.json();
      const { id, ...rest } = data;
      
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...rest, title: `${rest.title} (Cópia)`, published: false }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      alert("Erro de conexão.");
    } finally {
      setLoading(null);
      setActionMenu(null);
    }
  };

  const courseToDelete = courses.find(c => c.id === deleteModal);

  return (
    <>
      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
          <input
            type="text"
            placeholder="Buscar por título ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '12px', border: '1.5px solid var(--gray-light)', fontSize: '14px', outline: 'none' }}
          />
        </div>
      </div>

      {/* Course Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {filtered.map(course => (
          <div key={course.id} className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative', opacity: course.published ? 1 : 0.7 }}>
            {/* Thumbnail */}
            <div style={{ height: '140px', background: 'var(--green-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
              {course.thumbnail ? (
                <img src={course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <BookOpen size={40} color="var(--green)" />
              )}
              {/* Status Badge */}
              <div style={{
                position: 'absolute', top: '10px', left: '10px',
                background: course.published ? 'var(--green)' : '#EF4444',
                color: 'white', padding: '3px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px'
              }}>
                {course.published ? "PUBLICADO" : "RASCUNHO"}
              </div>
              {/* Actions Menu */}
              <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <button
                  onClick={() => setActionMenu(actionMenu === course.id ? null : course.id)}
                  style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <MoreVertical size={16} />
                </button>
                {actionMenu === course.id && (
                  <div style={{
                    position: 'absolute', top: '36px', right: 0, background: 'white', borderRadius: '12px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)', padding: '6px', minWidth: '180px', zIndex: 100,
                    border: '1px solid var(--gray-light)'
                  }}>
                    <Link href={`/admin/courses/${course.id}`} style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px',
                      fontSize: '13px', color: 'var(--black)', textDecoration: 'none', fontWeight: 500
                    }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--gray-light)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Edit size={15} /> Editar
                    </Link>
                    <button onClick={() => handleTogglePublish(course.id, course.published)} style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', width: '100%',
                      fontSize: '13px', color: 'var(--black)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, textAlign: 'left'
                    }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--gray-light)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {course.published ? <><EyeOff size={15} /> Despublicar</> : <><Eye size={15} /> Publicar</>}
                    </button>
                    <button onClick={() => handleDuplicate(course)} style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', width: '100%',
                      fontSize: '13px', color: 'var(--black)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, textAlign: 'left'
                    }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--gray-light)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Copy size={15} /> Duplicar
                    </button>
                    <div style={{ height: '1px', background: 'var(--gray-light)', margin: '4px 0' }}></div>
                    <button onClick={() => { setDeleteModal(course.id); setActionMenu(null); }} style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', width: '100%',
                      fontSize: '13px', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textAlign: 'left'
                    }}
                      onMouseOver={e => e.currentTarget.style.background = '#FEF2F2'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Trash2 size={15} /> Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{course.category}</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, marginBottom: '14px', lineHeight: 1.3 }}>{course.title}</h4>
              
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--gray)', marginBottom: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BookOpen size={13} /> {course.modulesCount} módulos · {course.lessonsCount} aulas</span>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, background: 'var(--gray-light)', borderRadius: '8px', padding: '10px 14px', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '16px', fontFamily: 'var(--font-display)' }}>{course.enrollmentCount}</div>
                  <div style={{ fontSize: '10px', color: 'var(--gray)' }}>Inscritos</div>
                </div>
                <div style={{ flex: 1, background: 'var(--gray-light)', borderRadius: '8px', padding: '10px 14px', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '16px', fontFamily: 'var(--font-display)' }}>{course.completedCount}</div>
                  <div style={{ fontSize: '10px', color: 'var(--gray)' }}>Concluídos</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray)' }}>
          <BookOpen size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <p>Nenhum curso encontrado.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && courseToDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}
          onClick={() => setDeleteModal(null)}
        >
          <div className="card" style={{ maxWidth: '440px', width: '100%', textAlign: 'center', padding: '40px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <AlertTriangle size={28} color="#EF4444" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Excluir Curso</h3>
            <p style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '8px', lineHeight: 1.6 }}>
              Tem certeza que deseja excluir <strong style={{ color: 'var(--black)' }}>{courseToDelete.title}</strong>?
            </p>
            <p style={{ fontSize: '12px', color: '#EF4444', marginBottom: '28px' }}>
              ⚠️ Esta ação irá remover {courseToDelete.enrollmentCount} matrícula(s) associada(s) e não pode ser desfeita.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setDeleteModal(null)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid var(--gray-light)', background: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteModal)}
                disabled={loading === deleteModal}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#EF4444', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
              >
                {loading === deleteModal ? "Excluindo..." : "Sim, Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
