
import React, { useState, useEffect, useRef } from 'react';
import { Course, Lesson, Question, Language } from '../types';
import { getLessonDeepDive } from '../services/geminiService';
import LiveInterviewer from './LiveInterviewer';

const SovereignSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 border-4 border-black/5 rounded-2xl ${className}`}>
    <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
  </div>
);

interface CustomVideoPlayerProps {
  src: string;
  title: string;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ src, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    if (id) {
      return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&origin=${window.location.origin}`;
    }
    return url;
  };

  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
  const sanitizedSrc = getEmbedUrl(src);

  useEffect(() => {
    setIsInitialLoading(true);
    setHasError(false);
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || isYouTube) {
      if (isYouTube) {
        const timer = setTimeout(() => setIsInitialLoading(false), 1500);
        return () => clearTimeout(timer);
      }
      return;
    }
    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };
    const updateDuration = () => {
      setDuration(video.duration);
      setIsInitialLoading(false);
    };
    const handleError = () => {
      if (src) setHasError(true);
      setIsInitialLoading(false);
    };
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('error', handleError);
    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('error', handleError);
    };
  }, [src, isYouTube]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
    }
  };

  return (
    <div ref={containerRef} className="relative aspect-video w-full bg-black rounded-[3.5rem] border-[8px] border-black shadow-[25px_25px_0px_0px_rgba(0,0,0,1)] overflow-hidden group">
      {isInitialLoading && (
        <div className="absolute inset-0 z-20 bg-white p-8 flex flex-col items-center justify-center space-y-8">
          <div className="w-32 h-32 border-[12px] border-black border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-xl font-black uppercase italic tracking-tighter">Establishing Module Link...</p>
        </div>
      )}
      {isYouTube && sanitizedSrc ? (
        <iframe className="w-full h-full" src={sanitizedSrc} title={title} frameBorder="0" allowFullScreen onLoad={() => setIsInitialLoading(false)}></iframe>
      ) : (
        <video ref={videoRef} src={src} className="w-full h-full cursor-pointer" onClick={togglePlay} playsInline />
      )}
    </div>
  );
};

interface SecurePDFViewerProps {
  url: string;
  title: string;
}

const SecurePDFViewer: React.FC<SecurePDFViewerProps> = ({ url, title }) => {
  const [loadError, setLoadError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(false);
    setLoadError(false);
  }, [url]);
  const secureUrl = url ? `${url}#toolbar=0&navpanes=0&scrollbar=0` : '';
  if (loadError || !url) {
    return (
      <div className="w-full h-[800px] bg-rose-50 border-8 border-black rounded-[3.5rem] flex flex-col items-center justify-center p-12 text-center space-y-8">
        <div className="text-9xl">📖</div>
        <h3 className="text-5xl font-black uppercase italic tracking-tighter text-rose-600">Secure Stream Failure</h3>
      </div>
    );
  }
  return (
    <div className="w-full h-[850px] bg-gray-200 border-8 border-black rounded-[3.5rem] shadow-[25px_25px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative group">
      {!isLoaded && (
        <div className="absolute inset-0 bg-white p-20 z-10 space-y-12 flex flex-col items-center justify-center">
           <div className="w-24 h-24 border-[10px] border-black border-t-blue-600 rounded-full animate-spin"></div>
           <p className="text-2xl font-black uppercase italic tracking-tighter animate-pulse">Establishing Sovereign Stream...</p>
        </div>
      )}
      <iframe src={secureUrl} className="w-full h-full border-none" title={title} onLoad={() => setIsLoaded(true)}></iframe>
    </div>
  );
};

interface CourseViewerProps {
  course: Course;
  initialLessonId?: string;
  onClose: () => void;
  onLessonComplete?: (lessonId: string, points: number) => void;
  completedLessonIds?: string[];
  language?: Language;
}

const CourseViewer: React.FC<CourseViewerProps> = ({ course, initialLessonId, onClose, onLessonComplete, completedLessonIds = [], language = 'en' }) => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(
    course.lessons.find(l => l.id === initialLessonId) || course.lessons[0] || null
  );
  const [deepDive, setDeepDive] = useState<{ content: string; type: 'simpler' | 'advanced' | null }>({ content: '', type: null });
  const [isDeepDiving, setIsDeepDiving] = useState(false);

  const handleFinish = (score?: number) => {
    if (activeLesson && onLessonComplete) {
      onLessonComplete(activeLesson.id, score || 50);
      const currentIdx = course.lessons.findIndex(l => l.id === activeLesson.id);
      if (currentIdx < course.lessons.length - 1) {
        setActiveLesson(course.lessons[currentIdx + 1]);
        setDeepDive({ content: '', type: null });
      } else {
        alert("Course Mastery Achieved!");
        onClose();
      }
    }
  };

  const handleDeepDive = async (type: 'simpler' | 'advanced') => {
    if (!activeLesson || isDeepDiving) return;
    setIsDeepDiving(true);
    setDeepDive({ content: '', type });
    const response = await getLessonDeepDive(activeLesson.content, type, language as Language);
    setDeepDive({ content: response, type });
    setIsDeepDiving(false);
  };

  if (!activeLesson) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col overflow-hidden animate-fadeIn no-select">
      <div className="h-24 md:h-32 border-b-8 border-black flex items-center justify-between px-8 md:px-16 bg-white z-20">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="w-16 h-16 bg-gray-50 border-4 border-black rounded-2xl flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">←</button>
          <h2 className="text-xl md:text-4xl font-black uppercase tracking-tighter italic leading-none">{course.title}</h2>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <div className="w-16 h-16 bg-rose-600 text-white rounded-2xl border-4 border-black flex items-center justify-center text-2xl">🔒</div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="hidden lg:flex w-96 border-r-8 border-black flex-col bg-gray-50 overflow-y-auto p-6 space-y-8">
          <div className="space-y-4">
            <h3 className="font-black uppercase italic p-4 border-b-4 border-black">Lesson Plan</h3>
            <div className="space-y-4">
              {course.lessons.map((lesson, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveLesson(lesson); setDeepDive({ content: '', type: null }); }}
                  className={`w-full text-left p-6 rounded-[2rem] border-4 border-black font-black transition-all ${activeLesson.id === lesson.id ? 'bg-blue-600 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' : completedLessonIds.includes(lesson.id) ? 'bg-green-50' : 'bg-white'}`}
                >
                  {idx + 1}. {lesson.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f0f2f5] p-6 md:p-12">
          <div className="max-w-5xl mx-auto space-y-12 pb-24">
            {/* Conditional Rendering for TVET Oral Assessment or Standard Content */}
            {activeLesson.id.includes('oral') ? (
              <LiveInterviewer topic={activeLesson.title} onComplete={handleFinish} onCancel={onClose} />
            ) : (
              <>
                {activeLesson.contentType === 'video' ? (
                  <CustomVideoPlayer src={activeLesson.videoUrl || ''} title={activeLesson.title} />
                ) : (
                  <SecurePDFViewer url={activeLesson.pdfUrl || ''} title={activeLesson.title} />
                )}
                
                <div className="bg-white p-10 md:p-20 rounded-[4rem] border-8 border-black shadow-[25px_25px_0px_0px_rgba(0,0,0,1)] space-y-12">
                  <div className="flex flex-col gap-6">
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">{activeLesson.title}</h1>
                    <div className="flex gap-4">
                      <button onClick={() => handleDeepDive('simpler')} className="bg-yellow-400 border-4 border-black px-6 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all">AI Simpler</button>
                      <button onClick={() => handleDeepDive('advanced')} className="bg-blue-600 text-white border-4 border-black px-6 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all">AI Advanced</button>
                    </div>
                  </div>
                  <p className="text-2xl leading-relaxed text-gray-700">{activeLesson.content}</p>
                  <div className="pt-10 flex justify-center">
                    <button onClick={() => handleFinish()} className="px-20 py-8 bg-black text-white rounded-[2.5rem] border-8 border-black font-black uppercase text-2xl shadow-[12px_12px_0px_0px_rgba(34,197,94,1)] hover:translate-y-2 transition-all">Mark Complete →</button>
                  </div>
                </div>

                {(deepDive.type || isDeepDiving) && (
                  <div className="bg-blue-50 border-8 border-black rounded-[4rem] p-12 md:p-20 shadow-[25px_25px_0px_0px_rgba(59,130,246,1)]">
                    <h4 className="text-4xl font-black uppercase italic mb-8">{deepDive.type === 'simpler' ? 'Simpler logic' : 'Advanced context'}</h4>
                    {isDeepDiving ? <p className="animate-pulse">Synthesizing...</p> : <p className="text-2xl leading-relaxed italic">{deepDive.content}</p>}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
