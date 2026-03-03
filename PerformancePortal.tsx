
import React, { useState } from 'react';
import { ExamResult, Exam, User, Course } from '../types';
import ReportCard from './ReportCard';
import PaymentPortal from './PaymentPortal';
import CertificatePortal from './CertificatePortal';

interface PerformancePortalProps {
  results: ExamResult[];
  exams: Exam[];
  currentUser?: User;
  courses: Course[];
  onCertPaid: (courseId: string) => void;
}

const PerformancePortal: React.FC<PerformancePortalProps> = ({ results, exams, currentUser, courses, onCertPaid }) => {
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [showPayment, setShowPayment] = useState<Course | null>(null);
  const [showCertificate, setShowCertificate] = useState<Course | null>(null);

  const analytics = (() => {
    if (results.length === 0) return { averageScore: 0, trend: [] };
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const totalPossible = results.reduce((sum, r) => sum + r.totalPoints, 0);
    const averageScore = Math.round((totalScore / totalPossible) * 100);
    const trend = results.slice(-5).map(r => Math.round((r.score / r.totalPoints) * 100));
    return { averageScore, trend };
  })();

  const handlePaymentSuccess = () => {
    if (showPayment) {
      onCertPaid(showPayment.id);
      setShowCertificate(showPayment);
      setShowPayment(null);
    }
  };

  if (selectedResult) return <ReportCard result={selectedResult} onClose={() => setSelectedResult(null)} />;

  return (
    <div className="max-w-7xl mx-auto space-y-24 animate-fadeIn py-12 px-4 selection:bg-yellow-200">
      
      {/* CUMULATIVE TRANSCRIPT HEADER */}
      <section className="bg-white border-[10px] border-black rounded-[5rem] p-12 md:p-24 shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-8 ethiopian-gradient"></div>
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 relative z-10">
          <div className="space-y-10 max-w-2xl">
            <span className="inline-block bg-blue-700 text-white px-10 py-4 rounded-3xl border-4 border-black font-black uppercase text-sm tracking-[0.5em] shadow-xl">National Academic Registry</span>
            <h2 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.75] text-blue-900">Transcript <br/>Summary.</h2>
          </div>
          <div className="flex flex-col items-center bg-gray-50 border-8 border-black p-12 rounded-[4rem] shadow-inner w-full lg:w-auto">
             <div className="text-center">
                <p className="text-8xl md:text-[12rem] font-black italic tracking-tighter leading-none">{analytics.averageScore}%</p>
                <p className="text-xs font-black uppercase tracking-widest text-blue-600 mt-4">Aggregate Mastery</p>
             </div>
          </div>
        </div>
      </section>

      {/* COMPLETED MODULES & CERTIFICATES */}
      <section className="space-y-16">
        <div className="flex items-center gap-8 border-l-[20px] border-green-600 pl-10">
           <h3 className="text-6xl font-black uppercase italic tracking-tighter text-blue-900">Completed Hubs</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           {courses.filter(c => currentUser?.completedCourses?.includes(c.id)).map(c => {
             const isPaid = currentUser?.certificatesPaid?.includes(c.id);
             return (
               <div key={c.id} className="bg-white border-8 border-black rounded-[4rem] p-12 space-y-10 shadow-[20px_20px_0px_0px_rgba(0,155,68,1)] hover:translate-y-[-8px] transition-transform">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">{c.code}</p>
                       <h4 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{c.title}</h4>
                    </div>
                    <span className="text-7xl">{isPaid ? '📜' : '🏆'}</span>
                  </div>
                  <div className="pt-8 border-t-8 border-black flex flex-col sm:flex-row gap-6">
                     {isPaid ? (
                       <button 
                         onClick={() => setShowCertificate(c)}
                         className="flex-1 py-8 bg-green-600 text-white rounded-[2.5rem] border-4 border-black font-black uppercase text-xs shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all"
                       >
                         View Sovereign Credential
                       </button>
                     ) : (
                       <button 
                         onClick={() => setShowPayment(c)}
                         className="flex-1 py-8 bg-black text-white rounded-[2.5rem] border-4 border-black font-black uppercase text-xs shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all"
                       >
                         Claim Master Credential (150 ETB)
                       </button>
                     )}
                     <button onClick={() => alert("Trace ID exported to personal academic ledger.")} className="flex-1 py-8 bg-white border-4 border-black rounded-[2.5rem] font-black uppercase text-xs hover:bg-gray-50 transition-colors">Export Evidence</button>
                  </div>
               </div>
             );
           })}
           {(!currentUser?.completedCourses || currentUser.completedCourses.length === 0) && (
             <div className="col-span-full bg-gray-50 border-8 border-dashed border-black/10 p-24 text-center rounded-[4rem]">
                <p className="text-4xl font-black uppercase italic text-gray-300">No Credentials Minted Yet.</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-4">Complete module units to unlock registry entries</p>
             </div>
           )}
        </div>
      </section>

      {/* MODALS */}
      {showPayment && (
        <PaymentPortal 
          itemTitle={`Master Credential: ${showPayment.title}`} 
          price={150} 
          onSuccess={handlePaymentSuccess} 
          onClose={() => setShowPayment(null)} 
        />
      )}

      {showCertificate && currentUser && (
        <CertificatePortal 
          user={currentUser} 
          course={showCertificate} 
          onClose={() => setShowCertificate(null)} 
        />
      )}

      <div className="h-24"></div>
    </div>
  );
};

export default PerformancePortal;
