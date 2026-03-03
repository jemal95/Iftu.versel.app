
import React from 'react';
import { User } from '../types';

interface LeaderboardProps {
  students: Partial<User>[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ students }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-fadeIn py-12">
      <div className="text-center space-y-6">
        <h2 className="text-8xl font-black uppercase tracking-tighter italic text-blue-900 leading-none">National <br/>Ranks.</h2>
        <p className="text-2xl font-black uppercase tracking-widest text-gray-400 italic">IFTU LMS & Regional Leaders</p>
      </div>

      <div className="bg-white border-8 border-black rounded-[5rem] overflow-hidden shadow-[30px_30px_0px_0px_rgba(255,205,0,1)]">
        <div className="p-8 md:p-12 bg-black text-white flex justify-between items-center border-b-8 border-black font-black uppercase italic text-sm tracking-widest">
           <span>Student Profile</span>
           <span className="hidden sm:inline">Academic Hub</span>
           <span>KP Score</span>
        </div>
        
        <div className="divide-y-8 divide-black">
          {students.map((student, i) => (
            <div key={student.id} className="p-8 md:p-12 flex items-center justify-between hover:bg-yellow-50 transition-colors">
              <div className="flex items-center gap-8">
                 <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border-4 border-black font-black text-3xl flex items-center justify-center shadow-lg ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-200' : i === 2 ? 'bg-orange-200' : 'bg-white'}`}>
                    {i + 1}
                 </div>
                 <div className="flex items-center gap-6">
                    <img src={student.photo} className="w-16 h-16 rounded-full border-4 border-black shadow-md hidden sm:block" alt="" />
                    <div>
                      <h4 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight leading-none">{student.name}</h4>
                      <div className="flex gap-2 mt-2">
                         {student.badges?.slice(0, 2).map(b => (
                           <span key={b.id} title={b.title} className="text-xl grayscale hover:grayscale-0 cursor-help transition-all">{b.icon}</span>
                         ))}
                      </div>
                    </div>
                 </div>
              </div>
              
              <div className="hidden md:block">
                 <span className="text-sm font-black uppercase text-gray-400 bg-gray-100 px-4 py-1 rounded-lg border-2 border-black">{student.school}</span>
              </div>

              <div className="text-right">
                 <p className="text-4xl font-black text-blue-700 italic">{student.points?.toLocaleString()}</p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Knowledge Points</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-12 bg-blue-50 text-center border-t-8 border-black">
          <p className="text-xl font-black italic">Rank up by completing lessons and scoring high on mocks!</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
