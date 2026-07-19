import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  writeBatch, 
  deleteDoc, 
  getDoc 
} from 'firebase/firestore';
import { firestore } from './firebase';
import { Market, Category, Subcategory, Merchant, Customer, Product } from '../types';

// Generic helper to get all documents from a Firestore collection
export async function getCollectionData<T>(collectionName: string): Promise<T[]> {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    const data: T[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() } as unknown as T);
    });
    return data;
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    return [];
  }
}

// Generic helper to save/update a single document
export async function saveDocument(collectionName: string, docId: string, data: any): Promise<void> {
  try {
    await setDoc(doc(firestore, collectionName, docId), data, { merge: true });
  } catch (error) {
    console.error(`Error saving document in ${collectionName}:`, error);
    throw error;
  }
}

// Generic helper to delete a document
export async function removeDocument(collectionName: string, docId: string): Promise<void> {
  try {
    await deleteDoc(doc(firestore, collectionName, docId));
  } catch (error) {
    console.error(`Error deleting document in ${collectionName}:`, error);
    throw error;
  }
}

// Batch helper to save multiple documents (e.g. for bulk updates or seeding)
export async function saveBatch<T extends { id: string }>(collectionName: string, items: T[]): Promise<void> {
  try {
    const batch = writeBatch(firestore);
    items.forEach((item) => {
      // Remove id from payload if we want it purely as the doc ID, 
      // but keeping it in document fields is also fine and helpful.
      const itemRef = doc(firestore, collectionName, item.id);
      batch.set(itemRef, item, { merge: true });
    });
    await batch.commit();
  } catch (error) {
    console.error(`Error in batch saving for ${collectionName}:`, error);
    throw error;
  }
}

// Firebase Service API
export const firebaseService = {
  // Load all app data from Firestore. If Firestore is empty, we can seed it with the local initial mock data.
  async loadAllData(initialSeeds: {
    markets: Market[];
    categories: Category[];
    subcategories: Subcategory[];
    merchants: Merchant[];
    customers: Customer[];
    products: Product[];
  }) {
    try {
      console.log('Loading data from Firebase Firestore...');
      
      const markets = await getCollectionData<Market>('markets');
      const categories = await getCollectionData<Category>('categories');
      const subcategories = await getCollectionData<Subcategory>('subcategories');
      const merchants = await getCollectionData<Merchant>('merchants');
      const customers = await getCollectionData<Customer>('customers');
      const products = await getCollectionData<Product>('products');

      // Check if DB is completely empty (first run). If so, we seed it!
      const isEmpty = markets.length === 0 && merchants.length === 0 && products.length === 0;
      
      if (isEmpty) {
        console.log('Firestore is empty. Seeding initial data...');
        await saveBatch('markets', initialSeeds.markets);
        await saveBatch('categories', initialSeeds.categories);
        await saveBatch('subcategories', initialSeeds.subcategories);
        await saveBatch('merchants', initialSeeds.merchants);
        await saveBatch('customers', initialSeeds.customers);
        await saveBatch('products', initialSeeds.products);
        
        return initialSeeds;
      }

      return {
        markets: markets.length > 0 ? markets : initialSeeds.markets,
        categories: categories.length > 0 ? categories : initialSeeds.categories,
        subcategories: subcategories.length > 0 ? subcategories : initialSeeds.subcategories,
        merchants: merchants.length > 0 ? merchants : initialSeeds.merchants,
        customers: customers.length > 0 ? customers : initialSeeds.customers,
        products: products.length > 0 ? products : initialSeeds.products,
      };
    } catch (error) {
      console.error('Failed to load data from Firebase:', error);
      // Fallback to initial seeds in case of failure (e.g. permission or network issue)
      return initialSeeds;
    }
  },

  // Market Sync
  async syncMarkets(markets: Market[]) {
    await saveBatch('markets', markets);
  },
  async addMarket(market: Market) {
    await saveDocument('markets', market.id, market);
  },

  // Category Sync
  async syncCategories(categories: Category[]) {
    await saveBatch('categories', categories);
  },
  async addCategory(category: Category) {
    await saveDocument('categories', category.id, category);
  },

  // Subcategory Sync
  async syncSubcategories(subcategories: Subcategory[]) {
    await saveBatch('subcategories', subcategories);
  },
  async addSubcategory(subcategory: Subcategory) {
    await saveDocument('subcategories', subcategory.id, subcategory);
  },

  // Merchant Sync
  async syncMerchants(merchants: Merchant[]) {
    await saveBatch('merchants', merchants);
  },
  async saveMerchant(merchant: Merchant) {
    await saveDocument('merchants', merchant.id, merchant);
  },

  // Customer Sync
  async syncCustomers(customers: Customer[]) {
    await saveBatch('customers', customers);
  },
  async saveCustomer(customer: Customer) {
    await saveDocument('customers', customer.id, customer);
  },

  // Product Sync
  async syncProducts(products: Product[]) {
    // If a product is deleted, we might want to clean up.
    // In bulk sync, we overwrite/set all. But to prevent orphan documents in Firestore
    // if a product was deleted, we can compare and delete it.
    await saveBatch('products', products);
  },
  async saveProduct(product: Product) {
    await saveDocument('products', product.id, product);
  },
  async deleteProduct(productId: string) {
    await removeDocument('products', productId);
  }
};
