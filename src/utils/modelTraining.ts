import * as tf from '@tensorflow/tfjs';
import Papa from 'papaparse';

export interface TrainingCallback {
  onEpochEnd: (epoch: number, logs: any) => void;
  onBatchEnd: (batch: number, logs: any) => void;
}

export interface DataValidation {
  isValid: boolean;
  error?: string;
  summary?: {
    rowCount: number;
    columnCount: number;
    missingValues: number;
    dataTypes: string[];
    features: string[];
    target?: string;
  };
}

export const validateDataset = async (file: File): Promise<DataValidation> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      preview: 1000, // Preview first 1000 rows
      complete: (results) => {
        const { data, meta } = results;
        if (!data.length) {
          resolve({ isValid: false, error: 'Empty dataset' });
          return;
        }

        const rowCount = data.length;
        const columnCount = Object.keys(data[0]).length;
        let missingValues = 0;
        const dataTypes = new Set<string>();

        // Analyze data types and missing values
        data.forEach(row => {
          Object.values(row).forEach(value => {
            if (value === '' || value === null || value === undefined) {
              missingValues++;
            } else {
              dataTypes.add(typeof value);
            }
          });
        });

        resolve({
          isValid: true,
          summary: {
            rowCount,
            columnCount,
            missingValues,
            dataTypes: Array.from(dataTypes),
            features: meta.fields || []
          }
        });
      },
      error: (error) => resolve({ isValid: false, error: error.message })
    });
  });
};

export const preprocessData = async (file: File): Promise<{ xs: tf.Tensor; ys: tf.Tensor }> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const data = results.data as Record<string, any>[];
        if (!data.length) {
          reject(new Error('Empty dataset'));
          return;
        }

        // Remove rows with missing values
        const cleanData = data.filter(row => 
          Object.values(row).every(val => val !== null && val !== undefined && val !== '')
        );

        // Convert to tensors
        const features = cleanData.map(row => {
          const values = Object.values(row);
          return values.slice(0, -1);
        });
        const labels = cleanData.map(row => {
          const values = Object.values(row);
          return values[values.length - 1];
        });

        // Normalize features
        const featureTensor = tf.tensor2d(features);
        const labelTensor = tf.tensor1d(labels);

        resolve({ 
          xs: featureTensor,
          ys: labelTensor
        });
      },
      error: (error) => reject(error)
    });
  });
};

export const createModel = (inputShape: number): tf.Sequential => {
  const model = tf.sequential();
  
  // Input layer
  model.add(tf.layers.dense({
    units: 128,
    activation: 'relu',
    inputShape: [inputShape]
  }));
  
  // Hidden layers
  model.add(tf.layers.dropout({ rate: 0.3 }));
  model.add(tf.layers.dense({
    units: 64,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({
    units: 32,
    activation: 'relu'
  }));
  
  // Output layer
  model.add(tf.layers.dense({
    units: 1
  }));

  // Compile with Adam optimizer and MSE loss
  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'meanSquaredError',
    metrics: ['mse']
  });

  return model;
};

export const trainModel = async (
  model: tf.Sequential,
  xs: tf.Tensor,
  ys: tf.Tensor,
  callbacks: TrainingCallback
): Promise<tf.History> => {
  // Configure training parameters
  const trainingConfig = {
    epochs: 50,
    batchSize: 32,
    validationSplit: 0.2,
    shuffle: true,
    callbacks: {
      onEpochEnd: callbacks.onEpochEnd,
      onBatchEnd: callbacks.onBatchEnd,
      // Early stopping
      onEpochBegin: async (epoch: number) => {
        if (epoch > 10) {
          const logs = model.history.history;
          const recentLoss = logs.loss.slice(-5);
          const isImproving = recentLoss.every((loss, i) => 
            i === 0 || loss <= recentLoss[i - 1]
          );
          if (!isImproving) {
            model.stopTraining = true;
          }
        }
      }
    }
  };

  // Start training
  return await model.fit(xs, ys, trainingConfig);
};