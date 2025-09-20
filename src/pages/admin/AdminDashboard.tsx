import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Book, 
  DollarSign, 
  Users, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Database,
  Loader,
  MessageCircle,
  RefreshCw,
  Bell,
  Menu,
  X,
  TrendingUp,
  Activity,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import { GuideEditor } from '../../components/admin/GuideEditor';
import { PricingPlanEditor } from '../../components/admin/PricingPlanEditor';
import { BackupManager } from '../../components/admin/BackupManager';
import { MessageManager } from '../../components/admin/MessageManager';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showGuideEditor, setShowGuideEditor] = useState(false);
  const [showPricingEditor, setShowPricingEditor] = useState(false);
  const [editingGuide, setEditingGuide] = useState<any>(null);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const { 
    logout, 
    guides, 
    pricingPlans,
    messages,
    getMessageStats,
    addGuide, 
    updateGuide, 
    deleteGuide,
    addPricingPlan,
    updatePricingPlan,
    deletePricingPlan,
    isLoading,
    refreshData
  } = useAdmin();
  const navigate = useNavigate();

  // Автоматическое обновление данных каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshData]);

  const handleLogout = () => {
    logout();
    navigate('/admin1188');
  };

  const handleRefresh = async () => {
    await refreshData();
  };

  const messageStats = getMessageStats();

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Панель управления', 
      icon: LayoutDashboard,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    { 
      id: 'guides', 
      label: 'Гайды', 
      icon: Book,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    { 
      id: 'pricing', 
      label: 'Тарифы', 
      icon: DollarSign,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    { 
      id: 'messages', 
      label: 'Сообщения', 
      icon: MessageCircle, 
      badge: messageStats.new > 0 ? messageStats.new : null,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    { 
      id: 'backups', 
      label: 'Резервные копии', 
      icon: Database,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
    { 
      id: 'users', 
      label: 'Пользователи', 
      icon: Users,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10'
    },
    { 
      id: 'settings', 
      label: 'Настройки', 
      icon: Settings,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10'
    },
  ];

  const stats = [
    { 
      label: 'Всего гайдов', 
      value: guides.length, 
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      icon: Book,
      change: '+12%',
      changeType: 'positive'
    },
    { 
      label: 'Опубликованных', 
      value: guides.filter(g => g.published).length, 
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      icon: Eye,
      change: '+8%',
      changeType: 'positive'
    },
    { 
      label: 'Тарифных планов', 
      value: pricingPlans.length, 
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      icon: DollarSign,
      change: '0%',
      changeType: 'neutral'
    },
    { 
      label: 'Новых сообщений', 
      value: messageStats.new, 
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      icon: MessageCircle,
      change: '+25%',
      changeType: 'positive'
    },
  ];

  const categories = ['all', 'Getting Started', 'Advanced', 'Configuration', 'Management', 'Troubleshooting'];

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || guide.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && guide.published) ||
                         (filterStatus === 'draft' && !guide.published);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSaveGuide = async (guideData: any) => {
    try {
      if (editingGuide) {
        await updateGuide(editingGuide.id, guideData);
      } else {
        await addGuide(guideData);
      }
      setShowGuideEditor(false);
      setEditingGuide(null);
    } catch (error) {
      console.error('Failed to save guide:', error);
      alert('Не удалось сохранить гайд');
    }
  };

  const handleSavePricingPlan = async (planData: any) => {
    try {
      if (editingPlan) {
        await updatePricingPlan(editingPlan.id, planData);
      } else {
        await addPricingPlan(planData);
      }
      setShowPricingEditor(false);
      setEditingPlan(null);
    } catch (error) {
      console.error('Failed to save pricing plan:', error);
      alert('Не удалось сохранить тариф');
    }
  };

  const handleEditGuide = (guide: any) => {
    setEditingGuide(guide);
    setShowGuideEditor(true);
  };

  const handleEditPlan = (plan: any) => {
    setEditingPlan(plan);
    setShowPricingEditor(true);
  };

  const handleDeleteGuide = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот гайд?')) {
      try {
        await deleteGuide(id);
      } catch (error) {
        console.error('Failed to delete guide:', error);
        alert('Не удалось удалить гайд');
      }
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот тариф?')) {
      try {
        await deletePricingPlan(id);
      } catch (error) {
        console.error('Failed to delete pricing plan:', error);
        alert('Не удалось удалить тариф');
      }
    }
  };

  const handleViewGuide = (guide: any) => {
    window.open(`/guides/${guide.id}`, '_blank');
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Панель управления';
      case 'guides': return 'Управление гайдами';
      case 'pricing': return 'Управление тарифами';
      case 'messages': return 'Управление сообщениями';
      case 'backups': return 'Резервные копии';
      case 'users': return 'Управление пользователями';
      case 'settings': return 'Настройки';
      default: return 'Админ панель';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader className="h-12 w-12 text-white animate-spin mx-auto mb-4" />
            <div className="absolute inset-0 h-12 w-12 border-4 border-white/20 rounded-full animate-pulse" />
          </div>
          <p className="text-white text-lg">Загрузка данных...</p>
          <p className="text-white/60 text-sm mt-2">Инициализация системы управления</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 glass-dark border-r border-white/10 min-h-screen relative`}>
          <div className="p-6">
            {/* Logo - ИСПРАВЛЕНО */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M28.16 16C28.16 22.7158 22.7158 28.16 16 28.16C9.28422 28.16 3.84 22.7158 3.84 16H0C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0V3.84C22.7158 3.84 28.16 9.28422 28.16 16Z" fill="black"/>
                  <rect width="11.7073" height="11.7073" fill="black"/>
                  <path d="M13.5029 13.5029H31.36L27.0058 27.0058L13.5029 29.44V13.5029Z" fill="black"/>
                </svg>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <span className="text-xl font-bold text-white">Deplos</span>
                  <div className="text-xs text-white/60">Admin Panel</div>
                </div>
              )}
            </div>

            {/* Collapse Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute top-6 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </button>

            {/* Navigation */}
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                    activeTab === item.id
                      ? `${item.bgColor} ${item.color} shadow-lg scale-105`
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${activeTab === item.id ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'} transition-colors`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    {!sidebarCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </div>
                  {!sidebarCollapsed && item.badge && (
                    <div className="relative">
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-semibold shadow-lg">
                        {item.badge}
                      </span>
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                    </div>
                  )}
                  {sidebarCollapsed && item.badge && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                </button>
              ))}
            </nav>

            {/* User Section */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="glass rounded-xl p-4 border border-white/10">
                {!sidebarCollapsed && (
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">AD</span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">Admin</div>
                      <div className="text-white/60 text-xs">Администратор</div>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors`}
                  title={sidebarCollapsed ? 'Выйти' : ''}
                >
                  <LogOut className="h-4 w-4" />
                  {!sidebarCollapsed && <span>Выйти</span>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Bar */}
          <div className="glass-dark border-b border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">{getTabTitle()}</h1>
                <p className="text-white/60 text-sm mt-1">
                  {activeTab === 'dashboard' && 'Обзор системы и статистика'}
                  {activeTab === 'guides' && `${guides.length} гайдов в системе`}
                  {activeTab === 'pricing' && `${pricingPlans.length} тарифных планов`}
                  {activeTab === 'messages' && `${messages.length} сообщений, ${messageStats.new} новых`}
                  {activeTab === 'backups' && 'Управление резервными копиями'}
                  {activeTab === 'users' && 'Управление пользователями системы'}
                  {activeTab === 'settings' && 'Настройки системы'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Bell className="h-5 w-5" />
                  </button>
                  {notifications > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">{notifications}</span>
                    </div>
                  )}
                </div>

                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  className="btn-secondary flex items-center space-x-2 shadow-lg"
                  title="Обновить данные"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Обновить</span>
                </button>

                {/* Quick Actions */}
                {activeTab === 'guides' && (
                  <button 
                    onClick={() => setShowGuideEditor(true)}
                    className="btn-primary flex items-center space-x-2 shadow-lg"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Новый гайд</span>
                  </button>
                )}
                {activeTab === 'pricing' && (
                  <button 
                    onClick={() => setShowPricingEditor(true)}
                    className="btn-primary flex items-center space-x-2 shadow-lg"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Новый тариф</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="glass rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.color} shadow-lg`}>
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className={`text-sm font-semibold ${
                          stat.changeType === 'positive' ? 'text-green-400' : 
                          stat.changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {stat.change}
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-white/70 text-sm">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts and Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Guides */}
                  <div className="glass rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                        <Book className="h-5 w-5" />
                        <span>Последние гайды</span>
                      </h2>
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="space-y-4">
                      {guides.slice(0, 5).map((guide) => (
                        <div key={guide.id} className="flex items-center justify-between p-3 glass rounded-lg hover:bg-white/10 transition-colors">
                          <div className="flex-1">
                            <h3 className="text-white font-medium text-sm">{guide.title}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-white/60 text-xs">{guide.category}</span>
                              <span className="text-white/40">•</span>
                              <span className="text-white/60 text-xs">{new Date(guide.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${guide.published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Messages */}
                  <div className="glass rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                        <MessageCircle className="h-5 w-5" />
                        <span>Последние сообщения</span>
                      </h2>
                      <Activity className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="space-y-4">
                      {messages.slice(0, 5).map((message) => (
                        <div key={message.id} className="flex items-center justify-between p-3 glass rounded-lg hover:bg-white/10 transition-colors">
                          <div className="flex-1">
                            <h3 className="text-white font-medium text-sm">{message.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded ${
                                message.type === 'contact' ? 'bg-blue-500/20 text-blue-300' :
                                message.type === 'support' ? 'bg-red-500/20 text-red-300' :
                                message.type === 'partnership' ? 'bg-green-500/20 text-green-300' :
                                'bg-purple-500/20 text-purple-300'
                              }`}>
                                {message.type}
                              </span>
                              <span className="text-white/60 text-xs">{new Date(message.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${
                            message.status === 'new' ? 'bg-blue-500 animate-pulse' :
                            message.status === 'read' ? 'bg-yellow-500' :
                            message.status === 'replied' ? 'bg-green-500' : 'bg-gray-500'
                          }`} />
                        </div>
                      ))}
                      {messages.length === 0 && (
                        <div className="text-center py-8 text-white/60">
                          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Сообщений пока нет</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* System Status */}
                <div className="glass rounded-xl p-6 border border-white/10 border-l-4 border-l-green-500">
                  <div className="flex items-start space-x-4">
                    <Database className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold mb-2 flex items-center space-x-2">
                        <span>Система хранения данных</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80 text-sm">
                        <div className="space-y-1">
                          <p>✅ IndexedDB активна и работает</p>
                          <p>✅ Автоматическое резервное копирование</p>
                          <p>✅ Синхронизация с localStorage</p>
                        </div>
                        <div className="space-y-1">
                          <p>✅ Система сообщений активна</p>
                          <p>✅ Автоматическое обновление каждые 30 сек</p>
                          <p>✅ Экспорт/импорт данных доступен</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'guides' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="glass rounded-xl p-6 border border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <input
                        type="text"
                        placeholder="Поиск гайдов..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                      />
                    </div>
                    
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-4 py-3 glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                    >
                      {categories.map(category => (
                        <option key={category} value={category} className="bg-gray-800">
                          {category === 'all' ? 'Все категории' : category}
                        </option>
                      ))}
                    </select>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-3 glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                    >
                      <option value="all" className="bg-gray-800">Все статусы</option>
                      <option value="published" className="bg-gray-800">Опубликованные</option>
                      <option value="draft" className="bg-gray-800">Черновики</option>
                    </select>

                    <div className="text-white/70 flex items-center justify-center bg-white/5 rounded-lg px-4 py-3">
                      Найдено: {filteredGuides.length}
                    </div>
                  </div>
                </div>

                {/* Guides Table */}
                <div className="glass rounded-xl border border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="text-left text-white font-semibold py-4 px-6">Название</th>
                          <th className="text-left text-white font-semibold py-4 px-6">Категория</th>
                          <th className="text-left text-white font-semibold py-4 px-6">Сложность</th>
                          <th className="text-left text-white font-semibold py-4 px-6">Статус</th>
                          <th className="text-left text-white font-semibold py-4 px-6">Обновлено</th>
                          <th className="text-left text-white font-semibold py-4 px-6">Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGuides.map((guide, index) => (
                          <tr key={guide.id} className={`border-t border-white/5 hover:bg-white/5 transition-colors ${index % 2 === 0 ? 'bg-white/2' : ''}`}>
                            <td className="py-4 px-6">
                              <div>
                                <div className="text-white font-medium">{guide.title}</div>
                                <div className="text-white/60 text-sm">{guide.readTime}</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="bg-white/20 text-white px-2 py-1 rounded text-xs">
                                {guide.category}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                guide.difficulty === 'Beginner' 
                                  ? 'bg-green-500/20 text-green-300'
                                  : guide.difficulty === 'Intermediate'
                                  ? 'bg-yellow-500/20 text-yellow-300'
                                  : 'bg-red-500/20 text-red-300'
                              }`}>
                                {guide.difficulty}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${guide.published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                <span className={`text-xs font-semibold ${
                                  guide.published ? 'text-green-300' : 'text-yellow-300'
                                }`}>
                                  {guide.published ? 'Опубликован' : 'Черновик'}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-white/70 text-sm">
                              {new Date(guide.updatedAt).toLocaleDateString('ru-RU')}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => handleViewGuide(guide)}
                                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                  title="Просмотр"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleEditGuide(guide)}
                                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                  title="Редактировать"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteGuide(guide.id)}
                                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                  title="Удалить"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {filteredGuides.length === 0 && (
                      <div className="text-center py-12 text-white/70">
                        <Book className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Гайды не найдены</p>
                        <p className="text-sm mt-2">Попробуйте изменить фильтры или создать новый гайд</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pricingPlans.map((plan) => (
                    <div key={plan.id} className={`glass rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
                      plan.popular ? 'border-white/30 ring-2 ring-white/20' : 'border-white/10'
                    }`}>
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-gradient-to-r from-white to-gray-300 text-black px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
                            Популярный
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center mb-6">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                          plan.popular ? 'bg-gradient-to-r from-white to-gray-300' : 'bg-white/10'
                        }`}>
                          <DollarSign className={`h-8 w-8 ${plan.popular ? 'text-black' : 'text-white'}`} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                        <div className="mb-2">
                          <span className="text-4xl font-bold text-white">${plan.price}</span>
                          <span className="text-white/60 ml-2">{plan.period}</span>
                        </div>
                        <p className="text-white/70 text-sm">{plan.description}</p>
                      </div>

                      <div className="space-y-3 mb-6">
                        {plan.features.slice(0, 4).map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0" />
                            <span className="text-white/80 text-sm">{feature}</span>
                          </div>
                        ))}
                        {plan.features.length > 4 && (
                          <div className="text-white/60 text-sm">+{plan.features.length - 4} больше</div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditPlan(plan)}
                          className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Редактировать</span>
                        </button>
                        <button 
                          onClick={() => handleDeletePlan(plan.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'messages' && <MessageManager />}
            {activeTab === 'backups' && <BackupManager />}

            {activeTab === 'users' && (
              <div className="glass rounded-xl p-8 border border-white/10 text-center">
                <Users className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Управление пользователями</h3>
                <p className="text-white/70">Функция управления пользователей будет добавлена в следующих обновлениях.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="glass rounded-xl p-8 border border-white/10 text-center">
                <Settings className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Настройки системы</h3>
                <p className="text-white/70">Настройки системы будут добавлены в следующих обновлениях.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showGuideEditor && (
        <GuideEditor
          guide={editingGuide}
          onSave={handleSaveGuide}
          onCancel={() => {
            setShowGuideEditor(false);
            setEditingGuide(null);
          }}
        />
      )}

      {showPricingEditor && (
        <PricingPlanEditor
          plan={editingPlan}
          onSave={handleSavePricingPlan}
          onCancel={() => {
            setShowPricingEditor(false);
            setEditingPlan(null);
          }}
        />
      )}
    </div>
  );
};