import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useModelStore } from '../store/modelStore';

interface NewModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewModelModal: React.FC<NewModelModalProps> = ({ isOpen, onClose }) => {
  const addModel = useModelStore((state) => state.addModel);
  const [modelConfig, setModelConfig] = useState({
    name: '',
    type: 'classification',
    framework: 'tensorflow',
    model: null,
    status: 'ready' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addModel(modelConfig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Create New Model</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model Name
              </label>
              <input
                type="text"
                value={modelConfig.name}
                onChange={(e) => setModelConfig({ ...modelConfig, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model Type
              </label>
              <select
                value={modelConfig.type}
                onChange={(e) => setModelConfig({ ...modelConfig, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="classification">Classification</option>
                <option value="regression">Regression</option>
                <option value="clustering">Clustering</option>
                <option value="nlp">Natural Language Processing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Framework
              </label>
              <select
                value={modelConfig.framework}
                onChange={(e) => setModelConfig({ ...modelConfig, framework: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="tensorflow">TensorFlow</option>
                <option value="pytorch">PyTorch</option>
                <option value="scikit-learn">Scikit-learn</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Model
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewModelModal;