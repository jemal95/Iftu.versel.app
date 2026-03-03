
import React from 'react';
import { ExamResult } from '../types';

interface ReportCardProps {
  result: ExamResult;
  onClose: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ result, onClose }) => {
  const percentage = Math.round((result.score / result.totalPoints) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn py-12 px-4 printable-transcript">
      <div className="bg-white p-12 md:p-24 rounded-[5rem] border-[10px] border-black shadow-[35px_35px_0px_0px_rgba(0,155,68,1)] space-y-16 relative overflow-hidden">
        
        {/* Document Metadata Header */}
        <div className="absolute top-0 left-0 w-full h-8 ethiopian-gradient"></div>
        <div className="flex justify-between items-start pt-4">
           <div className="flex flex-col gap-1">
             <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Official National Transcript</span>
             <span className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em]">Trace: #{result.examId.slice(0,12)}</span>
           </div>
           <div className="w-24 h-24 bg-gray-50 border-4 border-black rounded-2xl flex items-center justify-center text-4xl shadow-md rotate-3">
             📜
           </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-16 border-b-8 border-black pb-16 relative z-10">
           <div className="space-y-6 text-center md:text-left">
              <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter italic text-blue-900 leading-[0.75]">National <br/>Statement.</h2>
              <div className="inline-flex items-center gap-3 bg-black text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                 <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                 Blockchain Verified Artifact
              </div>
           </div>
           <div className="relative group">
              <div className={`w-56 h-56 rounded-[3.5rem] border-8 border-black flex flex-col items-center justify-center shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:scale-105 ${percentage >= 50 ? 'bg-green-100' : 'bg-rose-100'}`}>
                 <p className="text-8xl font-black italic tracking-tighter leading-none">{percentage}%</p>
                 <p className="text-xs font-black uppercase tracking-widest mt-2">{percentage >= 50 ? 'Competent' : 'Remedial'}</p>
              </div>
           </div>
        </div>

        <div className="space-y-12">
           <div className="flex items-center gap-6">
              <div className="w-16 h-1 w-16 bg-blue-700"></div>
              <h3 className="text-4xl font-black uppercase italic tracking-tighter">Competency Matrix</h3>
           </div>
           
           <div className="grid grid-cols-1 gap-12">
              {Object.entries(result.categoryBreakdown).map(([cat, data]: [string, any]) => {
                const catPercent = Math.round((data.correct / data.total) * 100);
                return (
                  <div key={cat} className="space-y-5 bg-gray-50 p-8 rounded-[3rem] border-4 border-black shadow-inner">
                     <div className="flex justify-between font-black uppercase text-sm tracking-widest">
                        <span className="flex items-center gap-4">
                           <div className={`w-4 h-4 rounded-full border-2 border-black ${catPercent >= 50 ? 'bg-green-500' : 'bg-rose-500'}`}></div>
                           {cat}
                        </span>
                        <span>{data.correct} Correct / {data.total} Items ({catPercent}%)</span>
                     </div>
                     <div className="h-12 w-full bg-white border-4 border-black rounded-full overflow-hidden shadow-sm">
                        <div 
                          className={`h-full border-r-4 border-black transition-all duration-1000 ${catPercent >= 75 ? 'bg-green-500' : catPercent >= 40 ? 'bg-yellow-400' : 'bg-rose-500'}`} 
                          style={{ width: `${catPercent}%` }}
                        />
                     </div>
                  </div>
                );
              })}
           </div>
        </div>

        <div className="bg-blue-600 text-white p-12 md:p-16 rounded-[4rem] border-8 border-black space-y-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
           <div className="absolute -bottom-10 -right-10 text-[12rem] opacity-10 font-black italic pointer-events-none">AI</div>
           <h4 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
             <span className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 text-2xl shadow-lg">🤖</span>
             Diagnostic Feedback
           </h4>
           <p className="text-3xl font-black leading-tight italic max-w-2xl">
             "Strategic analysis confirms high proficiency in most domains. However, your response latency in subject modules indicates a need for theoretical reinforcement."
           </p>
           <button className="no-print bg-white text-blue-900 px-14 py-6 rounded-[2.5rem] border-4 border-black font-black uppercase text-sm tracking-widest shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all">Launch Remedial Hub</button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 no-print">
          <button 
            type="button"
            onClick={handlePrint}
            className="flex-1 py-10 bg-white text-black border-8 border-black rounded-[3rem] font-black uppercase text-xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
          >
            🖨️ Generate PDF Transcript
          </button>
          <button 
            type="button"
            onClick={onClose} 
            className="flex-1 py-10 bg-black text-white rounded-[3rem] border-8 border-black font-black uppercase text-3xl shadow-[10px_10px_0px_0px_rgba(59,130,246,1)] hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
          >
            Finalize & Close
          </button>
        </div>
        
        {/* Footnote Seal */}
        <div className="text-center space-y-4 pt-10">
           <div className="inline-block border-4 border-black px-6 py-2 rounded-full font-black text-[9px] uppercase tracking-[0.5em] text-gray-400">
             Official IFTU LMS Document Seal - Non Transferrable
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;