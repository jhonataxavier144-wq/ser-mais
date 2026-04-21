"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2, AlertTriangle, Filter, CheckCircle, Clock } from "lucide-react";

interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  userName: string;
  userEmail: string;
  courseTitle: string;
  courseCategory: string;
  progress: number;
  completedLessons: number;
  createdAt: string;
}

export default function AdminEnrollmentsTable({ enrollments: initial }: { enrollments: Enrollment[] }) {
  const [enrollments, setEnrollments] = useState(initial);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const filtered = enrollments
    .filter(e => {
      const matchSearch = e.userName.toLowerCase().includes(search.toLowerCase()) ||
        e.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
        e.userEmail.toLowerCase().includes(search.toLowerCase());
      if (statusFilter === "completed") return matchSearch && e.progress === 100;
      if (statusFilter === "inprogress") return matchSearch && e.progress > 0 && e.progress < 100;
      if (statusFilter === "notstarted") return matchSearch && e.progress === 0;
      return matchSearch;
    })
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

  const handleDelete = async (id: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/enrollments/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEnrollments(enrollments.filter(e => e.id !== id));
        setDeleteModal(null);
      }
    } catch {
      alert("Erro ao excluir.");
    } finally {
      setLoading(null);
    }
  };

  const enrollmentToDelete = enrollments.find(e => e.id === deleteModal);

  const stats = {
    total: enrollments.length,
    completed: enrollments.filter(e => e.progress === 100).length,
    inProgress: enrollments.filter(e => e.progress > 0 && e.progress < 100).length,
    notStarted: enrollments.filter(e => e.progress === 0).length,
  };

  return (
    <>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: "Total", value: stats.total, color: "var(--black)", bg: "var(--gray-light)", filter: "all" },
          { label: "Concluídas", value: stats.completed, color: "var(--green)", bg: "var(--green-light)", filter: "completed" },
          { label: "Em Progresso", value: stats.inProgress, color: "#0891B2", bg: "#ECFEFF", filter: "inprogress" },
          { label: "Não Iniciadas", value: stats.notStarted, color: "#D97706", bg: "#FFFBEB", filter: "notstarted" },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => setStatusFilter(statusFilter === s.filter ? "all" : s.filter)}
            className="card"
            style={{
              padding: '18px', textAlign: 'center', cursor: 'pointer', border: statusFilter === s.filter ? `2px solid ${s.color}` : '1px solid var(--gray-light)',
              background: statusFilter === s.filter ? s.bg : 'white'
            }}
          >
            <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-display)', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '2px' }}>{s.label}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
        <input
          type="text"
          placeholder="Buscar por aluno ou curso..."
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
              <th style={{ padding: '14px 20px', fontSize: '11px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aluno</th>
              <th style={{ padding: '14px 20px', fontSize: '11px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Curso</th>
              <th style={{ padding: '14px 20px', fontSize: '11px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
              <th style={{ padding: '14px 20px', fontSize: '11px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Progresso</th>
              <th style={{ padding: '14px 20px', fontSize: '11px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aulas</th>
              <th style={{ padding: '14px 20px', fontSize: '11px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid var(--gray-light)' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{e.userName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--gray)' }}>{e.userEmail}</div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{e.courseTitle}</div>
                  <div style={{ fontSize: '11px', color: 'var(--gray)' }}>{e.courseCategory}</div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  {e.progress === 100 ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: 700, background: 'var(--green-light)', color: 'var(--green-dark)' }}>
                      <CheckCircle size={11} /> Concluído
                    </span>
                  ) : e.progress > 0 ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: 700, background: '#ECFEFF', color: '#0891B2' }}>
                      <Clock size={11} /> Em Progresso
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: 700, background: '#FFFBEB', color: '#D97706' }}>
                      Não Iniciado
                    </span>
                  )}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '80px', height: '5px', background: 'var(--gray-light)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: e.progress === 100 ? 'var(--green)' : '#0891B2', width: `${e.progress}%` }}></div>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>{e.progress}%</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: '13px' }}>
                  {e.completedLessons} feita(s)
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <button
                    onClick={() => setDeleteModal(e.id)}
                    style={{ padding: '6px', borderRadius: '8px', border: '1px solid #FECACA', background: '#FEF2F2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Excluir matrícula"
                  >
                    <Trash2 size={14} color="#EF4444" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray)', fontSize: '13px' }}>Nenhuma matrícula encontrada.</div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal && enrollmentToDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}
          onClick={() => setDeleteModal(null)}
        >
          <div className="card" style={{ maxWidth: '440px', width: '100%', textAlign: 'center', padding: '40px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <AlertTriangle size={28} color="#EF4444" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Remover Matrícula</h3>
            <p style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '24px', lineHeight: 1.6 }}>
              Tem certeza que deseja remover a matrícula de <strong style={{ color: 'var(--black)' }}>{enrollmentToDelete.userName}</strong> no curso <strong style={{ color: 'var(--black)' }}>{enrollmentToDelete.courseTitle}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid var(--gray-light)', background: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                Cancelar
              </button>
              <button onClick={() => handleDelete(deleteModal)} disabled={loading === deleteModal} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#EF4444', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                {loading === deleteModal ? "Removendo..." : "Sim, Remover"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
