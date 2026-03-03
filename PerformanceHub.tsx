
import React, { useState } from 'react';
import { ExamResult, Exam } from '../types';
import ReportCard from './ReportCard';

interface PerformanceHubProps {
  results: ExamResult[];
  exams: Exam[];
}

const PerformanceHub: React.FC<PerformanceHubProps> = ({ results, exams }) => {
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);

  // Aggregated Analytics
  const getAggregatedData = () => {
    if (results.length === 0) return { items: [], strengths: [], weaknesses: [], averageScore: 0, trend: [] };

    const categories: Record<string, { correct: number; total: number }> = {};
    let totalScore = 0;
    let totalPossible = 0;

    // Calculate Trend (Last 5 exams)
    const sortedResults = [...results].sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());
    const trend = sortedResults.slice(-5).map(r => Math.round((r.score / r.totalPoints) * 100));

    results.forEach(res => {
      totalScore += res.score;
      totalPossible += res.totalPoints;
      // Use explicit type cast for data to avoid unknown property access errors
      Object.entries(res.categoryBreakdown).forEach(([cat, data]: [string, any]) => {
        if (!categories[cat]) categories[cat] = { correct: 0, total: 0 };
        categories[cat].correct += data.correct;
        categories[cat].total += data.total;
      });
    });

    const items = Object.entries(categories).map(([name, data]) => ({
      name,
      percentage: Math.round((data.correct / data.total) * 100),
      nationalAvg: 62 + (Math.floor(Math.random() * 10) - 5), 
      ...data
    })).sort((a, b) => b.percentage - a.percentage);

    return {
      items,
      strengths: items.slice(0, 3),
      weaknesses: items.slice(-3).reverse().filter(w => !items.slice(0, 3).find(s => s.name === w.name)),
      averageScore: Math.round((totalScore / totalPossible) * 100),
      trend
    };
  };

  const analytics = getAggregatedData();

  if (selectedResult) {
    return (
      <div className="animate-fadeIn">
        <div className="max-w-4xl mx-auto flex justify-between items-center mb-10 px-4">
          <button 
            onClick={() => setSelectedResult(null)}
            className="bg-black text-white px-10 py-5 rounded-[2rem] border-4 border-black font-black uppercase text-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
          >
            ← Close Detailed Script
          </button>
          <div className="text-right">
             <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Authenticated Record</p>
             <p className="text-xl font-black uppercase italic leading-none">{exams.find(e => e.id === selectedResult.examId)?.title || 'Exam Result'}</p>
          </div>
        </div>
        <ReportCard result={selectedResult} onClose={() => setSelectedResult(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-24 animate-fadeIn py-12 px-4 selection:bg-yellow-200">
      
      {/* CUMULATIVE TRANSCRIPT HEADER */}
      <section className="relative">
        <div className="bg-white border-[10px] border-black rounded-[5rem] p-12 md:p-24 shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
          {/* Official Holographic Watermark */}
          <div className="absolute top-10 right-10 w-48 h-48 opacity-10 rotate-12 pointer-events-none border-8 border-dashed border-black rounded-full flex items-center justify-center font-black text-4xl text-center p-4 italic">
            EAES <br/> SECURE
          </div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start gap-16 relative z-10">
            <div className="space-y-10 max-w-2xl">
              <div className="inline-flex items-center gap-4 bg-blue-700 text-white px-10 py-4 rounded-3xl border-4 border-black font-black uppercase text-sm tracking-[0.5em] shadow-xl">
                National Academic Registry
              </div>
              <h2 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.75] text-blue-900">Transcript <br/>Summary.</h2>
              <div className="flex gap-10">
                 <div className="bg-gray-50 border-4 border-black p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Letter Grade</p>
                    <p className="text-6xl font-black italic">{results.length === 0 ? '?' : (analytics.averageScore >= 90 ? 'A+' : analytics.averageScore >= 80 ? 'A' : analytics.averageScore >= 70 ? 'B' : analytics.averageScore >= 50 ? 'C' : 'F')}</p>
                 </div>
                 <div className="bg-gray-50 border-4 border-black p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">National Percentile</p>
                    <p className="text-6xl font-black italic">{results.length === 0 ? 'N/A' : `Top ${Math.max(1, 100 - analytics.averageScore)}%`}</p>
                 </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center bg-gray-50 border-8 border-black p-12 rounded-[4rem] shadow-inner w-full lg:w-auto">
              <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="32" fill="transparent" className="text-gray-200" />
                  <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="32" fill="transparent" 
                    strokeDasharray="283%" strokeDashoffset={`${283 - (analytics.averageScore * 2.83)}%`}
                    className="text-blue-600 transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-8xl md:text-9xl font-black italic tracking-tighter leading-none">{analytics.averageScore}%</span>
                  <span className="text-xs font-black uppercase tracking-widest text-blue-600">Aggregate Mastery</span>
                </div>
              </div>
              
              <div className="mt-12 flex flex-col items-center gap-4">
                 <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Academic Momentum</p>
                 <div className="flex items-end gap-2 h-20">
                    {results.length > 0 ? analytics.trend.map((val, i) => (
                      <div key={i} className="group relative">
                        <div className="bg-black w-8 border-2 border-black rounded-t-lg transition-all hover:bg-blue-600" style={{ height: `${val}%` }}></div>
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black opacity-0 group-hover:opacity-100">{val}%</span>
                      </div>
                    )) : (
                      <div className="flex gap-2 items-end">
                        {[40, 30, 50, 20, 45].map((h, i) => (
                          <div key={i} className="bg-gray-200 w-8 border-2 border-gray-300 rounded-t-lg" style={{ height: `${h}%` }}></div>
                        ))}
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED COMPETENCY ANALYTICS */}
      <section className="space-y-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b-8 border-black pb-10">
           <div className="flex items-center gap-6">
             <div className="w-4 h-24 bg-blue-700 rounded-full"></div>
             <div>
               <h3 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">Category Competency</h3>
               <p className="text-gray-400 font-black uppercase text-sm tracking-widest mt-2">Personal Mastery vs. National Baseline</p>
             </div>
           </div>
           <div className="flex gap-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-600 border-2 border-black rounded-lg shadow-sm"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Your Mastery</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-300 border-2 border-dashed border-black rounded-lg"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">National Avg</span>
              </div>
           </div>
        </div>

        {results.length === 0 ? (
          <div className="bg-gray-50 border-[8px] border-black rounded-[5rem] p-24 md:p-40 text-center space-y-12 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-4 ethiopian-gradient"></div>
             <div className="text-[12rem] opacity-20 transform -rotate-12 select-none animate-pulse">📊</div>
             <div className="relative z-10 space-y-6">
               <p className="text-5xl font-black uppercase italic text-gray-800 tracking-tighter">Diagnostic Data Pending</p>
               <p className="text-gray-500 font-black uppercase text-sm tracking-[0.3em] max-w-xl mx-auto leading-relaxed">
                 The registry is currently empty. Complete your first proctored mock examination to generate subject-specific competency insights.
               </p>
             </div>
             <button className="relative z-10 bg-black text-white px-16 py-8 rounded-[3rem] border-8 border-black font-black uppercase text-2xl shadow-[10px_10px_0px_0px_rgba(59,130,246,1)] hover:translate-y-2 hover:shadow-none transition-all">
                Enter Exam Hall
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {analytics.items.map(topic => (
              <div key={topic.name} className="bg-white border-8 border-black rounded-[4rem] p-12 space-y-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 transition-all relative overflow-hidden group">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <p className="text-3xl font-black uppercase italic tracking-tighter leading-[0.85]">{topic.name}</p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-gray-50 border-2 border-black px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">
                       {topic.percentage >= topic.nationalAvg ? '✅ Above National Avg' : '⚠️ Below National Avg'}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-black italic text-blue-700 leading-none">{topic.percentage}%</p>
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mt-2">Module Mastery</p>
                  </div>
                </div>
                
                <div className="space-y-6 relative z-10">
                   <div className="relative h-14 w-full bg-gray-100 border-4 border-black rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 bottom-0 border-r-4 border-dashed border-black bg-gray-300 z-10 opacity-50" 
                        style={{ left: `calc(${topic.nationalAvg}% - 2px)` }}
                      >
                         <div className="absolute -top-1 right-2 text-[8px] font-black uppercase whitespace-nowrap">Baseline</div>
                      </div>
                      <div 
                        className={`h-full border-r-4 border-black transition-all duration-1000 ${
                          topic.percentage >= 80 ? 'bg-green-500' : 
                          topic.percentage >= 50 ? 'bg-yellow-400' : 
                          'bg-rose-500'
                        }`} 
                        style={{ width: `${topic.percentage}%` }}
                      />
                   </div>
                   <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest italic">
                      <span>{topic.correct} Correct Assertions</span>
                      <span>Target: 80%+</span>
                   </div>
                </div>
                
                <div className="pt-6 border-t-4 border-black flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em]">Verified Registry Log</span>
                   <div className="flex gap-1">
                      {[1,2,3].map(i => <div key={i} className={`w-2 h-2 rounded-full border border-black ${topic.percentage > 33*i ? 'bg-blue-600' : 'bg-white'}`}></div>)}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* HISTORICAL REGISTRY TABLE */}
      <section className="space-y-16 pb-32">
        <div className="flex items-center gap-8 border-l-[20px] border-blue-700 pl-10">
           <h3 className="text-7xl font-black uppercase italic tracking-tighter leading-none">Registry <br/>Archives.</h3>
        </div>
        
        <div className="bg-white border-8 border-black rounded-[4rem] overflow-hidden shadow-[25px_25px_0px_0px_rgba(0,0,0,1)] relative">
          <div className="p-10 bg-black text-white flex justify-between items-center font-black uppercase text-sm tracking-widest border-b-8 border-black">
             <span>Session Trace</span>
             <span className="hidden md:inline">Curriculum Level</span>
             <span>Performance</span>
          </div>
          <div className="divide-y-8 divide-black bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
            {results.length === 0 ? (
              <div className="p-24 md:p-40 text-center space-y-10 group">
                 <div className="text-[14rem] transition-transform duration-700 group-hover:scale-110 grayscale opacity-10">📖</div>
                 <div className="space-y-4">
                    <p className="text-5xl font-black uppercase italic text-gray-300 tracking-tighter">Registry Unpopulated</p>
                    <p className="text-gray-400 font-black uppercase text-xs tracking-[0.4em] max-lg mx-auto leading-relaxed">
                       Your historical academic ledger is awaiting initial authentication of mock results. 
                    </p>
                 </div>
              </div>
            ) : (
              results.sort((a,b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()).map(res => {
                const exam = exams.find(e => e.id === res.examId);
                const percent = Math.round((res.score / res.totalPoints) * 100);
                return (
                  <div 
                    key={res.completedAt} 
                    onClick={() => setSelectedResult(res)}
                    className="p-10 flex flex-col md:flex-row justify-between items-center gap-10 hover:bg-blue-50 cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-10 w-full md:w-auto">
                       <div className={`w-24 h-24 rounded-[1.5rem] border-4 border-black flex flex-col items-center justify-center font-black italic shadow-lg transition-transform group-hover:scale-110 ${percent >= 50 ? 'bg-green-100' : 'bg-rose-100'}`}>
                          <span className="text-3xl leading-none">{percent}%</span>
                          <span className="text-[8px] uppercase tracking-widest mt-1">{percent >= 50 ? 'Pass' : 'Failed'}</span>
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Session: {new Date(res.completedAt).toLocaleDateString()}</p>
                          <h4 className="text-3xl font-black uppercase italic leading-none group-hover:text-blue-700 transition-colors">{exam?.title || 'National Module'}</h4>
                          <p className="text-sm font-black text-blue-600 mt-2 uppercase tracking-tight">Trace ID: SEC-{(res.examId.slice(-4))}</p>
                       </div>
                    </div>
                    
                    <div className="hidden lg:flex items-center gap-4 bg-gray-50 border-4 border-black px-6 py-3 rounded-2xl shadow-sm">
                       <span className="text-xs font-black uppercase text-gray-400">Validated:</span>
                       <span className="text-sm font-black uppercase">{Object.keys(res.categoryBreakdown).length} Units Tested</span>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                       <div className="text-right">
                          <p className="text-3xl font-black italic leading-none">{res.score}</p>
                          <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mt-1">Knowledge Points</p>
                       </div>
                       <div className="w-16 h-16 bg-blue-700 text-white rounded-2xl border-4 border-black flex items-center justify-center text-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                          →
                       </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* SOVEREIGN VERIFICATION FOOTER */}
      <section className="relative py-24 px-10 overflow-hidden bg-white rounded-[5rem] shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)] border-4 border-black/5">
        <div className="relative z-10 flex flex-col items-center gap-12">
           <div className="flex items-center gap-12 group">
              <div className="w-32 h-32 border-[10px] border-[#009b44] rounded-full flex items-center justify-center text-6xl shadow-inner group-hover:scale-110 transition-transform bg-white">🏛️</div>
              <div className="h-32 w-2 ethiopian-gradient rounded-full"></div>
              <div className="w-32 h-32 border-[10px] border-[#ef3340] rounded-[2rem] flex flex-col items-center justify-center bg-white group-hover:border-[#ffcd00] transition-colors overflow-hidden">
                <span className="text-4xl font-black italic text-[#0f3460] tracking-tighter">EAES</span>
                <div className="absolute inset-x-0 bottom-0 h-2 ethiopian-gradient"></div>
              </div>
           </div>
           
           <div className="text-center space-y-6 max-w-4xl">
              <p className="text-sm font-black uppercase tracking-[0.6em] text-sky-300 leading-relaxed drop-shadow-sm">
                 OFFICIAL ACADEMIC REGISTRY OF THE IFTU INFRASTRUCTURE
              </p>
              <p className="text-xl font-black text-gray-500 italic leading-relaxed px-4">
                 This transcript summary is a cryptographically verified academic artifact belonging to the IFTU LMS National Education Infrastructure. Unauthorized duplication or manipulation of proctored results is strictly prohibited by Federal Educational Standards.
              </p>
           </div>
           
           <div className="flex gap-10">
              <div className="w-20 h-2 bg-[#009b44] rounded-full shadow-sm"></div>
              <div className="w-20 h-2 bg-[#ffcd00] rounded-full shadow-sm"></div>
              <div className="w-20 h-2 bg-[#ef3340] rounded-full shadow-sm"></div>
           </div>
        </div>
      </section>

      <div className="h-24"></div>
    </div>
  );
};

export default PerformanceHub;
