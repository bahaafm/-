import React, { useState } from 'react';
import { Customer, Merchant } from '../types';
import PhoneVerificationModal from './PhoneVerificationModal';
import { 
  User, Store, ShieldCheck, Phone, Lock, Eye, EyeOff, 
  ArrowRight, Upload, AlertCircle, Sparkles, Building, CheckCircle2 
} from 'lucide-react';

interface AuthScreenProps {
  onLoginCustomer: (phone: string, pass: string) => Customer | null;
  onRegisterCustomer: (fullName: string, phone: string, pass: string) => Customer;
  onLoginMerchant: (phone: string, pass: string) => Merchant | null;
  onRegisterMerchant: (fullName: string, storeName: string, phone: string, pass: string, docs: string[]) => Merchant;
  onLoginAdmin: (phone: string, pass: string) => boolean;
}

export default function AuthScreen({
  onLoginCustomer,
  onRegisterCustomer,
  onLoginMerchant,
  onRegisterMerchant,
  onLoginAdmin
}: AuthScreenProps) {
  // Main modes: 'role_selection' | 'customer_auth' | 'merchant_auth' | 'admin_auth'
  const [authMode, setAuthMode] = useState<'role_selection' | 'customer_auth' | 'merchant_auth' | 'admin_auth'>('role_selection');
  
  // Secondary sub-mode: 'login' | 'register'
  const [subMode, setSubMode] = useState<'login' | 'register'>('login');

  // Input states
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP Modal State for Customer registration
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  // Errors / Success feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // simulated uploader helper
  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesList = Array.from(e.target.files).map((f: any) => f.name);
      setUploadedDocs([...uploadedDocs, ...filesList]);
      setErrorMsg('');
    }
  };

  const clearForm = () => {
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setStoreName('');
    setUploadedDocs([]);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleBackToSelection = () => {
    setAuthMode('role_selection');
    clearForm();
  };

  // Submit Customer login / register
  const handleSubmitCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!phone.trim() || !password.trim()) {
      setErrorMsg('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (subMode === 'login') {
      const cust = onLoginCustomer(phone.trim(), password.trim());
      if (!cust) {
        setErrorMsg('رقم الهاتف أو رمز المرور غير صحيح. يرجى المحاولة مجدداً.');
      }
    } else {
      // Register validation
      if (!fullName.trim() || !confirmPassword.trim()) {
        setErrorMsg('يرجى كتابة معلوماتك كاملة وتأكيد كلمة المرور');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('كلمات المرور غير متطابقة، يرجى التحقق');
        return;
      }
      if (phone.trim().length < 10) {
        setErrorMsg('رقم الهاتف غير صالح، يرجى كتابة رقم كامل');
        return;
      }

      // Open OTP verification modal first
      setIsOtpOpen(true);
    }
  };

  // Callback once customer verified phone
  const handleCustomerVerificationSuccess = () => {
    setIsOtpOpen(false);
    const newCust = onRegisterCustomer(fullName.trim(), phone.trim(), password.trim());
    setSuccessMsg('تم تسجيل حسابك وتأكيد هاتفك بنجاح! جاري تسجيل الدخول...');
    setTimeout(() => {
      clearForm();
    }, 1500);
  };

  // Submit Merchant login / register
  const handleSubmitMerchant = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!phone.trim() || !password.trim()) {
      setErrorMsg('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (subMode === 'login') {
      const merch = onLoginMerchant(phone.trim(), password.trim());
      if (!merch) {
        setErrorMsg('بيانات الدخول غير صحيحة، أو أن حسابك ما زال بانتظار موافقة الإدارة.');
      }
    } else {
      // Register Merchant
      if (!fullName.trim() || !storeName.trim() || !confirmPassword.trim()) {
        setErrorMsg('يرجى ملء كافة البيانات المطلوبة واسم متجرك التجاري');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('كلمتا المرور غير متطابقتين');
        return;
      }
      if (uploadedDocs.length === 0) {
        setErrorMsg('يرجى تحميل مستمسكاتك الرسمية (هوية الأحوال، بطاقة السكن) لتدقيق الحساب');
        return;
      }

      onRegisterMerchant(fullName.trim(), storeName.trim(), phone.trim(), password.trim(), uploadedDocs);
      setSuccessMsg('تم تقديم طلبك بنجاح! طلبك معلق وبانتظار اعتماد الإدارة لتدقيق مستمسكاتك.');
      setSubMode('login');
      // Keep phone and password filled for convenience
      setPassword('');
      setConfirmPassword('');
      setUploadedDocs([]);
    }
  };

  // Submit Admin login
  const handleSubmitAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!phone.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMsg('يرجى ملء جميع الحقول وتأكيد الرمز السري');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('الرموز السرية المدخلة غير متطابقة!');
      return;
    }

    if (onLoginAdmin(phone.trim(), password.trim())) {
      setSuccessMsg('مرحباً بك يا مسؤول النظام! جاري تشغيل لوحة الإدارة...');
    } else {
      setErrorMsg('الرقم السري أو رقم هاتف الإدارة غير صحيح.');
    }
  };

  return (
    <div className="bg-transparent text-slate-100 min-h-screen flex flex-col justify-between font-sans relative" dir="rtl">
      
      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 z-10">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl animate-in fade-in duration-300 relative overflow-hidden">
          {/* Top orange ambient accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
          
          {/* Logo Brand Head */}
          <div className="text-center mb-8">
            <div className="inline-flex bg-gradient-to-br from-orange-400 to-orange-600 text-white w-16 h-16 rounded-2xl items-center justify-center font-black text-3xl shadow-lg shadow-orange-500/20 mb-4 select-none transform hover:scale-105 transition-transform duration-300">
              جبلة
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">سوق <span className="text-orange-500">جبلة</span> الرقمي</h1>
            <p className="text-xs text-slate-300 mt-2 max-w-xs mx-auto leading-relaxed">السوق العراقي التخصصي المتكامل - بيع، شراء، جرد وإدارة اشتراكات</p>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="bg-red-500/10 text-red-300 border border-red-500/20 p-3.5 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2 backdrop-blur-md">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 p-3.5 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2 backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE 1: Role Selection Portal */}
          {authMode === 'role_selection' && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-300 text-center uppercase tracking-wider mb-2">اختر واجهتك للدخول للتطبيق</p>
              
              <button
                onClick={() => { setAuthMode('customer_auth'); setSubMode('login'); }}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 p-5 rounded-2xl text-right transition-all duration-200 flex items-center justify-between group cursor-pointer"
                id="select-customer-btn"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500/20 text-blue-400 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg shadow-blue-500/10">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm">دخول الزبون</h3>
                    <p className="text-xxs text-slate-400 mt-0.5">تصفح البضائع، تتبع المقاسات المتاحة والشراء الفوري</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transform rotate-180 transition-transform" />
              </button>

              <button
                onClick={() => { setAuthMode('merchant_auth'); setSubMode('login'); }}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/40 p-5 rounded-2xl text-right transition-all duration-200 flex items-center justify-between group cursor-pointer"
                id="select-merchant-btn"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-orange-500/20 text-orange-400 p-3 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-all shadow-lg shadow-orange-500/10">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm">بوابة التاجر</h3>
                    <p className="text-xxs text-slate-400 mt-0.5">عرض السلع والمخزون، إضافة تخفيضات وتنزيل التقارير</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transform rotate-180 transition-transform" />
              </button>
            </div>
          )}

          {/* MODE 2: Customer Auth Screen */}
          {authMode === 'customer_auth' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <button 
                  onClick={handleBackToSelection}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  الرجوع للرئيسية
                </button>
                <div className="bg-teal-950 text-teal-400 text-xxs font-bold px-2.5 py-1 rounded-full border border-teal-850">
                  لوحة الزبون
                </div>
              </div>

              {/* Login vs Register Customer Tabs */}
              <div className="grid grid-cols-2 gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                <button
                  onClick={() => { setSubMode('login'); setErrorMsg(''); }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    subMode === 'login' 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  id="customer-login-tab"
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => { setSubMode('register'); setErrorMsg(''); }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    subMode === 'register' 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  id="customer-register-tab"
                >
                  حساب زبون جديد
                </button>
              </div>

              <form onSubmit={handleSubmitCustomer} className="space-y-4">
                {subMode === 'register' && (
                  <div>
                    <label className="block text-xxs font-bold text-slate-300 mb-1">الاسم الكامل للزبون</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="اكتب اسمك الثلاثي"
                      className="w-full bg-white/5 border border-white/10 text-sm rounded-xl px-4 py-2.5 focus:border-orange-500 focus:bg-white/10 focus:outline-none text-white placeholder:text-slate-500 transition-all"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xxs font-bold text-slate-300 mb-1">رقم الهاتف الجوال</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="مثال: 07800000000"
                      className="w-full bg-white/5 border border-white/10 text-sm rounded-xl pl-4 pr-10 py-2.5 focus:border-orange-500 focus:bg-white/10 focus:outline-none text-white placeholder:text-slate-500 transition-all font-mono dir-ltr text-right"
                      required
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xxs font-bold text-slate-300 mb-1">كلمة المرور السرية</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="اكتب كلمة مرور قوية"
                      className="w-full bg-white/5 border border-white/10 text-sm rounded-xl pl-10 pr-10 py-2.5 focus:border-orange-500 focus:bg-white/10 focus:outline-none text-white placeholder:text-slate-500 transition-all"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-3.5 left-3.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {subMode === 'register' && (
                  <div>
                    <label className="block text-xxs font-bold text-slate-300 mb-1">تأكيد كلمة المرور</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="أعد كتابة كلمة المرور"
                        className="w-full bg-white/5 border border-white/10 text-sm rounded-xl pl-10 pr-10 py-2.5 focus:border-orange-500 focus:bg-white/10 focus:outline-none text-white placeholder:text-slate-500 transition-all"
                        required
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute top-3.5 left-3.5 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-600/30 transition-all text-center cursor-pointer ring-1 ring-orange-400/50"
                  id="customer-auth-submit-btn"
                >
                  {subMode === 'login' ? 'دخول التطبيق زبون' : 'التحقق من الهاتف والتسجيل'}
                </button>
              </form>
            </div>
          )}

          {/* MODE 3: Merchant Auth Screen */}
          {authMode === 'merchant_auth' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <button 
                  onClick={handleBackToSelection}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  الرجوع للرئيسية
                </button>
                <div className="bg-amber-950 text-amber-400 text-xxs font-bold px-2.5 py-1 rounded-full border border-amber-900/30">
                  لوحة التاجر
                </div>
              </div>

              {/* Login vs Register Merchant Tabs */}
              <div className="grid grid-cols-2 gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                <button
                  onClick={() => { setSubMode('login'); setErrorMsg(''); }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    subMode === 'login' 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  id="merchant-login-tab"
                >
                  تسجيل دخول تاجر
                </button>
                <button
                  onClick={() => { setSubMode('register'); setErrorMsg(''); }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    subMode === 'register' 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  id="merchant-register-tab"
                >
                  تسجيل تاجر جديد
                </button>
              </div>

              <form onSubmit={handleSubmitMerchant} className="space-y-4">
                {subMode === 'register' && (
                  <>
                    <div>
                      <label className="block text-xxs font-bold text-slate-300 mb-1">الاسم الكامل للتاجر</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="الاسم الثلاثي الصحيح للتاجر"
                        className="w-full bg-white/5 border border-white/10 text-sm rounded-xl px-4 py-2.5 focus:border-orange-500 focus:bg-white/10 focus:outline-none text-white placeholder:text-slate-500 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xxs font-bold text-slate-300 mb-1">اسم المتجر / المعرض</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          placeholder="مثال: متجر هدايا وباقة بغداد"
                          className="w-full bg-white/5 border border-white/10 text-sm rounded-xl pl-4 pr-10 py-2.5 focus:border-orange-500 focus:bg-white/10 focus:outline-none text-white placeholder:text-slate-500 transition-all"
                          required
                        />
                        <Building className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5" />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xxs font-bold text-slate-300 mb-1">رقم الهاتف الجوال</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="رقم الهاتف للتواصل"
                      className="w-full bg-white/5 border border-white/10 text-sm rounded-xl pl-4 pr-10 py-2.5 focus:border-orange-500 focus:bg-white/10 focus:outline-none text-white placeholder:text-slate-500 transition-all font-mono text-right"
                      required
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xxs font-bold text-slate-300 mb-1">كلمة المرور</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="كلمة مرور الحساب"
                      className="w-full bg-white/5 border border-white/10 text-sm rounded-xl pl-10 pr-10 py-2.5 focus:border-orange-500 focus:bg-white/10 focus:outline-none text-white placeholder:text-slate-500 transition-all"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-3.5 left-3.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {subMode === 'register' && (
                  <>
                    <div>
                      <label className="block text-xxs font-bold text-slate-300 mb-1">تأكيد كلمة المرور</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="أعد كتابة كلمة المرور"
                          className="w-full bg-white/5 border border-white/10 text-sm rounded-xl pl-10 pr-10 py-2.5 focus:border-orange-500 focus:bg-white/10 focus:outline-none text-white placeholder:text-slate-500 transition-all"
                          required
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute top-3.5 left-3.5 text-slate-400 hover:text-white cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Documents File Upload Simulation */}
                    <div>
                      <label className="block text-xxs font-bold text-slate-300 mb-1">رفع مستمسكاتك الثبوتية (مستمسكاته)</label>
                      <div className="bg-white/5 border-2 border-dashed border-white/15 hover:border-orange-500/45 rounded-2xl p-4 text-center transition-colors relative cursor-pointer">
                        <input
                          type="file"
                          multiple
                          onChange={handleSimulateUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id="merchant-docs-upload"
                        />
                        <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                        <p className="text-xxs text-slate-200 font-bold">اسحب المستمسكات أو اضغط للتحميل</p>
                        <p className="text-xxxs text-slate-400 mt-0.5">يرجى رفع هوية الأحوال أو البطاقة الموحدة</p>
                      </div>

                      {uploadedDocs.length > 0 && (
                        <div className="mt-3 bg-white/5 p-2.5 rounded-xl border border-white/10 space-y-1">
                          <p className="text-xxxs font-bold text-slate-400">الملفات المرفوعة للتدقيق:</p>
                          {uploadedDocs.map((doc, i) => (
                            <p key={i} className="text-xxs text-emerald-400 font-semibold flex items-center gap-1">
                              <span>✓</span> {doc}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-600/30 transition-all text-center cursor-pointer ring-1 ring-orange-400/50"
                  id="merchant-auth-submit-btn"
                >
                  {subMode === 'login' ? 'تسجيل دخول كتاجر' : 'تقديم طلب المتجر للمراجعة'}
                </button>
              </form>
            </div>
          )}

          {/* MODE 4: Admin Portal Login Screen */}
          {authMode === 'admin_auth' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <button 
                  onClick={handleBackToSelection}
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  إلغاء والعودة
                </button>
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xxs font-extrabold px-2.5 py-1 rounded-full shadow-lg shadow-orange-500/10">
                  المدير العام
                </div>
              </div>

              <form onSubmit={handleSubmitAdmin} className="space-y-4">
                <div>
                  <label className="block text-xxs font-bold text-slate-300 mb-1">رقم هاتف الإدارة</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: 07800000000"
                    className="w-full bg-white/5 border border-white/10 text-sm rounded-xl px-4 py-2.5 focus:border-orange-500 focus:bg-white/10 focus:outline-none text-white placeholder:text-slate-500 transition-all font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xxs font-bold text-slate-300 mb-1">الرمز السري للإدارة</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور الخاصة بالإدارة"
                      className="w-full bg-white/5 border border-white/10 text-sm rounded-xl pl-10 pr-10 py-2.5 focus:border-orange-500 focus:bg-white/10 focus:outline-none text-white placeholder:text-slate-500 transition-all"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-3.5 left-3.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xxs font-bold text-slate-300 mb-1">تأكيد الرمز السري للإدارة</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="أعد كتابة كلمة المرور للتأكيد"
                      className="w-full bg-white/5 border border-white/10 text-sm rounded-xl pl-10 pr-10 py-2.5 focus:border-orange-500 focus:bg-white/10 focus:outline-none text-white placeholder:text-slate-500 transition-all"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute top-3.5 left-3.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-600/30 transition-all text-center cursor-pointer ring-1 ring-orange-400/50"
                  id="admin-auth-submit-btn"
                >
                  الدخول للوحة التحكم الرئيسية
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* FOOTER: Admin entrance bottom-aligned as requested */}
      {authMode === 'role_selection' && (
        <footer className="text-center p-6 border-t border-white/10 bg-white/3 backdrop-blur-md z-10">
          <button
            onClick={() => {
              setAuthMode('admin_auth');
              setPhone('');
              setPassword('');
              setConfirmPassword('');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="text-xs font-bold text-slate-200 hover:text-orange-400 transition-colors flex items-center gap-1.5 mx-auto px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 backdrop-blur-md cursor-pointer"
            id="admin-portal-login-footer-btn"
          >
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span>تسجيل دخول لوحة الإدارة</span>
          </button>
        </footer>
      )}

      {/* OTP Modal */}
      <PhoneVerificationModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        phone={phone}
        onVerifySuccess={handleCustomerVerificationSuccess}
      />

    </div>
  );
}
