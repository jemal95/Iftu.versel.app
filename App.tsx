
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CourseCard from './components/CourseCard';
import AITutor from './components/AITutor';
import ExamEngine from './components/ExamEngine';
import CourseViewer from './components/CourseViewer';
import Leaderboard from './components/Leaderboard';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import PerformancePortal from './components/PerformancePortal';
import RegistrationPortal from './components/RegistrationPortal';
import AboutPortal from './components/AboutPortal';
import CampusLocator from './components/CampusLocator';
import DevPortal from './components/DevPortal';
import { MOCK_COURSES, MOCK_NEWS, MOCK_EXAMS, SUMMER_STATS, SUMMER_ACTIVITIES } from './constants';
import { Course, Grade, User, Exam, ExamResult, EducationLevel, Stream, Language, News } from './types';
import { fetchLatestEducationNews } from './services/geminiService';

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: { home: 'Home', courses: 'Courses', exams: 'Exams', tutor: 'AI Tutor', about: 'About', news: 'News', locator: 'Locator', login: 'Login', register: 'Register', leaderboard: 'Rankings', performance: 'My Results', documentation: 'Guide' },
  am: { home: 'መነሻ', courses: 'ትምህርቶች', exams: 'ፈተናዎች', tutor: 'AI ረዳት', about: 'ስለ እኛ', news: 'ዜና', locator: 'መፈለጊያ', login: 'ይግቡ', register: 'ይመዝገቡ', leaderboard: 'ደረጃዎች', performance: 'ውጤቴ', documentation: 'መመሪያ' },
  om: { home: 'Mana', courses: 'Koorsoota', exams: 'Qormaata', tutor: 'Gargaaraa AI', about: "Waa'ee", news: 'Oduu', locator: 'Bakka', login: 'Seeni', register: 'Galmaa’i', leaderboard: 'Sadarkaa', performance: 'Bu’aa koo', documentation: 'Qajeelfama' }
};

const INITIAL_USERS: User[] = [
  { 
    id: 'adm-001', 
    name: 'Jemal Fano Haji', 
    role: 'admin', 
    points: 99999, 
    status: 'active', 
    email: 'admin@iftu.edu.et', 
    joinedDate: '2024-01-01', 
    preferredLanguage: 'om', 
    badges: [{ id: 'b1', title: 'Grand Architect', icon: '👑', earnedAt: '2024-01-01' }],
    school: 'IFTU National Digital Center', 
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jemal&backgroundColor=b6e3f4',
    completedLessons: [], completedExams: [], completedCourses: [], certificatesPaid: [],
    nid: 'ET-ADMIN-001', gender: 'Male', phoneNumber: '+251 911 000000', address: 'IFTU HQ, Menelik II Square'
  },
  {
    id: 'tch-001',
    name: 'Dr. Tesfaye Wolde',
    role: 'teacher',
    points: 5500,
    status: 'active',
    email: 'tesfaye@iftu.edu.et',
    joinedDate: '2024-01-10',
    preferredLanguage: 'en',
    badges: [],
    school: 'Science Hub 1',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tesfaye&backgroundColor=ffdfbf',
    department: 'Physics & STEM',
    subjects: ['Advanced Mechanics', 'Quantum Theory'],
    salary: 24500,
    nid: 'ET-INST-992',
    gender: 'Male',
    dob: '1985-05-20',
    phoneNumber: '+251 922 111222',
    address: 'Bole, Addis Ababa'
  },
  {
    id: 'std-001', 
    name: 'Makiya Kedir', 
    role: 'student', 
    grade: Grade.G12, 
    stream: Stream.NATURAL_SCIENCE,
    level: EducationLevel.SECONDARY, 
    points: 1250, 
    status: 'active', 
    email: 'student@iftu.edu.et', 
    joinedDate: '2024-02-15', 
    preferredLanguage: 'am', 
    badges: [],
    school: 'Addis Future Academy', 
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Makiya&backgroundColor=00D05A',
    completedLessons: [], completedExams: [], completedCourses: [], certificatesPaid: [],
    nid: 'ET-ST-8812', gender: 'Female', salary: 250, dob: '2007-08-12', address: 'Summit Area, Addis Ababa'
  }
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [exams, setExams] = useState<Exam[]>(MOCK_EXAMS);
  const [news, setNews] = useState<News[]>(MOCK_NEWS as News[]);
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loginEmail, setLoginEmail] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [userResults, setUserResults] = useState<ExamResult[]>([]);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [groundedNews, setGroundedNews] = useState<{ text: string, sources: any[] } | null>(null);
  const [isSyncingNews, setIsSyncingNews] = useState(false);

  useEffect(() => {
    const handleSyncStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleSyncStatus);
    window.addEventListener('offline', handleSyncStatus);
    return () => {
      window.removeEventListener('online', handleSyncStatus);
      window.removeEventListener('offline', handleSyncStatus);
    };
  }, []);

  const t = (key: string) => TRANSLATIONS[currentLang][key] || key;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      const user = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
        setActiveView(user.role === 'admin' ? 'admin' : user.role === 'teacher' ? 'teacher' : 'home');
      } else { 
        alert("ERROR: Identity not found. Please register or contact Jemal Fano Haji."); 
      }
      setIsAuthenticating(false);
    }, 800);
  };

  const handleCertPaid = (courseId: string) => {
    if (currentUser) {
      const updatedPaid = Array.from(new Set([...(currentUser.certificatesPaid || []), courseId]));
      const updatedUser = { ...currentUser, certificatesPaid: updatedPaid };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  const renderContent = () => {
    if (activeView === 'login') return (
      <div className="max-w-4xl mx-auto py-24">
        <div className="bg-white p-12 md:p-24 rounded-[5rem] border-8 border-black shadow-[35px_35px_0px_0px_rgba(0,0,0,1)] space-y-16 text-center">
          <h2 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter">Enter <span className="liquid-spectrum-text">Portal.</span></h2>
          <form onSubmit={handleLogin} className="space-y-12">
            <input type="email" required placeholder="Identity Email" className="w-full p-10 bg-gray-50 border-8 border-black rounded-[3rem] font-black text-3xl outline-none shadow-inner" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            <button type="submit" disabled={isAuthenticating} className="w-full py-12 bg-black text-white border-8 border-black rounded-[4rem] font-black uppercase text-4xl shadow-[15px_15px_0px_0px_rgba(59,130,246,1)] hover:translate-y-1 transition-all">
              {isAuthenticating ? 'AUTHENTICATING...' : 'ACCESS REGISTRY →'}
            </button>
          </form>
        </div>
      </div>
    );

    if (activeView === 'register') return <RegistrationPortal onRegister={(u) => { setUsers([...users, u]); setCurrentUser(u); setIsLoggedIn(true); setActiveView('home'); }} onCancel={() => setActiveView('login')} />;

    if (isLoggedIn) {
      if (activeView === 'admin' && currentUser?.role === 'admin') {
        return (
          <AdminDashboard 
            users={users} 
            courses={courses} 
            exams={exams} 
            news={news} 
            onUpdateUser={(u) => setUsers(users.map(usr => usr.id === u.id ? u : usr))} 
            onAddUser={(u) => setUsers([...users, u])} 
            onDeleteUser={(id) => setUsers(users.filter(u => u.id !== id))} 
            onUpdateCourse={(c) => setCourses(courses.map(crs => crs.id === c.id ? c : crs))} 
            onAddCourse={(c) => setCourses([...courses, c])} 
            onDeleteCourse={(id) => setCourses(courses.filter(c => c.id !== id))} 
            onAddNews={(n) => setNews([n, ...news])}
            onUpdateNews={(n) => setNews(news.map(bulletin => bulletin.id === n.id ? n : bulletin))}
            onDeleteNews={(id) => setNews(news.filter(n => n.id !== id))}
            onNavClick={setActiveView}
          />
        );
      }
      if (activeView === 'teacher' && currentUser?.role === 'teacher') {
        return <TeacherDashboard exams={exams} onAddExam={(ex) => setExams([...exams, ex])} onDeleteExam={(id) => setExams(exams.filter(e => e.id !== id))} />;
      }
    }

    switch(activeView) {
      case 'courses':
        return (
          <div className="space-y-16 animate-fadeIn">
            <h2 className="text-9xl font-black uppercase italic tracking-tighter leading-none text-blue-900">Catalogue.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {courses.map(c => (
                <CourseCard 
                  key={c.id} 
                  course={c} 
                  onClick={(crs) => isLoggedIn ? setViewingCourse(crs) : setActiveView('login')} 
                  completedLessonIds={currentUser?.completedLessons}
                  completedCourseIds={currentUser?.completedCourses}
                />
              ))}
            </div>
          </div>
        );
      case 'news':
        return (
          <div className="max-w-6xl mx-auto space-y-24 py-12 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
              <h2 className="text-9xl font-black uppercase italic tracking-tighter leading-none text-blue-900">Bulletin.</h2>
              <button onClick={async () => { setIsSyncingNews(true); const d = await fetchLatestEducationNews(); if (d) setGroundedNews(d); setIsSyncingNews(false); }} disabled={isSyncingNews || !isOnline} className="bg-[#00D05A] text-white px-10 py-6 rounded-[2.5rem] border-8 border-black font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all flex items-center gap-4">
                {isSyncingNews ? 'SYNCING...' : '📡 Sync National Feed'}
              </button>
            </div>
            {groundedNews && (
               <div className="bg-blue-50 border-8 border-black rounded-[5rem] p-12 md:p-20 space-y-10 shadow-[30px_30px_0px_0px_rgba(59,130,246,1)]">
                 <p className="text-sm font-black uppercase tracking-widest text-red-600 italic">Live Grounded Update</p>
                 <div className="prose prose-2xl max-w-none font-bold text-gray-800 italic whitespace-pre-wrap">{groundedNews.text}</div>
               </div>
            )}
            <div className="grid grid-cols-1 gap-16">
              {news.map(n => (
                <div key={n.id} className="bg-white border-8 border-black rounded-[5rem] overflow-hidden shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row">
                  <div className="w-full lg:w-[450px] h-96 border-b-8 lg:border-b-0 lg:border-r-8 border-black shrink-0">
                    <img src={n.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="p-12 md:p-20 space-y-8">
                    <h3 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">{n.title}</h3>
                    <p className="text-2xl font-bold text-gray-500 italic leading-relaxed">{n.summary}</p>
                    <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">{n.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'exams':
        return (
          <div className="max-w-4xl mx-auto space-y-16 py-12 animate-fadeIn">
            <h2 className="text-8xl font-black uppercase italic tracking-tighter text-blue-900 leading-none">Mock Sessions.</h2>
            <div className="grid grid-cols-1 gap-8">
              {exams.map(ex => (
                <div key={ex.id} className="bg-white p-10 md:p-12 rounded-[3.5rem] border-8 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-center gap-8 hover:translate-x-2 transition-all">
                  <h3 className="text-3xl md:text-4xl font-black uppercase italic leading-none tracking-tight">{ex.title}</h3>
                  <button onClick={() => isLoggedIn ? setActiveExam(ex) : setActiveView('login')} className="px-12 py-5 bg-black text-white rounded-2xl border-4 border-black font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1">Launch</button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'performance':
        return <PerformancePortal results={userResults} exams={exams} currentUser={currentUser || undefined} courses={courses} onCertPaid={handleCertPaid} />;
      case 'leaderboard':
        return <Leaderboard students={users} />;
      case 'tutor':
        return <AITutor />;
      case 'locator':
        return <CampusLocator />;
      case 'about':
        return <AboutPortal />;
      case 'documentation':
        return <DevPortal />;
      default:
        return (
          <div className="space-y-48 animate-fadeIn">
            <section className="rounded-[6rem] p-16 md:p-32 text-white sovereign-bg border-8 border-black sovereign-aura relative overflow-hidden flex flex-col items-center text-center">
              <div className="relative z-10 max-w-6xl space-y-16">
                <h1 className="text-7xl md:text-[14rem] font-black uppercase tracking-tighter leading-[0.75] italic drop-shadow-2xl">
                  <span className="liquid-spectrum-text">SOVEREIGN</span> <br/> LEARNING
                </h1>
                <p className="text-2xl md:text-4xl font-black uppercase tracking-widest italic opacity-85">Empowering Ethiopia's Digital Generation.</p>
                {!isLoggedIn && (
                  <div className="flex flex-col sm:flex-row gap-10 justify-center pt-8">
                    <button onClick={() => setActiveView('register')} className="bg-white text-black px-16 py-8 rounded-[3rem] border-8 border-black font-black uppercase text-2xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-all">START REGISTRY</button>
                    <button onClick={() => setActiveView('login')} className="bg-black text-white px-16 py-8 rounded-[3rem] border-8 border-black font-black uppercase text-2xl shadow-[10px_10px_0px_0px_rgba(255,255,255,0.2)] hover:scale-105 transition-all">ACCESS PORTAL</button>
                  </div>
                )}
              </div>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {SUMMER_STATS.map((s, i) => (
                <div key={i} className="bg-white border-8 border-black rounded-[4rem] p-12 text-center shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center group hover:bg-blue-50 transition-colors">
                  <div className="text-6xl mb-4 p-4 bg-gray-50 border-4 border-black rounded-2xl group-hover:scale-110 transition-transform">{s.icon}</div>
                  <h3 className="text-6xl font-black italic" style={{ color: s.color }}>{s.value}</h3>
                  <p className="text-xs font-black uppercase text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      {activeExam && <ExamEngine exam={activeExam} onComplete={(res) => { setUserResults([...userResults, res]); setActiveExam(null); setActiveView('performance'); }} onCancel={() => setActiveExam(null)} />}
      {viewingCourse && (
        <CourseViewer 
          course={viewingCourse} 
          onClose={() => setViewingCourse(null)} 
          language={currentLang} 
          completedLessonIds={currentUser?.completedLessons || []}
          onLessonComplete={(id, pts) => {
            if (currentUser) {
              const updatedCompletedLessons = [...(currentUser.completedLessons || []), id];
              const isCourseComplete = viewingCourse.lessons.every(l => updatedCompletedLessons.includes(l.id));
              const updatedCompletedCourses = isCourseComplete ? Array.from(new Set([...(currentUser.completedCourses || []), viewingCourse.id])) : (currentUser.completedCourses || []);
              const updatedUser = { ...currentUser, points: currentUser.points + pts, completedLessons: updatedCompletedLessons, completedCourses: updatedCompletedCourses };
              setCurrentUser(updatedUser);
              setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
            }
          }} 
        />
      )}
      {!activeExam && !viewingCourse && (
        <>
          <Header onNavClick={setActiveView} activeView={activeView} isLoggedIn={isLoggedIn} userRole={currentUser?.role} onLogout={() => { setIsLoggedIn(false); setCurrentUser(null); setActiveView('home'); }} onLoginClick={() => setActiveView('login')} currentLang={currentLang} onLangChange={setCurrentLang} t={t} accessibilitySettings={{}} onAccessibilityChange={() => {}} />
          <main className="flex-grow w-full max-w-screen-2xl mx-auto px-4 py-16">{renderContent()}</main>
          <footer className="bg-black text-white py-24 px-8 mt-20 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 ethiopian-gradient"></div>
             <p className="text-[14px] font-black uppercase tracking-[0.6em] text-white/60">© 2026 <span className="liquid-spectrum-text">IFTU NATIONAL DIGITAL CENTER</span>.</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
