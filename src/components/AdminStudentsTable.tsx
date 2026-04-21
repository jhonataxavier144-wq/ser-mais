"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Mail, Award, Trash2, AlertTriangle, ChevronDown, ChevronUp, X, Shield, ShieldOff } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  nivel: number;
  xp: number;
  enrollmentsCount: number;
  certificatesCount: number;
  createdAt: string;
}

export default function AdminStudentsTable({ students: initialStudents }: { students: Student[] }) {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [detailModal, setDetailModal] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const router = useRouter();

  const filtered = students
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a: any, b: any) => {
      const val = sortAsc ? 1 : -1;
      if (sortField === "name") return a.name.localeCompare(b.name) * val;
      if (sortField === "xp") return (a.xp - b.xp) * val;
      if (sortField === "enrollments") return (a.enrollmentsCount - b.enrollmentsCount) * val;
      return 0;
    });

  const handleSort = (field: string) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const SortIcon = ({ field }: { field: string }) => (
    sortField === field
      ? (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
      : <ChevronDown size={12} style={{ opacity: 0.3 }} />
  );

  const handleDelete = async (id: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/students/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStudents(students.filter(s => s.id !== id));
        setDeleteModal(null);
      } else {
        alert("Erro ao excluir aluno.");
      }
    } catch {
      alert("Erro de conexão.");
    } finally {
      setLoading(null);
    }
  };

  const handleToggleRole = async (id: string, currentRole: string) => {
    setLoading(id);
    const newRole = currentRole === "ADMIN" ? "STUDENT" : "ADMIN";
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setStudents(students.map(s => s.id === id ? { ...s, role: newRole } : s));
      }
    } catch {
      alert("Erro de conexão.");
    } finally {
      setLoading(null);
    }
  };

  const handleViewDetails = async (student: Student) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/students/${student.id}`);
      if (res.ok) {
        const data = await res.json();
        setDetailModal(data);
      }
    } catch {
      alert("Erro ao carregar detalhes.");
    } finally {
      setDetailLoading(false);
    }
  };

  const studentToDelete = students.find(s => s.id === deleteModal);

  return (
    <>
      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
        <input
          type="text"
          placeholder="Buscar aluno por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '12px 16px 12px 42px', borderRadius: '12px', border: '1.5px solid var(--gray-light)', fontSize: '14px', outline: 'none' }}
        />
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--gray-light)', background: '#F9FAFB' }}>
              <th onClick={() => handleSort("name")} style={{ padding: '14px 20px', fontSize: '11px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer', userSelect: 'none' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Aluno <SortIcon field="name" /></span>
              </th>
              <th style={{ padding: '14px 20px', fontSize: '11px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cargo</th>
              <th onClick={() => handleSort("enrollments")} style={{ padding: '14px 20px', fontSize: '11px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer', userSelect: 'none' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Cursos <SortIcon field="enrollments" /></span>
              </th>
              <th style={{ padding: '14px 20px', fontSize: '11px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Certificados</th>
              <th onClick={() => handleSort("xp")} style={{ padding: '14px 20px', fontSize: '11px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer', userSelect: 'none' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Nível / XP <SortIcon field="xp" /></span>
              </th>
              <th style={{ padding: '14px 20px', fontSize: '11px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(student => (
              <tr key={student.id} style={{ borderBottom: '1px solid var(--gray-light)' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      {student.image ? <img src={student.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={16} color="var(--green)" />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{student.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Mail size={10} /> {student.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: 700,
                    background: student.role === "ADMIN" ? '#EEF2FF' : 'var(--green-light)',
                    color: student.role === "ADMIN" ? '#4F46E5' : 'var(--green-dark)',
                  }}>
                    {student.role === "ADMIN" ? "ADMIN" : "ALUNO"}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{student.enrollmentsCount}</div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--green)', fontWeight: 600, fontSize: '13px' }}>
                    <Award size={14} /> {student.certificatesCount}
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ background: 'var(--green-mid)', color: 'var(--green-dark)', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>Lvl {student.nivel}</div>
                    <div style={{ fontSize: '11px', color: 'var(--gray)' }}>{student.xp} XP</div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleViewDetails(student)}
                      title="Ver detalhes"
                      style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--gray-light)', background: 'white', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Detalhes
                    </button>
                    <button
                      onClick={() => handleToggleRole(student.id, student.role)}
                      title={student.role === "ADMIN" ? "Remover admin" : "Tornar admin"}
                      disabled={loading === student.id}
                      style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--gray-light)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {student.role === "ADMIN" ? <ShieldOff size={14} color="#4F46E5" /> : <Shield size={14} color="var(--gray)" />}
                    </button>
                    <button
                      onClick={() => setDeleteModal(student.id)}
                      title="Excluir aluno"
                      style={{ padding: '6px', borderRadius: '8px', border: '1px solid #FECACA', background: '#FEF2F2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Trash2 size={14} color="#EF4444" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray)', fontSize: '13px' }}>Nenhum aluno encontrado.</div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && studentToDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}
          onClick={() => setDeleteModal(null)}
        >
          <div className="card" style={{ maxWidth: '440px', width: '100%', textAlign: 'center', padding: '40px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <AlertTriangle size={28} color="#EF4444" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Excluir Aluno</h3>
            <p style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '8px', lineHeight: 1.6 }}>
              Tem certeza que deseja excluir <strong style={{ color: 'var(--black)' }}>{studentToDelete.name}</strong>?
            </p>
            <p style={{ fontSize: '12px', color: '#EF4444', marginBottom: '28px' }}>
              ⚠️ Todas as {studentToDelete.enrollmentsCount} matrícula(s) e dados serão removidos permanentemente.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid var(--gray-light)', background: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                Cancelar
              </button>
              <button onClick={() => handleDelete(deleteModal)} disabled={loading === deleteModal} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#EF4444', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                {loading === deleteModal ? "Excluindo..." : "Sim, Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {detailModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}
          onClick={() => setDetailModal(null)}
        >
          <div className="card" style={{ maxWidth: '560px', width: '100%', padding: '0', maxHeight: '80vh', overflow: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '28px 32px', borderBottom: '1px solid var(--gray-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {detailModal.image ? <img src={detailModal.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={24} color="var(--green)" />}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800 }}>{detailModal.name}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--gray)' }}>{detailModal.email}</div>
                </div>
              </div>
              <button onClick={() => setDetailModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)' }}><X size={20} /></button>
            </div>

            {/* Stats */}
            <div style={{ padding: '20px 32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ background: 'var(--gray-light)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '18px', fontFamily: 'var(--font-display)' }}>{detailModal.nivel || 1}</div>
                <div style={{ fontSize: '10px', color: 'var(--gray)' }}>Nível</div>
              </div>
              <div style={{ background: 'var(--gray-light)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '18px', fontFamily: 'var(--font-display)' }}>{detailModal.xp || 0}</div>
                <div style={{ fontSize: '10px', color: 'var(--gray)' }}>XP Total</div>
              </div>
              <div style={{ background: 'var(--gray-light)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '18px', fontFamily: 'var(--font-display)', color: 'var(--green)' }}>{detailModal.enrollments?.length || 0}</div>
                <div style={{ fontSize: '10px', color: 'var(--gray)' }}>Cursos</div>
              </div>
            </div>

            {/* Enrollments */}
            <div style={{ padding: '0 32px 28px' }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Matrículas</h4>
              {(detailModal.enrollments || []).length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--gray)', padding: '20px', fontSize: '13px', background: 'var(--gray-light)', borderRadius: '12px' }}>
                  Nenhuma matrícula encontrada.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {detailModal.enrollments.map((e: any) => (
                    <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--gray-light)', borderRadius: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{e.courseTitle}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                          <div style={{ flex: 1, maxWidth: '120px', height: '5px', background: '#ddd', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: e.progress === 100 ? 'var(--green)' : '#0891B2', width: `${e.progress || 0}%` }}></div>
                          </div>
                          <span style={{ fontSize: '11px', color: e.progress === 100 ? 'var(--green)' : 'var(--gray)', fontWeight: 600 }}>{e.progress || 0}%</span>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          if (!confirm("Remover esta matrícula?")) return;
                          const res = await fetch(`/api/admin/enrollments/${e.id}`, { method: "DELETE" });
                          if (res.ok) {
                            setDetailModal({ ...detailModal, enrollments: detailModal.enrollments.filter((en: any) => en.id !== e.id) });
                          }
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px' }}
                        title="Remover matrícula"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
