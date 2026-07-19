import React, { useState } from 'react';
import { Market, Category, Subcategory, Merchant, Product, SizeStock, DiscountOffer } from '../types';
import { 
  Store, ShoppingBag, Plus, Trash2, Calendar, FileText, 
  Sparkles, Layers, Box, Info, Tag, AlertTriangle, LogOut, Download
} from 'lucide-react';

interface MerchantPanelProps {
  merchant: Merchant;
  markets: Market[];
  categories: Category[];
  subcategories: Subcategory[];
  products: Product[];
  onAddProduct: (productData: Omit<Product, 'id' | 'merchantId'>) => void;
  onDeleteProduct: (id: string) => void;
  onLogout: () => void;
  onGenerateReport: () => void;
}

export default function MerchantPanel({
  merchant,
  markets,
  categories,
  subcategories,
  products,
  onAddProduct,
  onDeleteProduct,
  onLogout,
  onGenerateReport
}: MerchantPanelProps) {
  // Navigation
  const [activeSubTab, setActiveSubTab] = useState<'my_products' | 'add_product'>('my_products');

  // Product Form State
  const [marketId, setMarketId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState('');

  // Sizes List Form State
  const [sizes, setSizes] = useState<SizeStock[]>([{ size: 'Standard', quantity: 10 }]);
  const [tempSize, setTempSize] = useState('');
  const [tempQty, setTempQty] = useState<number>(5);

  // Discount Offer State
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<'single' | 'quantity'>('single');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [minQty, setMinQty] = useState<number>(3);
  const [discountDays, setDiscountDays] = useState<number>(7);
  const [discountDesc, setDiscountDesc] = useState('');

  // Notification Banner
  const [notif, setNotif] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const triggerNotif = (type: 'success' | 'error', text: string) => {
    setNotif({ type, text });
    setTimeout(() => setNotif(null), 4000);
  };

  // Add a size-stock item to the local product size state
  const handleAddSizeItem = () => {
    if (!tempSize.trim()) {
      triggerNotif('error', 'يرجى إدخال اسم المقاس أو الحجم (مثال: XL, 42, لتر)');
      return;
    }
    if (tempQty <= 0) {
      triggerNotif('error', 'يجب أن تكون الكمية أكبر من الصفر');
      return;
    }

    // Check if size already exists
    if (sizes.some(s => s.size.toLowerCase() === tempSize.trim().toLowerCase())) {
      triggerNotif('error', 'هذا المقاس مضاف مسبقاً لهذا المنتج');
      return;
    }

    setSizes([...sizes, { size: tempSize.trim(), quantity: tempQty }]);
    setTempSize('');
    setTempQty(5);
    triggerNotif('success', 'تم إضافة المقاس بنجاح');
  };

  const handleRemoveSizeItem = (indexToRemove: number) => {
    if (sizes.length <= 1) {
      triggerNotif('error', 'يجب توفير مقاس واحد على الأقل للمنتج');
      return;
    }
    setSizes(sizes.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit new product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!marketId || !categoryId || !subcategoryId) {
      triggerNotif('error', 'يرجى تحديد السوق، القسم الرئيسي، والفرع');
      return;
    }
    if (!name.trim()) {
      triggerNotif('error', 'يرجى كتابة اسم المنتج');
      return;
    }
    if (!type.trim()) {
      triggerNotif('error', 'يرجى كتابة نوع المنتج (مثال: ملابس قطنية، هواتف ذكية)');
      return;
    }
    if (price <= 0) {
      triggerNotif('error', 'يرجى كتابة سعر صحيح للمنتج');
      return;
    }
    if (sizes.length === 0) {
      triggerNotif('error', 'يرجى إضافة مقاس واحد على الأقل مع الكمية المتاحة');
      return;
    }

    let discount: DiscountOffer | null = null;
    if (hasDiscount) {
      if (discountAmount <= 0) {
        triggerNotif('error', 'يرجى كتابة مبلغ تخفيض صحيح');
        return;
      }
      if (discountAmount >= price) {
        triggerNotif('error', 'لا يمكن أن يكون التخفيض مساوياً أو أكبر من السعر الأصلي');
        return;
      }

      discount = {
        type: discountType,
        amount: discountAmount,
        minQuantity: discountType === 'quantity' ? minQty : undefined,
        durationDays: discountDays,
        startDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + discountDays * 24 * 60 * 60 * 1000).toISOString(),
        description: discountDesc.trim() || (discountType === 'single' ? 'تخفيض محدود على قطعة واحدة' : `تخفيض خاص عند شراء ${minQty} قطع أو أكثر`)
      };
    }

    // Default placeholder image if empty
    const productImg = imageUrl.trim() || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60';

    onAddProduct({
      marketId,
      categoryId,
      subcategoryId,
      name: name.trim(),
      type: type.trim(),
      description: description.trim(),
      price,
      sizes,
      discount,
      imageUrl: productImg
    });

    // Reset Form
    setName('');
    setType('');
    setDescription('');
    setPrice(0);
    setSizes([{ size: 'Standard', quantity: 10 }]);
    setHasDiscount(false);
    setDiscountAmount(0);
    setDiscountDesc('');
    setImageUrl('');
    setActiveSubTab('my_products');
    triggerNotif('success', 'تم إضافة المنتج وعرضه بنجاح!');
  };

  // Filter merchant's specific products
  const myProducts = products.filter(p => p.merchantId === merchant.id);

  // Check subscription countdown
  const now = new Date();
  const expiry = new Date(merchant.subscriptionExpiry);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpired = diffDays <= 0 || merchant.subscriptionStatus === 'expired';
  const isSuspended = merchant.subscriptionStatus === 'suspended';

  return (
    <div className="bg-transparent min-h-screen text-slate-100 font-sans pb-16" dir="rtl">
      
      {/* Merchant Top Bar */}
      <header className="bg-slate-950/40 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white p-2.5 rounded-2xl font-black text-xl shadow-lg shadow-orange-500/20">
              تاجر
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{merchant.storeName}</h1>
                <span className="bg-orange-500/10 text-orange-400 text-xxs font-bold px-2 py-0.5 rounded-full border border-orange-500/20">بوابة التاجر</span>
              </div>
              <p className="text-xs text-slate-400">التاجر المسؤول: {merchant.fullName} &bull; هاتف: <span className="font-mono text-slate-300 font-medium">{merchant.phone}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="bg-white/5 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 border border-white/10 cursor-pointer"
              id="merchant-logout-btn"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Subscription Alert Warning */}
        {(isExpired || isSuspended) ? (
          <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-3xl p-6 mb-8 shadow-xl shadow-red-500/15 flex flex-col sm:flex-row justify-between items-center gap-4 border border-rose-500/40">
            <div className="flex items-center gap-4 text-center sm:text-right">
              <div className="bg-white/10 p-3.5 rounded-2xl">
                <AlertTriangle className="w-8 h-8 text-white animate-bounce" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">تنبيه: اشتراكك معطل حالياً!</h3>
                <p className="text-xs text-rose-100 leading-relaxed mt-1 max-w-xl">
                  {isExpired 
                    ? 'لقد انتهت صلاحية اشتراك الـ 30 يوماً الخاصة بمتجرك وتوقفت تلقائياً. منتجاتك مخفية الآن عن الزبائن لضمان موثوقية المعاملات.' 
                    : 'لقد تم إيقاف اشتراكك مؤقتاً من قبل لوحة الإدارة. منتجاتك مخفية عن الزبائن حتى يتم إلغاء الإيقاف.'}
                </p>
              </div>
            </div>
            <div className="bg-white/10 px-5 py-3 rounded-2xl text-center border border-white/10">
              <p className="text-xxs uppercase tracking-wider text-rose-100">يرجى الاتصال بالإدارة</p>
              <p className="font-bold text-sm mt-0.5 font-sans">بهاء محمد: 07806722599</p>
            </div>
          </div>
        ) : (
          /* Subscription Healthy Badge Banner */
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-3xl p-6 mb-8 shadow-lg shadow-orange-600/20 flex flex-col sm:flex-row justify-between items-center gap-4 border border-orange-500/20">
            <div className="flex items-center gap-4 text-center sm:text-right">
              <div className="bg-white/10 p-3 rounded-2xl">
                <Store className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-base">حالة الاشتراك: مفعّل ونشط بالكامل</h3>
                <p className="text-xs text-orange-100 mt-1">
                  أنت شريك معتمد في سوق جبلة. جميع منتجاتك المعروضة تظهر تلقائياً للزبائن وتحديثاتك فورية.
                </p>
              </div>
            </div>
            <div className="bg-white/10 px-5 py-2.5 rounded-2xl text-center border border-white/10">
              <p className="text-xxs uppercase tracking-wider text-orange-100">ينتهي اشتراكك الحالي بعد</p>
              <p className="font-bold text-sm mt-0.5 font-mono">{diffDays} يوم ({expiry.toLocaleDateString('ar-IQ')})</p>
            </div>
          </div>
        )}

        {/* Quick notification */}
        {notif && (
          <div className={`p-4 rounded-xl mb-6 flex items-center justify-between border animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-md ${
            notif.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            <span className="text-sm font-bold">{notif.text}</span>
            <button onClick={() => setNotif(null)} className="text-xs opacity-60 hover:opacity-100 cursor-pointer">&times;</button>
          </div>
        )}

        {/* Action Tabs & PDF Report Button */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex gap-1 shadow-md backdrop-blur-md">
            <button
              onClick={() => setActiveSubTab('my_products')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'my_products' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>بضاعتي المعروضة ({myProducts.length})</span>
            </button>
            <button
              onClick={() => {
                if (isExpired || isSuspended) {
                  triggerNotif('error', 'عذراً! لا يمكنك إضافة منتجات جديدة وحسابك معطل أو منتهي الاشتراك. تواصل مع الإدارة.');
                  return;
                }
                setActiveSubTab('add_product');
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'add_product' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>إضافة منتج جديد</span>
            </button>
          </div>

          <button
            onClick={onGenerateReport}
            className="bg-white/5 border border-orange-500/30 hover:border-orange-500/60 text-orange-400 font-bold text-xs px-5 py-3 rounded-2xl shadow-md hover:shadow-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
            id="merchant-inventory-report-btn"
          >
            <FileText className="w-4 h-4 text-orange-400" />
            <span>سحب تقرير البضاعة والمخزون PDF</span>
          </button>
        </div>

        {/* Tab content */}
        {activeSubTab === 'my_products' ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-md">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white">جرد بضائع المتجر الحالية</h2>
              <p className="text-xs text-slate-400">القائمة الكاملة لكل بضائعك المضافة مع تتبع مستويات المخزون لكل مقاس وحجم</p>
            </div>

            {myProducts.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl">
                <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="font-bold text-slate-200 text-base">لا توجد بضائع بعد</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                  لم تقم بإضافة أي بضائع أو منتجات حتى الآن. اضغط على زر "إضافة منتج جديد" لبدء البيع وعرض بضائعك.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProducts.map((p) => {
                  const totalQty = p.sizes.reduce((sum, s) => sum + s.quantity, 0);
                  const marketName = markets.find(m => m.id === p.marketId)?.name || 'سوق عام';
                  const catName = categories.find(c => c.id === p.categoryId)?.name || 'عام';
                  const subCatName = subcategories.find(s => s.id === p.subcategoryId)?.name || 'عام';

                  return (
                    <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:shadow-xl hover:border-orange-500/20 transition-all duration-300 flex flex-col group relative backdrop-blur-md">
                      {/* Subscription Hidden Indicator */}
                      {(isExpired || isSuspended) && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-4">
                          <AlertTriangle className="w-8 h-8 text-rose-500 mb-2 animate-pulse" />
                          <p className="text-white text-xs font-bold leading-relaxed">هذا المنتج مخفي عن الزبائن</p>
                          <p className="text-rose-300 text-xxs mt-0.5">بسبب عدم تفعيل اشتراك المتجر</p>
                        </div>
                      )}

                      <div className="h-44 overflow-hidden relative bg-slate-950">
                        <img 
                          src={p.imageUrl} 
                          alt={p.name}
                          className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xxs font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded border border-white/10">
                              {p.type}
                            </span>
                            {p.discount && (
                              <span className="text-xxs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 flex items-center gap-0.5 animate-pulse">
                                <Tag className="w-3 h-3" />
                                {p.discount.type === 'single' ? 'خصم مفرد' : 'خصم كميات'}
                              </span>
                            )}
                          </div>
                          
                          <h3 className="font-bold text-slate-100 text-sm line-clamp-1 mb-1">{p.name}</h3>
                          <p className="text-xxs text-slate-400 font-sans leading-relaxed mb-3">
                            {marketName} &bull; {catName} &bull; {subCatName}
                          </p>
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">{p.description}</p>
                          
                          {/* Sizes details */}
                          <div className="bg-white/5 rounded-xl p-3 border border-white/5 mb-4">
                            <h4 className="text-xxs font-bold text-slate-400 mb-2">المخزون حسب الحجم والمقاس:</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {p.sizes.map((s, idx) => (
                                <span key={idx} className="bg-white/5 border border-white/10 text-xxs font-semibold text-slate-200 px-2 py-1 rounded-lg">
                                  <span>{s.size}: </span>
                                  <span className="font-bold text-orange-400">{s.quantity}</span>
                                </span>
                              ))}
                            </div>
                            <p className="text-xxs text-slate-400 font-sans font-medium mt-2">مجموع القطع الكلي: <span className="font-bold text-slate-200">{totalQty} قطعة</span></p>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-end justify-between pt-3 border-t border-white/10 mt-2">
                            <div>
                              <p className="text-xxs text-slate-400">سعر البيع</p>
                              <p className="font-bold text-slate-100 font-sans text-sm mt-0.5">
                                {p.price.toLocaleString('ar-IQ')} <span className="text-xxs font-normal">د.ع</span>
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                onDeleteProduct(p.id);
                                triggerNotif('success', 'تم حذف المنتج من بضاعتك بنجاح.');
                              }}
                              className="p-2 hover:bg-rose-500/10 rounded-xl text-slate-400 hover:text-rose-400 transition-colors border border-white/10 cursor-pointer"
                              title="حذف المنتج"
                              id={`delete-prod-${p.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Add Product view */
          <form onSubmit={handleCreateProduct} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Primary Product info */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-md">
              <div>
                <h2 className="text-lg font-bold text-white">معلومات السلعة أو المنتج</h2>
                <p className="text-xs text-slate-400">أدخل التفاصيل الأساسية ووصف البضاعة للزبائن</p>
              </div>

              {/* Categorization */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xxs font-bold text-slate-300 mb-1">السوق المستهدف</label>
                  <select
                    value={marketId}
                    onChange={(e) => {
                      setMarketId(e.target.value);
                      setCategoryId('');
                      setSubcategoryId('');
                    }}
                    className="w-full bg-white/5 border border-white/10 text-xs rounded-xl px-4 py-2.5 focus:border-orange-500 focus:bg-slate-900 focus:outline-none text-white [&>option]:bg-slate-950 [&>option]:text-white transition-all cursor-pointer"
                    required
                  >
                    <option value="">-- اختر السوق --</option>
                    {markets.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xxs font-bold text-slate-300 mb-1">القسم الرئيسي</label>
                  <select
                    value={categoryId}
                    disabled={!marketId}
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      setSubcategoryId('');
                    }}
                    className="w-full bg-white/5 border border-white/10 text-xs rounded-xl px-4 py-2.5 focus:border-orange-500 focus:bg-slate-900 focus:outline-none text-white [&>option]:bg-slate-950 [&>option]:text-white disabled:opacity-30 transition-all cursor-pointer"
                    required
                  >
                    <option value="">-- اختر القسم أولاً --</option>
                    {categories.filter(c => c.marketId === marketId).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xxs font-bold text-slate-300 mb-1">الفرع التخصصي</label>
                  <select
                    value={subcategoryId}
                    disabled={!categoryId}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-xs rounded-xl px-4 py-2.5 focus:border-orange-500 focus:bg-slate-900 focus:outline-none text-white [&>option]:bg-slate-950 [&>option]:text-white disabled:opacity-30 transition-all cursor-pointer"
                    required
                  >
                    <option value="">-- اختر الفرع أولاً --</option>
                    {subcategories.filter(s => s.categoryId === categoryId).map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xxs font-bold text-slate-300 mb-1">اسم المنتج</label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: قميص رجالي رسمي كم طويل"
                    className="w-full bg-white/5 border border-white/10 text-sm rounded-xl px-4 py-2.5 focus:border-orange-500 focus:bg-white/10 focus:outline-none text-white placeholder:text-slate-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xxs font-bold text-slate-300 mb-1">نوع المنتج وتخصصه</label>
                  <input 
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="مثال: قمصان سبورت رسمية"
                    className="w-full bg-white/5 border border-white/10 text-sm rounded-xl px-4 py-2.5 focus:border-orange-500 focus:bg-white/10 focus:outline-none text-white placeholder:text-slate-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Price and Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xxs font-bold text-slate-300 mb-1">السعر المفرد (بالدينار العراقي)</label>
                  <input 
                    type="number"
                    value={price || ''}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="مثال: 25000"
                    className="w-full bg-white/5 border border-white/10 text-sm rounded-xl px-4 py-2.5 focus:border-orange-500 focus:bg-white/10 focus:outline-none text-white placeholder:text-slate-500 font-mono transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xxs font-bold text-slate-300 mb-1">رابط صورة المنتج (اختياري)</label>
                  <input 
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="ضع رابط صورة من الإنترنت أو اتركها فارغة للتلقائي"
                    className="w-full bg-white/5 border border-white/10 text-xs rounded-xl px-4 py-2.5 focus:border-orange-500 focus:bg-white/10 focus:outline-none text-white placeholder:text-slate-500 transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xxs font-bold text-slate-300 mb-1">وصف المنتج ومميزاته بالتفصيل</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب خامات المنتج، بلد المنشأ، إرشادات الاستخدام وأي تفاصيل تهم المشتري..."
                  className="w-full bg-white/5 border border-white/10 text-sm rounded-xl px-4 py-2.5 focus:border-orange-500 focus:bg-white/10 focus:outline-none text-white placeholder:text-slate-500 h-32 resize-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-orange-600/30 transition-all text-center hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ring-1 ring-orange-400/50"
                id="merchant-add-product-submit-btn"
              >
                حفظ ونشر السلعة في سوق جبلة
              </button>
            </div>

            {/* Inventory sizes & discounts */}
            <div className="space-y-6">
              
              {/* Product Size manager */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-md">
                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-orange-400" />
                  المقاسات المتاحة والكميات
                </h3>
                <p className="text-xxs text-slate-400 mb-4">أضف كل مقاس (مثل XL أو 42 أو 1 لتر) مع كمية القطع المتوفرة منه في المخزن</p>

                {/* Added Sizes list */}
                <div className="space-y-2 mb-4 max-h-44 overflow-y-auto pr-1">
                  {sizes.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="bg-orange-500/10 text-orange-400 text-xxs font-bold px-2 py-0.5 rounded border border-orange-500/20">مقاس {idx+1}</span>
                        <p className="text-xs font-bold text-slate-100">{s.size}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xs text-slate-300">الكمية: <span className="font-bold text-white font-sans">{s.quantity} قطعة</span></p>
                        <button
                          type="button"
                          onClick={() => handleRemoveSizeItem(idx)}
                          className="p-1 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded transition-colors cursor-pointer"
                          title="حذف هذا المقاس"
                          id={`remove-size-item-${idx}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new size input row */}
                <div className="bg-white/5 rounded-2xl p-3 border border-dashed border-white/10">
                  <p className="text-xxs font-bold text-slate-300 mb-2">إضافة حجم/مقاس جديد:</p>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="block text-xxxs text-slate-400 mb-0.5">المقاس / الحجم</label>
                      <input 
                        type="text"
                        value={tempSize}
                        onChange={(e) => setTempSize(e.target.value)}
                        placeholder="XL / 42 / 1 لتر"
                        className="w-full bg-slate-950/40 border border-white/10 text-xs rounded-lg px-2.5 py-1.5 focus:border-orange-500 focus:outline-none text-white placeholder:text-slate-600 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xxxs text-slate-400 mb-0.5">الكمية المتوفرة</label>
                      <input 
                        type="number"
                        value={tempQty || ''}
                        onChange={(e) => setTempQty(Number(e.target.value))}
                        placeholder="العدد"
                        className="w-full bg-slate-950/40 border border-white/10 text-xs rounded-lg px-2.5 py-1.5 focus:border-orange-500 focus:outline-none text-white placeholder:text-slate-600 font-sans transition-all"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSizeItem}
                    className="w-full bg-white/10 hover:bg-white/20 text-slate-200 text-xxs font-bold py-2 rounded-lg transition-colors cursor-pointer"
                    id="add-size-item-btn"
                  >
                    + إضافة المقاس للقائمة
                  </button>
                </div>
              </div>

              {/* Discount Offers Creator */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-rose-400" />
                    تخفيض وعروض خاصة
                  </h3>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={hasDiscount}
                      onChange={(e) => setHasDiscount(e.target.checked)}
                      className="sr-only peer"
                      id="enable-discount-checkbox"
                    />
                    <div className="relative w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full rtl:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500 cursor-pointer"></div>
                  </label>
                </div>
                <p className="text-xxs text-slate-400 mb-4">هل ترغب في إضافة تخفيض لفترة محدودة على السعر لزيادة المبيعات؟</p>

                {hasDiscount && (
                  <div className="space-y-4 pt-3 border-t border-white/10 animate-in fade-in duration-200">
                    
                    {/* Discount type toggle */}
                    <div>
                      <label className="block text-xxs font-bold text-slate-300 mb-1">نوع التخفيض والعرض</label>
                      <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-1 rounded-xl border border-white/10">
                        <button
                          type="button"
                          onClick={() => setDiscountType('single')}
                          className={`py-1.5 rounded-lg text-xxs font-bold transition-all cursor-pointer ${
                            discountType === 'single' 
                              ? 'bg-rose-500 text-white shadow-sm' 
                              : 'text-slate-400 hover:text-white'
                          }`}
                          id="discount-type-single-btn"
                        >
                          تخفيض على قطعة واحدة
                        </button>
                        <button
                          type="button"
                          onClick={() => setDiscountType('quantity')}
                          className={`py-1.5 rounded-lg text-xxs font-bold transition-all cursor-pointer ${
                            discountType === 'quantity' 
                              ? 'bg-rose-500 text-white shadow-sm' 
                              : 'text-slate-400 hover:text-white'
                          }`}
                          id="discount-type-qty-btn"
                        >
                          تخفيض على الكميات
                        </button>
                      </div>
                    </div>

                    {/* Discount parameters */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xxs font-bold text-slate-300 mb-1">مبلغ التخفيض (د.ع)</label>
                        <input 
                          type="number"
                          value={discountAmount || ''}
                          onChange={(e) => setDiscountAmount(Number(e.target.value))}
                          placeholder="مثال: 5000 خصم"
                          className="w-full bg-slate-950/40 border border-white/10 text-xs rounded-xl px-2.5 py-1.5 focus:border-rose-500 focus:outline-none text-white placeholder:text-slate-600 font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-xxs font-bold text-slate-300 mb-1">مدة العرض (بالأيام)</label>
                        <input 
                          type="number"
                          value={discountDays}
                          onChange={(e) => setDiscountDays(Number(e.target.value))}
                          placeholder="أيام العرض"
                          className="w-full bg-slate-950/40 border border-white/10 text-xs rounded-xl px-2.5 py-1.5 focus:border-rose-500 focus:outline-none text-white placeholder:text-slate-600 font-sans"
                        />
                      </div>
                    </div>

                    {discountType === 'quantity' && (
                      <div>
                        <label className="block text-xxs font-bold text-slate-300 mb-1">الحد الأدنى للقطع للاستفادة</label>
                        <input 
                          type="number"
                          value={minQty}
                          onChange={(e) => setMinQty(Number(e.target.value))}
                          placeholder="مثال: 3 قطع"
                          className="w-full bg-slate-950/40 border border-white/10 text-xs rounded-xl px-2.5 py-1.5 focus:border-rose-500 focus:outline-none text-white placeholder:text-slate-600 font-sans"
                        />
                        <p className="text-xxxs text-rose-400 mt-1">يستحق الزبون خصم بقيمة {discountAmount.toLocaleString('ar-IQ')} د.ع عند شراء {minQty} قطع أو أكثر.</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-xxs font-bold text-slate-300 mb-1">نص ووصف العرض (اختياري)</label>
                      <input 
                        type="text"
                        value={discountDesc}
                        onChange={(e) => setDiscountDesc(e.target.value)}
                        placeholder="مثال: عرض صيفي خاص بنصف القيمة..."
                        className="w-full bg-slate-950/40 border border-white/10 text-xs rounded-xl px-2.5 py-1.5 focus:border-rose-500 focus:outline-none text-white placeholder:text-slate-600"
                      />
                    </div>

                  </div>
                )}
              </div>

            </div>
          </form>
        )}

      </main>
    </div>
  );
}
