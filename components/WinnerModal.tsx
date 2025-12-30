
import React, { useEffect, useState } from 'react';
import { Student } from '../types';

interface WinnerModalProps {
  student: Student;
  praise: string;
  isLoading: boolean;
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ student, praise, isLoading, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const winAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    winAudio.play().catch(() => {});
  }, []);

  return (
    <div className={`fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 transition-all duration-700 ${isVisible ? 'opacity-100 backdrop-blur-xl' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

      {/* Confetti Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <div 
            key={i}
            className="absolute animate-bounce"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              backgroundColor: ['#f472b6', '#60a5fa', '#fbbf24', '#4ade80', '#c084fc'][i % 5],
              borderRadius: i % 2 === 0 ? '50%' : '2px',
              opacity: 0.8,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDuration: `${Math.random() * 2 + 1}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className={`relative bg-white text-slate-900 rounded-[40px] p-8 md:p-12 w-full max-w-lg text-center shadow-[0_30px_100px_rgba(0,0,0,0.5)] transform transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${isVisible ? 'scale-100 translate-y-0' : 'scale-50 translate-y-32'}`}>
        
        {/* Profile Image with Ring */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full animate-spin-slow p-2">
              <div className="w-full h-full bg-white rounded-full"></div>
            </div>
            <img 
              src={student.photoUrl} 
              alt={student.name} 
              className="w-40 h-40 rounded-full border-[6px] border-white object-cover shadow-2xl relative z-10" 
            />
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-indigo-900 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-20 border-4 border-white">
              <i className="fa-solid fa-star text-xl"></i>
            </div>
          </div>
        </div>

        <div className="mt-20 space-y-5">
          <div className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black tracking-[0.2em] mb-2 uppercase">
            Xướng tên người thắng cuộc
          </div>
          
          <h2 className="text-4xl md:text-5xl font-pacifico text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 leading-tight">
            {student.name}
          </h2>
          
          <div className="relative min-h-[100px] flex items-center justify-center bg-slate-50 rounded-3xl p-6 border-2 border-dashed border-slate-200">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-200"></div>
                </div>
                <p className="text-xs font-bold text-slate-400 italic">Gemini AI đang viết lời khen tặng...</p>
              </div>
            ) : (
              <p className="text-xl font-bold text-slate-800 leading-relaxed italic animate-fadeIn">
                "{praise}"
              </p>
            )}
            <i className="fa-solid fa-quote-left absolute top-3 left-4 text-slate-200 text-3xl"></i>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-5 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-2xl font-black text-xl shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:shadow-indigo-500/50 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            TUYỆT VỜI! TIẾP TỤC <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-slate-300 text-[9px] font-bold uppercase tracking-widest">
          <div className="h-px w-8 bg-slate-200"></div>
          Thầy Duy's Education Tool
          <div className="h-px w-8 bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;
