
import React from 'react';
import { User, Course } from '../types';

interface CertificatePortalProps {
  user: User;
  course: Course;
  onClose: () => void;
}

const CertificatePortal: React.FC<CertificatePortalProps> = ({ user, course, onClose }) => {
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  return (
    <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 md:p-12 overflow-y-auto animate-fadeIn">
      <div className="printable-transcript w-full max-w-6xl">
        <div className="bg-white border-[15px] border-black rounded-[5rem] p-12 md:p-32 space-y-16 relative overflow-hidden shadow-[40px_40px_0px_0px_rgba(59,130,246,1)]">
          {/* Sovereign Borders & Watermark */}
          <div className="absolute top-0 left-0 w-full h-10 ethiopian-gradient"></div>
          <div className="absolute top-10 right-10 flex flex-col items-center rotate-12 opacity-5 pointer-events-none">
             <div className="text-[20rem] font-black italic leading-none">IFTU</div>
             <div className="text-[10rem] font-black uppercase tracking-[0.5em] -mt-10">VALID</div>
          </div>

          {/* Certificate Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
             <div className="space-y-6">
                <span className="inline-block bg-black text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-[0.5em] shadow-xl">Official Academic Credential</span>
                <h1 className="text-8xl md:text-[14rem] font-black uppercase italic tracking-tighter leading-[0.7] text-blue-900">Module <br/>Mastery.</h1>
             </div>
             <div className="w-48 h-48 bg-gray-50 border-8 border-black rounded-full flex flex-col items-center justify-center rotate-3 shadow-2xl">
                <span className="text-6xl">🏛️</span>
                <span className="text-[10px] font-black uppercase tracking-widest mt-2">Verified Seal</span>
             </div>
          </div>

          {/* Recipient Details */}
          <div className="space-y-12 relative z-10 py-12 border-y-8 border-black">
             <div className="space-y-4">
                <p className="text-xl md:text-2xl font-black uppercase tracking-widest text-gray-400 italic">This National Registry Entry certifies that</p>
                <h2 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter text-black leading-none">{user.name}</h2>
             </div>
             <div className="space-y-4">
                <p className="text-xl md:text-2xl font-black uppercase tracking-widest text-gray-400 italic">has demonstrated absolute competence in the course</p>
                <h3 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-blue-700 leading-none">{course.title}</h3>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Curriculum Code: {course.code} // ID: {user.id.slice(-8)}-{course.id.slice(-4)}</p>
             </div>
          </div>

          {/* Footer & Signature */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-16 relative z-10">
             <div className="space-y-4">
                <div className="flex gap-4">
                   <div className="w-12 h-12 bg-[#009b44] rounded-lg border-2 border-black"></div>
                   <div className="w-12 h-12 bg-[#ffcd00] rounded-lg border-2 border-black"></div>
                   <div className="w-12 h-12 bg-[#ef3340] rounded-lg border-2 border-black"></div>
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Issued Date: {dateStr}</p>
             </div>
             <div className="text-center space-y-6">
                <div className="relative">
                   <img src="https://api.dicebear.com/7.x/initials/svg?seed=IFTU" className="w-48 h-16 opacity-30 absolute -top-8 left-1/2 -translate-x-1/2" alt="" />
                   <p className="text-4xl font-black italic border-b-4 border-black pb-2 px-10">Sovereign Authority</p>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Director General - IFTU NDC</p>
             </div>
          </div>
        </div>

        {/* Print / Actions */}
        <div className="no-print mt-12 flex flex-col sm:flex-row gap-8">
           <button onClick={() => window.print()} className="flex-1 py-10 bg-black text-white rounded-[3rem] border-8 border-black font-black uppercase text-3xl shadow-[10px_10px_0px_0px_rgba(34,197,94,1)] hover:translate-y-2 transition-all">Export Official PDF</button>
           <button onClick={onClose} className="flex-1 py-10 bg-white text-black rounded-[3rem] border-8 border-black font-black uppercase text-3xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 transition-all">Close Certificate View</button>
        </div>
      </div>
    </div>
  );
};

export default CertificatePortal;
