
import React, { useState } from 'react';
import { Grade, Stream, EducationLevel, User } from '../types';

interface RegistrationPortalProps {
  onRegister: (user: User) => void;
  onCancel: () => void;
}

const RegistrationPortal: React.FC<RegistrationPortalProps> = ({ onRegister, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nid: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    dob: '',
    level: EducationLevel.SECONDARY,
    grade: Grade.G9,
    stream: Stream.GENERAL,
    school: '',
    phoneNumber: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.nid) {
      alert("NID, Full Name, and Email are strictly required for National Registry Authentication.");
      return;
    }
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      nid: formData.nid,
      gender: formData.gender,
      dob: formData.dob,
      role: 'student',
      status: 'active',
      grade: formData.grade,
      stream: formData.stream,
      level: formData.level,
      school: formData.school,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      salary: 250, // Initial National Stipend
      points: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      preferredLanguage: 'en',
      badges: [],
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}&backgroundColor=b6e3f4`,
      completedLessons: [],
      completedExams: [],
      completedCourses: [],
      certificatesPaid: []
    };
    onRegister(newUser);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 animate-fadeIn">
      <div className="bg-white p-12 md:p-24 rounded-[5rem] border-[10px] border-black shadow-[35px_35px_0px_0px_rgba(0,155,68,1)] space-y-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-8 ethiopian-gradient"></div>
        
        <div className="text-center space-y-6">
          <h2 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-none">Enroll.</h2>
          <p className="text-xl font-black text-gray-400 uppercase tracking-widest italic">Official IFTU National Registry Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* PRIMARY IDENTITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-gray-50 p-10 rounded-[4rem] border-4 border-black">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Legal Full Name</label>
              <input required className="w-full p-8 border-4 border-black rounded-[2.5rem] font-black text-xl outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Legal Identity Name" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Portal Email</label>
              <input required type="email" className="w-full p-8 border-4 border-black rounded-[2.5rem] font-black text-xl outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="example@iftu.edu.et" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">National ID (NID)</label>
              <input required className="w-full p-8 border-4 border-black rounded-[2.5rem] font-black text-xl outline-none" placeholder="ET-2025-XXXX" value={formData.nid} onChange={e => setFormData({...formData, nid: e.target.value})} />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Registry Gender</label>
              <select className="w-full p-8 border-4 border-black rounded-[2.5rem] font-black text-xl outline-none" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* ACADEMIC ROUTING */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Registry Level</label>
              <select className="w-full p-8 border-4 border-black rounded-[2rem] font-black text-lg outline-none" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value as any})}>
                {Object.values(EducationLevel).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Grade / Hub</label>
              <select className="w-full p-8 border-4 border-black rounded-[2rem] font-black text-lg outline-none" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value as any})}>
                {Object.values(Grade).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Stream Allocation</label>
              <select className="w-full p-8 border-4 border-black rounded-[2rem] font-black text-lg outline-none" value={formData.stream} onChange={e => setFormData({...formData, stream: e.target.value as any})}>
                {Object.values(Stream).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          {/* CONTACT & RESIDENCE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Identity DOB</label>
              <input type="date" className="w-full p-8 border-4 border-black rounded-[2.5rem] font-black text-xl outline-none" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Registry Phone</label>
              <input className="w-full p-8 border-4 border-black rounded-[2.5rem] font-black text-xl outline-none" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} placeholder="+251 ..." />
            </div>
            <div className="md:col-span-2 space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Residential Address Archive</label>
              <textarea className="w-full p-8 border-4 border-black rounded-[3rem] font-black text-xl outline-none h-40" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Woreda, House No, Region, City..." />
            </div>
          </div>

          <div className="flex flex-col gap-6 pt-10">
            <button type="submit" className="w-full py-12 bg-black text-white border-8 border-black rounded-[4rem] font-black uppercase text-4xl shadow-[15px_15px_0px_0px_rgba(59,130,246,1)] hover:translate-y-2 transition-all">Authenticate & Enroll</button>
            <button type="button" onClick={onCancel} className="text-xl font-black uppercase italic text-gray-400">Cancel & Return to Hall</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPortal;
