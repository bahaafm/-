import { useState } from 'react';
import { Market, Category, Subcategory, Merchant, Product, Customer } from '../types';
import { 
  ShoppingBag, Search, Tag, Box, SlidersHorizontal, LogOut, CheckCircle2,
  ChevronLeft, Percent, Smartphone, Shirt, Gem, Grid, Clock, ChevronDown, Check
} from 'lucide-react';

interface CustomerPanelProps {
  customer: Customer;
  markets: Market[];
  categories: Category[];
  subcategories: Subcategory[];
  products: Product[];
  merchants: Merchant[];
  onLogout: () => void;
}

export default function CustomerPanel({
  customer,
  markets,
  categories,
  subcategories,
  products,
  merchants,
  onLogout
}: CustomerPanelProps) {
  // Navigation & Search State
  const [selectedMarketId, setSelectedMarketId] = useState<string>('m1'); // default first market
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Shopping / Detail view state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [purchaseQty, setPurchaseQty] = useState<number>(1);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Filter products that are VISIBLE:
  // - Merchant must be 'approved'
  // - Merchant's subscription must be 'active'
  const visibleProducts = products.filter(p => {
    const merchant = merchants.find(m => m.id === p.merchantId);
    if (!merchant) return false;
    return merchant.status === 'approved' && merchant.subscriptionStatus === 'active';
  });

  // Filter products by selected market/category/subcategory and search query
  const filteredProducts = visibleProducts.filter(p => {
    if (p.marketId !== selectedMarketId) return false;
    if (selectedCategoryId && p.categoryId !== selectedCategoryId) return false;
    if (selectedSubcategoryId && p.subcategoryId !== selectedSubcategoryId) return false;
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchesName = p.name.toLowerCase().includes(query);
      const matchesType = p.type.toLowerCase().includes(query);
      const matchesDesc = p.description.toLowerCase().includes(query);
      if (!matchesName && !matchesType && !matchesDesc) return false;
    }
    return true;
  });

  // Get active categories for the selected market
  const activeCategories = categories.filter(c => c.marketId === selectedMarketId);

  // Get active subcategories for the selected category
  const activeSubcategories = subcategories.filter(s => s.categoryId === selectedCategoryId);

  const getMarketIcon = (iconName: string | undefined) => {
    switch (iconName) {
      case 'Shirt': return <Shirt className="w-5 h-5" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5" />;
      case 'Gem': return <Gem className="w-5 h-5" />;
      default: return <ShoppingBag className="w-5 h-5" />;
    }
  };

  const getMerchantStoreName = (merchId: string) => {
    return merchants.find(m => m.id === merchId)?.storeName || 'متجر سوق جبلة';
  };

  const handleOpenProduct = (p: Product) => {
    setSelectedProduct(p);
    setSelectedSize(p.sizes[0]?.size || '');
    setPurchaseQty(1);
    setOrderSuccess(false);
  };

  const handleSimulatePurchase = () => {
    if (!selectedProduct || !selectedSize) return;
    
    // Check stock limit
    const sizeStock = selectedProduct.sizes.find(s => s.size === selectedSize);
    if (!sizeStock || sizeStock.quantity < purchaseQty) {
      alert('⚠️ العفو! الكمية المطلوبة غير متوفرة حالياً في المخزن.');
      return;
    }

    // Deduct stock simulation
    sizeStock.quantity -= purchaseQty;
    setOrderSuccess(true);
    setTimeout(() => {
      setSelectedProduct(null);
      setOrderSuccess(false);
    }, 3000);
  };

  // Pricing math
  const calculatePricing = () => {
    if (!selectedProduct) return { original: 0, discount: 0, final: 0 };
    const originalPrice = selectedProduct.price * purchaseQty;
    let discountAmount = 0;

    const disc = selectedProduct.discount;
    if (disc) {
      if (disc.type === 'single') {
        discountAmount = disc.amount * purchaseQty;
      } else if (disc.type === 'quantity' && disc.minQuantity && purchaseQty >= disc.minQuantity) {
        discountAmount = disc.amount; // total package discount or quantity threshold reached
      }
    }

    return {
      original: originalPrice,
      discount: discountAmount,
      final: Math.max(0, originalPrice - discountAmount)
    };
  };

  const pricing = calculatePricing();

  return (
    <div className="bg-transparent min-h-screen text-slate-100 font-sans pb-16" dir="rtl">
      
      {/* Customer Header */}
      <header className="bg-slate-950/40 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-orange-500/20">
              جبلة
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white">تطبيق سوق جبلة الإلكتروني</h1>
              <p className="text-xxs text-slate-400">أهلاً بك، <span className="font-bold text-orange-400">{customer.fullName}</span> &bull; هاتف: <span className="font-mono">{customer.phone}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="relative flex-1 md:w-64 max-w-sm">
              <input
                type="text"
                placeholder="ابحث عن ملابس، أجهزة، بضائع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-2 focus:border-orange-500 focus:bg-white/10 focus:outline-none text-xs text-white placeholder:text-slate-500 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute top-2.5 right-3.5" />
            </div>

            <button
              onClick={onLogout}
              className="bg-white/5 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 p-2 rounded-xl transition-all border border-white/10 cursor-pointer"
              title="تسجيل الخروج"
              id="customer-logout-btn"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Market Selector Horizontal Tab */}
      <section className="bg-white/3 backdrop-blur-md border-b border-white/5 py-3.5 shadow-sm sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {markets.map((m) => {
              const active = m.id === selectedMarketId;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMarketId(m.id);
                    setSelectedCategoryId('');
                    setSelectedSubcategoryId('');
                  }}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                    active 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 scale-[1.02]' 
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                  }`}
                  id={`market-tab-${m.id}`}
                >
                  {getMarketIcon(m.icon)}
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Body Grid */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Category & Subcategory Secondary Navigation Filters */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 shadow-md flex flex-col gap-3 backdrop-blur-md">
          
          {/* Categories Tab */}
          <div>
            <span className="text-xxs font-bold text-slate-400 block mb-2 uppercase tracking-wide">تصفية حسب الأقسام الرئيسية:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  setSelectedCategoryId('');
                  setSelectedSubcategoryId('');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xxs transition-all cursor-pointer ${
                  selectedCategoryId === '' 
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-transparent'
                }`}
              >
                الكل
              </button>
              {activeCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setSelectedSubcategoryId('');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xxs transition-all cursor-pointer ${
                    selectedCategoryId === cat.id 
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' 
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-transparent'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategories (Only visible if category selected) */}
          {selectedCategoryId && activeSubcategories.length > 0 && (
            <div className="pt-3 border-t border-white/10 animate-in fade-in duration-200">
              <span className="text-xxs font-bold text-slate-400 block mb-2 uppercase tracking-wide">تصفية دقيقة حسب الفرع:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedSubcategoryId('')}
                  className={`px-3 py-1 rounded-lg font-semibold text-xxs transition-all cursor-pointer ${
                    selectedSubcategoryId === '' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/5 hover:bg-white/10 text-slate-400'
                  }`}
                >
                  جميع الفروع
                </button>
                {activeSubcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubcategoryId(sub.id)}
                    className={`px-3 py-1 rounded-lg font-semibold text-xxs transition-all cursor-pointer ${
                      selectedSubcategoryId === sub.id 
                        ? 'bg-white/20 text-white' 
                        : 'bg-white/5 hover:bg-white/10 text-slate-400'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Catalog list */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-extrabold text-white">البضائع المتوفرة حالياً في السوق</h2>
              <p className="text-xxs text-slate-400">متاجر مرخصة وذات اشتراكات صالحة وموثقة في سوق جبلة</p>
            </div>
            <span className="text-xxs font-bold text-slate-300 bg-white/10 border border-white/5 px-2.5 py-1 rounded-full">
              {filteredProducts.length} منتج متاح
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center bg-white/5 border border-white/10 rounded-3xl p-16 shadow-lg backdrop-blur-md">
              <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="font-bold text-slate-200 text-base">عذراً! لا توجد معروضات</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                لا توجد بضائع مفعلة في هذا القسم حالياً. قد يكون التجار بانتظار تجديد اشتراك الـ 30 يوماً أو لم يضيفوا سلعاً بعد.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => {
                const totalStock = p.sizes.reduce((sum, s) => sum + s.quantity, 0);
                const hasStock = totalStock > 0;

                return (
                  <div 
                    key={p.id}
                    onClick={() => handleOpenProduct(p)}
                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:shadow-xl hover:border-orange-500/30 transition-all duration-300 cursor-pointer flex flex-col group relative backdrop-blur-md hover:-translate-y-1"
                  >
                    <div className="relative overflow-hidden h-48 bg-slate-900">
                      <img 
                        src={p.imageUrl} 
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    {/* Discount badge absolute */}
                    {p.discount && (
                      <div className="absolute top-3 left-3 bg-rose-500 text-white font-extrabold text-xxs px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1 z-10">
                        <Percent className="w-3.5 h-3.5" />
                        <span>خصم متاح</span>
                      </div>
                    )}

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xxs font-extrabold text-orange-400">{getMerchantStoreName(p.merchantId)}</p>
                          <span className={`text-xxs font-bold px-2 py-0.5 rounded ${hasStock ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'}`}>
                            {hasStock ? `متوفر (${totalStock} قطع)` : 'منتهي المخزون'}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-100 text-sm line-clamp-1 group-hover:text-orange-400 transition-colors mb-1">{p.name}</h3>
                        <p className="text-xxxs text-slate-400 font-sans leading-relaxed mb-2">نوع البضاعة: {p.type}</p>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">{p.description}</p>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-xxs text-slate-400">السعر</p>
                          <p className="font-extrabold text-slate-100 font-sans text-sm mt-0.5">
                            {p.price.toLocaleString('ar-IQ')} <span className="text-xxs font-normal text-slate-400">د.ع</span>
                          </p>
                        </div>
                        <span className="text-orange-400 font-bold text-xs group-hover:translate-x-[-4px] transition-transform flex items-center gap-0.5">
                          <span>تفاصيل وشراء</span>
                          <ChevronLeft className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Product Detail Modal & Quick Checkout Simulation */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-[2rem] max-w-2xl w-full shadow-2xl overflow-hidden border border-white/10 flex flex-col md:flex-row animate-in zoom-in-95 duration-200 max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-y-visible relative">
            
            {/* Product Image Section */}
            <div className="md:w-1/2 relative bg-slate-950 flex items-center justify-center">
              <img 
                src={selectedProduct.imageUrl} 
                alt={selectedProduct.name}
                className="w-full h-full object-cover min-h-[250px] md:min-h-full max-h-[40vh] md:max-h-none"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-slate-950/60 hover:bg-slate-950/85 text-white rounded-full p-2 backdrop-blur-md transition-all cursor-pointer w-8 h-8 flex items-center justify-center font-bold text-lg"
                id="close-product-detail-btn"
              >
                &times;
              </button>
            </div>

            {/* Product Info / Checkout Section */}
            <div className="p-6 md:w-1/2 flex flex-col justify-between">
              <div>
                <span className="text-xxs font-extrabold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                  {getMerchantStoreName(selectedProduct.merchantId)}
                </span>
                <h3 className="font-extrabold text-white text-lg mt-2 mb-1">{selectedProduct.name}</h3>
                <p className="text-xxs text-slate-400 font-sans mb-3">نوع الصنف: {selectedProduct.type}</p>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">{selectedProduct.description}</p>

                {/* Sizes Tabs */}
                <div className="mb-4">
                  <label className="block text-xxs font-extrabold text-slate-400 mb-2">اختر المقاس / الحجم:</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((s) => {
                      const active = s.size === selectedSize;
                      const hasQty = s.quantity > 0;
                      return (
                        <button
                          key={s.size}
                          disabled={!hasQty}
                          onClick={() => {
                            setSelectedSize(s.size);
                            setPurchaseQty(1);
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            active 
                              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-lg shadow-orange-500/20' 
                              : hasQty 
                                ? 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10' 
                                : 'bg-white/3 text-slate-500 border-white/5 cursor-not-allowed line-through'
                          }`}
                        >
                          {s.size} ({s.quantity} متاح)
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity input */}
                <div className="mb-6">
                  <label className="block text-xxs font-extrabold text-slate-400 mb-2">تحديد عدد القطع المطلوبة:</label>
                  <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl border border-white/10 max-w-[150px]">
                    <button
                      onClick={() => setPurchaseQty(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 flex items-center justify-center font-bold text-slate-300 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold font-sans text-sm text-white">{purchaseQty}</span>
                    <button
                      onClick={() => {
                        const currentMax = selectedProduct.sizes.find(s => s.size === selectedSize)?.quantity || 1;
                        setPurchaseQty(prev => Math.min(currentMax, prev + 1));
                      }}
                      className="w-8 h-8 flex items-center justify-center font-bold text-slate-300 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Discount banner if applicable */}
                {selectedProduct.discount && (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-6">
                    <p className="text-xxs font-extrabold text-rose-400 flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5 text-rose-400" />
                      عرض تخفيض نشط: {selectedProduct.discount.description}
                    </p>
                    <p className="text-xxxs text-rose-300 mt-0.5 leading-relaxed">
                      {selectedProduct.discount.type === 'single' 
                        ? `خصم مباشر بقيمة ${selectedProduct.discount.amount.toLocaleString('ar-IQ')} د.ع على كل قطعة.` 
                        : `خصم بقيمة ${selectedProduct.discount.amount.toLocaleString('ar-IQ')} د.ع يطبق عند شراء ${selectedProduct.discount.minQuantity} قطع أو أكثر.`}
                    </p>
                  </div>
                )}
              </div>

              {/* Purchase Calculation & Button */}
              <div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-4 space-y-2 text-xs backdrop-blur-md">
                  <div className="flex justify-between">
                    <span className="text-slate-400">السعر الإجمالي قبل التخفيض:</span>
                    <span className="font-semibold font-sans text-slate-200">{pricing.original.toLocaleString('ar-IQ')} د.ع</span>
                  </div>
                  {pricing.discount > 0 && (
                    <div className="flex justify-between text-rose-400 font-bold">
                      <span>قيمة التخفيض المستحق:</span>
                      <span>- {pricing.discount.toLocaleString('ar-IQ')} د.ع</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-sm text-white">
                    <span>الصافي المطلوب للدفع:</span>
                    <span className="text-orange-400 font-sans">{pricing.final.toLocaleString('ar-IQ')} د.ع</span>
                  </div>
                </div>

                {orderSuccess ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold p-3.5 rounded-xl text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>تم محاكاة الشراء وإرسال الطلب للمتجر بنجاح!</span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSimulatePurchase}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-600/30 transition-all text-center cursor-pointer ring-1 ring-orange-400/50"
                      id="simulate-checkout-btn"
                    >
                      تأكيد الطلب والشراء د.ع
                    </button>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="bg-white/5 hover:bg-white/10 text-slate-300 font-semibold py-3 px-4 rounded-xl transition-colors text-xs cursor-pointer border border-white/10"
                    >
                      إلغاء
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
