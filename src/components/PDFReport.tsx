import { Merchant, Product, Market, Category, Subcategory } from '../types';
import { FileText, Printer, ArrowRight, TrendingUp, Calendar, Info, Layers } from 'lucide-react';

interface PDFReportProps {
  merchant: Merchant;
  products: Product[];
  markets: Market[];
  categories: Category[];
  subcategories: Subcategory[];
  onBack: () => void;
}

export default function PDFReport({ merchant, products, markets, categories, subcategories, onBack }: PDFReportProps) {
  const getMarketName = (id: string) => markets.find(m => m.id === id)?.name || id;
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || id;
  const getSubcategoryName = (id: string) => subcategories.find(s => s.id === id)?.name || id;

  // Calculate statistics
  const totalItems = products.reduce((sum, p) => sum + p.sizes.reduce((sSum, s) => sSum + s.quantity, 0), 0);
  const totalValue = products.reduce((sum, p) => {
    const itemStock = p.sizes.reduce((sSum, s) => sSum + s.quantity, 0);
    return sum + (p.price * itemStock);
  }, 0);
  const uniqueProductsCount = products.length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-transparent min-h-screen pb-16 font-sans" dir="rtl">
      {/* Top action bar - Hidden in Print */}
      <div className="bg-slate-950/40 backdrop-blur-md border-b border-white/10 py-4 px-6 sticky top-0 z-30 shadow-lg print:hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-slate-300 hover:text-white transition-all cursor-pointer"
              title="العودة"
              id="back-report-btn"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-white">تقرير بضاعة ومخزون المتجر</h2>
              <p className="text-xs text-slate-400">سحب التقرير وحفظه كملف PDF</p>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer"
            id="print-report-btn"
          >
            <Printer className="w-5 h-5" />
            <span>طباعة التقرير / حفظ PDF</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        {/* Printable Area Card */}
        <div className="bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 sm:p-10 shadow-2xl text-white print:bg-white print:text-slate-950 print:shadow-none print:border-none print:p-0 print:rounded-none" id="printable-report-area">
          
          {/* Header Document Style */}
          <div className="border-b-4 border-orange-500 pb-8 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:border-b-4 print:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg">
                جبلة
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white print:text-slate-900 tracking-tight">سوق جبلة الإلكتروني</h1>
                <p className="text-sm text-orange-400 print:text-slate-600 font-semibold tracking-wide">منصة التاجر والزبون المتكاملة</p>
              </div>
            </div>
            <div className="text-left sm:text-left dir-ltr flex flex-col items-end">
              <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 print:bg-slate-100 print:text-slate-800 px-3 py-1 rounded-full text-xs font-bold font-sans tracking-wide mb-1 select-none">
                تقرير رسمي للمخزون
              </span>
              <p className="text-sm text-slate-400 print:text-slate-500 flex items-center gap-1.5 font-mono">
                <span>{new Date().toLocaleDateString('ar-IQ')}</span>
                <Calendar className="w-4 h-4 text-slate-500" />
              </p>
            </div>
          </div>

          {/* Report Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 rounded-2xl p-6 mb-8 border border-white/10 print:bg-slate-50 print:text-slate-900 print:border-slate-200">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                معلومات المتجر والتاجر
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-slate-300 print:text-slate-700"><strong className="text-slate-500">اسم المتجر:</strong> <span className="font-bold text-white print:text-slate-900">{merchant.storeName}</span></p>
                <p className="text-slate-300 print:text-slate-700"><strong className="text-slate-500">التاجر المسؤول:</strong> <span className="font-semibold text-slate-200 print:text-slate-800">{merchant.fullName}</span></p>
                <p className="text-slate-300 print:text-slate-700"><strong className="text-slate-500">رقم الهاتف:</strong> <span className="font-mono text-slate-200 print:text-slate-800">{merchant.phone}</span></p>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                ملخص إحصاءات البضاعة
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-slate-300 print:text-slate-700"><strong className="text-slate-500">عدد المنتجات الفريدة:</strong> <span className="font-bold text-white print:text-slate-900">{uniqueProductsCount} صنف</span></p>
                <p className="text-slate-300 print:text-slate-700"><strong className="text-slate-500">إجمالي كمية القطع:</strong> <span className="font-bold text-white print:text-slate-900">{totalItems} قطعة</span></p>
                <p className="text-slate-300 print:text-slate-700">
                  <strong className="text-slate-500">إجمالي القيمة التقديرية:</strong> 
                  <span className="font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded mr-1 print:bg-slate-100 print:text-slate-900 print:border print:border-slate-300">
                    {totalValue.toLocaleString('ar-IQ')} د.ع
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Table of products */}
          <div>
            <h3 className="text-base font-bold text-white print:text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-400" />
              تفاصيل قائمة البضائع والمنتجات
            </h3>
            
            <div className="overflow-x-auto rounded-xl border border-white/10 print:border-slate-200 shadow-sm">
              <table className="w-full text-right text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-950/40 text-slate-200 font-bold border-b border-white/10 print:bg-slate-100 print:text-slate-900 print:border-slate-200">
                    <th className="py-3.5 px-4">#</th>
                    <th className="py-3.5 px-4">اسم المنتج والتصنيف</th>
                    <th className="py-3.5 px-4">النوع</th>
                    <th className="py-3.5 px-4 text-center">المقاسات والمخزون والكمية</th>
                    <th className="py-3.5 px-4 text-left">السعر المفرد</th>
                    <th className="py-3.5 px-4 text-left">التخفيض المتاح</th>
                    <th className="py-3.5 px-4 text-left">القيمة الإجمالية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-slate-200">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">لا توجد منتجات مضافة لهذا المتجر حالياً.</td>
                    </tr>
                  ) : (
                    products.map((p, idx) => {
                      const totalQty = p.sizes.reduce((sum, s) => sum + s.quantity, 0);
                      const totalItemValue = p.price * totalQty;
                      return (
                        <tr key={p.id} className="hover:bg-white/5 print:hover:bg-transparent transition-colors">
                          <td className="py-4 px-4 font-mono text-slate-500 text-xs">{idx + 1}</td>
                          <td className="py-4 px-4">
                            <p className="font-bold text-slate-100 print:text-slate-900 text-sm">{p.name}</p>
                            <p className="text-xxs text-slate-400 print:text-slate-500 flex flex-wrap gap-1 mt-1">
                              <span>{getMarketName(p.marketId)}</span>
                              <span>&bull;</span>
                              <span>{getCategoryName(p.categoryId)}</span>
                              <span>&bull;</span>
                              <span>{getSubcategoryName(p.subcategoryId)}</span>
                            </p>
                          </td>
                          <td className="py-4 px-4 text-slate-300 print:text-slate-600 text-xs">{p.type}</td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex flex-wrap justify-center gap-1.5">
                              {p.sizes.map((s, i) => (
                                <span key={i} className="inline-flex items-center gap-1 text-xxs font-semibold bg-white/5 border border-white/10 text-slate-200 px-1.5 py-0.5 rounded print:bg-slate-100 print:border-slate-300 print:text-slate-800">
                                  <span>{s.size}:</span>
                                  <span className="font-bold text-orange-400 print:text-slate-900">{s.quantity}</span>
                                </span>
                              ))}
                            </div>
                            <p className="text-xxs text-slate-400 print:text-slate-500 mt-1 font-sans">الإجمالي: <span className="font-bold text-slate-200 print:text-slate-700">{totalQty} قطعة</span></p>
                          </td>
                          <td className="py-4 px-4 text-left font-semibold font-mono text-slate-300 print:text-slate-700 text-xs">
                            {p.price.toLocaleString('ar-IQ')} د.ع
                          </td>
                          <td className="py-4 px-4 text-left">
                            {p.discount ? (
                              <div className="text-right">
                                <span className="text-xxs font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded print:text-slate-800 print:bg-slate-100 print:border">
                                  {p.discount.type === 'single' ? 'خصم مفرد' : 'خصم كميات'}
                                </span>
                                <p className="text-xxs text-orange-300 print:text-slate-700 mt-1">{p.discount.amount.toLocaleString('ar-IQ')} د.ع</p>
                              </div>
                            ) : (
                              <span className="text-slate-500 print:text-slate-400 text-xxs">لا يوجد خصم</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-left font-bold font-mono text-orange-400 print:text-slate-900 text-xs">
                            {totalItemValue.toLocaleString('ar-IQ')} د.ع
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer of report */}
          <div className="mt-12 pt-8 border-t border-white/10 print:border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 print:text-slate-500 text-xs">
            <p>تم استخراج هذا التقرير آلياً عبر لوحة تحكم سوق جبلة.</p>
            <div className="flex items-center gap-4 font-mono">
              <p>رمز التحقق للمستند: <span className="font-bold text-slate-300 print:text-slate-600">SJ-{merchant.id.toUpperCase()}-{new Date().getFullYear()}</span></p>
              <p>&bull;</p>
              <p>رقم الصفحة: 1 من 1</p>
            </div>
          </div>

          {/* Terms and Signatures */}
          <div className="mt-12 grid grid-cols-2 gap-8 text-center border-t border-dashed border-white/10 print:border-slate-200 pt-8">
            <div>
              <p className="text-slate-400 print:text-slate-500 text-xs mb-8">ختم وتوقيع إدارة سوق جبلة</p>
              <div className="h-16 w-32 border border-white/10 print:border-slate-300 rounded mx-auto flex items-center justify-center text-slate-400 print:text-slate-500 text-xs select-none bg-white/5 print:bg-transparent">
                الختم الرسمي
              </div>
            </div>
            <div>
              <p className="text-slate-400 print:text-slate-500 text-xs mb-8">توقيع ومصادقة التاجر</p>
              <div className="h-16 w-32 border border-white/10 print:border-slate-300 rounded mx-auto flex items-center justify-center text-slate-400 print:text-slate-500 text-xs select-none bg-white/5 print:bg-transparent">
                التوقيع الشخصي
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
