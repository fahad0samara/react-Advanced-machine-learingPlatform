import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ModelCard from './components/ModelCard';
import MetricsChart from './components/MetricsChart';
import NewModelModal from './components/NewModelModal';
import DataUploader from './components/DataUploader';
import TrainingMonitor from './components/TrainingMonitor';
import { Plus, ArrowUpRight, Users, Brain, Database } from 'lucide-react';
import { useModelStore } from './store/modelStore';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const models = useModelStore((state) => state.models);
  const datasets = useModelStore((state) => state.datasets);

  const stats = [
    { icon: Brain, label: 'Active Models', value: models.length.toString() },
    { icon: Database, label: 'Datasets', value: datasets.length.toString() },
    { icon: Users, label: 'Users', value: '156' },
  ];

  const defaultModels = [
    { name: 'Image Classifier v2', type: 'Computer Vision', accuracy: 95.8, lastTrained: '2h ago', status: 'ready' as const },
    { name: 'Sentiment Analysis', type: 'NLP', accuracy: 92.3, lastTrained: '1d ago', status: 'training' as const },
    { name: 'Anomaly Detection', type: 'Time Series', accuracy: 88.7, lastTrained: '3d ago', status: 'ready' as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Model</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <stat.icon className="w-6 h-6 text-blue-500" />
                  <span className="text-gray-600">{stat.label}</span>
                </div>
                <ArrowUpRight className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TrainingMonitor />
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4">Upload Dataset</h3>
              <DataUploader />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4">Recent Datasets</h3>
              <div className="space-y-4">
                {datasets.slice(0, 4).map((dataset) => (
                  <div key={dataset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{dataset.name}</p>
                      <p className="text-sm text-gray-500">{new Date(dataset.created).toLocaleDateString()}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {(dataset.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Active Models</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...models.map(m => ({
            name: m.name,
            type: m.type,
            accuracy: 85,
            lastTrained: 'Just now',
            status: 'ready' as const
          })), ...defaultModels].map((model, index) => (
            <ModelCard key={index} {...model} />
          ))}
        </div>
      </main>

      <NewModelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;