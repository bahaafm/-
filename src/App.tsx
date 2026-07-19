import { useState, useEffect } from 'react';
import { Market, Category, Subcategory, Merchant, Customer, Product } from './types';
import { db } from './mockData';
import AuthScreen from './components/AuthScreen';
import CustomerPanel from './components/CustomerPanel';
import MerchantPanel from './components/MerchantPanel';
import AdminPanel from './components/AdminPanel';
import PDFReport from './components/PDFReport';
import { Code, ArrowLeft, Copy, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Application Roles and States
  const [activeUserType, setActiveUserType] = useState<'none' | 'customer' | 'merchant' | 'admin'>('none');
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [activeMerchant, setActiveMerchant] = useState<Merchant | null>(null);

  // Loaded DB tables
  const [markets, setMarkets] = useState<Market[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Selected merchant for PDF report preview
  const [reportMerchant, setReportMerchant] = useState<Merchant | null>(null);

  // Flutter Assistant Panel State
  const [showFlutterDrawer, setShowFlutterDrawer] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load database on mount
  useEffect(() => {
    // Check and trigger auto-expiration of subscriptions
    db.checkSubscriptions();

    setMarkets(db.getMarkets());
    setCategories(db.getCategories());
    setSubcategories(db.getSubcategories());
    setMerchants(db.getMerchants());
    setCustomers(db.getCustomers());
    setProducts(db.getProducts());
  }, []);

  // Sync to database and state
  const syncMarkets = (data: Market[]) => {
    setMarkets(data);
    db.saveMarkets(data);
  };

  const syncCategories = (data: Category[]) => {
    setCategories(data);
    db.saveCategories(data);
  };

  const syncSubcategories = (data: Subcategory[]) => {
    setSubcategories(data);
    db.saveSubcategories(data);
  };

  const syncMerchants = (data: Merchant[]) => {
    setMerchants(data);
    db.saveMerchants(data);
  };

  const syncCustomers = (data: Customer[]) => {
    setCustomers(data);
    db.saveCustomers(data);
  };

  const syncProducts = (data: Product[]) => {
    setProducts(data);
    db.saveProducts(data);
  };

  // Auth Operations
  const handleLoginCustomer = (phone: string, pass: string): Customer | null => {
    const cust = customers.find(c => c.phone === phone && c.password === pass);
    if (cust) {
      setActiveCustomer(cust);
      setActiveUserType('customer');
      return cust;
    }
    return null;
  };

  const handleRegisterCustomer = (fullName: string, phone: string, pass: string): Customer => {
    const newCust: Customer = {
      id: `cust_${Date.now()}`,
      fullName,
      phone,
      password: pass,
      createdAt: new Date().toISOString()
    };
    const updated = [...customers, newCust];
    syncCustomers(updated);
    setActiveCustomer(newCust);
    setActiveUserType('customer');
    return newCust;
  };

  const handleLoginMerchant = (phone: string, pass: string): Merchant | null => {
    // Must be approved to log in
    const merch = merchants.find(m => m.phone === phone && m.password === pass);
    if (merch) {
      if (merch.status === 'approved') {
        setActiveMerchant(merch);
        setActiveUserType('merchant');
        return merch;
      } else if (merch.status === 'pending') {
        alert('⚠️ طلب متجرك ما زال قيد المراجعة والاعتماد من قبل الإدارة. يرجى الانتظار لحين تدقيق المستمسكات.');
      } else if (merch.status === 'banned') {
        alert('❌ تم حظر هذا الحساب من قبل إدارة سوق جبلة. يرجى التواصل مع الدعم الفني.');
      }
    }
    return null;
  };

  const handleRegisterMerchant = (fullName: string, storeName: string, phone: string, pass: string, docs: string[]): Merchant => {
    const newMerch: Merchant = {
      id: `mer_${Date.now()}`,
      fullName,
      storeName,
      phone,
      password: pass,
      status: 'pending', // Starts as pending until approved by Admin
      subscriptionStatus: 'active',
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Starts with 30 days
      documents: docs,
      createdAt: new Date().toISOString()
    };
    const updated = [...merchants, newMerch];
    syncMerchants(updated);
    return newMerch;
  };

  const handleLoginAdmin = (phone: string, pass: string): boolean => {
    if (phone === '07806722599' && pass === 'Ba12345haa@') {
      setActiveUserType('admin');
      return true;
    }
    return false;
  };

  // Admin Structural Modifiers
  const handleAddMarket = (name: string, desc: string, icon: string) => {
    const newMarket: Market = {
      id: `m_${Date.now()}`,
      name,
      description: desc,
      icon
    };
    syncMarkets([...markets, newMarket]);
  };

  const handleAddCategory = (marketId: string, name: string) => {
    const newCat: Category = {
      id: `c_${Date.now()}`,
      marketId,
      name
    };
    syncCategories([...categories, newCat]);
  };

  const handleAddSubcategory = (categoryId: string, name: string) => {
    const newSub: Subcategory = {
      id: `s_${Date.now()}`,
      categoryId,
      name
    };
    syncSubcategories([...subcategories, newSub]);
  };

  const handleUpdateMerchantStatus = (id: string, status: 'pending' | 'approved' | 'banned') => {
    const updated = merchants.map(m => {
      if (m.id === id) {
        // If approved, give them 30 days starting now
        const expiry = status === 'approved' 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() 
          : m.subscriptionExpiry;
        return { 
          ...m, 
          status, 
          subscriptionStatus: (status === 'approved' ? 'active' : m.subscriptionStatus) as any,
          subscriptionExpiry: expiry
        };
      }
      return m;
    });
    syncMerchants(updated);
  };

  const handleUpdateMerchantSubscription = (id: string, action: 'renew' | 'suspend' | 'delete') => {
    const updated = merchants.map(m => {
      if (m.id === id) {
        if (action === 'renew') {
          return {
            ...m,
            subscriptionStatus: 'active' as const,
            subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 fresh days
          };
        } else if (action === 'suspend') {
          return {
            ...m,
            subscriptionStatus: 'suspended' as const
          };
        } else if (action === 'delete') {
          return {
            ...m,
            subscriptionStatus: 'expired' as const,
            subscriptionExpiry: new Date(Date.now() - 1000).toISOString() // expired in past
          };
        }
      }
      return m;
    });
    syncMerchants(updated);
  };

  // Merchant Actions
  const handleAddProduct = (productData: Omit<Product, 'id' | 'merchantId'>) => {
    if (!activeMerchant) return;
    const newProd: Product = {
      ...productData,
      id: `p_${Date.now()}`,
      merchantId: activeMerchant.id
    };
    syncProducts([...products, newProd]);
  };

  const handleDeleteProduct = (id: string) => {
    syncProducts(products.filter(p => p.id !== id));
  };

  const handleLogout = () => {
    setActiveUserType('none');
    setActiveCustomer(null);
    setActiveMerchant(null);
    setReportMerchant(null);
  };

  // Copy Flutter code helper
  const handleCopyFlutter = () => {
    navigator.clipboard.writeText(flutterCodeTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const flutterCodeTemplate = `import 'package:flutter/material.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

// === كود تطبيق سوق جبلة - واجهة الدخول والهيكل البرمجي لـ Flutter ===

void main() {
  runApp(const SouqJablehApp());
}

class SouqJablehApp extends StatelessWidget {
  const SouqJablehApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'سوق جبلة',
      locale: const Locale('ar', 'IQ'),
      theme: ThemeData(
        primarySwatch: Colors.teal,
        fontFamily: 'Cairo', // خط عربي ممتاز
      ),
      home: const LandingScreen(),
    );
  }
}

class LandingScreen extends StatelessWidget {
  const LandingScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Slate 900
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              // شعار التطبيق
              Center(
                child: Container(
                  width: 90,
                  height: 90,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF0D9488), Color(0xFF059669)],
                    ),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: const Center(
                    child: Text(
                      'جبلة',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Center(
                child: Text(
                  'سوق جبلة الرقمي',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              const Center(
                child: Text(
                  'التطبيق العراقي المتكامل للتجار والزبائن',
                  style: TextStyle(color: Colors.slate400, fontSize: 13),
                ),
              ),
              const Spacer(),
              
              // زر دخول الزبون
              ElevatedButton.icon(
                onPressed: () {
                  // الانتقال لصفحة الزبون
                },
                icon: const Icon(Icons.person, color: Colors.white),
                label: const Text('دخول الزبون'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0D9488),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // زر دخول التاجر
              OutlinedButton.icon(
                onPressed: () {
                  // الانتقال لصفحة التاجر
                },
                icon: const Icon(Icons.store, color: Color(0xFFF59E0B)),
                label: const Text(
                  'دخول التاجر والشركاء',
                  style: TextStyle(color: Color(0xFFF59E0B)),
                ),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Color(0xFFF59E0B), width: 2),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
              ),
              const Spacer(),

              // دخول لوحة الإدارة بالرقم والرمز المطلوبين
              TextButton.icon(
                onPressed: () {
                  // فتح لوحة المسؤول مع التحقق من الرقم والرمز:
                  // الرقم: 07806722599
                  // الرمز: Ba12345haa@
                },
                icon: const Icon(Icons.admin_panel_settings, color: Colors.slate500),
                label: const Text(
                  'لوحة الإدارة (07806722599)',
                  style: TextStyle(color: Colors.slate500, fontSize: 12),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// === محاكي تصدير التقارير كملف PDF في Flutter ===
class PdfInvoiceApi {
  static Future<void> generateAndPrintReport(
      String storeName, String merchantName, List<Map<String, dynamic>> products) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        build: (pw.Context context) {
          return pw.Directionality(
            textDirection: pw.TextDirection.rtl,
            child: pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
                pw.Header(
                  level: 0,
                  child: pw.Text('سوق جبلة - تقرير جرد بضاعة المتجر',
                      style: pw.TextStyle(fontSize: 24, fontWeight: pw.FontWeight.bold)),
                ),
                pw.SizedBox(height: 10),
                pw.Text('اسم المتجر: \$storeName', style: const pw.TextStyle(fontSize: 14)),
                pw.Text('التاجر المسؤول: \$merchantName', style: const pw.TextStyle(fontSize: 14)),
                pw.SizedBox(height: 20),
                pw.Table.fromTextArray(
                  headers: ['اسم المنتج', 'النوع', 'المخزون', 'السعر المفرط'],
                  data: products.map((p) => [
                    p['name'],
                    p['type'],
                    p['stock'].toString(),
                    p['price'].toString()
                  ]).toList(),
                ),
              ],
            ),
          );
        },
      ),
    );

    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => pdf.save(),
    );
  }
}
`;

  return (
    <div className="relative font-sans antialiased selection:bg-orange-500 selection:text-white bg-slate-950 text-slate-100 min-h-screen overflow-x-hidden">
      
      {/* Mesh Background Ambient Blur Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/15 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-[35%] left-[25%] w-[40%] h-[40%] bg-teal-600/5 blur-[130px] rounded-full pointer-events-none z-0"></div>

      {/* Main Core View Router */}
      <div className="relative min-h-screen z-10">
        {/* VIEW 1: PDF Report View (Overrides everything else) */}
        {reportMerchant ? (
          <PDFReport
            merchant={reportMerchant}
            products={products.filter(p => p.merchantId === reportMerchant.id)}
            markets={markets}
            categories={categories}
            subcategories={subcategories}
            onBack={() => setReportMerchant(null)}
          />
        ) : (
          /* REGULAR ROUTER SCREEN */
          <>
            {activeUserType === 'none' && (
              <AuthScreen
                onLoginCustomer={handleLoginCustomer}
                onRegisterCustomer={handleRegisterCustomer}
                onLoginMerchant={handleLoginMerchant}
                onRegisterMerchant={handleRegisterMerchant}
                onLoginAdmin={handleLoginAdmin}
              />
            )}

            {activeUserType === 'customer' && activeCustomer && (
              <CustomerPanel
                customer={activeCustomer}
                markets={markets}
                categories={categories}
                subcategories={subcategories}
                products={products}
                merchants={merchants}
                onLogout={handleLogout}
              />
            )}

            {activeUserType === 'merchant' && activeMerchant && (
              <MerchantPanel
                merchant={activeMerchant}
                markets={markets}
                categories={categories}
                subcategories={subcategories}
                products={products}
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
                onLogout={handleLogout}
                onGenerateReport={() => setReportMerchant(activeMerchant)}
              />
            )}

            {activeUserType === 'admin' && (
              <AdminPanel
                markets={markets}
                categories={categories}
                subcategories={subcategories}
                merchants={merchants}
                customers={customers}
                products={products}
                onAddMarket={handleAddMarket}
                onAddCategory={handleAddCategory}
                onAddSubcategory={handleAddSubcategory}
                onUpdateMerchantStatus={handleUpdateMerchantStatus}
                onUpdateMerchantSubscription={handleUpdateMerchantSubscription}
                onLogout={handleLogout}
                onViewReport={(m) => setReportMerchant(m)}
                onShowFlutter={() => setShowFlutterDrawer(true)}
              />
            )}
          </>
        )}
      </div>

      {/* Slide Out Drawer: Flutter Code Helper */}
      {showFlutterDrawer && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-300" dir="rtl">
          <div className="bg-slate-950 w-full max-w-2xl h-full shadow-2xl flex flex-col border-r border-slate-800 animate-in slide-in-from-left-full duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-500">
                <Code className="w-5 h-5" />
                <div>
                  <h3 className="font-extrabold text-base text-slate-100">هيكل كود Flutter لـ iOS و Android</h3>
                  <p className="text-xxs text-slate-400">ملف جاهز للنسخ لبناء تطبيق الجوال الخاص بـ سوق جبلة</p>
                </div>
              </div>
              <button
                onClick={() => setShowFlutterDrawer(false)}
                className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all flex items-center gap-1 text-xs"
                id="close-flutter-drawer-btn"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>إغلاق</span>
              </button>
            </div>

            {/* Copy Button info */}
            <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-slate-400">يحتوي هذا الملف على أكواد التصميم، وبوابة التحقق وتصدير الـ PDF بنجاح.</span>
              <button
                onClick={handleCopyFlutter}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors text-xxs"
                id="copy-flutter-code-btn"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ الكود بالكامل'}</span>
              </button>
            </div>

            {/* Code Block Container */}
            <div className="flex-1 overflow-y-auto p-6 font-mono text-xs text-slate-300 leading-relaxed bg-slate-950 selection:bg-slate-800">
              <pre className="whitespace-pre-wrap rounded-xl bg-slate-900/50 p-4 border border-slate-850 text-emerald-400">
                {flutterCodeTemplate}
              </pre>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
