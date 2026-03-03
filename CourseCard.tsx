import React from 'react';
import { Course, Stream } from '../types';

interface CourseCardProps {
  course: Course;
  onClick: (course: Course) => void;
  completedLessonIds?: string[];
  completedCourseIds?: string[];
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onClick, 
  completedLessonIds = [], 
  completedCourseIds = [] 
}) => {
  const totalLessons = course.lessons.length || 0;
  const completedInCourse = course.lessons.filter(l => completedLessonIds.includes(l.id)).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedInCourse / totalLessons) * 100) : 0;

  // Prerequisite logic
  const isLocked = course.prerequisites && course.prerequisites.length > 0 && 
    !course.prerequisites.every(preReqId => completedCourseIds.includes(preReqId));

  // Stream-based branding
  const branding = {
    [Stream.NATURAL_SCIENCE]: { color: '#3b82f6', bg: 'bg-blue-50', shadow: 'rgba(59, 130, 246, 1)', label: 'STEM' },
    [Stream.SOCIAL_SCIENCE]: { color: '#ffcd00', bg: 'bg-yellow-50', shadow: 'rgba(255, 205, 0, 1)', label: 'SOCIAL' },
    [Stream.GENERAL]: { color: '#009b44', bg: 'bg-green-50', shadow: 'rgba(0, 155, 68, 1)', label: 'CORE' }
  }[course.stream] || { color: '#000000', bg: 'bg-gray-50', shadow: 'rgba(0, 0, 0, 1)', label: 'GENERAL' };

  const handleCardClick = () => {
    if (isLocked) {
      alert(`Access Denied: You must complete prerequisites first.`);
      return;
    }
    onClick(course);
  };

  // Circular progress math
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercent / 100) * circumference;

  return (
    <div 
      onClick={handleCardClick}
      className={`group relative bg-white rounded-[3.5rem] border-8 border-black overflow-hidden transition-all cursor-pointer ${isLocked ? 'grayscale opacity-75' : 'hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]'}`}
      style={{ boxShadow: !isLocked ? `12px 12px 0px 0px ${branding.shadow}` : 'none' }}
    >
      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
          <span className="text-6xl mb-4">🔒</span>
          <p className="font-black uppercase tracking-widest text-xs">Module Restricted</p>
          <p className="text-[10px] font-bold opacity-70 mt-2">Complete prerequisites to unlock</p>
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative h-56 border-b-8 border-black bg-gray-100 overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <span className="bg-black text-white px-4 py-1.5 rounded-xl border-2 border-white text-[10px] font-black uppercase tracking-widest shadow-lg">
            {course.code}
          </span>
          <span className="bg-white text-black px-4 py-1.5 rounded-xl border-4 border-black text-[9px] font-black uppercase tracking-widest shadow-md">
            {course.grade}
          </span>
        </div>
        
        {/* Circular Progress Ring in Corner */}
        <div className="absolute -bottom-10 right-6 z-10 w-24 h-24 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">
           <svg className="w-20 h-20 transform -rotate-90">
             <circle 
               cx="40" cy="40" r={radius} 
               stroke="#f3f4f6" strokeWidth="8" fill="transparent" 
             />
             <circle 
               cx="40" cy="40" r={radius} 
               stroke={branding.color} strokeWidth="8" fill="transparent" 
               strokeDasharray={circumference}
               strokeDashoffset={offset}
               strokeLinecap="round"
               className="transition-all duration-1000"
             />
           </svg>
           <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
              <span className="text-xs font-black leading-none">{completedInCourse}/{totalLessons}</span>
              <span className="text-[8px] font-black uppercase tracking-tighter text-gray-400">Modules</span>
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 pt-12 space-y-6">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
        </div>

        <p className="text-sm font-bold text-gray-500 line-clamp-2 italic leading-relaxed uppercase">
          {course.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t-4 border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border-2 border-black overflow-hidden bg-gray-50">
              <img src={course.instructorPhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${course.instructor}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="leading-tight">
              <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Instructor</p>
              <p className="text-[10px] font-black uppercase italic">{course.instructor}</p>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-xl border-4 border-black font-black uppercase text-[9px] tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${branding.bg}`}>
            {branding.label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;