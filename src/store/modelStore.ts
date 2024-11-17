import { create } from 'zustand';
import * as tf from '@tensorflow/tfjs';

export interface ModelConfig {
  id: string;
  name: string;
  type: string;
  framework: string;
  model: tf.Sequential | null;
  status: 'ready' | 'training' | 'error';
  metrics: {
    epoch: number;
    loss: number;
    accuracy: number;
    valLoss: number;
    valAccuracy: number;
  }[];
}

export interface Dataset {
  id: string;
  name: string;
  type: string;
  size: number;
  created: string;
  data: File | null;
}

interface ModelState {
  models: ModelConfig[];
  datasets: Dataset[];
  activeModelId: string | null;
  addModel: (model: Omit<ModelConfig, 'id' | 'metrics'>) => string;
  addDataset: (dataset: Omit<Dataset, 'id'>) => void;
  updateModelMetrics: (modelId: string, metrics: ModelConfig['metrics'][0]) => void;
  updateModelStatus: (modelId: string, status: ModelConfig['status']) => void;
  setActiveModel: (modelId: string) => void;
}

export const useModelStore = create<ModelState>((set) => ({
  models: [],
  datasets: [],
  activeModelId: null,
  addModel: (modelData) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      models: [...state.models, { ...modelData, id, metrics: [] }]
    }));
    return id;
  },
  addDataset: (dataset) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      datasets: [...state.datasets, { ...dataset, id }]
    }));
  },
  updateModelMetrics: (modelId, metrics) => {
    set((state) => ({
      models: state.models.map(model =>
        model.id === modelId
          ? { ...model, metrics: [...model.metrics, metrics] }
          : model
      )
    }));
  },
  updateModelStatus: (modelId, status) => {
    set((state) => ({
      models: state.models.map(model =>
        model.id === modelId ? { ...model, status } : model
      )
    }));
  },
  setActiveModel: (modelId) => {
    set({ activeModelId: modelId });
  }
}));