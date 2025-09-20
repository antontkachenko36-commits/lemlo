import React, { useState } from 'react';
import { Save, X, DollarSign, Plus, Trash2 } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PricingPlanEditorProps {
  plan?: PricingPlan;
  onSave: (plan: Omit<PricingPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const PricingPlanEditor: React.FC<PricingPlanEditorProps> = ({ plan, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: plan?.name || '',
    price: plan?.price || '0',
    period: plan?.period || 'per month',
    description: plan?.description || '',
    features: plan?.features || [''],
    popular: plan?.popular || false,
  });

  const [newFeature, setNewFeature] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedFeatures = formData.features.filter(feature => feature.trim() !== '');
    onSave({ ...formData, features: cleanedFeatures });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      handleChange('features', [...formData.features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    handleChange('features', newFeatures);
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    handleChange('features', newFeatures);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-dark rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/10">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <DollarSign className="h-6 w-6" />
            <span>{plan ? 'Редактировать тариф' : 'Создать новый тариф'}</span>
          </h2>
          <button onClick={onCancel} className="p-2 text-white/70 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Название тарифа
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                  placeholder="Free, Mini, Alpha..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Цена
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className="w-full px-4 py-2 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                  placeholder="0, 5, 15..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Период
                </label>
                <select
                  value={formData.period}
                  onChange={(e) => handleChange('period', e.target.value)}
                  className="w-full px-4 py-2 glass rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                >
                  <option value="Forever" className="bg-gray-800">Forever</option>
                  <option value="per month" className="bg-gray-800">per month</option>
                  <option value="per year" className="bg-gray-800">per year</option>
                  <option value="one-time" className="bg-gray-800">one-time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Популярный
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => handleChange('popular', e.target.checked)}
                    className="rounded border-white/20 bg-transparent text-white focus:ring-white"
                  />
                  <span className="text-white">Отметить как популярный</span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-4 py-2 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white resize-none border border-white/20"
                rows={3}
                placeholder="Краткое описание тарифа..."
                required
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Особенности
              </label>
              
              {/* Existing Features */}
              <div className="space-y-2 mb-4">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 px-4 py-2 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                      placeholder="Особенность тарифа..."
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Feature */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-2 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                  placeholder="Добавить новую особенность..."
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Добавить</span>
                </button>
              </div>
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
      </div>
    </div>
  );
};