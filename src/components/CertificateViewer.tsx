"use client";

import { useRef, useEffect, useState } from "react";
import { Download, Share2, Award } from "lucide-react";

export default function CertificateViewer({ course, user }: { course: any, user: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !course.certificateImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = course.certificateImage;

    img.onload = () => {
      // Set canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw background
      ctx.drawImage(img, 0, 0);

      // Draw name
      const x = (course.certNameX / 100) * canvas.width;
      const y = (course.certNameY / 100) * canvas.height;
      
      ctx.fillStyle = course.certFontColor || "#000000";
      ctx.font = `bold ${course.certFontSize * (canvas.width / 1000)}px 'DM Sans', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Draw text
      ctx.fillText(user.name.toUpperCase(), x, y);

      setLoading(false);
    };
  }, [course, user]);

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `certificado-${course.title.toLowerCase().replace(/ /g, '-')}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '800px', 
        aspectRatio: '1.414/1', 
        background: 'white',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'white', zIndex: 10 }}>
            <Award size={48} color="var(--green)" className="animate-bounce" />
            <p style={{ marginTop: '16px', fontWeight: 600, color: 'var(--gray)' }}>Gerando seu certificado...</p>
          </div>
        )}
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: loading ? 'none' : 'block' }}></canvas>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button 
          onClick={downloadCertificate}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 32px' }}
        >
          <Download size={20} /> Baixar Certificado (PNG)
        </button>
        <button 
          className="btn btn-outline"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 32px' }}
        >
          <Share2 size={20} /> Compartilhar no LinkedIn
        </button>
      </div>
    </div>
  );
}
