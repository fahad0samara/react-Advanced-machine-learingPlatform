import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { useModelStore } from '../store/modelStore';
import { preprocessData, validateDataset } from '../utils/modelTraining';

const DataUploader: React.FC = () => {
  const addDataset = useModelStore((state) => state.addDataset);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [validationSummary, setValidationSummary] = useState<any>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadStatus('processing');
    setErrorMessage('');

    try {
      // Validate file type
      const validTypes = ['text/csv', 'application/json', 'application/vnd.ms-excel'];
      if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
        throw new Error('Please upload a CSV, JSON, or Excel file');
      }

      // Preview and validate data
      const validation = await validateDataset(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      setValidationSummary(validation.summary);

      // Process data
      await preprocessData(file);

      // Add to store
      addDataset({
        name: file.name,
        type: file.type,
        size: file.size,
        created: new Date().toISOString(),
        data: file
      });

      setUploadStatus('success');
    } catch (error) {
      console.error('Error processing file:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error processing file');
      setUploadStatus('error');
    }
  }, [addDataset]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.ms-excel': ['.xls', '.xlsx']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}
          ${uploadStatus === 'error' ? 'border-red-500 bg-red-50' : ''}
          ${uploadStatus === 'success' ? 'border-green-500 bg-green-50' : ''}`}
      >
        <input {...getInputProps()} />
        {uploadStatus === 'processing' ? (
          <div className="animate-pulse">
            <RefreshCw className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
            <p className="text-lg font-medium text-gray-700">Processing file...</p>
          </div>
        ) : uploadStatus === 'error' ? (
          <>
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <p className="text-lg font-medium text-red-700">{errorMessage}</p>
          </>
        ) : uploadStatus === 'success' ? (
          <>
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <p className="text-lg font-medium text-green-700">File uploaded successfully!</p>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-700">
              {isDragActive ? 'Drop the file here' : 'Drag & drop your dataset here'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: CSV, JSON, Excel
            </p>
          </>
        )}
      </div>

      {uploadStatus === 'success' && validationSummary && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">Dataset Preview</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Rows: {validationSummary.rowCount}</p>
              <p className="text-gray-600">Columns: {validationSummary.columnCount}</p>
            </div>
            <div>
              <p className="text-gray-600">Missing Values: {validationSummary.missingValues}</p>
              <p className="text-gray-600">Data Types: {validationSummary.dataTypes.join(', ')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataUploader;