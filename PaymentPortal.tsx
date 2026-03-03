
import React, { useState } from 'react';

interface PaymentPortalProps {
  itemTitle: string;
  price: number;
  onSuccess: () => void;
  onClose: () => void;
}

const PaymentPortal: React.FC<PaymentPortalProps> = ({ itemTitle, price, onSuccess, onClose }) => {
  const [method, setMethod] = useState<'telebirr' | 'chapa' | null>(null);
  const [step, setStep] = useState<'selection' | 'processing' | 'success'>('selection');

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-[5rem] border-8 border-black shadow-[30px_30px_0px_0px_rgba(59,130,246,1)] p-12 md:p-20 relative overflow-hidden">
        
        {step === 'selection' && (
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-6xl font-black uppercase tracking-tighter italic leading-none">Checkout Portal</h2>
              <p className="text-xl font-black text-gray-500 uppercase">Item: {itemTitle}</p>
              <div className="text-5xl font-black text-green-600 italic">{price} ETB</div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <button 
                onClick={() => setMethod('telebirr')}
                className={`flex items-center justify-between p-8 rounded-[2.5rem] border-8 border-black transition-all ${method === 'telebirr' ? 'bg-blue-50 border-blue-600 translate-x-4' : 'bg-white hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-black italic">T</div>
                  <span className="text-3xl font-black uppercase italic tracking-tight">Telebirr</span>
                </div>
                {method === 'telebirr' && <span className="text-4xl">✅</span>}
              </button>

              <button 
                onClick={() => setMethod('chapa')}
                className={`flex items-center justify-between p-8 rounded-[2.5rem] border-8 border-black transition-all ${method === 'chapa' ? 'bg-green-50 border-green-600 translate-x-4' : 'bg-white hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-4xl font-black italic">C</div>
                  <span className="text-3xl font-black uppercase italic tracking-tight">Chapa</span>
                </div>
                {method === 'chapa' && <span className="text-4xl">✅</span>}
              </button>
            </div>

            <div className="flex gap-6 pt-8">
              <button onClick={onClose} className="flex-1 py-8 bg-white border-8 border-black rounded-[2.5rem] font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">Cancel</button>
              <button 
                disabled={!method}
                onClick={handlePay}
                className="flex-1 py-8 bg-black text-white border-8 border-black rounded-[2.5rem] font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(0,155,68,1)] disabled:opacity-30 disabled:shadow-none"
              >
                Pay Now
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center py-20 space-y-12">
            <div className="w-32 h-32 border-[16px] border-black border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <h3 className="text-5xl font-black uppercase italic animate-pulse">Communicating with Portal...</h3>
            <p className="text-xl font-black text-gray-400">Please do not refresh the secure transaction portal.</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-20 space-y-12 animate-bounceIn">
            <div className="text-[12rem]">🏆</div>
            <h3 className="text-6xl font-black uppercase italic text-green-600">Payment Verified!</h3>
            <p className="text-2xl font-black">Your certificate/course has been unlocked.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentPortal;
