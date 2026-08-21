// IndexedDB-based Engagement Logger Service
// Tracks user activity offline and syncs to central storage/localStorage when online

export interface EngagementLogEntry {
  id?: number;
  eventType: 'chapter_opened' | 'notes_opened' | 'pdf_opened' | 'quiz_attempt' | 'video_watched' | 'glossary_viewed' | string;
  data: Record<string, any>;
  timestamp: string;
  isOffline: boolean;
}

const DB_NAME = 'ScienceGoatEngagementDB';
const DB_VERSION = 1;
const STORE_NAME = 'pending_logs';
const LOCALSTORAGE_SYNC_KEY = 'rbse_engagement_logs_synced_v1';

class EngagementLogger {
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    this.initDB();
    this.setupNetworkListeners();
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('indexedDB' in window)) {
        reject(new Error('IndexedDB is not supported in this environment'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };

      request.onerror = (event) => {
        console.warn('IndexedDB initialization error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });

    return this.dbPromise;
  }

  private setupNetworkListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      console.log('[EngagementLogger] Device is back online. Syncing pending offline logs...');
      this.syncLogs().catch((err) => console.warn('Auto sync error:', err));
    });

    // Attempt initial sync on load if online
    if (navigator.onLine) {
      setTimeout(() => {
        this.syncLogs().catch(() => {});
      }, 2000);
    }
  }

  /**
   * Log user activity to IndexedDB.
   */
  async log(eventType: string, data: Record<string, any> = {}): Promise<void> {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    const entry: EngagementLogEntry = {
      eventType,
      data,
      timestamp: new Date().toISOString(),
      isOffline: !isOnline,
    };

    try {
      const db = await this.initDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      
      await new Promise<void>((resolve, reject) => {
        const req = store.add(entry);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });

      console.log(`[EngagementLogger] Logged '${eventType}' (Offline: ${!isOnline})`, data);

      // Trigger immediate sync if device is online
      if (isOnline) {
        await this.syncLogs();
      }
    } catch (err) {
      console.warn('[EngagementLogger] IndexedDB write failed, falling back to direct localStorage:', err);
      // Fallback directly to localStorage if IndexedDB fails
      this.appendToLocalStorage([entry]);
    }
  }

  /**
   * Sync all pending logs from IndexedDB to localStorage / central state
   */
  async syncLogs(): Promise<number> {
    try {
      const db = await this.initDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);

      const pendingLogs: EngagementLogEntry[] = await new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });

      if (pendingLogs.length === 0) {
        return 0;
      }

      // Sync pending logs into LocalStorage central repository
      this.appendToLocalStorage(pendingLogs);

      // Clear synced items from IndexedDB
      const clearTx = db.transaction(STORE_NAME, 'readwrite');
      const clearStore = clearTx.objectStore(STORE_NAME);
      await new Promise<void>((resolve, reject) => {
        const req = clearStore.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });

      console.log(`[EngagementLogger] Successfully synced ${pendingLogs.length} offline engagement logs to localStorage.`);
      
      // Dispatch custom event so UI components can reflect synced status
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('engagement_logs_synced', { detail: { count: pendingLogs.length } }));
      }

      return pendingLogs.length;
    } catch (err) {
      console.warn('[EngagementLogger] Sync failed:', err);
      return 0;
    }
  }

  /**
   * Helper to append logs to localStorage
   */
  private appendToLocalStorage(logs: EngagementLogEntry[]): void {
    try {
      const existingStr = localStorage.getItem(LOCALSTORAGE_SYNC_KEY);
      const existing: EngagementLogEntry[] = existingStr ? JSON.parse(existingStr) : [];
      const updated = [...existing, ...logs];
      // Limit total saved logs in localStorage to last 500 entries
      const trimmed = updated.slice(-500);
      localStorage.setItem(LOCALSTORAGE_SYNC_KEY, JSON.stringify(trimmed));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  }

  /**
   * Retrieve all synced logs from LocalStorage
   */
  getSyncedLogs(): EngagementLogEntry[] {
    try {
      const str = localStorage.getItem(LOCALSTORAGE_SYNC_KEY);
      return str ? JSON.parse(str) : [];
    } catch (err) {
      return [];
    }
  }

  /**
   * Get pending offline logs count in IndexedDB
   */
  async getPendingCount(): Promise<number> {
    try {
      const db = await this.initDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      return new Promise((resolve, reject) => {
        const req = store.count();
        req.onsuccess = () => resolve(req.result || 0);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      return 0;
    }
  }

  /**
   * Clear all synced logs from LocalStorage
   */
  clearSyncedLogs(): void {
    localStorage.removeItem(LOCALSTORAGE_SYNC_KEY);
  }
}

export const engagementLogger = new EngagementLogger();
