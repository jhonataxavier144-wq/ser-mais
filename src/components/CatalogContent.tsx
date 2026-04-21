"use client";

import { useState } from "react";
import { Search, BookOpen, Star, Layers, Clock } from "lucide-react";
import Link from "next/link";

export default function CatalogContent({ allCourses, enrolledIds }: { allCourses: any[], enrolledIds: string[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  const categories = ["Todos", ...Array.from(new Set(allCourses.map((c: any) => c.category).filter(Boolean)))];

  const filteredCourses = allCourses.filter(course => {
    const matchSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = activeCategory === "Todos" || course.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <>
      {/* Header */}
      <div style={{ background: 'white', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--gray-light)', position: 'sticky', top: 0, zIndex: 40, gap: '12px', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, flexShrink: 0 }}>Catálogo</h1>
        
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px', minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
          <input 
            type="text" 
            placeholder="Buscar cursos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: '100px', border: '1.5px solid var(--gray-light)', fontSize: '14px', outline: 'none', fontFamily: 'var(--font-body)' }}
          />
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Category filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px', borderRadius: '100px', fontSize: '12px', fontWeight: 600,
                border: activeCategory === cat ? 'none' : '1.5px solid var(--gray-light)',
                background: activeCategory === cat ? 'var(--green)' : 'white',
                color: activeCategory === cat ? 'white' : 'var(--gray-dark)',
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
                boxShadow: activeCategory === cat ? '0 4px 12px rgba(0,156,59,0.3)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredCourses.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'var(--gray)' }}>
              <Search size={40} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p style={{ fontSize: '15px', marginBottom: '4px' }}>Nenhum curso encontrado</p>
              <p style={{ fontSize: '12px' }}>Tente outro termo de busca ou categoria.</p>
            </div>
          ) : (
            filteredCourses.map((course: any) => {
              const isEnrolled = enrolledIds.includes(course.id);
              const totalLessons = (course.modules || []).reduce((a: number, m: any) => a + (m.lessons?.length || 0), 0);
              return (
                <div key={course.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.05)'; }}
                >
                  <div style={{ height: '160px', background: 'var(--green-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <BookOpen size={48} color="var(--green)" />
                    )}
                    {isEnrolled && (
                      <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--green)', color: 'white', padding: '3px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: 700 }}>
                        INSCRITO
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '1px' }}>{course.category}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>{course.title}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: 1.5, marginBottom: '16px', flex: 1 }}>
                      {course.description?.substring(0, 90)}{course.description?.length > 90 ? '...' : ''}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: 'var(--gray)', marginBottom: '16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Layers size={12} /> {(course.modules || []).length} módulos</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {totalLessons} aulas</span>
                    </div>
                    
                    <Link 
                      href={`/course/${course.id}`} 
                      className={isEnrolled ? "btn btn-outline" : "btn btn-primary"}
                      style={{ textAlign: 'center', width: '100%', justifyContent: 'center', padding: '10px 20px' }}
                    >
                      {isEnrolled ? "Continuar" : "Começar Agora"}
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
