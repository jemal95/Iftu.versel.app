import React, { useState } from 'react';

const DevPortal: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-fadeIn pb-40">
      {/* HEADER: Only visible on screen, hidden on print if needed, but here we want it in the PDF */}
      <div className="text-center space-y-8 mb-20 no-print">
        <div className="inline-block bg-blue-600 text-white px-8 py-3 rounded-2xl border-4 border-black font-black uppercase text-xs tracking-[0.4em] shadow-xl mb-4">
          Institutional Deployment Manual
        </div>
        <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-none text-blue-900">
          Hosting <span className="liquid-spectrum-text">Protocol.</span>
        </h1>
        <p className="text-xl font-black text-gray-400 uppercase tracking-widest italic max-w-2xl mx-auto">
          Official Step-by-Step Guide for Broadcasting the IFTU LMS Sovereign Codebase to Global Nodes.
        </p>
        
        <button 
          onClick={handlePrint}
          className="mt-8 bg-black text-white px-12 py-6 rounded-[3rem] border-8 border-black font-black uppercase text-2xl shadow-[12px_12px_0px_0px_rgba(34,197,94,1)] hover:translate-y-2 hover:shadow-none transition-all"
        >
          Download Guide as PDF 📥
        </button>
      </div>

      {/* THE ACTUAL DOCUMENT: Styled for Print (PDF) */}
      <div className="bg-white border-[12px] border-black rounded-[5rem] p-12 md:p-24 shadow-[40px_40px_0px_0px_rgba(0,0,0,1)] space-y-20 relative printable-transcript">
        {/* Official Header for PDF */}
        <div className="absolute top-0 left-0 w-full h-10 ethiopian-gradient"></div>
        
        <div className="flex justify-between items-start border-b-8 border-black pb-12">
          <div className="space-y-4">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter">IFTU National Digital Center</h2>
            <p className="text-sm font-black text-blue-600 uppercase tracking-[0.3em]">Infrastructure Deployment Division</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase italic">Authorized by: Jemal Fano Haji</p>
          </div>
          <div className="w-32 h-32 bg-gray-50 border-4 border-black rounded-3xl flex items-center justify-center text-6xl shadow-inner">🏛️</div>
        </div>

        {/* SECTION 1: GITHUB PAGES */}
        <section className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-black text-white rounded-2xl border-4 border-black flex items-center justify-center text-3xl font-black italic">01</div>
            <h3 className="text-4xl font-black uppercase italic tracking-tighter">GitHub Pages Broadcast</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-8 pl-4 border-l-8 border-blue-600">
            <div className="space-y-2">
              <h4 className="text-xl font-black uppercase italic">Step 1: Repository Initialization</h4>
              <p className="text-gray-600 font-bold leading-relaxed">Login to <span className="text-black underline">GitHub.com</span>. Create a "New Repository". Name it <code>iftu-lms-portal</code>. Keep it Public to use GitHub Pages for free.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black uppercase italic">Step 2: Sync Local Code</h4>
              <p className="text-gray-600 font-bold leading-relaxed">Open your terminal in the project folder and execute:</p>
              <div className="bg-slate-900 text-green-400 p-6 rounded-2xl font-mono text-sm border-4 border-black">
                git init<br/>
                git add .<br/>
                git commit -m "Official IFTU LMS Release v1.0"<br/>
                git remote add origin [YOUR_REPO_URL]<br/>
                git push -u origin main
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black uppercase italic">Step 3: Activation</h4>
              <p className="text-gray-600 font-bold leading-relaxed">Go to Repository Settings > Pages. Under 'Branch', select <code>main</code> and click Save. Your site will be live at <code>username.github.io/iftu-lms-portal</code>.</p>
            </div>
          </div>
        </section>

        {/* SECTION 2: FIREBASE SOVEREIGNTY */}
        <section className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-yellow-400 text-black rounded-2xl border-4 border-black flex items-center justify-center text-3xl font-black italic">02</div>
            <h3 className="text-4xl font-black uppercase italic tracking-tighter">Firebase Infrastructure</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-8 pl-4 border-l-8 border-yellow-400">
            <div className="space-y-2">
              <h4 className="text-xl font-black uppercase italic">Step 1: Console Registration</h4>
              <p className="text-gray-600 font-bold leading-relaxed">Visit <span className="text-black underline">Firebase Console</span>. Create a project named <code>IFTU-LMS-SOVEREIGN</code>.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black uppercase italic">Step 2: Tool Integration</h4>
              <p className="text-gray-600 font-bold leading-relaxed">Install the Firebase CLI and initialize your directory:</p>
              <div className="bg-slate-900 text-green-400 p-6 rounded-2xl font-mono text-sm border-4 border-black">
                npm install -g firebase-tools<br/>
                firebase login<br/>
                firebase init hosting
              </div>
              <p className="text-[10px] font-black uppercase text-gray-400">Note: Select 'Single Page App' as YES during initialization.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black uppercase italic">Step 3: Global Deployment</h4>
              <p className="text-gray-600 font-bold leading-relaxed">Generate the production build and push to Firebase nodes:</p>
              <div className="bg-slate-900 text-green-400 p-6 rounded-2xl font-mono text-sm border-4 border-black">
                npm run build<br/>
                firebase deploy
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: API_KEY SECURITY */}
        <section className="bg-rose-50 border-8 border-black rounded-[3rem] p-10 space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-rose-600 text-white rounded-2xl border-4 border-black flex items-center justify-center text-3xl font-black italic">!</div>
            <h3 className="text-4xl font-black uppercase italic tracking-tighter">Critical: AI Key Logic</h3>
          </div>
          <p className="text-xl font-bold leading-relaxed italic text-rose-900">
            The Sovereign AI Tutor and Regional Intelligence require a valid Google GenAI API Key. When hosting, you MUST set the Environment Variable:
          </p>
          <div className="bg-white p-6 border-4 border-black rounded-2xl shadow-inner">
             <p className="font-mono text-2xl font-black text-center">API_KEY = [YOUR_SECRET_KEY]</p>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            For GitHub: Actions Secrets and Variables > Actions.<br/>
            For Firebase: Hosting > Environment Variables.
          </p>
        </section>

        {/* OFFICIAL ADDRESS BOX */}
        <div className="pt-20 border-t-8 border-black flex flex-col items-center space-y-6">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Central Command Headquarters</p>
           <div className="bg-gray-50 border-4 border-black p-8 rounded-[2rem] text-center space-y-2 w-full">
              <p className="text-2xl font-black italic">IFTU LMS National Digital Sovereign Education Center</p>
              <p className="text-sm font-bold text-blue-600 underline">https://goo.gl/maps/KcLgTHsz6WKtSeda7/</p>
              <p className="text-[10px] font-black uppercase text-gray-400 mt-4">Registry Authenticated (C) 2025</p>
           </div>
        </div>
      </div>

      {/* PRINT-ONLY FOOTER */}
      <div className="hidden print-only text-center py-10">
         <p className="font-black uppercase tracking-widest text-xs">End of Official Document</p>
      </div>
    </div>
  );
};

export default DevPortal;