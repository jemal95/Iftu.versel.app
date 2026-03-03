
import React from 'react';
import { NATIONAL_CENTER_INFO } from '../constants';

const AboutPortal: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-32 py-12 animate-fadeIn">
      {/* Vision Hero */}
      <section className="bg-white border-[10px] border-black rounded-[6rem] p-16 md:p-32 shadow-[30px_30px_0px_0px_rgba(255,205,0,1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
          <div className="ethiopian-gradient h-full w-full"></div>
        </div>
        <div className="space-y-12 relative z-10">
          <h2 className="text-8xl md:text-[12rem] font-black uppercase italic tracking-tighter leading-[0.75] text-blue-900">Digital <br/>Sovereignty.</h2>
          <p className="text-3xl md:text-5xl font-black uppercase italic leading-tight text-gray-800 max-w-4xl">
            {NATIONAL_CENTER_INFO.name} is the cornerstone of Ethiopia's 2030 educational transformation.
          </p>
          <div className="h-4 w-48 bg-red-600"></div>
        </div>
      </section>

      {/* Main Location Section */}
      <section className="bg-white border-[10px] border-black rounded-[5rem] p-12 md:p-24 shadow-[30px_30px_0px_0px_rgba(0,155,68,1)] flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-10">
          <span className="bg-black text-white px-6 py-2 rounded-xl font-black uppercase text-xs tracking-widest">Central Command</span>
          <h3 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">{NATIONAL_CENTER_INFO.name}.</h3>
          <p className="text-2xl font-bold text-gray-500 italic">
            Established by {NATIONAL_CENTER_INFO.authorizedBy}, located at {NATIONAL_CENTER_INFO.location}. 
            This hub serves as the national registry and AI laboratory for sovereign Ethiopian learning.
          </p>
          
          <div className="pt-6">
            <a 
              href={NATIONAL_CENTER_INFO.mapsLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-6 bg-blue-600 text-white px-12 py-8 rounded-[2.5rem] border-8 border-black font-black uppercase text-2xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 transition-all group"
            >
              <span>Explore Center Location</span>
              <span className="text-4xl group-hover:scale-125 transition-transform">📍</span>
            </a>
          </div>
        </div>
        <div className="w-full lg:w-1/3 aspect-square bg-gray-50 border-8 border-black rounded-[4rem] flex items-center justify-center p-12 shadow-inner">
           <div className="text-[12rem]">🏛️</div>
        </div>
      </section>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { icon: '🏛️', title: 'EAES Standards', desc: 'Full alignment with the Educational Assessment and Examination Services national curriculum.' },
          { icon: '⚙️', title: 'TVET Focus', desc: 'Specialized modules for Technical and Vocational training in ICT, Automotive, and Engineering.' },
          { icon: '🤖', title: 'AI Integration', desc: 'Powered by advanced Sovereign AI to provide personalized tutoring in local languages.' }
        ].map((p, i) => (
          <div key={i} className="bg-white border-8 border-black p-12 rounded-[4rem] shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] space-y-8 flex flex-col items-center text-center hover:-translate-y-4 transition-all">
             <div className="text-9xl">{p.icon}</div>
             <h3 className="text-4xl font-black uppercase italic tracking-tighter">{p.title}</h3>
             <p className="text-lg font-bold text-gray-500 leading-relaxed italic">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Leadership Footer */}
      <section className="text-center py-24 border-t-8 border-black">
        <p className="text-[12px] font-black uppercase tracking-[0.8em] text-gray-400 mb-12">Authorized by IFTU National Board</p>
        <div className="flex justify-center gap-10">
           <div className="flex flex-col items-center gap-4">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jemal&backgroundColor=b6e3f4" className="w-32 h-32 rounded-full border-8 border-black shadow-xl" alt={NATIONAL_CENTER_INFO.authorizedBy} />
             <p className="text-xs font-black uppercase italic">{NATIONAL_CENTER_INFO.authorizedBy}</p>
           </div>
           <div className="flex flex-col items-center gap-4">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Makiya&backgroundColor=ffd5dc" className="w-32 h-32 rounded-full border-8 border-black shadow-xl" alt="Director General" />
             <p className="text-xs font-black uppercase italic">Makiya Kedir</p>
           </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPortal;
