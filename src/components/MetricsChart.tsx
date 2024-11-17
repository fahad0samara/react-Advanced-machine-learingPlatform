import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', accuracy: 85, loss: 0.35 },
  { name: 'Feb', accuracy: 88, loss: 0.32 },
  { name: 'Mar', accuracy: 90, loss: 0.28 },
  { name: 'Apr', accuracy: 92, loss: 0.25 },
  { name: 'May', accuracy: 93, loss: 0.23 },
  { name: 'Jun', accuracy: 95, loss: 0.20 },
];

const MetricsChart = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-4">Model Performance</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="accuracy"
              stroke="#3B82F6"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="loss"
              stroke="#EF4444"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsChart;