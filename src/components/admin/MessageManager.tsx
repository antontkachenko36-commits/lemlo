import React, { useState } from 'react';
import { MessageCircle, Mail, User, Calendar, Eye, Trash2, Filter, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

interface Message {
  id: string;
  type: 'contact' | 'support' | 'partnership' | 'creator' | 'general';
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
  readAt?: string;
  repliedAt?: string;
  priority: 'low' | 'medium' | 'high';
  source: string; // откуда пришло сообщение (страница)
}

export const MessageManager: React.FC = () => {
  const { messages, updateMessageStatus, deleteMessage, getMessageStats } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const categories = [
    { id: 'all', label: 'Все сообщения', icon: MessageCircle },
    { id: 'contact', label: 'Контакты', icon: Mail },
    { id: 'support', label: 'Поддержка', icon: AlertCircle },
    { id: 'partnership', label: 'Партнерство', icon: User },
    { id: 'creator', label: 'Создатели', icon: User },
    { id: 'general', label: 'Общие', icon: MessageCircle },
  ];

  const statuses = [
    { id: 'all', label: 'Все статусы' },
    { id: 'new', label: 'Новые' },
    { id: 'read', label: 'Прочитанные' },
    { id: 'replied', label: 'Отвеченные' },
    { id: 'archived', label: 'Архивированные' },
  ];

  const filteredMessages = messages.filter(message => {
    const matchesCategory = selectedCategory === 'all' || message.type === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || message.status === selectedStatus;
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const stats = getMessageStats();

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    if (message.status === 'new') {
      await updateMessageStatus(message.id, 'read');
    }
  };

  const handleStatusChange = async (messageId: string, status: Message['status']) => {
    await updateMessageStatus(messageId, status);
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage({ ...selectedMessage, status });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (confirm('Вы уверены, что хотите удалить это сообщение?')) {
      await deleteMessage(messageId);
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage(null);
      }
    }
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'new':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      case 'read':
        return <Eye className="h-4 w-4 text-yellow-500" />;
      case 'replied':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'archived':
        return <Clock className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: Message['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-white';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Всего сообщений</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <MessageCircle className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Новые</p>
              <p className="text-2xl font-bold text-white">{stats.new}</p>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{stats.new}</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Требуют ответа</p>
              <p className="text-2xl font-bold text-white">{stats.needReply}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Отвеченные</p>
              <p className="text-2xl font-bold text-white">{stats.replied}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              type="text"
              placeholder="Поиск сообщений..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id} className="bg-gray-800">
                {category.label}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
          >
            {statuses.map(status => (
              <option key={status.id} value={status.id} className="bg-gray-800">
                {status.label}
              </option>
            ))}
          </select>

          <div className="text-white/70 flex items-center">
            Найдено: {filteredMessages.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Список сообщений */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-6">
              Сообщения ({filteredMessages.length})
            </h3>
            
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8 text-white/70">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Сообщения не найдены</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 glass rounded-lg cursor-pointer transition-colors hover:bg-white/10 ${
                      selectedMessage?.id === message.id ? 'ring-2 ring-white' : ''
                    } ${message.status === 'new' ? 'border-l-4 border-blue-500' : ''}`}
                    onClick={() => handleViewMessage(message)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(message.status)}
                        <span className="text-white font-medium">{message.name}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          message.type === 'contact' ? 'bg-blue-500/20 text-blue-300' :
                          message.type === 'support' ? 'bg-red-500/20 text-red-300' :
                          message.type === 'partnership' ? 'bg-green-500/20 text-green-300' :
                          message.type === 'creator' ? 'bg-purple-500/20 text-purple-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {categories.find(c => c.id === message.type)?.label || message.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs ${getPriorityColor(message.priority)}`}>
                          {message.priority === 'high' ? 'Высокий' : 
                           message.priority === 'medium' ? 'Средний' : 'Низкий'}
                        </span>
                        <span className="text-white/60 text-xs">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-white/80 text-sm mb-2">{message.email}</div>
                    {message.subject && (
                      <div className="text-white font-medium text-sm mb-2">{message.subject}</div>
                    )}
                    <div className="text-white/70 text-sm line-clamp-2">
                      {message.message}
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                      <span className="text-white/60 text-xs">
                        Источник: {message.source}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMessage(message.id);
                          }}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                          title="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Детали сообщения */}
        <div className="lg:col-span-1">
          {selectedMessage ? (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Детали сообщения</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-white/70 hover:text-white"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Имя</label>
                  <div className="text-white">{selectedMessage.name}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
                  <div className="text-white">{selectedMessage.email}</div>
                </div>
                
                {selectedMessage.subject && (
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">Тема</label>
                    <div className="text-white">{selectedMessage.subject}</div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Категория</label>
                  <div className="text-white">
                    {categories.find(c => c.id === selectedMessage.type)?.label || selectedMessage.type}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Приоритет</label>
                  <div className={getPriorityColor(selectedMessage.priority)}>
                    {selectedMessage.priority === 'high' ? 'Высокий' : 
                     selectedMessage.priority === 'medium' ? 'Средний' : 'Низкий'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Сообщение</label>
                  <div className="text-white bg-white/5 p-3 rounded-lg whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Дата создания</label>
                  <div className="text-white/80 text-sm">{formatDate(selectedMessage.createdAt)}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Источник</label>
                  <div className="text-white/80 text-sm">{selectedMessage.source}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Статус</label>
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value as Message['status'])}
                    className="w-full px-3 py-2 glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                  >
                    <option value="new" className="bg-gray-800">Новое</option>
                    <option value="read" className="bg-gray-800">Прочитано</option>
                    <option value="replied" className="bg-gray-800">Отвечено</option>
                    <option value="archived" className="bg-gray-800">Архивировано</option>
                  </select>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Ваше сообщение'}`}
                    className="w-full btn-primary mb-3"
                  >
                    Ответить по email
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'archived')}
                    className="w-full btn-secondary"
                  >
                    Архивировать
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center">
              <MessageCircle className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">Выберите сообщение для просмотра деталей</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};