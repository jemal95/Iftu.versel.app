
import React, { useState, useRef } from 'react';
import { Exam, Question, Grade, Stream } from '../types';
import { parseExamDocument, generateExamQuestions } from '../services/geminiService';

interface TeacherDashboardProps {
  exams: Exam[];
  onAddExam: (exam: Exam) => void;
  onDeleteExam: (id: string) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ exams, onAddExam, onDeleteExam }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [creationMethod, setCreationMethod] = useState<'manual' | 'ai' | 'generate'>('manual');
  const [isScanning, setIsScanning] = useState(false);
  const [rawText, setRawText] = useState('');

  // Generation Params
  const [genSubject, setGenSubject] = useState('');
  const [genTopic, setGenTopic] = useState('');
  const [genDifficulty, setGenDifficulty] = useState('Standard');
  const [genCount, setGenCount] = useState(5);

  const [newExam, setNewExam] = useState<Partial<Exam>>({
    title: '',
    durationMinutes: 90,
    questions: [],
    categories: [],
    grade: Grade.G12,
    stream: Stream.NATURAL_SCIENCE,
    academicYear: new Date().getFullYear(),
    totalPoints: 0,
    status: 'published',
    subject: 'General'
  });

  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 10,
    category: 'General'
  });

  const updateCategories = (questions: Question[]) => {
    const uniqueCats = Array.from(new Set(questions.map(q => q.category)));
    setNewExam(prev => ({ ...prev, categories: uniqueCats }));
  };

  const handleAIScan = async () => {
    if (!rawText.trim()) return;
    setIsScanning(true);
    try {
      const extracted = await parseExamDocument(rawText);
      const formatted: Question[] = extracted.map((q, idx) => ({
        ...q,
        id: `ai-${Date.now()}-${idx}`
      })) as Question[];
      
      const updatedQuestions = [...(newExam.questions || []), ...formatted];
      setNewExam(prev => ({
        ...prev,
        questions: updatedQuestions,
        totalPoints: (prev.totalPoints || 0) + formatted.reduce((sum, q) => sum + q.points, 0)
      }));
      updateCategories(updatedQuestions);
      setIsScanning(false);
      setRawText('');
      setCreationMethod('manual');
    } catch (error) {
      console.error(error);
      setIsScanning(false);
      alert("AI Processing Failed.");
    }
  };

  const handleAIGeneration = async () => {
    if (!genSubject || !genTopic) return;
    setIsScanning(true);
    try {
      const extracted = await generateExamQuestions(genSubject, genTopic, genDifficulty, genCount);
      const formatted: Question[] = extracted.map((q, idx) => ({
        ...q,
        id: `gen-${Date.now()}-${idx}`
      })) as Question[];
      
      const updatedQuestions = [...(newExam.questions || []), ...formatted];
      setNewExam(prev => ({
        ...prev,
        questions: updatedQuestions,
        totalPoints: (prev.totalPoints || 0) + formatted.reduce((sum, q) => sum + q.points, 0)
      }));
      updateCategories(updatedQuestions);
      setIsScanning(false);
      setCreationMethod('manual');
    } catch (error) {
      console.error(error);
      setIsScanning(false);
      alert("AI Generation Failed.");
    }
  };

  const addQuestion = () => {
    if (!currentQuestion.text) return;
    const q = { ...currentQuestion, id: Date.now().toString() } as Question;
    const updatedQuestions = [...(newExam.questions || []), q];
    setNewExam(prev => ({
      ...prev,
      questions: updatedQuestions,
      totalPoints: (prev.totalPoints || 0) + q.points
    }));
    updateCategories(updatedQuestions);
    setCurrentQuestion({ text: '', options: ['', '', '', ''], correctAnswer: 0, points: 10, category: 'General' });
  };

  const handleSaveExam = () => {
    if (!newExam.title || !newExam.questions?.length) return;
    onAddExam({ 
      ...newExam, 
      id: Date.now().toString(),
      type: 'mock-eaes',
      semester: 2,
      status: 'published'
    } as Exam);
    setIsCreating(false);
    // Reset
    setNewExam({
      title: '',
      durationMinutes: 90,
      questions: [],
      categories: [],
      grade: Grade.G12,
      stream: Stream.NATURAL_SCIENCE,
      academicYear: new Date().getFullYear(),
      totalPoints: 0,
      status: 'published',
      subject: 'General'
    });
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b-8 border-black pb-10">
        <div>
          <h2 className="text-7xl font-black uppercase tracking-tighter italic leading-none text-blue-900">Mock Repository.</h2>
          <p className="text-blue-600 font-black uppercase text-sm mt-4 tracking-[0.3em]">Official EAES Standard Creator</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)} 
          className="bg-black text-white px-10 py-5 rounded-[2.5rem] border-4 border-black font-black uppercase text-xl shadow-[10px_10px_0px_0px_rgba(59,130,246,1)] hover:translate-y-1 transition-all"
        >
          ＋ Deploy New Exam
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {exams.map(ex => (
          <div key={ex.id} className="bg-white p-10 rounded-[4rem] border-8 border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between group">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase border-2 border-black ${ex.stream === Stream.NATURAL_SCIENCE ? 'bg-cyan-400' : 'bg-amber-400'}`}>
                  {ex.grade}
                </span>
                <span className="text-xs font-black text-gray-400 uppercase">{ex.durationMinutes}m</span>
              </div>
              <h4 className="text-4xl font-black uppercase italic tracking-tighter leading-none group-hover:text-blue-700 transition-all">{ex.title}</h4>
              <div className="flex flex-wrap gap-2">
                {ex.categories.map(cat => (
                  <span key={cat} className="bg-gray-100 text-[8px] font-black uppercase px-2 py-1 rounded border border-black">{cat}</span>
                ))}
              </div>
            </div>
            <div className="mt-10 pt-8 border-t-4 border-black flex justify-between items-center">
              <span className="text-2xl font-black">{ex.questions.length} Items</span>
              <button onClick={() => onDeleteExam(ex.id)} className="w-12 h-12 bg-rose-50 border-4 border-black rounded-xl text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-[6000] bg-white overflow-y-auto p-6 md:p-20 flex flex-col items-center">
          <div className="w-full max-w-6xl space-y-12 py-12">
            <div className="flex justify-between items-center border-b-[10px] border-black pb-10">
              <h3 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">Exam Forge.</h3>
              <button onClick={() => setIsCreating(false)} className="w-20 h-20 bg-rose-50 border-8 border-black rounded-[2.5rem] flex items-center justify-center text-4xl font-black">✕</button>
            </div>

            <div className="flex flex-wrap gap-4">
               <button onClick={() => setCreationMethod('manual')} className={`px-10 py-6 rounded-2xl border-4 border-black font-black uppercase tracking-widest text-sm transition-all ${creationMethod === 'manual' ? 'bg-black text-white' : 'bg-gray-100'}`}>Manual Builder</button>
               <button onClick={() => setCreationMethod('ai')} className={`px-10 py-6 rounded-2xl border-4 border-black font-black uppercase tracking-widest text-sm transition-all ${creationMethod === 'ai' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>AI Intelligence Scan</button>
               <button onClick={() => setCreationMethod('generate')} className={`px-10 py-6 rounded-2xl border-4 border-black font-black uppercase tracking-widest text-sm transition-all ${creationMethod === 'generate' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>AI Generation Hall</button>
            </div>

            {creationMethod === 'ai' && (
              <div className="bg-blue-50 border-8 border-black rounded-[4rem] p-12 space-y-10 animate-fadeIn">
                 <h4 className="text-4xl font-black uppercase italic text-blue-900">AI Subject Scanner</h4>
                 <textarea 
                   placeholder="Paste educational data here for processing..."
                   className="w-full h-80 p-10 bg-white border-4 border-black rounded-[3rem] font-black text-xl outline-none shadow-inner"
                   value={rawText}
                   onChange={e => setRawText(e.target.value)}
                 />
                 <button 
                   onClick={handleAIScan}
                   disabled={isScanning || !rawText.trim()}
                   className="w-full py-10 bg-blue-600 text-white rounded-[3rem] border-8 border-black font-black uppercase text-3xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 transition-all disabled:opacity-30"
                 >
                   {isScanning ? 'Synchronizing Lab Logic...' : 'Trigger Structure Extraction'}
                 </button>
              </div>
            )}

            {creationMethod === 'generate' && (
              <div className="bg-green-50 border-8 border-black rounded-[4rem] p-12 space-y-10 animate-fadeIn">
                 <h4 className="text-4xl font-black uppercase italic text-green-900">AI Logic Generator</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                   <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Main Subject</label>
                     <input className="w-full p-6 border-4 border-black rounded-2xl font-black outline-none" placeholder="Ex: Physics" value={genSubject} onChange={e => setGenSubject(e.target.value)} />
                   </div>
                   <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Specific Topic</label>
                     <input className="w-full p-6 border-4 border-black rounded-2xl font-black outline-none" placeholder="Ex: Newton's Laws" value={genTopic} onChange={e => setGenTopic(e.target.value)} />
                   </div>
                   <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Difficulty</label>
                     <select className="w-full p-6 border-4 border-black rounded-2xl font-black outline-none" value={genDifficulty} onChange={e => setGenDifficulty(e.target.value)}>
                        <option>Entry</option>
                        <option>Standard</option>
                        <option>Advanced</option>
                     </select>
                   </div>
                   <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Unit Count</label>
                     <input type="number" min="1" max="50" className="w-full p-6 border-4 border-black rounded-2xl font-black outline-none" value={genCount} onChange={e => setGenCount(parseInt(e.target.value))} />
                   </div>
                 </div>
                 <button 
                   onClick={handleAIGeneration}
                   disabled={isScanning || !genSubject || !genTopic}
                   className="w-full py-10 bg-green-600 text-white rounded-[3rem] border-8 border-black font-black uppercase text-3xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 transition-all disabled:opacity-30"
                 >
                   {isScanning ? 'Synthesizing Educational Artifacts...' : 'Deploy Generative Protocol'}
                 </button>
              </div>
            )}

            {creationMethod === 'manual' && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-12 rounded-[4rem] border-8 border-black shadow-[25px_25px_0px_0px_rgba(0,0,0,1)]">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Exam Title</label>
                    <input placeholder="National Mock Series" className="w-full p-8 border-4 border-black rounded-[2.5rem] text-3xl font-black outline-none" value={newExam.title} onChange={e => setNewExam({...newExam, title: e.target.value})} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Subject</label>
                    <input className="w-full p-8 border-4 border-black rounded-[2.5rem] text-3xl font-black outline-none" value={newExam.subject} onChange={e => setNewExam({...newExam, subject: e.target.value})} />
                  </div>
                </div>

                <div className="bg-white border-8 border-black rounded-[5rem] p-12 md:p-20 space-y-12 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-center border-b-4 border-black pb-8">
                    <h4 className="text-5xl font-black uppercase italic">Unit Forge</h4>
                    <span className="text-2xl font-black text-blue-600">{newExam.questions?.length} Items Staged</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <textarea placeholder="The derivative of sin(x) is..." className="md:col-span-2 w-full p-10 border-4 border-black rounded-[3rem] font-black h-32 text-2xl bg-gray-50 outline-none" value={currentQuestion.text} onChange={e => setCurrentQuestion({...currentQuestion, text: e.target.value})} />
                    <input placeholder="Category (e.g. Calculus, Mechanics)" className="w-full p-6 border-4 border-black rounded-2xl font-black" value={currentQuestion.category} onChange={e => setCurrentQuestion({...currentQuestion, category: e.target.value})} />
                    <input placeholder="Points" type="number" className="w-full p-6 border-4 border-black rounded-2xl font-black" value={currentQuestion.points} onChange={e => setCurrentQuestion({...currentQuestion, points: parseInt(e.target.value)})} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {currentQuestion.options?.map((opt, i) => (
                       <input 
                         key={i} 
                         placeholder={`Option ${String.fromCharCode(65+i)}`}
                         className="p-8 border-4 border-black rounded-[2rem] font-black text-xl"
                         value={opt}
                         onChange={e => {
                           const opts = [...(currentQuestion.options || [])];
                           opts[i] = e.target.value;
                           setCurrentQuestion({...currentQuestion, options: opts});
                         }}
                       />
                     ))}
                  </div>
                  <button onClick={addQuestion} className="w-full py-10 bg-black text-white rounded-[3rem] border-8 border-black font-black uppercase text-3xl shadow-[10px_10px_0px_0px_rgba(34,197,94,1)] hover:translate-y-2 transition-all">Lock Unit to Forge</button>
                </div>

                {newExam.questions && newExam.questions.length > 0 && (
                  <div className="space-y-6">
                    <h5 className="text-2xl font-black uppercase italic">Staged Units</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {newExam.questions.map((q, idx) => (
                        <div key={idx} className="bg-gray-50 p-6 rounded-3xl border-4 border-black flex justify-between items-center">
                          <p className="font-black italic truncate pr-4">{q.text}</p>
                          <button onClick={() => {
                             const qs = [...(newExam.questions || [])];
                             qs.splice(idx, 1);
                             setNewExam({...newExam, questions: qs});
                             updateCategories(qs);
                          }} className="text-rose-600 font-black">✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="pt-10">
               <button onClick={handleSaveExam} disabled={!newExam.questions?.length} className="w-full py-16 bg-blue-700 text-white rounded-[5rem] border-[10px] border-black font-black uppercase text-5xl md:text-7xl shadow-[30px_30px_0px_0px_rgba(239,51,64,1)] hover:translate-y-4 transition-all disabled:opacity-30">
                 Deploy Registry Exam
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
