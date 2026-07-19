import React, { useState } from 'react';
import { Market, Category, Subcategory, Merchant, Customer, Product } from '../types';
import { 
  Users, Store, ShoppingBag, Plus, Trash2, ShieldCheck, 
  XCircle, CheckCircle2, Calendar, AlertTriangle, FileText, 
  Search, ShieldAlert, LogOut, LayoutGrid, Check, Ban, Code
} from 'lucide-react';

interface AdminPanelProps {
  markets: Market[];
  categories: Category[];
  subcategories: Subcategory[];
  merchants: Merchant[];
  customers: Customer[];
  products: Product[];
  onAddMarket: (name: string, desc: string, icon: string) => void;
  onAddCategory: (marketId: string, name: string) => void;
  onAddSubcategory: (categoryId: string, name: string) => void;
  onUpdateMerchantStatus: (id: string, status: 'pending' | 'approved' | 'banned') => void;
  onUpdateMerchantSubscription: (id: string, action: 'renew' | 'suspend' | 'delete') => void;
  onLogout: () => void;
  onViewReport: (merchant: Merchant) => void;
  onShowFlutter?: () => void;
}

export default function AdminPanel({
  markets,
  categories,
  subcategories,
  merchants,
  customers,
  products,
  onAddMarket,
  onAddCategory,
  onAddSubcategory,
  onUpdateMerchantStatus,
  onUpdateMerchantSubscription,
  onLogout,
  onViewReport,
  onShowFlutter
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'merchants' | 'customers' | 'markets' | 'reports'>('merchants');

  // Market Form State
  const [marketName, setMarketName] = useState('');
  const [marketDesc, setMarketDesc] = useState('');
  const [marketIcon, setMarketIcon] = useState('ShoppingBag');

  // Category Form State
  const [selectedMarketId, setSelectedMarketId] = useState('');
  const [categoryName, setCategoryName] = useState('');

  // Subcategory Form State
  const [selectedCatMarketId, setSelectedCatMarketId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Notification Banner
  const [notif, setNotif] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const triggerNotif = (type: 'success' | 'error', text: string) => {
    setNotif({ type, text });
    setTimeout(() => setNotif(null), 4000);
  };

  const handleCreateMarket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketName.trim()) {
      triggerNotif('error', 'يرجى إدخال اسم السوق الجديد');
      return;
    }
    onAddMarket(marketName.trim(), marketDesc.trim(), marketIcon);
    setMarketName('');
    setMarketDesc('');
    triggerNotif('success', `تم إضافة السوق "${marketName}" بنجاح!`);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMarketId) {
      triggerNotif('error', 'يرجى اختيار السوق');
      return;
    }
    if (!categoryName.trim()) {
      triggerNotif('error', 'يرجى إدخال اسم القسم');
      return;
    }
    onAddCategory(selectedMarketId, categoryName.trim());
    setCategoryName('');
    triggerNotif('success', `تم إضافة القسم "${categoryName}" بنجاح!`);
  };

  const handleCreateSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) {
      triggerNotif('error', 'يرجى اختيار القسم الرئيسي');
      return;
    }
    if (!subcategoryName.trim()) {
      triggerNotif('error', 'يرجى إدخال اسم الفرع الجديد');
      return;
    }
    onAddSubcategory(selectedCategoryId, subcategoryName.trim());
    setSubcategoryName('');
    triggerNotif('success', `تم إضافة الفرع "${subcategoryName}" بنجاح!`);
  };

  // Filter merchants based on search
  const filteredMerchants = merchants.filter(m => 
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone.includes(searchTerm)
  );

  // Filter customers
  const filteredCustomers = customers.filter(c => 
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="bg-transparent text-slate-100 min-h-screen font-sans pb-16" dir="rtl">
      {/* Admin Top Header */}
      <header className="bg-slate-950/40 backdrop-blur-md border-b border-white/10 px-6 py-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white p-2.5 rounded-2xl font-black text-xl shadow-lg shadow-orange-500/20">
              إدارة
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                لوحة الإدارة الرئيسية
                <span className="bg-orange-500/10 text-orange-400 text-xxs font-bold px-2.5 py-0.5 rounded-full border border-orange-500/20">سوق جبلة</span>
              </h1>
              <p className="text-xs text-slate-400">تحكم كامل بالأسواق والاشتراكات والتجار والزبائن</p>
            </div>
          </div>

          {/* Top Admin Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-400">المدير العام</p>
              <p className="text-sm font-bold text-slate-200">بهاء فالح</p>
            </div>
            {onShowFlutter && (
              <button 
                onClick={onShowFlutter}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/10 transition-all flex items-center gap-2 cursor-pointer"
                id="admin-flutter-btn"
              >
                <Code className="w-4 h-4" />
                <span>كود Flutter للجوال</span>
              </button>
            )}
            <button 
              onClick={onLogout}
              className="bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 text-slate-300 font-semibold text-xs px-4 py-2.5 rounded-xl border border-white/10 hover:border-rose-500/20 transition-all duration-200 flex items-center gap-2 cursor-pointer"
              id="admin-logout-btn"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Notification Banner */}
        {notif && (
          <div className={`p-4 rounded-xl mb-6 flex items-center justify-between border animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-md ${
            notif.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            <span className="text-sm font-bold">{notif.text}</span>
            <button onClick={() => setNotif(null)} className="text-xs opacity-60 hover:opacity-100 cursor-pointer">&times;</button>
          </div>
        )}

        {/* Stats Dashboard */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">إجمالي التجار</span>
              <Store className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-mono">{merchants.length}</p>
            <p className="text-xxs text-slate-500 mt-1">تجار مسجلين بالمنصة</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">الزبائن المشتركين</span>
              <Users className="w-5 h-5 text-teal-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-mono">{customers.length}</p>
            <p className="text-xxs text-slate-500 mt-1">حسابات نشطة للزبائن</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">الأسواق والساحات</span>
              <LayoutGrid className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-mono">{markets.length}</p>
            <p className="text-xxs text-slate-500 mt-1">أسواق مفعلة داخل التطبيق</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">المنتجات المعروضة</span>
              <ShoppingBag className="w-5 h-5 text-rose-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-mono">
              {products.filter(p => {
                const merch = merchants.find(m => m.id === p.merchantId);
                return merch?.status === 'approved' && merch?.subscriptionStatus === 'active';
              }).length}
            </p>
            <p className="text-xxs text-slate-500 mt-1">منتجات نشطة ومعروضة حالياً</p>
          </div>
        </section>

        {/* Tab Navigation & Search */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10 mb-8 backdrop-blur-md shadow-lg">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setActiveTab('merchants'); setSearchTerm(''); }}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === 'merchants' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>إدارة التجار وحالة الاشتراكات</span>
              {merchants.filter(m => m.status === 'pending').length > 0 && (
                <span className="bg-rose-500 text-white text-xxs font-bold h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center animate-pulse font-mono">
                  {merchants.filter(m => m.status === 'pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('customers'); setSearchTerm(''); }}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === 'customers' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>قائمة الزبائن</span>
            </button>
            <button
              onClick={() => { setActiveTab('markets'); setSearchTerm(''); }}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === 'markets' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>هيكلة الأسواق والأقسام</span>
            </button>
          </div>

          {/* Search bar inside navigation (only relevant for merchants/customers) */}
          {(activeTab === 'merchants' || activeTab === 'customers') && (
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={activeTab === 'merchants' ? "البحث عن تاجر أو متجر..." : "البحث عن زبون برقم الهاتف..."}
                className="bg-white/5 text-white border border-white/10 rounded-xl pl-4 pr-10 py-2.5 focus:border-orange-500 focus:outline-none w-full md:w-64 text-sm font-sans placeholder:text-slate-500 transition-all"
              />
              <Search className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
            </div>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'merchants' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">سجل طلبات وحسابات التجار</h2>
                <p className="text-xs text-slate-400">تحقق من المستمسكات، اعتمد المتاجر أو عطل اشتراكاتهم غير المجددة</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-950/40 text-slate-300 font-bold border-b border-white/10">
                    <th className="py-4 px-6 text-slate-300">التاجر والمتجر</th>
                    <th className="py-4 px-6 text-slate-300">رقم الهاتف</th>
                    <th className="py-4 px-6 text-slate-300 text-center">حالة التاجر</th>
                    <th className="py-4 px-6 text-center">اشتراك الـ 30 يوم</th>
                    <th className="py-4 px-6">المستمسكات المرفوعة</th>
                    <th className="py-4 px-6 text-left">إجراءات لوحة الإدارة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredMerchants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-500">لا يوجد تجار يطابقون شروط البحث.</td>
                    </tr>
                  ) : (
                    filteredMerchants.map((merchant) => {
                      // Calc remaining subscription days
                      const now = new Date();
                      const expiry = new Date(merchant.subscriptionExpiry);
                      const diffTime = expiry.getTime() - now.getTime();
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      const isExpired = diffDays <= 0 || merchant.subscriptionStatus === 'expired';

                      return (
                        <tr key={merchant.id} className="hover:bg-white/5 transition-all duration-150">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                                {merchant.storeName.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-100 text-sm">{merchant.storeName}</h4>
                                <p className="text-xs text-slate-400">{merchant.fullName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-mono text-slate-300 text-sm select-all">
                            {merchant.phone}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {merchant.status === 'approved' && (
                              <span className="inline-flex items-center gap-1 text-xxs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                معتمد ونشط
                              </span>
                            )}
                            {merchant.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 text-xxs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full animate-pulse">
                                <ShieldAlert className="w-3.5 h-3.5" />
                                معلق - بانتظار الموافقة
                              </span>
                            )}
                            {merchant.status === 'banned' && (
                              <span className="inline-flex items-center gap-1 text-xxs font-bold bg-white/5 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full">
                                <Ban className="w-3.5 h-3.5" />
                                محظور وموقوف
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {merchant.status !== 'approved' ? (
                              <span className="text-slate-500 text-xs">-</span>
                            ) : (
                              <div>
                                <div className="flex items-center justify-center gap-2">
                                  {merchant.subscriptionStatus === 'active' && !isExpired ? (
                                    <span className="text-xxs font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full font-mono">
                                      مفعّل (يتبقى {diffDays} يوم)
                                    </span>
                                  ) : merchant.subscriptionStatus === 'suspended' ? (
                                    <span className="text-xxs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                                      موقوف مؤقتاً
                                    </span>
                                  ) : (
                                    <span className="text-xxs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                                      منتهي الصلاحية
                                    </span>
                                  )}
                                </div>
                                <p className="text-xxs text-slate-500 mt-1 font-mono">
                                  تنتهي: {expiry.toLocaleDateString('ar-IQ')}
                                </p>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col gap-1">
                              {merchant.documents.map((doc, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1.5 text-xxs font-medium text-slate-400 hover:text-orange-400 transition-colors cursor-pointer select-all">
                                  <FileText className="w-3 h-3 text-slate-500" />
                                  {doc}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-left">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {merchant.status === 'pending' && (
                                <button
                                  onClick={() => {
                                    onUpdateMerchantStatus(merchant.id, 'approved');
                                    triggerNotif('success', `تم اعتماد التاجر "${merchant.fullName}" ومنحه اشتراك 30 يوم بنجاح!`);
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                  id={`approve-${merchant.id}`}
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>موافقة واعتماد</span>
                                </button>
                              )}

                              {merchant.status === 'approved' && (
                                <>
                                  {/* Subscription renew / suspend */}
                                  <button
                                    onClick={() => {
                                      onUpdateMerchantSubscription(merchant.id, 'renew');
                                      triggerNotif('success', `تم تجديد اشتراك متجر "${merchant.storeName}" لمدة 30 يوم أخرى!`);
                                    }}
                                    className="bg-white/5 hover:bg-white/10 text-teal-400 border border-white/10 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                                    id={`renew-sub-${merchant.id}`}
                                  >
                                    تجديد (30 يوم)
                                  </button>

                                  {merchant.subscriptionStatus === 'active' ? (
                                    <button
                                      onClick={() => {
                                        onUpdateMerchantSubscription(merchant.id, 'suspend');
                                        triggerNotif('success', `تم إيقاف اشتراك متجر "${merchant.storeName}" مؤقتاً واختفت منتجاته.`);
                                      }}
                                      className="bg-white/5 hover:bg-white/10 text-amber-500 border border-white/10 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                                      id={`suspend-sub-${merchant.id}`}
                                    >
                                      إيقاف مؤقت
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        onUpdateMerchantSubscription(merchant.id, 'renew'); // Reactivate
                                        triggerNotif('success', `تم إعادة تفعيل اشتراك متجر "${merchant.storeName}" وظهرت منتجاته تلقائياً.`);
                                      }}
                                      className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                                      id={`activate-sub-${merchant.id}`}
                                    >
                                      تفعيل مجدداً
                                    </button>
                                  )}

                                  <button
                                    onClick={() => {
                                      onUpdateMerchantSubscription(merchant.id, 'delete');
                                      triggerNotif('success', `تم حذف اشتراك "${merchant.storeName}" بالكامل.`);
                                    }}
                                    className="bg-white/5 hover:bg-rose-500/10 text-rose-400 border border-white/10 hover:border-rose-500/20 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                                    id={`delete-sub-${merchant.id}`}
                                  >
                                    حذف الاشتراك
                                  </button>

                                  {/* Pull inventory report as admin */}
                                  <button
                                    onClick={() => onViewReport(merchant)}
                                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-xs px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer shadow-md shadow-orange-500/10"
                                    id={`view-rep-${merchant.id}`}
                                  >
                                    جرد البضاعة PDF
                                  </button>
                                </>
                              )}

                              {merchant.status !== 'banned' ? (
                                <button
                                  onClick={() => {
                                    onUpdateMerchantStatus(merchant.id, 'banned');
                                    triggerNotif('success', `تم حظر التاجر "${merchant.fullName}" وحجب منتجاته نهائياً.`);
                                  }}
                                  className="bg-white/5 hover:bg-rose-500/10 text-red-400 border border-white/10 text-xs p-1.5 rounded-lg transition-colors cursor-pointer"
                                  title="حظر التاجر"
                                  id={`ban-${merchant.id}`}
                                >
                                  <Ban className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    onUpdateMerchantStatus(merchant.id, 'approved');
                                    triggerNotif('success', `تم إلغاء حظر التاجر "${merchant.fullName}". يمكنك تفعيل اشتراكه الآن.`);
                                  }}
                                  className="bg-white/5 hover:bg-emerald-500/10 text-emerald-400 border border-white/10 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                                  id={`unban-${merchant.id}`}
                                >
                                  إلغاء الحظر
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">سجل حسابات الزبائن المشتركين</h2>
              <p className="text-xs text-slate-400">قائمة كاملة بالزبائن الذين قاموا بتأكيد هواتفهم برمز التحقق والتسجيل</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-950/40 text-slate-300 font-bold border-b border-white/10">
                    <th className="py-4 px-6 text-slate-300">الاسم الكامل للزبون</th>
                    <th className="py-4 px-6 text-slate-300">رقم الهاتف الجوال</th>
                    <th className="py-4 px-6 text-slate-300">تاريخ الانضمام</th>
                    <th className="py-4 px-6 text-slate-300">التحقق من الهاتف</th>
                    <th className="py-4 px-6 text-slate-300 text-left">ملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-500">لا يوجد زبائن مسجلين يطابقون شروط البحث.</td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-white/5 transition-all duration-150">
                        <td className="py-4 px-6 font-bold text-white">
                          {customer.fullName}
                        </td>
                        <td className="py-4 px-6 font-mono text-slate-300 text-sm">
                          {customer.phone}
                        </td>
                        <td className="py-4 px-6 text-slate-400 font-sans">
                          {new Date(customer.createdAt).toLocaleDateString('ar-IQ')}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 text-xxs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            متحقق ومؤكد بالكامل
                          </span>
                        </td>
                        <td className="py-4 px-6 text-left text-slate-500 text-xs">
                          حساب جوال نشط
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'markets' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Market Structural View */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-md">
              <h2 className="text-lg font-bold text-white mb-2">هيكلية وأسواق المنصة</h2>
              <p className="text-xs text-slate-400 mb-6">عرض شجري للأسواق المفعلة وما تحتويه من أقسام وفروع</p>

              <div className="space-y-4">
                {markets.map((m) => (
                  <div key={m.id} className="border border-white/10 rounded-2xl p-4 bg-white/5 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                      <div className="flex items-center gap-2 text-orange-400">
                        <ShoppingBag className="w-5 h-5 text-orange-400" />
                        <h3 className="font-extrabold text-slate-100 text-base">{m.name}</h3>
                      </div>
                      <span className="text-xxs font-bold bg-white/10 text-slate-300 px-2 py-0.5 rounded-full border border-white/10">
                        {categories.filter(c => c.marketId === m.id).length} أقسام رئيسية
                      </span>
                    </div>

                    <div className="space-y-3 mr-4 border-r-2 border-white/10 pr-4">
                      {categories.filter(c => c.marketId === m.id).map((c) => (
                        <div key={c.id} className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                          <p className="font-bold text-xs text-slate-200 mb-1.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span>
                            {c.name}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2 mr-3">
                            {subcategories.filter(s => s.categoryId === c.id).map((s) => (
                              <span key={s.id} className="bg-slate-950/40 text-slate-300 border border-white/10 px-2 py-0.5 rounded text-xxs font-semibold">
                                {s.name}
                              </span>
                            ))}
                            {subcategories.filter(s => s.categoryId === c.id).length === 0 && (
                              <span className="text-slate-500 text-xxs italic">لا توجد فروع مضافة بعد</span>
                            )}
                          </div>
                        </div>
                      ))}
                      {categories.filter(c => c.marketId === m.id).length === 0 && (
                        <p className="text-slate-500 text-xs italic">لا توجد أقسام مضافة لهذا السوق</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Creation Forms */}
            <div className="space-y-6">
              
              {/* Form 1: Add Market */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-md">
                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-orange-400" />
                  إضافة سوق رئيسي جديد
                </h3>
                <p className="text-xxs text-slate-400 mb-4">أضف مظلة تخصصية لتضم أقسام ومتاجر</p>

                <form onSubmit={handleCreateMarket} className="space-y-4">
                  <div>
                    <label className="block text-xxs font-bold text-slate-300 mb-1">اسم السوق</label>
                    <input 
                      type="text" 
                      value={marketName}
                      onChange={(e) => setMarketName(e.target.value)}
                      placeholder="سوق الهواتف وصيانة الأجهزة"
                      className="w-full bg-white/5 border border-white/10 text-sm font-sans text-white rounded-xl px-4 py-2.5 focus:border-orange-500 focus:outline-none placeholder:text-slate-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-bold text-slate-300 mb-1">وصف مقتصر</label>
                    <textarea 
                      value={marketDesc}
                      onChange={(e) => setMarketDesc(e.target.value)}
                      placeholder="يضم جميع متاجر بيع وصيانة الهواتف الذكية..."
                      className="w-full bg-white/5 border border-white/10 text-xs font-sans text-white rounded-xl px-4 py-2.5 focus:border-orange-500 focus:outline-none h-16 resize-none placeholder:text-slate-500 transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
                    id="add-market-submit-btn"
                  >
                    حفظ وإضافة السوق
                  </button>
                </form>
              </div>

              {/* Form 2: Add Category */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-md">
                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-orange-400" />
                  إضافة قسم داخل سوق
                </h3>
                <p className="text-xxs text-slate-400 mb-4">أضف تصنيف رئيسي يندرج تحته بضائع</p>

                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div>
                    <label className="block text-xxs font-bold text-slate-300 mb-1">اختر السوق المستهدف</label>
                    <select
                      value={selectedMarketId}
                      onChange={(e) => setSelectedMarketId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-xs font-sans text-white rounded-xl px-4 py-2.5 focus:border-orange-500 focus:bg-slate-900 focus:outline-none text-white [&>option]:bg-slate-950 [&>option]:text-white transition-all cursor-pointer"
                    >
                      <option value="">-- اختر السوق من القائمة --</option>
                      {markets.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xxs font-bold text-slate-300 mb-1">اسم القسم الجديد</label>
                    <input 
                      type="text" 
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="مثال: ملابس شتوية"
                      className="w-full bg-white/5 border border-white/10 text-sm font-sans text-white rounded-xl px-4 py-2.5 focus:border-orange-500 focus:outline-none placeholder:text-slate-500 transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-orange-500/20"
                    id="add-category-submit-btn"
                  >
                    إضافة القسم الرئيسي
                  </button>
                </form>
              </div>

              {/* Form 3: Add Subcategory */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-md">
                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-orange-400" />
                  إضافة فرع داخل قسم
                </h3>
                <p className="text-xxs text-slate-400 mb-4">التصنيف الفرعي الدقيق (مثل مقاسات، نوع خاص)</p>

                <form onSubmit={handleCreateSubcategory} className="space-y-4">
                  <div>
                    <label className="block text-xxs font-bold text-slate-300 mb-1">اختر السوق</label>
                    <select
                      value={selectedCatMarketId}
                      onChange={(e) => {
                        setSelectedCatMarketId(e.target.value);
                        setSelectedCategoryId('');
                      }}
                      className="w-full bg-white/5 border border-white/10 text-xs font-sans text-white rounded-xl px-4 py-2.5 focus:border-orange-500 focus:bg-slate-900 focus:outline-none text-white [&>option]:bg-slate-950 [&>option]:text-white transition-all cursor-pointer"
                    >
                      <option value="">-- اختر السوق --</option>
                      {markets.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xxs font-bold text-slate-300 mb-1">اختر القسم الرئيسي</label>
                    <select
                      value={selectedCategoryId}
                      disabled={!selectedCatMarketId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-xs font-sans text-white rounded-xl px-4 py-2.5 focus:border-orange-500 focus:bg-slate-900 focus:outline-none text-white [&>option]:bg-slate-950 [&>option]:text-white disabled:opacity-30 transition-all cursor-pointer"
                    >
                      <option value="">-- اختر القسم أولاً --</option>
                      {categories.filter(c => c.marketId === selectedCatMarketId).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xxs font-bold text-slate-300 mb-1">اسم الفرع الجديد</label>
                    <input 
                      type="text" 
                      value={subcategoryName}
                      onChange={(e) => setSubcategoryName(e.target.value)}
                      placeholder="مثال: أحذية رياضية جبلية"
                      className="w-full bg-white/5 border border-white/10 text-sm font-sans text-white rounded-xl px-4 py-2.5 focus:border-orange-500 focus:outline-none placeholder:text-slate-500 transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={!selectedCategoryId}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs py-3 rounded-xl transition-all disabled:opacity-30 cursor-pointer shadow-lg shadow-orange-500/20"
                    id="add-subcategory-submit-btn"
                  >
                    إضافة الفرع التخصصي
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}
