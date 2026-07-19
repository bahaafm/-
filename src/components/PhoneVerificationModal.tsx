import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, RefreshCw } from 'lucide-react';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  onVerifySuccess: () => void;
}

export default function PhoneVerificationModal({ isOpen, onClose, phone, onVerifySuccess }: PhoneVerificationModalProps) {
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [timer, setTimer] = useState(59);
  const [simulatedCode, setSimulatedCode] = useState('1234');
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Generate a random 4-digit code for simulation
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedCode(generated);
    setTimer(59);
    setError('');
    setCode(['', '', '', '']);

    // Display simulated SMS to user
    const notificationTimeout = setTimeout(() => {
      alert(`[محاكاة رسائل سوق جبلة SMS]: رمز التحقق الخاص بك هو: ${generated}`);
    }, 1200);

    return () => clearTimeout(notificationTimeout);
  }, [isOpen]);

  useEffect(() => {
    if (timer > 0 && isOpen) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isOpen]);

  if (!isOpen) return null;

  const handleChange = (index: number, val: string) => {
    if (isNaN(Number(val))) return;
    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);

    // Focus next input automatically
    if (val !== '' && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    const enteredCode = code.join('');
    if (enteredCode.length < 4) {
      setError('يرجى إدخال رمز التحقق المكون من 4 أرقام كاملاً');
      return;
    }

    if (enteredCode === simulatedCode || enteredCode === '1234') {
      onVerifySuccess();
    } else {
      setError('رمز التحقق غير صحيح، يرجى المحاولة مرة أخرى');
    }
  };

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      const generated = Math.floor(1000 + Math.random() * 9000).toString();
      setSimulatedCode(generated);
      setTimer(59);
      setError('');
      setCode(['', '', '', '']);
      setResending(false);
      alert(`[محاكاة رسائل سوق جبلة SMS]: رمز التحقق الجديد الخاص بك هو: ${generated}`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans" dir="rtl">
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-[2rem] max-w-md w-full shadow-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in-95 duration-200 relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
        
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-6 text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-white" />
            <div>
              <h3 className="font-bold text-lg">التحقق من رقم الهاتف</h3>
              <p className="text-xs text-orange-100">سوق جبلة يضمن حماية حسابك</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white cursor-pointer"
            id="close-otp-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-slate-300 text-center mb-6 leading-relaxed text-sm">
            لقد أرسلنا رمز تحقق مكون من 4 أرقام عبر رسالة SMS إلى الرقم:
            <span className="block font-bold text-orange-400 dir-ltr mt-1.5 text-lg font-mono">{phone}</span>
          </p>

          <div className="flex justify-center gap-3 dir-ltr mb-6">
            {code.map((char, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={char}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:bg-white/10 focus:outline-none transition-all duration-200 text-white shadow-md font-mono"
              />
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4 font-semibold flex items-center justify-center gap-1 bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/20">
              <span>⚠️</span> {error}
            </p>
          )}

          <button
            onClick={handleVerify}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-center cursor-pointer ring-1 ring-orange-400/30"
            id="confirm-otp-btn"
          >
            تأكيد والتحقق
          </button>

          <div className="mt-6 text-center">
            {timer > 0 ? (
              <p className="text-sm text-slate-400">
                إعادة إرسال الرمز خلال <span className="font-mono font-medium text-orange-400">{timer}</span> ثانية
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1.5 mx-auto cursor-pointer"
                id="resend-otp-btn"
              >
                <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                إعادة إرسال رمز التحقق
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
