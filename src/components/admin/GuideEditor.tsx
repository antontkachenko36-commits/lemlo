import React, { useState, useEffect } from 'react';
import { Save, X, Eye, FileText, Tag, Clock, User } from 'lucide-react';

interface Guide {
  id: string;
  title: string;
  category: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  author: string;
}

interface GuideEditorProps {
  guide?: Guide;
  onSave: (guide: Omit<Guide, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const GuideEditor: React.FC<GuideEditorProps> = ({ guide, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: guide?.title || '',
    category: guide?.category || 'Getting Started',
    readTime: guide?.readTime || '5 min read',
    difficulty: guide?.difficulty || 'Beginner' as const,
    content: guide?.content || '',
    published: guide?.published || false,
    tags: guide?.tags || [],
    author: guide?.author || 'Deplos Team',
  });

  const [tagInput, setTagInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const categories = [
    'Getting Started',
    'Advanced',
    'Configuration',
    'Management',
    'Troubleshooting',
    'Performance',
    'Security',
    'Plugins',
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-dark rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-white/10">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <span>{guide ? 'Редактировать гайд' : 'Создать новый гайд'}</span>
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>{isPreview ? 'Редактор' : 'Превью'}</span>
            </button>
            <button onClick={onCancel} className="p-2 text-white/70 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Form Section */}
          <div className={`${isPreview ? 'w-1/2' : 'w-full'} p-6 overflow-y-auto border-r border-white/10`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Название
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                    placeholder="Введите название гайда"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Категория
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                  >
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-gray-800">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Время чтения
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => handleChange('readTime', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                    placeholder="5 min read"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Сложность
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleChange('difficulty', e.target.value as any)}
                    className="w-full px-4 py-2 glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty} className="bg-gray-800">
                        {difficulty}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Автор
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => handleChange('author', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                    placeholder="Deplos Team"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Статус
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => handleChange('published', e.target.checked)}
                      className="rounded border-white/20 bg-transparent text-white focus:ring-white"
                    />
                    <span className="text-white">Опубликован</span>
                  </label>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Теги
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 bg-white/20 text-white px-2 py-1 rounded text-sm"
                    >
                      <Tag className="h-3 w-3" />
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-white/70 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-2 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                    placeholder="Добавить тег"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="btn-secondary"
                  >
                    Добавить
                  </button>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Содержание (Markdown)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  className="w-full h-96 px-4 py-2 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20 font-mono text-sm"
                  placeholder="Введите содержание гайда в формате Markdown..."
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onCancel}
                  className="btn-secondary"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Сохранить</span>
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          {isPreview && (
            <div className="w-1/2 p-6 overflow-y-auto">
              <div className="prose prose-invert max-w-none">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-white mb-2">{formData.title || 'Название гайда'}</h1>
                  <div className="flex items-center space-x-4 text-sm text-white/70 mb-4">
                    <span className="bg-white/20 text-white px-2 py-1 rounded">{formData.category}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formData.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{formData.author}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      formData.difficulty === 'Beginner' 
                        ? 'bg-green-500/20 text-green-300'
                        : formData.difficulty === 'Intermediate'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {formData.difficulty}
                    </span>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.tags.map((tag, index) => (
                        <span key={index} className="bg-white/10 text-white/80 px-2 py-1 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-white/80 whitespace-pre-wrap">
                  {formData.content || 'Содержание гайда появится здесь...'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};