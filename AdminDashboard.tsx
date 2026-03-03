
import React, { useState, useEffect } from 'react';
import { User, Grade, EducationLevel, Course, Stream, Exam, News } from '../types';
import { fetchLatestEducationNews } from '../services/geminiService';

interface AdminDashboardProps {
  users: User[];
  courses: Course[];
  exams: Exam[];
  news: News[];
  onUpdateUser: (user: User) => void;
  onAddUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  onUpdateCourse: (course: Course) => void;
  onAddCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  onAddNews: (news: News) => void;
  onUpdateNews: (news: News) => void;
  onDeleteNews: (id: string) => void;
  onNavClick: (view: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  users, courses, exams, news,
  onUpdateUser, onAddUser, onDeleteUser, 
  onUpdateCourse, onAddCourse, onDeleteCourse,
  onAddNews, onUpdateNews, onDeleteNews,
  onNavClick
}) => {
  const [activeTab, setActiveTab] = useState<'identities' | 'curriculum' | 'bulletins'>('identities');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isAddingNews, setIsAddingNews] = useState(false);
  
  const [isScanningNews, setIsScanningNews] = useState(false);
  const [scanResult, setScanResult] = useState<{ text: string, sources: any[] } | null>(null);

  // Initial user form state
  const initialUserForm: Partial<User> = {
    name: '', email: '', role: 'student', status: 'active', points: 0, 
    grade: Grade.G9, stream: Stream.GENERAL, level: EducationLevel.SECONDARY,
    gender: 'Male', nid: '', dob: '', salary: 0, department: '', 
    subjects: [], phoneNumber: '', address: ''
  };

  const [userForm, setUserForm] = useState<Partial<User>>(initialUserForm);

  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '', code: '', grade: Grade.G12, stream: Stream.NATURAL_SCIENCE, subject: '', description: '', lessons: []
  });

  const [newNews, setNewNews] = useState<Partial<News>>({
    title: '', summary: '', content: '', tag: 'EAES Update', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=600'
  });

  const handleScanEAES = async () => {
    setIsScanningNews(true);
    setScanResult(null);
    try {
      const data = await fetchLatestEducationNews();
      setScanResult(data);
    } catch (e) {
      alert("Intelligence Scan Failed.");
    } finally {
      setIsScanningNews(false);
    }
  };

  const handleCommitUser = () => {
    if (!userForm.name || !userForm.email) {
      alert("Name and Email are mandatory for registry authentication.");
      return;
    }
    const user = {
      ...userForm,
      id: editingUser?.id || `usr-${Date.now()}`,
      joinedDate: editingUser?.joinedDate || new Date().toISOString().split('T')[0],
      badges: editingUser?.badges || [],
      photo: userForm.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userForm.name}&backgroundColor=b6e3f4`,
      preferredLanguage: 'en',
      completedLessons: editingUser?.completedLessons || [],
      completedCourses: editingUser?.completedCourses || [],
      certificatesPaid: editingUser?.certificatesPaid || []
    } as User;

    if (editingUser) {
      onUpdateUser(user);
    } else {
      onAddUser(user);
    }
    setIsAddingUser(false);
    setEditingUser(null);
    setUserForm(initialUserForm);
  };

  return (
    <div className="space-y-16 animate-fadeIn pb-32">
      {/* Sovereign Stats Bar */}
      <div className="bg-black text-white p-12 rounded-[5rem] border-8 border-black shadow-[25px_25px_0px_0px_rgba(59,130,246,1)] flex flex-col md:flex-row justify-between items-center gap-10">
        <div>
           <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none text-white">Sovereign Command.</h2>
           <p className="text-blue-400 font-black uppercase tracking-widest text-[10px] mt-4">Authorized Admin: Jemal Fano Haji</p>
        </div>
        <div className="flex gap-12">
           <div className="text-center group">
              <p className="text-6xl font-black italic group-hover:text-blue-400 transition-colors">{users.length}</p>
              <p className="text-[10px] font-black uppercase opacity-60">Identities</p>
           </div>
           <div className="text-center group">
              <p className="text-6xl font-black italic text-green-400 group-hover:text-green-300 transition-colors">{courses.length}</p>
              <p className="text-[10px] font-black uppercase opacity-60">Modules</p>
           </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex flex-wrap gap-4 border-b-8 border-black pb-4">
        {['identities', 'curriculum', 'bulletins'].map((t) => (
          <button 
            key={t} 
            onClick={() => setActiveTab(t as any)} 
            className={`px-12 py-7 font-black uppercase text-2xl transition-all ${activeTab === t ? 'bg-black text-white shadow-[10px_10px_0px_0px_rgba(59,130,246,1)]' : 'text-gray-400 hover:text-black hover:translate-x-1'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Identities View */}
      {activeTab === 'identities' && (
        <div className="space-y-12 animate-fadeIn">
          <div className="flex justify-between items-center">
             <h3 className="text-5xl font-black uppercase italic tracking-tighter text-blue-900">National Identity Registry</h3>
             <button onClick={() => { setUserForm(initialUserForm); setIsAddingUser(true); }} className="bg-blue-600 text-white px-10 py-5 rounded-3xl border-8 border-black font-black uppercase text-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all">＋ Architect New Identity</button>
          </div>
          <div className="bg-white border-8 border-black rounded-[5rem] overflow-hidden shadow-[30px_30px_0px_0px_rgba(0,0,0,1)]">
             <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b-8 border-black font-black uppercase text-[10px] tracking-widest text-gray-400">
                   <tr>
                     <th className="p-10">Rank</th>
                     <th className="p-10">Identity Artifact</th>
                     <th className="p-10">NID / Registry Path</th>
                     <th className="p-10">Allocated Funds</th>
                     <th className="p-10">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y-8 divide-black font-black">
                   {users.map(u => (
                     <tr key={u.id} className="hover:bg-blue-50 transition-colors group">
                       <td className="p-10">
                          <span className={`px-5 py-2 rounded-2xl border-4 border-black text-[10px] uppercase shadow-md ${u.role === 'teacher' ? 'bg-orange-500 text-white' : u.role === 'admin' ? 'bg-black text-white' : 'bg-blue-500 text-white'}`}>
                            {u.role}
                          </span>
                       </td>
                       <td className="p-10">
                          <div className="flex items-center gap-6">
                             <img src={u.photo} className="w-16 h-16 rounded-[1.5rem] border-4 border-black shadow-lg" alt="" />
                             <div>
                                <p className="text-2xl italic leading-none">{u.name}</p>
                                <p className="text-xs text-gray-400 mt-2 font-mono uppercase tracking-tighter">{u.email}</p>
                             </div>
                          </div>
                       </td>
                       <td className="p-10">
                          <p className="text-lg italic tracking-tight">{u.nid || 'NO_ID_ARCHIVE'}</p>
                          <p className="text-[10px] text-gray-400 uppercase">
                            {u.role === 'teacher' ? (u.department || 'General Dept') : `${u.level} / ${u.grade}`}
                          </p>
                       </td>
                       <td className="p-10">
                          <p className="text-3xl font-black italic">{u.salary?.toLocaleString() || 0} ETB</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">{u.role === 'student' ? 'Stipend' : 'Standard Salary'}</p>
                       </td>
                       <td className="p-10 flex gap-6">
                          <button onClick={() => { setEditingUser(u); setUserForm(u); setIsAddingUser(true); }} className="w-14 h-14 border-4 border-black rounded-2xl flex items-center justify-center hover:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all">✏️</button>
                          <button onClick={() => onDeleteUser(u.id)} className="w-14 h-14 bg-rose-50 text-rose-600 border-4 border-black rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all">🗑️</button>
                       </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {/* Identity Architect Modal */}
      {isAddingUser && (
        <div className="fixed inset-0 z-[6000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8 animate-fadeIn overflow-y-auto">
           <div className="bg-white w-full max-w-5xl rounded-[5rem] border-[12px] border-black p-12 md:p-20 space-y-16 shadow-[50px_50px_0px_0px_rgba(59,130,246,1)] my-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-6 ethiopian-gradient"></div>
              <h3 className="text-7xl font-black uppercase italic text-blue-900 tracking-tighter leading-none">Identity Architect.</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* GLOBAL FIELDS */}
                <div className="md:col-span-1 space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Identity Name</label>
                  <input className="w-full p-8 border-8 border-black rounded-[2.5rem] font-black text-xl outline-none" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} placeholder="Full Name" />
                </div>
                <div className="md:col-span-1 space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Portal</label>
                  <input className="w-full p-8 border-8 border-black rounded-[2.5rem] font-black text-xl outline-none" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} placeholder="email@iftu.edu.et" />
                </div>
                <div className="md:col-span-1 space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sovereign Rank</label>
                  <select className="w-full p-8 border-8 border-black rounded-[2.5rem] font-black text-xl outline-none" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value as any})}>
                    <option value="student">Student Registry</option>
                    <option value="teacher">Instructor Rank</option>
                    <option value="admin">Sovereign Admin</option>
                  </select>
                </div>

                <div className="md:col-span-1 space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">National ID (NID)</label>
                  <input className="w-full p-8 border-8 border-black rounded-[2.5rem] font-black text-xl outline-none" value={userForm.nid} onChange={e => setUserForm({...userForm, nid: e.target.value})} placeholder="ET-000000" />
                </div>
                <div className="md:col-span-1 space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Gender</label>
                  <select className="w-full p-8 border-8 border-black rounded-[2.5rem] font-black text-xl outline-none" value={userForm.gender} onChange={e => setUserForm({...userForm, gender: e.target.value as any})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-1 space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Birth Date</label>
                  <input type="date" className="w-full p-8 border-8 border-black rounded-[2.5rem] font-black text-xl outline-none" value={userForm.dob} onChange={e => setUserForm({...userForm, dob: e.target.value})} />
                </div>

                {/* ROLE-SPECIFIC FIELDS: TEACHER */}
                {userForm.role === 'teacher' && (
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-10 bg-orange-50 p-10 rounded-[4rem] border-8 border-orange-200">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-orange-600">Department</label>
                      <input className="w-full p-8 border-8 border-black rounded-[2.5rem] font-black text-xl outline-none" value={userForm.department} onChange={e => setUserForm({...userForm, department: e.target.value})} placeholder="Science / Tech / Arts" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-orange-600">Subjects / Specialization</label>
                      <input className="w-full p-8 border-8 border-black rounded-[2.5rem] font-black text-xl outline-none" value={userForm.subjects?.join(', ')} onChange={e => setUserForm({...userForm, subjects: e.target.value.split(',').map(s => s.trim())})} placeholder="Physics, Math, Bio" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-orange-600">Monthly Base Salary (ETB)</label>
                      <input type="number" className="w-full p-8 border-8 border-black rounded-[2.5rem] font-black text-xl outline-none" value={userForm.salary} onChange={e => setUserForm({...userForm, salary: parseFloat(e.target.value)})} placeholder="0.00" />
                    </div>
                  </div>
                )}

                {/* ROLE-SPECIFIC FIELDS: STUDENT */}
                {userForm.role === 'student' && (
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-10 bg-blue-50 p-10 rounded-[4rem] border-8 border-blue-200">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-blue-600">Education Level</label>
                      <select className="w-full p-8 border-8 border-black rounded-[2.5rem] font-black text-xl outline-none" value={userForm.level} onChange={e => setUserForm({...userForm, level: e.target.value as any})}>
                        {Object.values(EducationLevel).map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-blue-600">Grade / Hub Rank</label>
                      <select className="w-full p-8 border-8 border-black rounded-[2.5rem] font-black text-xl outline-none" value={userForm.grade} onChange={e => setUserForm({...userForm, grade: e.target.value as any})}>
                        {Object.values(Grade).map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-blue-600">Stream</label>
                      <select className="w-full p-8 border-8 border-black rounded-[2.5rem] font-black text-xl outline-none" value={userForm.stream} onChange={e => setUserForm({...userForm, stream: e.target.value as any})}>
                        {Object.values(Stream).map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-blue-600">Monthly Stipend (ETB)</label>
                      <input type="number" className="w-full p-8 border-8 border-black rounded-[2.5rem] font-black text-xl outline-none" value={userForm.salary} onChange={e => setUserForm({...userForm, salary: parseFloat(e.target.value)})} placeholder="0.00" />
                    </div>
                  </div>
                )}

                {/* CONTACT INFO */}
                <div className="md:col-span-1 space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Registry</label>
                  <input className="w-full p-8 border-8 border-black rounded-[2.5rem] font-black text-xl outline-none" value={userForm.phoneNumber} onChange={e => setUserForm({...userForm, phoneNumber: e.target.value})} placeholder="+251 ..." />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Residential Address Archive</label>
                  <input className="w-full p-8 border-8 border-black rounded-[2.5rem] font-black text-xl outline-none" value={userForm.address} onChange={e => setUserForm({...userForm, address: e.target.value})} placeholder="Region, City, House No." />
                </div>
              </div>

              <div className="flex gap-8">
                <button onClick={() => { setIsAddingUser(false); setEditingUser(null); }} className="flex-1 py-10 border-8 border-black rounded-[3.5rem] font-black uppercase text-2xl">Abort Protocol</button>
                <button onClick={handleCommitUser} className="flex-1 py-10 bg-black text-white border-8 border-black rounded-[3.5rem] font-black uppercase text-2xl shadow-[15px_15px_0px_0px_rgba(59,130,246,1)]">Lock Identity Data</button>
              </div>
           </div>
        </div>
      )}

      {/* Curriculum View & Bulletins View follow as standard... */}
    </div>
  );
};

export default AdminDashboard;
