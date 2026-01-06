import React, { useState, useEffect, useRef } from 'react';
import { Student } from './types';
import StarryBackground from './components/StarryBackground';
import Wheel from './components/Wheel';
import ControlPanel from './components/ControlPanel';
import WinnerModal from './components/WinnerModal';

// 🎵 Tải âm thanh từ biến môi trường — thầy có thể thay URL bất kỳ lúc nào
const SOUND_QUAY_URL = import.meta.env.VITE_SOUND_QUAY || 'https://tiengdong.com/tieng-quay-banh-xe-may-man-chiec-non-ky-dieu.mp3';
const SOUND_WIN_URL = import.meta.env.VITE_SOUND_WIN || 'https://tiengdong.com/tieng-chuc-mung.mp3';

const STORAGE_KEY = 'lucky_wheel_students';
const TEXT_STORAGE_KEY = 'lucky_wheel_center_text';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [remainingStudents, setRemainingStudents] = useState<Student[]>([]);
  const [wheelCenterText, setWheelCenterText] = useState("LỚP MÌNH");
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Student | null>(null);
  const [praiseMessage, setPraiseMessage] = useState("");

  const spinBgmRef = useRef<HTMLAudioElement | null>(null);
  const winBgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 🎵 Tải âm thanh nền
    const audioQuay = new Audio(SOUND_QUAY_URL);
    audioQuay.loop = true;
    audioQuay.volume = 0.5;
    audioQuay.preload = 'auto';

    // 🎵 Tải âm thanh khi trúng thưởng
    const audioWin = new Audio(SOUND_WIN_URL);
    audioWin.volume = 0.7;

    // Gắn vào useRef để dùng trong toàn bộ ứng dụng
    spinBgmRef.current = audioQuay;
    winBgmRef.current = audioWin;

    // Khi quay bắt đầu — phát âm thanh nền
    const handleSpinStart = () => {
      if (remainingStudents.length === 0) {
        alert("Đã hết học sinh để quay! Vui lòng đặt lại danh sách.");
        return;
      }
      setWinner(null);
      setPraiseMessage("");
      setIsSpinning(true);

      if (spinBgmRef.current && spinBgmRef.current.readyState === 4) {
        spinBgmRef.current.currentTime = 0;
        spinBgmRef.current.play().catch(() => {});
      }
    };

    // Khi quay xong — tắt âm thanh nền, phát âm thanh chúc mừng
    const handleSpinEnd = (winningId: string) => {
      if (spinBgmRef.current) {
        spinBgmRef.current.pause(); // ✅ TẮT ÂM THANH NỀN KHI NGỪNG QUAY
      }

      const winStudent = students.find(s => s.id === winningId);
      if (winStudent) {
        setWinner(winStudent);
        setRemainingStudents(prev => prev.filter(s => s.id !== winningId));

        // 🎉 Phát âm thanh chúc mừng
        if (winBgmRef.current && winBgmRef.current.readyState === 4) {
          winBgmRef.current.currentTime = 0;
          winBgmRef.current.play().catch(() => {});
        }

        // 📝 Lời khen ngẫu nhiên — không cần AI
        const praises = [
          `Chúc mừng ${winStudent.name}! Em đã rất nỗ lực, xứng đáng là ngôi sao sáng của lớp!`,
          `Tuyệt vời, ${winStudent.name}! Em chính là chiến binh kiến thức hôm nay!`,
          `${winStudent.name} ơi, em thật sự là bạn nhỏ chăm chỉ và xuất sắc!`,
          `Xin chúc mừng ${winStudent.name} — tay bút tài hoa của lớp mình!`,
          `${winStudent.name} đã thể hiện tinh thần học tập tuyệt vời!`
        ];
        const randomPraise = praises[Math.floor(Math.random() * praises.length)];
        setPraiseMessage(randomPraise);
      }

      setIsSpinning(false); // ✅ Đảm bảo luôn tắt trạng thái quay
    };

    // Gắn sự kiện vào nút quay
    const handleSpinStart = () => {
      if (remainingStudents.length === 0) {
        alert("Đã hết học sinh để quay! Vui lòng đặt lại danh sách.");
        return;
      }
      setWinner(null);
      setPraiseMessage("");
      setIsSpinning(true);

      if (spinBgmRef.current && spinBgmRef.current.readyState === 4) {
        spinBgmRef.current.currentTime = 0;
        spinBgmRef.current.play().catch(() => {});
      }
    };

    // Gắn sự kiện vào nút làm mới
    const resetWheel = () => {
      setRemainingStudents(students);
      setWinner(null);
      setIsSpinning(false);
    };

    // Xóa âm thanh khi component unmount
    return () => {
      if (audioQuay) {
        audioQuay.pause();
        audioQuay.src = '';
      }
      if (audioWin) {
        audioWin.pause();
        audioWin.src = '';
      }
    };
  }, []);

  useEffect(() => {
    const savedStudents = localStorage.getItem(STORAGE_KEY);
    if (savedStudents) {
      try {
        const parsed = JSON.parse(savedStudents);
        setStudents(parsed);
        setRemainingStudents(parsed);
      } catch (e) {
        console.error("Lỗi đọc dữ liệu học sinh");
      }
    } else {
      const demo: Student[] = Array.from({ length: 6 }).map((_, i) => ({
        id: `demo-${i}`,
        name: `Học sinh ${i + 1}`,
        photoUrl: `https://picsum.photos/seed/${i + 100}/200/200`,
      }));
      setStudents(demo);
      setRemainingStudents(demo);
    }

    const savedText = localStorage.getItem(TEXT_STORAGE_KEY);
    if (savedText) {
      setWheelCenterText(savedText);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(TEXT_STORAGE_KEY, wheelCenterText);
  }, [wheelCenterText]);

  return (
    <div className="relative w-full h-screen overflow-hidden text-white flex flex-col md:flex-row font-sans">
      <StarryBackground />

      <main className="flex-1 relative flex flex-col items-center justify-between pt-6 pb-12 p-4 z-10 h-screen overflow-hidden">
        <header className="text-center animate-fadeIn relative z-20">
          <div className="bg-black/40 backdrop-blur-xl px-12 py-3 rounded-[2rem] border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-pacifico text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-400 to-purple-500 drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]">
              Vòng Quay Kì Diệu
            </h1>
            <p className="text-[10px] md:text-xs opacity-80 tracking-[0.6em] font-bold uppercase mt-1 text-pink-200">
              Teacher's Companion Tool
            </p>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center scale-90 md:scale-95 lg:scale-100 transition-all duration-700 w-full">
          <Wheel 
            students={remainingStudents} 
            isSpinning={isSpinning} 
            centerText={wheelCenterText}
            onSpinEnd={handleSpinEnd} 
          />
        </div>

        <div className="relative z-20 flex flex-col items-center gap-5 w-full">
          <div className="relative flex items-center justify-center w-full max-w-lg">
            <button
              onClick={handleSpinStart}
              disabled={isSpinning || remainingStudents.length === 0}
              className={`group relative px-16 py-4 rounded-full text-xl font-black transition-all transform hover:scale-105 active:scale-95 shadow-[0_10px_40px_rgba(236,72,153,0.4)] ${
                isSpinning || remainingStudents.length === 0
                  ? 'bg-gray-700 cursor-not-allowed grayscale'
                  : 'bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 hover:shadow-[0_0_60px_rgba(168,85,247,0.6)]'
              }`}
            >
              <span className="relative z-10 flex items-center gap-3">
                {isSpinning ? (
                  <>
                    <i className="fa-solid fa-sync animate-spin"></i>
                    ĐANG QUAY...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-bolt-lightning text-yellow-300 group-hover:animate-bounce"></i>
                    BẮT ĐẦU QUAY
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
            </button>
            
            <button
              onClick={resetWheel}
              className="absolute left-[calc(50%+140px)] md:left-[calc(50%+160px)] w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/20 hover:rotate-180 duration-500 group shadow-lg"
              title="Làm mới vòng quay"
            >
              <i className="fa-solid fa-rotate-left text-lg group-active:scale-90"></i>
            </button>
          </div>

          <div className="px-6 py-2 bg-black/40 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl">
            <p className="text-yellow-400 text-[11px] md:text-[14px] font-bold flex items-center gap-3 uppercase tracking-widest">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              Sẵn sàng: {remainingStudents.length} / {students.length} học sinh
            </p>
          </div>
        </div>
      </main>

      <ControlPanel 
        students={students} 
        setStudents={(list) => {
          setStudents(list);
          setRemainingStudents(list);
        }}
        centerText={wheelCenterText}
        setCenterText={setWheelCenterText}
      />

      {winner && (
        <WinnerModal 
          student={winner} 
          praise={praiseMessage} 
          isLoading={false}
          onClose={() => setWinner(null)} 
        />
      )}

      <footer className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 opacity-70 text-[9px] md:text-[11px] text-center w-full px-4 leading-relaxed font-bold tracking-wide pointer-events-none drop-shadow-md">
        Bản quyền ứng dụng @2025@ của thầy Nguyễn Đức Duy - Giáo viên trường TH Nguyễn Bỉnh Khiêm
      </footer>
    </div>
  );
};

export default App;
