
import React, { useState } from 'react';
import { findNearbyColleges } from '../services/geminiService';
import { NATIONAL_CENTER_INFO } from '../constants';

const CampusLocator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ text: string, places: any[] } | null>(null);
  const [type, setType] = useState<'TVET' | 'High School'>('TVET');

  const handleLocate = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const data = await findNearbyColleges(pos.coords.latitude, pos.coords.longitude, type);
        setResults(data);
        setLoading(false);
      }, (err) => {
        alert("Location access denied. Please enable GPS in your browser settings.");
        setLoading(false);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-16 animate-fadeIn px-4">
      <div className="bg-white border-[10px] border-black rounded-[5rem] p-12 md:p-20 shadow-[30px_30px_0px_0px_rgba(34,197,94,1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-4 ethiopian-gradient"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="space-y-6">
            <h2 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-none text-blue-900">Campus <br/>Locator.</h2>
            <p className="text-xl font-black text-gray-400 uppercase tracking-widest italic">Find the nearest center of excellence</p>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="flex bg-gray-100 p-2 rounded-2xl border-4 border-black">
              <button onClick={() => setType('TVET')} className={`flex-1 px-8 py-3 rounded-xl font-black uppercase text-xs transition-all ${type === 'TVET' ? 'bg-black text-white' : ''}`}>TVET</button>
              <button onClick={() => setType('High School')} className={`flex-1 px-8 py-3 rounded-xl font-black uppercase text-xs transition-all ${type === 'High School' ? 'bg-black text-white' : ''}`}>Secondary</button>
            </div>
            <button 
              onClick={handleLocate}
              disabled={loading}
              className="px-10 py-6 bg-blue-600 text-white border-4 border-black rounded-[2.5rem] font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all flex items-center justify-center gap-4"
            >
              {loading ? (
                <><div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> Interrogating Satellites...</>
              ) : 'Locate Nearest Centers'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Featured National Headquarters - Always Shown */}
        <div className="space-y-8">
          <h3 className="text-5xl font-black uppercase italic tracking-tighter text-blue-900 ml-4">National Headquarters</h3>
          <a 
            href={NATIONAL_CENTER_INFO.mapsLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block bg-blue-50 border-8 border-black rounded-[3rem] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 bg-yellow-400 border-b-4 border-l-4 border-black font-black uppercase text-[10px] tracking-widest">Primary Hub</div>
            <div className="flex justify-between items-start">
              <h4 className="text-4xl font-black uppercase italic tracking-tighter group-hover:text-blue-700">{NATIONAL_CENTER_INFO.name}</h4>
              <span className="text-4xl">🏛️</span>
            </div>
            <p className="mt-4 text-gray-600 font-bold uppercase text-[12px] tracking-widest leading-relaxed">
              {NATIONAL_CENTER_INFO.location}
            </p>
            <div className="mt-6 flex items-center gap-4 text-blue-600 font-black uppercase text-xs">
              Navigate to Command Center →
            </div>
          </a>
        </div>

        {results && (
          <div className="space-y-8 animate-fadeIn">
            <h3 className="text-5xl font-black uppercase italic tracking-tighter text-blue-900 ml-4">Registry Matches</h3>
            <div className="space-y-6">
              {results.places.length > 0 ? results.places.map((place, i) => (
                <a 
                  key={i} 
                  href={place.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-white border-8 border-black rounded-[3rem] p-8 shadow-[12px_12px_0px_0px_rgba(34,197,94,1)] hover:-translate-y-2 transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-3xl font-black uppercase italic tracking-tighter group-hover:text-blue-600">{place.title}</h4>
                    <span className="text-3xl">📍</span>
                  </div>
                  {place.snippet && <p className="mt-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest leading-relaxed">{place.snippet}</p>}
                  <div className="mt-6 flex items-center gap-4 text-blue-600 font-black uppercase text-xs">
                    Explore on Digital Map →
                  </div>
                </a>
              )) : (
                <div className="bg-gray-50 border-4 border-dashed border-black/20 rounded-[3rem] p-12 text-center">
                  <p className="font-black text-gray-400 uppercase italic">No direct matches found in mapping registry.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusLocator;
