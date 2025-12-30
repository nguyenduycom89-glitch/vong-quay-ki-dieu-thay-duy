
import React, { useRef, useEffect, useState } from 'react';
import { Student } from '../types';

interface WheelProps {
  students: Student[];
  isSpinning: boolean;
  centerText: string;
  onSpinEnd: (id: string) => void;
}

const Wheel: React.FC<WheelProps> = ({ students, isSpinning, centerText, onSpinEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isWiggling, setIsWiggling] = useState(false);
  const rotationRef = useRef(0);
  const lastSegmentRef = useRef(-1);
  const imagesRef = useRef<Record<string, HTMLImageElement>>({});
  const tickAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    tickAudioRef.current = new Audio('https://www.soundjay.com/buttons/button-50.mp3');
    tickAudioRef.current.volume = 0.4;
  }, []);

  useEffect(() => {
    students.forEach(student => {
      if (!imagesRef.current[student.id]) {
        const img = new Image();
        img.src = student.photoUrl;
        img.crossOrigin = "anonymous";
        imagesRef.current[student.id] = img;
        img.onload = () => drawWheel();
      }
    });
    drawWheel();
  }, [students, rotation, centerText]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    // Bán kính chính nhỏ lại nữa để đảm bảo không che chữ
    const radius = size / 2 - 40; 
    const numSegments = students.length;

    ctx.clearRect(0, 0, size, size);
    
    if (numSegments === 0) {
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
      ctx.fill();
      ctx.strokeStyle = "#fbbf24";
      ctx.setLineDash([10, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      return;
    }

    const angleStep = (Math.PI * 2) / numSegments;

    students.forEach((student, i) => {
      const startAngle = i * angleStep + rotation;
      const endAngle = (i + 1) * angleStep + rotation;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      const grad = ctx.createRadialGradient(center, center, radius * 0.2, center, center, radius);
      if (i % 2 === 0) {
        grad.addColorStop(0, '#6366f1');
        grad.addColorStop(1, '#4338ca');
      } else {
        grad.addColorStop(0, '#a855f7');
        grad.addColorStop(1, '#7e22ce');
      }
      
      ctx.fillStyle = grad;
      ctx.fill();
      
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      const middleAngle = startAngle + angleStep / 2;
      ctx.translate(center, center);
      ctx.rotate(middleAngle);

      const photoRadius = Math.min(angleStep * radius * 0.30, 38);
      const photoX = radius * 0.72;
      
      ctx.beginPath();
      ctx.arc(photoX, 0, photoRadius, 0, Math.PI * 2);
      ctx.clip();

      const img = imagesRef.current[student.id];
      if (img && img.complete) {
        ctx.drawImage(img, photoX - photoRadius, -photoRadius, photoRadius * 2, photoRadius * 2);
      }
      ctx.restore();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(middleAngle);
      ctx.textAlign = "right";
      ctx.fillStyle = "white";
      const fontSize = Math.min(14, Math.max(8, 16 - numSegments / 1.5));
      ctx.font = `900 ${fontSize}px Montserrat`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = "black";
      ctx.fillText(student.name.toUpperCase(), radius * 0.55, 5);
      ctx.restore();
    });

    // Viền bánh xe
    ctx.beginPath();
    ctx.arc(center, center, radius + 8, 0, Math.PI * 2);
    const borderGrad = ctx.createLinearGradient(0, 0, size, size);
    borderGrad.addColorStop(0, '#fbbf24');
    borderGrad.addColorStop(0.5, '#f59e0b');
    borderGrad.addColorStop(1, '#fbbf24');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 10;
    ctx.stroke();

    // Bóng đèn LED nhấp nháy
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI * 2) / 16;
      const x = center + Math.cos(angle) * (radius + 8);
      const y = center + Math.sin(angle) * (radius + 8);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = (Math.floor(Date.now() / 300) + i) % 2 === 0 ? "#fff" : "#fbbf24";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "white";
      ctx.fill();
    }

    // Tâm vòng quay (Hub) rực rỡ
    const hubRadius = 50;
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, hubRadius + 10, 0, Math.PI * 2);
    const hubGlow = ctx.createRadialGradient(center, center, hubRadius, center, center, hubRadius + 15);
    hubGlow.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
    hubGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = hubGlow;
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(center, center, hubRadius, 0, Math.PI * 2);
    const hubBody = ctx.createRadialGradient(center - 10, center - 10, 3, center, center, hubRadius);
    hubBody.addColorStop(0, '#fffbeb');
    hubBody.addColorStop(0.4, '#fbbf24');
    hubBody.addColorStop(1, '#b45309');
    ctx.fillStyle = hubBody;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.fill();

    ctx.fillStyle = "#451a03"; 
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    const maxW = hubRadius * 1.6;
    let fs = 14;
    ctx.font = `900 ${fs}px Montserrat`;
    while (ctx.measureText(centerText.toUpperCase()).width > maxW && fs > 8) {
      fs--;
      ctx.font = `900 ${fs}px Montserrat`;
    }
    ctx.fillText(centerText.toUpperCase(), center, center - 5);
    
    ctx.fillStyle = "#be123c"; 
    ctx.font = "900 9px Montserrat";
    ctx.letterSpacing = "1px";
    ctx.fillText("QUAY!", center, center + 12);
  };

  useEffect(() => {
    if (isSpinning && students.length > 0) {
      const numSegments = students.length;
      const angleStep = (Math.PI * 2) / numSegments;
      const extraSpins = 10 + Math.random() * 5;
      const targetRotation = rotationRef.current + extraSpins * Math.PI * 2 + Math.random() * Math.PI * 2;
      
      let startTime: number | null = null;
      const duration = 7500;

      const animate = (time: number) => {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const ease = 1 - Math.pow(1 - progress, 4);
        const currentRot = rotationRef.current + (targetRotation - rotationRef.current) * ease;
        
        const currentSegment = Math.floor(((currentRot % (Math.PI * 2)) / angleStep));
        if (currentSegment !== lastSegmentRef.current) {
          if (tickAudioRef.current) {
            tickAudioRef.current.currentTime = 0;
            tickAudioRef.current.play().catch(() => {});
          }
          setIsWiggling(true);
          setTimeout(() => setIsWiggling(false), 50);
          lastSegmentRef.current = currentSegment;
        }

        setRotation(currentRot);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          rotationRef.current = currentRot;
          const finalRot = currentRot % (Math.PI * 2);
          let winnerIndex = Math.floor((numSegments - (finalRot / angleStep)) % numSegments);
          if (winnerIndex < 0) winnerIndex += numSegments;
          
          onSpinEnd(students[winnerIndex].id);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isSpinning]);

  return (
    <div className="relative group select-none flex items-center justify-center">
      {/* Kim chỉ hướng tâm */}
      <div className={`absolute top-1/2 -right-6 -translate-y-1/2 z-40 transition-transform duration-75 origin-right ${isWiggling ? 'rotate-[15deg]' : 'rotate-0'}`}>
        <div 
          className="w-14 h-10 bg-gradient-to-l from-amber-600 via-yellow-400 to-white shadow-[0_5px_10px_rgba(0,0,0,0.4)]" 
          style={{ 
            clipPath: 'polygon(0% 50%, 100% 0%, 85% 50%, 100% 100%)',
          }}
        ></div>
      </div>
      
      <div className={`absolute inset-0 rounded-full blur-[80px] transition-all duration-1000 ${isSpinning ? 'bg-amber-500/20' : 'bg-transparent'}`}></div>
      
      <canvas
        ref={canvasRef}
        width={480}
        height={480}
        className="relative z-10 max-w-full h-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      />
    </div>
  );
};

export default Wheel;
