// Система постоянного локального хранения данных
interface StorageData {
  guides: any[];
  pricingPlans: any[];
  messages: any[];
  settings: any;
  lastBackup: string;
}

interface BackupData {
  timestamp: number;
  data: {
    guides: any[];
    pricingPlans: any[];
    messages: any[];
    version: string;
    created: string;
  };
}

class PersistentStorage {
  private dbName = 'deplos_admin_db';
  private dbVersion = 2; // Увеличиваем версию для обновления схемы
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;
  private isInitialized = false;

  async init(): Promise<void> {
    // Предотвращаем множественную инициализацию
    if (this.initPromise) {
      return this.initPromise;
    }

    if (this.db && this.isInitialized) {
      return Promise.resolve();
    }

    this.initPromise = new Promise((resolve, reject) => {
      // Проверяем поддержку IndexedDB
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported, falling back to localStorage only');
        this.isInitialized = true;
        resolve();
        return;
      }

      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        this.initPromise = null;
        // Не отклоняем промис, а продолжаем с localStorage
        this.isInitialized = true;
        resolve();
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        
        // Обработка неожиданного закрытия базы данных
        this.db.onclose = () => {
          console.warn('IndexedDB connection closed unexpectedly');
          this.db = null;
          this.isInitialized = false;
          this.initPromise = null;
        };

        this.db.onerror = (event) => {
          console.error('IndexedDB error:', event);
        };

        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        try {
          // Создаем хранилища для разных типов данных
          if (!db.objectStoreNames.contains('guides')) {
            const guidesStore = db.createObjectStore('guides', { keyPath: 'id' });
            guidesStore.createIndex('category', 'category', { unique: false });
            guidesStore.createIndex('published', 'published', { unique: false });
          }
          
          if (!db.objectStoreNames.contains('pricingPlans')) {
            const plansStore = db.createObjectStore('pricingPlans', { keyPath: 'id' });
            plansStore.createIndex('popular', 'popular', { unique: false });
          }
          
          if (!db.objectStoreNames.contains('messages')) {
            const messagesStore = db.createObjectStore('messages', { keyPath: 'id' });
            messagesStore.createIndex('type', 'type', { unique: false });
            messagesStore.createIndex('status', 'status', { unique: false });
            messagesStore.createIndex('createdAt', 'createdAt', { unique: false });
          }
          
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' });
          }
          
          if (!db.objectStoreNames.contains('backups')) {
            const backupsStore = db.createObjectStore('backups', { keyPath: 'timestamp' });
            backupsStore.createIndex('created', 'data.created', { unique: false });
          }
        } catch (error) {
          console.error('Error creating object stores:', error);
          // Не отклоняем промис, продолжаем работу
        }
      };

      request.onblocked = () => {
        console.warn('IndexedDB upgrade blocked. Please close other tabs.');
      };
    });

    return this.initPromise;
  }

  private async ensureConnection(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.init();
    }
    
    return this.db !== null && this.isInitialized;
  }

  async saveData(storeName: string, data: any[]): Promise<void> {
    const hasIDB = await this.ensureConnection();

    // Всегда сохраняем в localStorage как fallback
    try {
      const key = `deplos_${storeName}`;
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }

    if (!hasIDB) {
      return; // Если IndexedDB недоступен, используем только localStorage
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        
        transaction.onerror = () => {
          console.error('Transaction error:', transaction.error);
          resolve(); // Не отклоняем, так как данные сохранены в localStorage
        };

        transaction.onabort = () => {
          console.error('Transaction aborted');
          resolve(); // Не отклоняем, так как данные сохранены в localStorage
        };
        
        // Очищаем существующие данные
        const clearRequest = store.clear();
        
        clearRequest.onsuccess = () => {
          // Добавляем новые данные
          if (data.length === 0) {
            resolve();
            return;
          }

          let completed = 0;
          let hasError = false;
          
          data.forEach(item => {
            if (hasError) return;
            
            const addRequest = store.add(item);
            addRequest.onsuccess = () => {
              completed++;
              if (completed === data.length) {
                resolve();
              }
            };
            addRequest.onerror = () => {
              if (!hasError) {
                hasError = true;
                console.error('Error adding item:', addRequest.error);
                resolve(); // Не отклоняем, данные есть в localStorage
              }
            };
          });
        };
        
        clearRequest.onerror = () => {
          console.error('Error clearing store:', clearRequest.error);
          resolve(); // Не отклоняем, данные есть в localStorage
        };
      } catch (error) {
        console.error('Error in saveData:', error);
        resolve(); // Не отклоняем, данные есть в localStorage
      }
    });
  }

  async loadData(storeName: string): Promise<any[]> {
    try {
      const hasIDB = await this.ensureConnection();

      if (hasIDB) {
        // Пытаемся загрузить из IndexedDB
        try {
          const idbData = await new Promise<any[]>((resolve, reject) => {
            const transaction = this.db!.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            transaction.onerror = () => reject(transaction.error);
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
          });

          if (idbData.length > 0) {
            // Синхронизируем с localStorage
            try {
              const key = `deplos_${storeName}`;
              localStorage.setItem(key, JSON.stringify(idbData));
            } catch (error) {
              console.warn('Failed to sync to localStorage:', error);
            }
            return idbData;
          }
        } catch (error) {
          console.warn('Failed to load from IndexedDB:', error);
        }
      }

      // Fallback к localStorage
      const key = `deplos_${storeName}`;
      const localData = localStorage.getItem(key);
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error('Error in loadData:', error);
      return [];
    }
  }

  async createBackup(): Promise<void> {
    try {
      const guides = await this.loadData('guides');
      const pricingPlans = await this.loadData('pricingPlans');
      const messages = await this.loadData('messages');
      
      const timestamp = Date.now();
      
      const backup: BackupData = {
        timestamp,
        data: {
          guides,
          pricingPlans,
          messages,
          version: '1.1',
          created: new Date(timestamp).toISOString()
        }
      };

      // Сохраняем в IndexedDB если доступен
      const hasIDB = await this.ensureConnection();
      if (hasIDB) {
        try {
          await new Promise<void>((resolve, reject) => {
            const transaction = this.db!.transaction(['backups'], 'readwrite');
            const store = transaction.objectStore('backups');
            
            transaction.onerror = () => resolve(); // Не отклоняем
            transaction.onabort = () => resolve(); // Не отклоняем
            
            const request = store.put(backup);
            request.onsuccess = () => resolve();
            request.onerror = () => resolve(); // Не отклоняем
          });
        } catch (error) {
          console.warn('IndexedDB backup failed:', error);
        }
      }

      // Дублируем в localStorage
      try {
        const backups = JSON.parse(localStorage.getItem('deplos_backups') || '[]');
        
        // Удаляем дубликаты по timestamp
        const filteredBackups = backups.filter((b: BackupData) => b.timestamp !== timestamp);
        filteredBackups.push(backup);
        
        // Оставляем только последние 10 резервных копий
        filteredBackups.sort((a: BackupData, b: BackupData) => b.timestamp - a.timestamp);
        if (filteredBackups.length > 10) {
          filteredBackups.splice(10);
        }
        
        localStorage.setItem('deplos_backups', JSON.stringify(filteredBackups));
        localStorage.setItem('deplos_last_backup', timestamp.toString());
      } catch (error) {
        console.error('localStorage backup failed:', error);
      }
      
      console.log('Backup created successfully:', new Date(timestamp).toISOString());
    } catch (error) {
      console.error('Failed to create backup:', error);
      throw error;
    }
  }

  async restoreFromBackup(timestamp: number): Promise<boolean> {
    try {
      let backup: BackupData | null = null;

      // Пытаемся восстановить из IndexedDB
      const hasIDB = await this.ensureConnection();
      if (hasIDB) {
        try {
          backup = await new Promise<BackupData | null>((resolve, reject) => {
            const transaction = this.db!.transaction(['backups'], 'readonly');
            const store = transaction.objectStore('backups');
            const request = store.get(timestamp);
            
            transaction.onerror = () => resolve(null);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => resolve(null);
          });
        } catch (error) {
          console.warn('IndexedDB restore failed:', error);
        }
      }

      // Если не найдено в IndexedDB, пытаемся восстановить из localStorage
      if (!backup) {
        try {
          const backups = JSON.parse(localStorage.getItem('deplos_backups') || '[]');
          backup = backups.find((b: BackupData) => b.timestamp === timestamp) || null;
        } catch (error) {
          console.error('localStorage restore failed:', error);
        }
      }
      
      if (!backup) {
        console.error('Backup not found:', timestamp);
        return false;
      }

      // Проверяем структуру данных
      if (!backup.data || !Array.isArray(backup.data.guides) || !Array.isArray(backup.data.pricingPlans)) {
        console.error('Invalid backup data structure');
        return false;
      }

      // Восстанавливаем данные
      await this.saveData('guides', backup.data.guides);
      await this.saveData('pricingPlans', backup.data.pricingPlans);
      
      // Восстанавливаем сообщения если они есть
      if (Array.isArray(backup.data.messages)) {
        await this.saveData('messages', backup.data.messages);
      }
      
      console.log('Backup restored successfully:', new Date(timestamp).toISOString());
      return true;
    } catch (error) {
      console.error('Failed to restore backup:', error);
      return false;
    }
  }

  async getBackups(): Promise<BackupData[]> {
    const backups: BackupData[] = [];
    const seenTimestamps = new Set<number>();

    // Получаем из IndexedDB
    const hasIDB = await this.ensureConnection();
    if (hasIDB) {
      try {
        const idbBackups = await new Promise<BackupData[]>((resolve, reject) => {
          const transaction = this.db!.transaction(['backups'], 'readonly');
          const store = transaction.objectStore('backups');
          const request = store.getAll();
          
          transaction.onerror = () => resolve([]);
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => resolve([]);
        });
        
        idbBackups.forEach(backup => {
          if (!seenTimestamps.has(backup.timestamp)) {
            backups.push(backup);
            seenTimestamps.add(backup.timestamp);
          }
        });
      } catch (error) {
        console.warn('Failed to load IndexedDB backups:', error);
      }
    }

    // Получаем из localStorage
    try {
      const localBackups = JSON.parse(localStorage.getItem('deplos_backups') || '[]');
      localBackups.forEach((backup: BackupData) => {
        if (!seenTimestamps.has(backup.timestamp)) {
          backups.push(backup);
          seenTimestamps.add(backup.timestamp);
        }
      });
    } catch (error) {
      console.warn('Failed to load localStorage backups:', error);
    }

    // Сортируем по убыванию времени (новые сначала)
    return backups.sort((a, b) => b.timestamp - a.timestamp);
  }

  async exportData(): Promise<string> {
    try {
      const guides = await this.loadData('guides');
      const pricingPlans = await this.loadData('pricingPlans');
      const messages = await this.loadData('messages');
      
      const exportData = {
        version: '1.1',
        exported: new Date().toISOString(),
        data: {
          guides,
          pricingPlans,
          messages
        }
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const importData = JSON.parse(jsonData);
      
      // Проверяем структуру данных
      if (!importData.data) {
        console.error('Invalid import data: missing data field');
        return false;
      }
      
      let hasChanges = false;
      
      if (importData.data.guides && Array.isArray(importData.data.guides)) {
        await this.saveData('guides', importData.data.guides);
        hasChanges = true;
      }
      
      if (importData.data.pricingPlans && Array.isArray(importData.data.pricingPlans)) {
        await this.saveData('pricingPlans', importData.data.pricingPlans);
        hasChanges = true;
      }
      
      if (importData.data.messages && Array.isArray(importData.data.messages)) {
        await this.saveData('messages', importData.data.messages);
        hasChanges = true;
      }
      
      if (hasChanges) {
        // Создаем резервную копию после импорта
        await this.createBackup();
        console.log('Data imported successfully');
        return true;
      }
      
      console.warn('No valid data found in import file');
      return false;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Синхронизация с localStorage для обратной совместимости
  async syncWithLocalStorage(): Promise<void> {
    try {
      // Загружаем данные из localStorage
      const localGuides = JSON.parse(localStorage.getItem('deplos_guides') || '[]');
      const localPlans = JSON.parse(localStorage.getItem('deplos_pricing_plans') || '[]');
      const localMessages = JSON.parse(localStorage.getItem('deplos_messages') || '[]');

      // Загружаем данные из IndexedDB
      const idbGuides = await this.loadData('guides');
      const idbPlans = await this.loadData('pricingPlans');
      const idbMessages = await this.loadData('messages');

      // Если в IndexedDB нет данных, но есть в localStorage - переносим
      if (idbGuides.length === 0 && localGuides.length > 0) {
        await this.saveData('guides', localGuides);
        console.log('Migrated guides from localStorage to IndexedDB');
      }

      if (idbPlans.length === 0 && localPlans.length > 0) {
        await this.saveData('pricingPlans', localPlans);
        console.log('Migrated pricing plans from localStorage to IndexedDB');
      }

      if (idbMessages.length === 0 && localMessages.length > 0) {
        await this.saveData('messages', localMessages);
        console.log('Migrated messages from localStorage to IndexedDB');
      }

      // Обновляем localStorage актуальными данными из IndexedDB
      if (idbGuides.length > 0) {
        localStorage.setItem('deplos_guides', JSON.stringify(idbGuides));
      }

      if (idbPlans.length > 0) {
        localStorage.setItem('deplos_pricing_plans', JSON.stringify(idbPlans));
      }

      if (idbMessages.length > 0) {
        localStorage.setItem('deplos_messages', JSON.stringify(idbMessages));
      }
    } catch (error) {
      console.error('Failed to sync with localStorage:', error);
    }
  }

  // Очистка старых резервных копий
  async cleanupOldBackups(): Promise<void> {
    try {
      const backups = await this.getBackups();
      
      if (backups.length <= 10) {
        return; // Нет необходимости в очистке
      }

      // Оставляем только последние 10 резервных копий
      const backupsToKeep = backups.slice(0, 10);
      const backupsToDelete = backups.slice(10);

      // Удаляем из IndexedDB
      const hasIDB = await this.ensureConnection();
      if (hasIDB) {
        try {
          await new Promise<void>((resolve, reject) => {
            const transaction = this.db!.transaction(['backups'], 'readwrite');
            const store = transaction.objectStore('backups');
            
            let deleted = 0;
            const toDelete = backupsToDelete.length;
            
            if (toDelete === 0) {
              resolve();
              return;
            }
            
            transaction.onerror = () => resolve(); // Не отклоняем
            
            backupsToDelete.forEach(backup => {
              const deleteRequest = store.delete(backup.timestamp);
              deleteRequest.onsuccess = () => {
                deleted++;
                if (deleted === toDelete) {
                  resolve();
                }
              };
              deleteRequest.onerror = () => {
                deleted++;
                if (deleted === toDelete) {
                  resolve();
                }
              };
            });
          });
        } catch (error) {
          console.warn('Failed to cleanup IndexedDB backups:', error);
        }
      }

      // Обновляем localStorage
      try {
        localStorage.setItem('deplos_backups', JSON.stringify(backupsToKeep));
      } catch (error) {
        console.warn('Failed to cleanup localStorage backups:', error);
      }

      console.log(`Cleaned up ${backupsToDelete.length} old backups`);
    } catch (error) {
      console.error('Failed to cleanup old backups:', error);
    }
  }

  // Проверка целостности данных
  async validateData(): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      const guides = await this.loadData('guides');
      const pricingPlans = await this.loadData('pricingPlans');
      const messages = await this.loadData('messages');
      
      // Проверяем гайды
      if (!Array.isArray(guides)) {
        errors.push('Guides data is not an array');
      } else {
        guides.forEach((guide, index) => {
          if (!guide.id) errors.push(`Guide ${index} missing id`);
          if (!guide.title) errors.push(`Guide ${index} missing title`);
          if (!guide.content) errors.push(`Guide ${index} missing content`);
        });
      }
      
      // Проверяем тарифные планы
      if (!Array.isArray(pricingPlans)) {
        errors.push('Pricing plans data is not an array');
      } else {
        pricingPlans.forEach((plan, index) => {
          if (!plan.id) errors.push(`Pricing plan ${index} missing id`);
          if (!plan.name) errors.push(`Pricing plan ${index} missing name`);
          if (!plan.price) errors.push(`Pricing plan ${index} missing price`);
        });
      }
      
      // Проверяем сообщения
      if (!Array.isArray(messages)) {
        errors.push('Messages data is not an array');
      } else {
        messages.forEach((message, index) => {
          if (!message.id) errors.push(`Message ${index} missing id`);
          if (!message.name) errors.push(`Message ${index} missing name`);
          if (!message.email) errors.push(`Message ${index} missing email`);
          if (!message.message) errors.push(`Message ${index} missing message content`);
        });
      }
      
      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      errors.push(`Validation error: ${error}`);
      return {
        isValid: false,
        errors
      };
    }
  }

  // Очистка всех данных (для отладки)
  async clearAllData(): Promise<void> {
    try {
      // Очищаем IndexedDB
      const hasIDB = await this.ensureConnection();
      if (hasIDB) {
        const stores = ['guides', 'pricingPlans', 'messages', 'settings', 'backups'];
        for (const storeName of stores) {
          try {
            await new Promise<void>((resolve, reject) => {
              const transaction = this.db!.transaction([storeName], 'readwrite');
              const store = transaction.objectStore(storeName);
              const request = store.clear();
              
              transaction.onerror = () => resolve();
              request.onsuccess = () => resolve();
              request.onerror = () => resolve();
            });
          } catch (error) {
            console.warn(`Failed to clear ${storeName}:`, error);
          }
        }
      }

      // Очищаем localStorage
      const keys = [
        'deplos_guides',
        'deplos_pricing_plans', 
        'deplos_messages',
        'deplos_backups',
        'deplos_last_backup'
      ];
      
      keys.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`Failed to remove ${key}:`, error);
        }
      });

      console.log('All data cleared successfully');
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  }
}

export const persistentStorage = new PersistentStorage();