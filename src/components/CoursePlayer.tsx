"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Play, CheckCircle, FileText, Edit3, Brain, Award, Sun, Moon, List, X, ChevronRight } from "lucide-react";

type Theme = "dark" | "light";

export default function CoursePlayer({ course, enrollment }: { course: any, enrollment: any }) {
  const [activeLesson, setActiveLesson] = useState(course.modules[0]?.lessons[0] || null);
  const [activeTab, setActiveTab] = useState("sobre");
  const [completedLessons, setCompletedLessons] = useState<string[]>(enrollment.completedLessons || []);
  const [theme, setTheme] = useState<Theme>("dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(`notes-${course.id}`);
    if (saved) setNotes(saved);
    const savedTheme = localStorage.getItem("player-theme") as Theme;
    if (savedTheme) setTheme(savedTheme);
  }, [course.id]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleNotesChange = (val: string) => {
    setNotes(val);
    localStorage.setItem(`notes-${course.id}`, val);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("player-theme", next);
  };

  const toggleLessonCompletion = async (lessonId: string) => {
    const isCompleted = completedLessons.includes(lessonId);
    let newCompleted;
    if (isCompleted) {
      newCompleted = completedLessons.filter(id => id !== lessonId);
    } else {
      newCompleted = [...completedLessons, lessonId];
    }
    setCompletedLessons(newCompleted);

    await fetch("/api/course/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: course.id,
        lessonId,
        completed: !isCompleted,
      }),
    });
  };

  const totalLessons = course.modules.reduce((acc: number, mod: any) => acc + mod.lessons.length, 0);
  const progressPct = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  // Find next/prev lesson
  const allLessons = course.modules.flatMap((m: any) => m.lessons);
  const currentIdx = allLessons.findIndex((l: any) => l.id === activeLesson?.id || (l.title === activeLesson?.title && l.videoUrl === activeLesson?.videoUrl));
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  // Theme colors
  const t = theme === "dark" ? {
    bg: '#0f0f0f', panel: '#181818', surface: '#222', border: '#2a2a2a', text: '#fff', textMuted: 'rgba(255,255,255,0.55)', textSoft: 'rgba(255,255,255,0.75)',
  } : {
    bg: '#f8f9fa', panel: '#ffffff', surface: '#f0f2f4', border: '#e5e7eb', text: '#1a1a1a', textMuted: '#6b7280', textSoft: '#374151',
  };

  const tabLabels: Record<string, string> = { sobre: "Sobre", materiais: "Materiais", anotacoes: "Anotações", quiz: "Quiz" };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: t.bg, color: t.text, transition: 'background 0.3s, color 0.3s' }}>
      {/* TOPBAR */}
      <div style={{ background: t.panel, padding: isMobile ? '10px 16px' : '12px 28px', display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '20px', borderBottom: `1px solid ${t.border}`, zIndex: 50, flexShrink: 0 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: t.textMuted, fontSize: '13px', textDecoration: 'none', flexShrink: 0 }}>
          <ChevronLeft size={16} /> {!isMobile && "Voltar"}
        </Link>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '16px' : '18px', fontWeight: 800, color: 'var(--green)', flexShrink: 0 }}>SER+</div>
        {!isMobile && <div style={{ fontSize: '14px', fontWeight: 500, color: t.textSoft, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{course.title}</div>}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto', flexShrink: 0 }}>
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '120px', height: '4px', background: t.surface, borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--green)', width: `${progressPct}%`, transition: 'width 0.5s ease', borderRadius: '100px' }}></div>
              </div>
              <span style={{ fontSize: '11px', color: t.textMuted, fontWeight: 600 }}>{progressPct}%</span>
            </div>
          )}
          <button onClick={toggleTheme} style={{ background: t.surface, border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: t.textMuted, display: 'flex', transition: 'all 0.2s' }}
            title={theme === "dark" ? "Modo claro" : "Modo escuro"}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {isMobile && (
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: t.surface, border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: t.textMuted, display: 'flex' }}>
              {sidebarOpen ? <X size={16} /> : <List size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile progress bar */}
      {isMobile && (
        <div style={{ background: t.panel, padding: '0 16px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: 1, height: '3px', background: t.surface, borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--green)', width: `${progressPct}%`, transition: 'width 0.5s ease', borderRadius: '100px' }}></div>
            </div>
            <span style={{ fontSize: '10px', color: t.textMuted, fontWeight: 600 }}>{progressPct}%</span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, minHeight: 0, position: 'relative' }}>
        {/* MAIN CONTENT */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          {/* Video */}
          <div style={{ background: '#000', position: 'relative', width: '100%', aspectRatio: '16/9', flexShrink: 0 }}>
            {activeLesson?.videoUrl ? (
              activeLesson.videoUrl.includes('youtube.com') || activeLesson.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={`https://www.youtube.com/embed/${activeLesson.videoUrl.includes('v=') ? activeLesson.videoUrl.split('v=')[1]?.split('&')[0] : activeLesson.videoUrl.split('/').pop()}?rel=0&modestbranding=1`}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allowFullScreen
                ></iframe>
              ) : (
                <video 
                  src={activeLesson.videoUrl} 
                  controls 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                ></video>
              )
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0d2818, #1a3a28)', gap: '12px' }}>
                <Play size={56} color="var(--green)" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'white' }}>Selecione uma aula</h3>
              </div>
            )}
          </div>

          {/* Lesson Info + Actions */}
          <div style={{ background: t.panel, padding: isMobile ? '12px 16px' : '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${t.border}`, gap: '12px', flexWrap: 'wrap', flexShrink: 0 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeLesson?.title || "Selecione uma aula"}</div>
              {isMobile && <div style={{ fontSize: '11px', color: t.textMuted, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</div>}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
              {/* Nav buttons */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <button disabled={!prevLesson} onClick={() => prevLesson && setActiveLesson(prevLesson)} style={{
                  background: t.surface, border: 'none', borderRadius: '8px', padding: '8px', cursor: prevLesson ? 'pointer' : 'not-allowed', color: prevLesson ? t.textSoft : t.border, display: 'flex'
                }} title="Aula anterior">
                  <ChevronLeft size={16} />
                </button>
                <button disabled={!nextLesson} onClick={() => nextLesson && setActiveLesson(nextLesson)} style={{
                  background: t.surface, border: 'none', borderRadius: '8px', padding: '8px', cursor: nextLesson ? 'pointer' : 'not-allowed', color: nextLesson ? t.textSoft : t.border, display: 'flex'
                }} title="Próxima aula">
                  <ChevronRight size={16} />
                </button>
              </div>
              {progressPct === 100 && (
                <Link 
                  href={`/course/${course.id}/certificate`}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '100px', fontSize: '12px', border: `1.5px solid var(--green)`, color: 'var(--green)', textDecoration: 'none', fontWeight: 600, background: 'transparent' }}
                >
                  <Award size={14} /> Certificado
                </Link>
              )}
              <button 
                onClick={() => activeLesson && toggleLessonCompletion(activeLesson.id)}
                style={{
                  background: completedLessons.includes(activeLesson?.id) ? 'var(--green)' : 'transparent',
                  color: completedLessons.includes(activeLesson?.id) ? 'white' : 'var(--green)',
                  border: '1.5px solid var(--green)',
                  padding: '8px 14px', borderRadius: '100px', fontSize: '12px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, transition: 'all 0.2s'
                }}
              >
                <CheckCircle size={14} />
                {isMobile ? (completedLessons.includes(activeLesson?.id) ? '✓' : 'Concluir') : (completedLessons.includes(activeLesson?.id) ? 'Concluída' : 'Marcar concluída')}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ background: t.panel, borderBottom: `1px solid ${t.border}`, display: 'flex', padding: isMobile ? '0 12px' : '0 24px', overflowX: 'auto', flexShrink: 0 }}>
            {(["sobre", "materiais", "anotacoes", "quiz"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: isMobile ? '12px 14px' : '14px 20px', fontSize: '13px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer',
                  color: activeTab === tab ? 'var(--green)' : t.textMuted,
                  borderBottom: activeTab === tab ? '2px solid var(--green)' : '2px solid transparent',
                  whiteSpace: 'nowrap', transition: 'color 0.2s'
                }}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: isMobile ? '20px 16px' : '28px 24px', flex: 1 }}>
            {activeTab === "sobre" && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '18px' : '22px', fontWeight: 800, marginBottom: '12px' }}>{course.title}</h2>
                <p style={{ fontSize: '15px', color: t.textSoft, lineHeight: '1.8' }}>{course.description}</p>
                <div style={{ marginTop: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ background: t.surface, padding: '14px 20px', borderRadius: '12px', textAlign: 'center', minWidth: '100px' }}>
                    <div style={{ fontWeight: 800, fontSize: '18px', fontFamily: 'var(--font-display)' }}>{course.modules.length}</div>
                    <div style={{ fontSize: '11px', color: t.textMuted }}>Módulos</div>
                  </div>
                  <div style={{ background: t.surface, padding: '14px 20px', borderRadius: '12px', textAlign: 'center', minWidth: '100px' }}>
                    <div style={{ fontWeight: 800, fontSize: '18px', fontFamily: 'var(--font-display)' }}>{totalLessons}</div>
                    <div style={{ fontSize: '11px', color: t.textMuted }}>Aulas</div>
                  </div>
                  <div style={{ background: t.surface, padding: '14px 20px', borderRadius: '12px', textAlign: 'center', minWidth: '100px' }}>
                    <div style={{ fontWeight: 800, fontSize: '18px', fontFamily: 'var(--font-display)', color: 'var(--green)' }}>{completedLessons.length}</div>
                    <div style={{ fontSize: '11px', color: t.textMuted }}>Concluídas</div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "materiais" && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={18} color="var(--green)" /> Materiais Complementares</h3>
                {course.materials ? (
                  <div style={{ background: t.surface, padding: '20px', borderRadius: '12px', color: t.textSoft, whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '14px' }}>
                    {course.materials}
                  </div>
                ) : (
                  <div style={{ color: t.textMuted, textAlign: 'center', padding: '40px', background: t.surface, borderRadius: '12px' }}>
                    <FileText size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
                    <p>Nenhum material disponível para este curso.</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === "anotacoes" && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Edit3 size={18} color="var(--green)" /> Suas Anotações</h3>
                <textarea 
                  value={notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Escreva suas anotações aqui... Elas são salvas automaticamente no seu navegador."
                  style={{ width: '100%', minHeight: '250px', background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '16px', color: t.text, outline: 'none', fontSize: '14px', lineHeight: 1.7, resize: 'vertical', fontFamily: 'var(--font-body)' }}
                ></textarea>
                <div style={{ fontSize: '11px', color: t.textMuted, marginTop: '8px' }}>💾 Salvas automaticamente no seu navegador</div>
              </div>
            )}
            {activeTab === "quiz" && (
              <div style={{ textAlign: 'center', padding: isMobile ? '30px 0' : '50px 0' }}>
                <Brain size={48} color="var(--green)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Avaliação Final</h3>
                <p style={{ color: t.textMuted, marginBottom: '24px', maxWidth: '340px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                  {progressPct === 100 
                    ? "Parabéns por concluir todas as aulas! Agora você pode realizar a avaliação."
                    : `Você precisa concluir 100% das aulas para liberar o quiz. Progresso atual: ${progressPct}%`}
                </p>
                {course.quizUrl && progressPct === 100 ? (
                  <a href={course.quizUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', padding: '12px 32px' }}>
                    Iniciar Quiz
                  </a>
                ) : (
                  <div>
                    <button disabled style={{ background: t.surface, color: t.textMuted, border: 'none', padding: '12px 32px', borderRadius: '100px', cursor: 'not-allowed', fontSize: '14px' }}>
                      Quiz Bloqueado
                    </button>
                    <div style={{ marginTop: '16px', width: '200px', height: '6px', background: t.surface, borderRadius: '3px', overflow: 'hidden', margin: '16px auto 0' }}>
                      <div style={{ height: '100%', background: 'var(--green)', width: `${progressPct}%`, transition: 'width 0.5s' }}></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR: Modules (desktop) or slide-over (mobile) */}
        {isMobile && sidebarOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 60 }} onClick={() => setSidebarOpen(false)} />
        )}
        <div style={{
          background: t.panel, borderLeft: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column',
          ...(isMobile ? {
            position: 'fixed', right: 0, top: 0, bottom: 0, width: '300px', zIndex: 61,
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease',
            boxShadow: sidebarOpen ? '-8px 0 24px rgba(0,0,0,0.2)' : 'none'
          } : {
            width: '340px', flexShrink: 0
          })
        }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700 }}>Conteúdo do curso</h3>
            <span style={{ fontSize: '11px', color: t.textMuted }}>{completedLessons.length}/{totalLessons}</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {course.modules.map((module: any, mIdx: number) => {
              const moduleId = module.id || `module-${mIdx}`;
              const moduleLessonsCompleted = module.lessons.filter((l: any) => completedLessons.includes(l.id)).length;
              return (
                <div key={moduleId} style={{ borderBottom: `1px solid ${t.border}` }}>
                  <div style={{ padding: '12px 20px', background: t.surface, display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: moduleLessonsCompleted === module.lessons.length ? 'var(--green)' : t.border, color: moduleLessonsCompleted === module.lessons.length ? 'white' : t.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>
                        {moduleLessonsCompleted === module.lessons.length ? '✓' : mIdx + 1}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{module.title}</div>
                    </div>
                    <span style={{ fontSize: '10px', color: t.textMuted }}>{moduleLessonsCompleted}/{module.lessons.length}</span>
                  </div>
                  <div>
                    {module.lessons.map((lesson: any, lIdx: number) => {
                      const lessonId = lesson.id || `${moduleId}-lesson-${lIdx}`;
                      const isActive = activeLesson?.id === lesson.id || (activeLesson?.title === lesson.title && activeLesson?.videoUrl === lesson.videoUrl);
                      const isDone = completedLessons.includes(lessonId);
                      
                      return (
                        <div 
                          key={lessonId} 
                          onClick={() => { setActiveLesson(lesson); if (isMobile) setSidebarOpen(false); }}
                          style={{
                            padding: '11px 20px 11px 54px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                            background: isActive ? (theme === 'dark' ? 'rgba(0,156,59,0.12)' : 'rgba(0,156,59,0.08)') : 'transparent',
                            borderLeft: isActive ? '3px solid var(--green)' : '3px solid transparent',
                            transition: 'all 0.15s'
                          }}
                        >
                          <div style={{ 
                            width: '18px', height: '18px', borderRadius: '50%', 
                            border: isDone ? 'none' : `1.5px solid ${t.border}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px',
                            background: isDone ? 'var(--green)' : 'transparent',
                            color: isDone ? 'white' : t.textMuted, flexShrink: 0
                          }}>
                            {isDone ? '✓' : '▶'}
                          </div>
                          <div style={{ fontSize: '12.5px', color: isActive ? t.text : t.textSoft, fontWeight: isActive ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lesson.title}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
