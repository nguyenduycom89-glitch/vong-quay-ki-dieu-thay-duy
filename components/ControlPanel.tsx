
import React, { useState } from 'react';
import { Student } from '../types';

interface ControlPanelProps {
  students: Student[];
  setStudents: (list: Student[]) => void;
  centerText: string;
  setCenterText: (text: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  students, 
  setStudents,
  centerText,
  setCenterText
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBulkInputVisible, setIsBulkInputVisible] = useState(false);
  const [bulkNames, setBulkNames] = useState("");

  const isDemoList = students.length > 0 && students.every(s => s.id.startsWith('demo-'));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newStudents: Student[] = Array.from(files).map((file: File) => {
      return {
        id: `upload-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name.split('.')[0],
        photoUrl: URL.createObjectURL(file)
      };
    });

    if (isDemoList) {
      setStudents(newStudents);
    } else {
      setStudents([...students, ...newStudents]);
    }
  };

  const removeStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const clearAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả học sinh?")) {
      setStudents([]);
    }
  };

  const processBulkNames = () => {
    const names = bulkNames.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    const newStudents: Student[] = names.map((name, i) => ({
      id: `bulk-${Date.now()}-${i}`,
      name: name,
      photoUrl: `https://picsum.photos/seed/${name}/200/200`
    }));

    if (isDemoList) {
      setStudents(newStudents);
    } else {
      setStudents([...students, ...newStudents]);
    }
    
    setBulkNames("");
    setIsBulkInputVisible(false);
  };

  return (
    <>
      {/* Nút Cài Đặt (Gear Icon) - Sử dụng 'fixed' để luôn hiển thị đúng vị trí */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-6 right-6 z-[110] p-4 rounded-full shadow-[0_0_25px_rgba(79,70,229,0.6)] transition-all duration-300 border border-white/30 ${
          isOpen 
            ? 'bg-red-500 rotate-90 scale-110' 
            : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-110 active:scale-95'
        }`}
        title="Cài đặt vòng quay"
      >
        <i className={`fa-solid ${isOpen ? 'fa-times' : 'fa-gear'} text-xl text-white shadow-sm`}></i>
      </button>

      {/* Bảng điều khiển bên phải */}
      <div className={`fixed top-0 right-0 h-full bg-slate-950/95 backdrop-blur-3xl z-[100] w-full md:w-96 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} shadow-[-15px_0_40px_rgba(0,0,0,0.7)] border-l border-white/10 flex flex-col`}>
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-yellow-400">
            <i className="fa-solid fa-sliders"></i> Cài Đặt Hệ Thống
          </h2>

          <section className="mb-8 space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10 shadow-inner">
            <h3 className="font-bold text-sm uppercase tracking-wider text-yellow-500 flex items-center gap-2">
              <i className="fa-solid fa-school"></i> Tên Lớp / Nhóm
            </h3>
            <input 
              type="text" 
              value={centerText}
              onChange={(e) => setCenterText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-yellow-500 outline-none transition-all text-white"
              placeholder="VD: Lớp 5A1, Nhóm Sao Mai..."
            />
            <p className="text-[10px] text-slate-400 italic">Nội dung này xuất hiện ở tâm vòng quay.</p>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg uppercase tracking-wider text-purple-400">Học sinh ({students.length})</h3>
              <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                <i className="fa-solid fa-trash-can"></i> Xóa hết
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col items-center justify-center p-4 bg-indigo-600/20 border-2 border-dashed border-indigo-500/50 rounded-xl cursor-pointer hover:bg-indigo-600/30 transition-all group">
                <i className="fa-solid fa-images mb-1 text-indigo-400 group-hover:scale-110 transition-transform"></i>
                <span className="text-[10px] text-center font-bold uppercase text-indigo-200">Tải ảnh loạt</span>
                <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
              
              <button 
                onClick={() => setIsBulkInputVisible(!isBulkInputVisible)}
                className="flex flex-col items-center justify-center p-4 bg-pink-600/20 border-2 border-dashed border-pink-500/50 rounded-xl hover:bg-pink-600/30 transition-all group"
              >
                <i className="fa-solid fa-list-check mb-1 text-pink-400 group-hover:scale-110 transition-transform"></i>
                <span className="text-[10px] text-center font-bold uppercase text-pink-200">Nhập tên nhanh</span>
              </button>
            </div>

            {isBulkInputVisible && (
              <div className="space-y-2 animate-fadeIn">
                <textarea 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-pink-500 outline-none h-32 text-white resize-none"
                  placeholder="Nhập tên học sinh, mỗi người một dòng..."
                  value={bulkNames}
                  onChange={(e) => setBulkNames(e.target.value)}
                />
                <button 
                  onClick={processBulkNames}
                  className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg font-bold text-sm hover:brightness-110 transition-all shadow-lg"
                >
                  XÁC NHẬN DANH SÁCH
                </button>
              </div>
            )}

            <div className="space-y-2 mt-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {students.map((student) => (
                <div key={student.id} className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl group border border-transparent hover:border-white/10 hover:bg-white/10 transition-all">
                  <img src={student.photoUrl} alt={student.name} className="w-10 h-10 rounded-full object-cover border-2 border-white/20 shadow-md" />
                  <span className="flex-1 text-sm font-medium text-slate-200 truncate">{student.name}</span>
                  <button 
                    onClick={() => removeStudent(student.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))}
              {students.length === 0 && (
                <div className="text-center text-slate-500 py-12 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/50">
                  <i className="fa-solid fa-user-plus text-3xl mb-2 opacity-20"></i>
                  <p className="italic text-sm">Danh sách hiện đang trống</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer của bảng cài đặt */}
        <div className="p-6 bg-black border-t border-white/5 text-center text-[10px] text-slate-400 tracking-wide leading-relaxed">
          <p className="font-bold uppercase mb-1 text-slate-300">Bản quyền ứng dụng @2025@</p>
          <p>Thầy Nguyễn Đức Duy- Giáo viên trường TH Nguyễn Bỉnh Khiêm</p>
        </div>
      </div>
      
      {/* Lớp phủ mờ khi mở Menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[95]"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default ControlPanel;
