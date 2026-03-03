
import React, { useState, useRef, useEffect } from 'react';
import { askTutor } from '../services/geminiService';
// Modality is part of @google/genai, not types.ts
import { Language } from '../types';
import { GoogleGenAI, Modality } from "@google/genai";

const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Salam! I am IFTU AI. How can I assist with your Ethiopian National Curriculum (EAES) studies today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    const response = await askTutor(userMsg, lang);
    setMessages(prev => [...prev, { role: 'ai', text: response || 'Failed to connect.' }]);
    setIsLoading(false);
  };

  const speakResponse = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      // Use named parameter and ensure API_KEY is from process.env
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say clearly in a professional educational tone: ${text}` }] }],
        config: {
          // Use the correct Modality enum from @google/genai
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
        
        // Handling raw PCM bytes returned from Gemini TTS
        const dataInt16 = new Int16Array(bytes.buffer);
        const frameCount = dataInt16.length;
        const buffer = audioCtx.createBuffer(1, frameCount, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i] / 32768.0;

        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error("TTS Error:", err);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[800px] flex flex-col bg-white rounded-[4rem] border-8 border-black shadow-[24px_24px_0px_0px_rgba(59,130,246,1)] overflow-hidden animate-fadeIn">
      <div className="p-8 md:p-12 bg-blue-600 text-white border-b-8 border-black flex justify-between items-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-2 ethiopian-gradient"></div>
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl border-4 border-black flex items-center justify-center text-4xl shadow-lg">🧠</div>
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter italic">National AI Lab</h3>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Sovereign Knowledge Engine v4.0</p>
            </div>
         </div>
         <div className="flex gap-4">
            {(['en', 'am', 'om'] as Language[]).map(l => (
              <button 
                key={l}
                onClick={() => setLang(l)}
                className={`w-12 h-12 rounded-xl border-4 border-black font-black uppercase text-xs transition-all ${lang === l ? 'bg-yellow-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-gray-400'}`}
              >
                {l}
              </button>
            ))}
         </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative group max-w-[85%] p-8 rounded-[3rem] border-4 border-black shadow-xl font-black text-xl leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none'}`}>
              {m.text}
              {m.role === 'ai' && (
                <button 
                  onClick={() => speakResponse(m.text)}
                  disabled={isSpeaking}
                  className="absolute -bottom-4 -right-4 w-12 h-12 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center text-xl shadow-lg hover:scale-110 active:scale-95 transition-all disabled:grayscale"
                >
                  {isSpeaking ? '⏳' : '🔊'}
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-6 rounded-3xl border-4 border-black flex gap-2 shadow-lg animate-pulse">
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
             </div>
          </div>
        )}
      </div>

      <div className="p-8 md:p-12 bg-white border-t-8 border-black">
        <div className="flex gap-6">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Interrogate the National Registry..."
            className="flex-1 bg-gray-50 border-4 border-black rounded-[2.5rem] px-10 py-8 font-black text-2xl outline-none focus:bg-white transition-all shadow-inner"
          />
          <button onClick={handleSend} disabled={isLoading} className="bg-blue-600 text-white w-24 h-24 md:w-32 md:h-24 rounded-[2.5rem] border-4 border-black flex items-center justify-center text-5xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all disabled:opacity-50">
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
