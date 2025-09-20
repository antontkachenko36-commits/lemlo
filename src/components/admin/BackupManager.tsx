import React, { useState, useEffect } from 'react';
import { Download, Upload, RefreshCw, Trash2, Save, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

interface BackupData {
  timestamp: number;
  data: {
    guides: any[];
    pricingPlans: any[];
    version: string;
    created: string;
  };
}

export const BackupManager: React.FC = () => {
  const { createBackup, restoreBackup, getBackups, exportData, importData, error, clearError } = useAdmin();
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    loadBackups();
  }, []);

  // Очищаем сообщения через 5 секунд
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Отображаем ошибки из контекста
  useEffect(() => {
    if (error) {
      setMessage({ type: 'error', text: error });
      clearError();
    }
  }, [error, clearError]);

  const loadBackups = async () => {
    try {
      setIsLoading(true);
      const backupList = await getBackups();
      setBackups(backupList);
    } catch (error) {
      setMessage({ type: 'error', text: 'Не удалось загрузить список резервных копий' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setIsLoading(true);
    try {
      await createBackup();
      await loadBackups();
      setMessage({ type: 'success', text: 'Резервная копия успешно создана' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Не удалось создать резервную копию' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreBackup = async (timestamp: number) => {
    if (!confirm('Вы уверены, что хотите восстановить данные из этой резервной копии? Текущие данные будут перезаписаны.')) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await restoreBackup(timestamp);
      if (success) {
        setMessage({ type: 'success', text: 'Данные успешно восстановлены из резервной копии' });
        // Перезагружаем страницу для обновления интерфейса
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setMessage({ type: 'error', text: 'Не удалось восстановить данные из резервной копии' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при восстановлении данных' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `deplos_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: 'Данные успешно экспортированы' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Не удалось экспортировать данные' });
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setMessage({ type: 'error', text: 'Пожалуйста, выберите JSON файл' });
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonData = e.target?.result as string;
        
        // Проверяем, что файл содержит валидный JSON
        try {
          JSON.parse(jsonData);
        } catch (parseError) {
          setMessage({ type: 'error', text: 'Файл содержит некорректный JSON' });
          return;
        }

        const success = await importData(jsonData);
        if (success) {
          setMessage({ type: 'success', text: 'Данные успешно импортированы' });
          await loadBackups();
          // Перезагружаем страницу для обновления интерфейса
          setTimeout(() => window.location.reload(), 2000);
        } else {
          setMessage({ type: 'error', text: 'Не удалось импортировать данные. Проверьте формат файла.' });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Ошибка при чтении файла' });
      }
    };
    
    reader.onerror = () => {
      setMessage({ type: 'error', text: 'Ошибка при чтении файла' });
    };
    
    reader.readAsText(file);
    
    // Сбрасываем значение input для возможности повторного выбора того же файла
    event.target.value = '';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatSize = (data: any) => {
    const size = JSON.stringify(data).length;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getBackupAge = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} дн. назад`;
    if (hours > 0) return `${hours} ч. назад`;
    if (minutes > 0) return `${minutes} мин. назад`;
    return 'Только что';
  };

  return (
    <div className="space-y-6">
      {/* Сообщения */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-500/20 border border-green-500/50' 
            : message.type === 'info'
            ? 'bg-blue-500/20 border border-blue-500/50'
            : 'bg-red-500/20 border border-red-500/50'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-300" />
          ) : message.type === 'info' ? (
            <Info className="h-5 w-5 text-blue-300" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-300" />
          )}
          <span className={
            message.type === 'success' 
              ? 'text-green-300' 
              : message.type === 'info'
              ? 'text-blue-300'
              : 'text-red-300'
          }>
            {message.text}
          </span>
        </div>
      )}

      {/* Действия */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-6">Управление резервными копиями</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleCreateBackup}
            disabled={isLoading}
            className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            <span>Создать копию</span>
          </button>

          <button
            onClick={handleExportData}
            disabled={isLoading}
            className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            <span>Экспорт данных</span>
          </button>

          <label className={`btn-secondary flex items-center justify-center space-x-2 cursor-pointer ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}>
            <Upload className="h-4 w-4" />
            <span>Импорт данных</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleImportData}
              disabled={isLoading}
              className="hidden"
            />
          </label>

          <button
            onClick={loadBackups}
            disabled={isLoading}
            className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Обновить</span>
          </button>
        </div>
      </div>

      {/* Список резервных копий */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-6">
          Резервные копии ({backups.length})
        </h3>
        
        {isLoading && backups.length === 0 ? (
          <div className="text-center py-8 text-white/70">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            Загрузка резервных копий...
          </div>
        ) : backups.length === 0 ? (
          <div className="text-center py-8 text-white/70">
            <Save className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Резервные копии не найдены</p>
            <p className="text-sm mt-2">Создайте первую резервную копию, нажав кнопку "Создать копию"</p>
          </div>
        ) : (
          <div className="space-y-4">
            {backups.map((backup, index) => (
              <div key={backup.timestamp} className="glass rounded-lg p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-white font-medium">
                        Резервная копия #{backups.length - index}
                      </h4>
                      {index === 0 && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                          Последняя
                        </span>
                      )}
                    </div>
                    <div className="text-white/70 text-sm space-y-1">
                      <div className="flex items-center space-x-4">
                        <span>📅 {formatDate(backup.timestamp)}</span>
                        <span>⏰ {getBackupAge(backup.timestamp)}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span>📦 {formatSize(backup.data)}</span>
                        <span>📄 {backup.data.guides?.length || 0} гайдов</span>
                        <span>💰 {backup.data.pricingPlans?.length || 0} тарифов</span>
                      </div>
                      {backup.data.version && (
                        <div>
                          <span>🏷️ Версия: {backup.data.version}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRestoreBackup(backup.timestamp)}
                      disabled={isLoading}
                      className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Восстановить из этой резервной копии"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Информация */}
      <div className="card border-l-4 border-blue-500">
        <div className="flex items-start space-x-4">
          <Info className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-white font-semibold mb-2">Информация о резервных копиях</h4>
            <div className="text-white/80 space-y-2 text-sm">
              <p>• Резервные копии создаются автоматически каждые 30 минут</p>
              <p>• Данные сохраняются в IndexedDB браузера и дублируются в localStorage</p>
              <p>• Система автоматически очищает старые копии, оставляя последние 10</p>
              <p>• Экспорт данных создает JSON файл для переноса на другие устройства</p>
              <p>• При восстановлении текущие данные будут полностью заменены</p>
              <p>• Рекомендуется регулярно экспортировать данные для дополнительной безопасности</p>
            </div>
          </div>
        </div>
      </div>

      {/* Предупреждение */}
      <div className="card border-l-4 border-yellow-500">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-white font-semibold mb-2">Важные предупреждения</h4>
            <div className="text-white/80 space-y-2 text-sm">
              <p>• Восстановление из резервной копии необратимо - все текущие данные будут потеряны</p>
              <p>• Резервные копии хранятся локально в браузере и могут быть потеряны при очистке данных</p>
              <p>• Для надежного хранения используйте функцию экспорта данных</p>
              <p>• Перед важными изменениями всегда создавайте резервную копию вручную</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};