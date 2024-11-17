import React from 'react';
import { Brain, Clock, Server } from 'lucide-react';

interface ModelCardProps {
  name: string;
  type: string;
  accuracy: number;
  lastTrained: string;
  status: 'training' | 'ready' | 'error';
}

const ModelCard: React.FC<ModelCardProps> = ({ name, type, accuracy, lastTrained, status }) => {
  const statusColors = {
    training: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 text-blue-500" />
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-gray-600 text-sm">{type}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-gray-600">
          <Server className="w-4 h-4" />
          <span className="text-sm">Accuracy: {accuracy}%</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Last trained: {lastTrained}</span>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;