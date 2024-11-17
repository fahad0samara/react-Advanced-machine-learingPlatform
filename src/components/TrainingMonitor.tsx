import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { useModelStore } from '../store/modelStore';
import { createModel, trainModel, preprocessData } from '../utils/modelTraining';
import * as tf from '@tensorflow/tfjs';

const TrainingMonitor: React.FC = () => {
  const { models, datasets, activeModelId, updateModelMetrics, updateModelStatus } = useModelStore();
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);

  const activeModel = models.find(m => m.id === activeModelId);
  const latestDataset = datasets[datasets.length - 1];

  const startTraining = async () => {
    if (!activeModel || !latestDataset?.data || isTraining) return;

    try {
      setIsTraining(true);
      updateModelStatus(activeModel.id, 'training');

      const { xs, ys } = await preprocessData(latestDataset.data);
      const model = createModel(xs.shape[1]);

      const callbacks = {
        onEpochEnd: (epoch: number, logs: any) => {
          setCurrentEpoch(epoch + 1);
          updateModelMetrics(activeModel.id, {
            epoch: epoch + 1,
            loss: logs.loss,
            accuracy: 1 - logs.loss, // Simplified accuracy calculation
            valLoss: logs.val_loss,
            valAccuracy: 1 - logs.val_loss
          });
        },
        onBatchEnd: () => {
          // Update batch progress if needed
        }
      };

      await trainModel(model, xs, ys, callbacks);
      updateModelStatus(activeModel.id, 'ready');
    } catch (error) {
      console.error('Training error:', error);
      updateModelStatus(activeModel.id, 'error');
    } finally {
      setIsTraining(false);
    }
  };

  const metrics = activeModel?.metrics || [];
  const latestMetrics = metrics[metrics.length - 1];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Training Progress</h3>
        <div className="flex space-x-4">
          {isTraining ? (
            <button 
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsTraining(false)}
            >
              <Pause className="w-5 h-5" />
            </button>
          ) : (
            <button 
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={startTraining}
              disabled={!activeModel || !latestDataset}
            >
              <Play className="w-5 h-5" />
            </button>
          )}
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Current Epoch', value: `${currentEpoch}/50` },
          { label: 'Training Loss', value: latestMetrics?.loss.toFixed(3) || '-' },
          { label: 'Validation Loss', value: latestMetrics?.valLoss.toFixed(3) || '-' },
          { label: 'Accuracy', value: latestMetrics ? `${(latestMetrics.accuracy * 100).toFixed(1)}%` : '-' },
        ].map((metric, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">{metric.label}</p>
            <p className="text-lg font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="epoch" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="loss"
              name="Training Loss"
              stroke="#EF4444"
              strokeWidth={2}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="valLoss"
              name="Validation Loss"
              stroke="#F59E0B"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="accuracy"
              name="Training Accuracy"
              stroke="#3B82F6"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="valAccuracy"
              name="Validation Accuracy"
              stroke="#10B981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrainingMonitor;