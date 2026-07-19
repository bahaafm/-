import { Market, Category, Subcategory, Merchant, Customer, Product } from './types';

// Seed data
const initialMarkets: Market[] = [
  { id: 'm1', name: 'سوق جبلة للملابس والأقمشة', description: 'أحدث صيحات الموضة والأقمشة الفاخرة للرجال والنساء والأطفال', icon: 'Shirt' },
  { id: 'm2', name: 'سوق الإلكترونيات والهواتف', description: 'الهواتف الذكية الحديثة، ملحقاتها، والصيانة الفورية', icon: 'Smartphone' },
  { id: 'm3', name: 'سوق الذهب والمجوهرات', description: 'أفخم صياغات الذهب والمجوهرات الثمينة والفضيات', icon: 'Gem' },
  { id: 'm4', name: 'سوق المواد الغذائية والتوابل', description: 'التوابل العراقية الأصلية والمواد الغذائية الطازجة', icon: 'ShoppingBag' }
];

const initialCategories: Category[] = [
  // Clothes
  { id: 'c1', marketId: 'm1', name: 'ملابس رجالية' },
  { id: 'c2', marketId: 'm1', name: 'ملابس نسائية' },
  { id: 'c3', marketId: 'm1', name: 'ملابس أطفال' },
  // Electronics
  { id: 'c4', marketId: 'm2', name: 'هواتف ذكية' },
  { id: 'c5', marketId: 'm2', name: 'إكسسوارات وسماعات' },
  // Gold
  { id: 'c6', marketId: 'm3', name: 'مجوهرات وقلائد' },
  // Food
  { id: 'c7', marketId: 'm4', name: 'توابل عطرية' }
];

const initialSubcategories: Subcategory[] = [
  // Clothes - Men
  { id: 's1', categoryId: 'c1', name: 'دشداشة عربية' },
  { id: 's2', categoryId: 'c1', name: 'بدلات وقمصان رسمية' },
  { id: 's3', categoryId: 'c1', name: 'بناطيل كاجوال' },
  // Clothes - Women
  { id: 's4', categoryId: 'c2', name: 'عبايات خليجية' },
  { id: 's5', categoryId: 'c2', name: 'فساتين سهرة' },
  // Electronics - Phones
  { id: 's6', categoryId: 'c4', name: 'آبل آيفون' },
  { id: 's7', categoryId: 'c4', name: 'سامسونج جالكسي' },
  { id: 's8', categoryId: 'c4', name: 'شاومي وريدمي' },
  // Food - Spices
  { id: 's9', categoryId: 'c7', name: 'زعفران وهيل' },
  { id: 's10', categoryId: 'c7', name: 'بهارات مشكلة عراقية' }
];

const initialMerchants: Merchant[] = [
  {
    id: 'mer_1',
    fullName: 'أبو أحمد الساعدي',
    storeName: 'أناقة الرافدين للملابس',
    phone: '07812345678',
    password: 'password123',
    status: 'approved',
    subscriptionStatus: 'active',
    subscriptionExpiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    documents: ['هوية الأحوال المدنية.pdf', 'بطاقة السكن.pdf'],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mer_2',
    fullName: 'سرمد علي البصري',
    storeName: 'العراق ديجيتال',
    phone: '07709876543',
    password: 'password123',
    status: 'approved',
    subscriptionStatus: 'expired', // Expired, his products should not show initially
    subscriptionExpiry: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Expired 2 days ago
    documents: ['شهادة تأسيس المتجر.png', 'جواز السفر.jpg'],
    createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mer_3',
    fullName: 'حيدر الصائغ',
    storeName: 'مجوهرات بابل الذهبية',
    phone: '07501112233',
    password: 'password123',
    status: 'pending', // Waiting for Admin approval
    subscriptionStatus: 'active',
    subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    documents: ['هوية الصاغة.pdf'],
    createdAt: new Date().toISOString()
  }
];

const initialCustomers: Customer[] = [
  {
    id: 'cust_1',
    fullName: 'محمد جاسم الأسدي',
    phone: '07801234567',
    password: 'password123',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cust_2',
    fullName: 'زينب عادل حميد',
    phone: '07711223344',
    password: 'password123',
    createdAt: new Date().toISOString()
  }
];

const initialProducts: Product[] = [
  {
    id: 'p1',
    merchantId: 'mer_1',
    marketId: 'm1',
    categoryId: 'c1',
    subcategoryId: 's1',
    name: 'دشداشة نجفية صيفية فاخرة',
    type: 'ملابس صيفية رجالية',
    description: 'دشداشة نجفية أصلية مصنوعة من القطن الياباني البارد الممتاز، خياطة يدوية دقيقة وتصميم كلاسيكي مريح.',
    price: 35000,
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    sizes: [
      { size: '54', quantity: 12 },
      { size: '56', quantity: 20 },
      { size: '58', quantity: 8 }
    ],
    discount: {
      type: 'single',
      amount: 5000, // 5000 IQD discount
      durationDays: 5,
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'تخفيض صيفي لفترة محدودة'
    }
  },
  {
    id: 'p2',
    merchantId: 'mer_1',
    marketId: 'm1',
    categoryId: 'c1',
    subcategoryId: 's2',
    name: 'قميص رجالي تركي سبورت',
    type: 'قمصان كاجوال',
    description: 'قميص قطن تركي عالي الجودة متوفر بألوان متعددة، مناسب للأوقات الرسمية والكاجوال، خامات متينة لا تتغير بالغسيل.',
    price: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    sizes: [
      { size: 'M', quantity: 15 },
      { size: 'L', quantity: 25 },
      { size: 'XL', quantity: 18 },
      { size: 'XXL', quantity: 5 }
    ],
    discount: {
      type: 'quantity',
      amount: 15000, // 15,000 IQD off on quantities
      minQuantity: 3, // discount is applied if customer buys 3 or more
      durationDays: 10,
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'احصل على تخفيض عند شراء 3 قطع أو أكثر!'
    }
  },
  // Products from mer_2 (expired merchant - won't show initially unless renewed)
  {
    id: 'p3',
    merchantId: 'mer_2',
    marketId: 'm2',
    categoryId: 'c4',
    subcategoryId: 's6',
    name: 'آيفون 15 برو ماكس 256 جيجا',
    type: 'هواتف ذكية',
    description: 'جهاز Apple iPhone 15 Pro Max بذاكرة 256 جيجابايت، لون تيتانيوم طبيعي، نسخة الشرق الأوسط مع كفالة سنة كاملة.',
    price: 1650000,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    sizes: [
      { size: '256GB', quantity: 4 },
      { size: '512GB', quantity: 2 }
    ],
    discount: null
  },
  {
    id: 'p4',
    merchantId: 'mer_2',
    marketId: 'm2',
    categoryId: 'c5',
    subcategoryId: 's8',
    name: 'سماعات شاومي اللاسلكية Redmi Buds 5',
    type: 'سماعات إلكترونية',
    description: 'سماعات بلوتوث شاومي ردمي بودز 5 مع ميزة إلغاء الضوضاء الفعالة ومحيط صوتي مجسم متكامل وعمر بطارية يدوم 40 ساعة.',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    sizes: [
      { size: 'أبيض', quantity: 15 },
      { size: 'أسود', quantity: 20 }
    ],
    discount: {
      type: 'single',
      amount: 5000,
      durationDays: 3,
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'خصم نهاية الأسبوع'
    }
  }
];

// Helper to interact with LocalStorage
export const getFromStorage = <T>(key: string, initialData: T): T => {
  const stored = localStorage.getItem(`souq_jableh_${key}`);
  if (stored) {
    try {
      return JSON.parse(stored) as T;
    } catch {
      return initialData;
    }
  }
  localStorage.setItem(`souq_jableh_${key}`, JSON.stringify(initialData));
  return initialData;
};

export const saveToStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(`souq_jableh_${key}`, JSON.stringify(data));
};

// Database state managers
export const db = {
  getMarkets: () => getFromStorage<Market[]>('markets', initialMarkets),
  saveMarkets: (data: Market[]) => saveToStorage('markets', data),

  getCategories: () => getFromStorage<Category[]>('categories', initialCategories),
  saveCategories: (data: Category[]) => saveToStorage('categories', data),

  getSubcategories: () => getFromStorage<Subcategory[]>('subcategories', initialSubcategories),
  saveSubcategories: (data: Subcategory[]) => saveToStorage('subcategories', data),

  getMerchants: () => getFromStorage<Merchant[]>('merchants', initialMerchants),
  saveMerchants: (data: Merchant[]) => saveToStorage('merchants', data),

  getCustomers: () => getFromStorage<Customer[]>('customers', initialCustomers),
  saveCustomers: (data: Customer[]) => saveToStorage('customers', data),

  getProducts: () => getFromStorage<Product[]>('products', initialProducts),
  saveProducts: (data: Product[]) => saveToStorage('products', data),

  // Subscription checking: auto-expire merchant subscriptions if current date > subscriptionExpiry
  checkSubscriptions: () => {
    const merchants = db.getMerchants();
    const now = new Date();
    let updated = false;

    const updatedMerchants = merchants.map(m => {
      if (m.subscriptionStatus === 'active') {
        const expiry = new Date(m.subscriptionExpiry);
        if (now > expiry) {
          updated = true;
          return { ...m, subscriptionStatus: 'expired' as const };
        }
      }
      return m;
    });

    if (updated) {
      db.saveMerchants(updatedMerchants);
    }
    return updatedMerchants;
  }
};
