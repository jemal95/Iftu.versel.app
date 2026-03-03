import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

interface LiveInterviewerProps {
  topic: string;
  onComplete: (score: number) => void;
  onCancel: () => void;
}

const LiveInterviewer: React.FC<LiveInterviewerProps> = ({ topic, onComplete, onCancel }) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'active' | 'finished'>('idle');
  const [transcript, setTranscript] = useState<{ role: 'ai' | 'user', text: string }[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  const startSession = async () => {
    setStatus('connecting');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const outputCtx = audioContextRef.current;

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          setStatus('active');
          navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            const inputCtx = new AudioContext({ sampleRate: 16000 });
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob: Blob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          });
        },
        onmessage: async (message: LiveServerMessage) => {
          if (message.serverContent?.outputTranscription) {
            const text = message.serverContent.outputTranscription.text;
            setTranscript(prev => [...prev, { role: 'ai', text }]);
          } else if (message.serverContent?.inputTranscription) {
            const text = message.serverContent.inputTranscription.text;
            setTranscript(prev => [...prev, { role: 'user', text }]);
          }

          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
            const source = outputCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputCtx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
          }
        },
        onclose: () => setStatus('finished'),
        onerror: (e) => { console.error(e); setStatus('idle'); }
      },
      config: {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {},
        inputAudioTranscription: {},
        systemInstruction: `You are a TVET Technical Auditor. Conduct a live oral examination on the topic: ${topic}. Ask one technical question at a time, listen to the student's response, and provide immediate feedback. End the session by saying "Assessment Concluded" when finished.`
      }
    });

    sessionRef.current = await sessionPromise;
  };

  return (
    <div className="bg-white border-8 border-black rounded-[4rem] p-12 md:p-20 space-y-12 shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] text-center animate-fadeIn">
      {status === 'idle' && (
        <div className="space-y-10">
          <div className="text-9xl">🎙️</div>
          <h3 className="text-5xl font-black uppercase italic tracking-tighter">Live Oral Audit</h3>
          <p className="text-xl font-bold text-gray-500 uppercase">Topic: {topic}</p>
          <button onClick={startSession} className="px-16 py-8 bg-blue-600 text-white rounded-[2.5rem] border-8 border-black font-black uppercase text-2xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 transition-all">Begin Examination</button>
        </div>
      )}

      {status === 'connecting' && (
        <div className="py-20 animate-pulse space-y-8">
           <div className="w-24 h-24 border-[10px] border-black border-t-blue-600 rounded-full animate-spin mx-auto"></div>
           <p className="text-2xl font-black uppercase italic tracking-tighter">Initializing Sovereign Audio Stream...</p>
        </div>
      )}

      {status === 'active' && (
        <div className="space-y-12">
          <div className="flex justify-between items-center bg-rose-50 border-4 border-black p-6 rounded-[2rem]">
            <div className="flex items-center gap-4">
               <div className="w-4 h-4 bg-rose-600 rounded-full animate-pulse"></div>
               <span className="font-black uppercase text-xs tracking-widest text-rose-600">Secure Live Stream: Active</span>
            </div>
            <button onClick={() => sessionRef.current?.close()} className="text-xs font-black uppercase text-gray-400 hover:text-black">Terminate Audit</button>
          </div>
          
          <div className="h-[450px] overflow-y-auto space-y-6 p-8 bg-gray-50 rounded-[2.5rem] border-4 border-black text-left font-bold italic text-lg leading-relaxed shadow-inner">
             {transcript.length === 0 ? (
               <div className="h-full flex items-center justify-center opacity-30 italic">Establishing auditor dialogue...</div>
             ) : transcript.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                 <div className={`max-w-[80%] px-6 py-4 rounded-3xl border-2 border-black ${m.role === 'ai' ? 'bg-white shadow-sm' : 'bg-blue-600 text-white shadow-md'}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">{m.role === 'ai' ? 'Auditor' : 'Candidate'}</p>
                    <p>{m.text}</p>
                 </div>
               </div>
             ))}
          </div>

          <div className="flex justify-center gap-8">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl animate-bounce">👂</div>
            <p className="text-xl font-black uppercase italic tracking-tighter flex items-center">The Auditor is Listening...</p>
          </div>
        </div>
      )}

      {status === 'finished' && (
        <div className="space-y-10 animate-bounceIn">
          <div className="text-9xl">🏛️</div>
          <h3 className="text-6xl font-black uppercase italic text-green-600">Audit Concluded.</h3>
          <p className="text-xl font-black">Your oral competency data has been cataloged.</p>
          <button onClick={() => onComplete(95)} className="px-16 py-8 bg-black text-white rounded-[2.5rem] border-8 border-black font-black uppercase text-2xl shadow-[10px_10px_0px_0px_rgba(0,155,68,1)] hover:translate-y-2 transition-all">Submit Registry Entry →</button>
        </div>
      )}
    </div>
  );
};

export default LiveInterviewer;