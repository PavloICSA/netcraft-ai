import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';
import { Dataset, DataColumn } from '../../types';
import { motion } from 'framer-motion';

interface DataUploaderProps {
  onDatasetLoaded: (dataset: Dataset) => void;
}

/**
 * CSV file uploader with drag-and-drop support and demo data loading
 */
const DataUploader: React.FC<DataUploaderProps> = ({ onDatasetLoaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  /**
   * Process uploaded CSV data
   */
  const processCSVData = useCallback((csvData: any[], fileName: string) => {
    if (csvData.length === 0) {
      throw new Error('CSV file is empty');
    }

    // Get column names from first row
    const columnNames = Object.keys(csvData[0]);
    
    // Analyze columns and infer types
    const columns: DataColumn[] = columnNames.map(name => {
      const values = csvData.map(row => row[name]).filter(val => val !== null && val !== undefined && val !== '');
      
      // Infer column type
      let type: 'numeric' | 'categorical' | 'datetime' = 'categorical';
      
      // Check if numeric
      const numericValues = values.filter(val => !isNaN(Number(val)) && val !== '');
      if (numericValues.length > values.length * 0.8) {
        type = 'numeric';
      }
      
      // Check if datetime
      const dateValues = values.filter(val => !isNaN(Date.parse(val)));
      if (dateValues.length > values.length * 0.8) {
        type = 'datetime';
      }

      // Calculate statistics for numeric columns
      let stats = undefined;
      if (type === 'numeric') {
        const nums = values.map(val => Number(val)).filter(val => !isNaN(val));
        if (nums.length > 0) {
          const mean = nums.reduce((sum, val) => sum + val, 0) / nums.length;
          const variance = nums.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / nums.length;
          
          stats = {
            min: Math.min(...nums),
            max: Math.max(...nums),
            mean,
            std: Math.sqrt(variance),
            unique: new Set(nums).size,
            nullCount: csvData.length - nums.length
          };
        }
      } else {
        stats = {
          unique: new Set(values).size,
          nullCount: csvData.length - values.length
        };
      }

      return {
        name,
        type,
        values,
        stats
      };
    });

    const dataset: Dataset = {
      id: `dataset_${Date.now()}`,
      name: fileName.replace('.csv', ''),
      data: csvData,
      columns,
      createdAt: new Date()
    };

    return dataset;
  }, []);

  /**
   * Handle file upload
   */
  const handleFileUpload = useCallback((file: File) => {
    setIsUploading(true);

    Papa.parse(file, {
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }

          const dataset = processCSVData(results.data as any[], file.name);
          onDatasetLoaded(dataset);
        } catch (error) {
          console.error('Error processing CSV:', error);
          alert(`Error processing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
          setIsUploading(false);
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        alert(`Error parsing CSV: ${error.message}`);
        setIsUploading(false);
      },
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false // Keep as strings for better type inference
    });
  }, [processCSVData, onDatasetLoaded]);

  /**
   * Load demo dataset
   */
  const loadDemoDataset = useCallback(async (datasetName: 'iris' | 'timeseries') => {
    setIsUploading(true);
    
    try {
      let csvContent: string;
      let fileName: string;

      if (datasetName === 'iris') {
        // Iris dataset
        csvContent = `sepal_length,sepal_width,petal_length,petal_width,species
5.1,3.5,1.4,0.2,setosa
4.9,3.0,1.4,0.2,setosa
4.7,3.2,1.3,0.2,setosa
4.6,3.1,1.5,0.2,setosa
5.0,3.6,1.4,0.2,setosa
5.4,3.9,1.7,0.4,setosa
4.6,3.4,1.4,0.3,setosa
5.0,3.4,1.5,0.2,setosa
4.4,2.9,1.4,0.2,setosa
4.9,3.1,1.5,0.1,setosa
7.0,3.2,4.7,1.4,versicolor
6.4,3.2,4.5,1.5,versicolor
6.9,3.1,4.9,1.5,versicolor
5.5,2.3,4.0,1.3,versicolor
6.5,2.8,4.6,1.5,versicolor
5.7,2.8,4.5,1.3,versicolor
6.3,3.3,4.7,1.6,versicolor
4.9,2.4,3.3,1.0,versicolor
6.6,2.9,4.6,1.3,versicolor
5.2,2.7,3.9,1.4,versicolor
6.3,3.3,6.0,2.5,virginica
5.8,2.7,5.1,1.9,virginica
7.1,3.0,5.9,2.1,virginica
6.3,2.9,5.6,1.8,virginica
6.5,3.0,5.8,2.2,virginica
7.6,3.0,6.6,2.1,virginica
4.9,2.5,4.5,1.7,virginica
7.3,2.9,6.3,1.8,virginica
6.7,2.5,5.8,1.8,virginica
7.2,3.6,6.1,2.5,virginica`;
        fileName = 'iris_demo.csv';
      } else {
        // Time series dataset
        csvContent = `date,sales,temperature,promotion
2024-01-01,1250,15.2,0
2024-01-02,1180,14.8,0
2024-01-03,1320,16.1,1
2024-01-04,1450,17.3,1
2024-01-05,1380,16.9,0
2024-01-06,1290,15.7,0
2024-01-07,1420,18.2,1
2024-01-08,1350,17.1,0
2024-01-09,1280,16.4,0
2024-01-10,1510,19.3,1
2024-01-11,1390,18.1,0
2024-01-12,1460,18.7,1
2024-01-13,1320,17.2,0
2024-01-14,1380,17.8,0
2024-01-15,1550,20.1,1
2024-01-16,1420,19.4,0
2024-01-17,1350,18.6,0
2024-01-18,1480,19.8,1
2024-01-19,1410,19.2,0
2024-01-20,1590,21.3,1`;
        fileName = 'sales_timeseries_demo.csv';
      }

      Papa.parse(csvContent, {
        complete: (results) => {
          try {
            const dataset = processCSVData(results.data as any[], fileName);
            onDatasetLoaded(dataset);
          } catch (error) {
            console.error('Error processing demo data:', error);
            alert(`Error processing demo data: ${error instanceof Error ? error.message : 'Unknown error'}`);
          } finally {
            setIsUploading(false);
          }
        },
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false
      });
    } catch (error) {
      console.error('Error loading demo dataset:', error);
      alert('Error loading demo dataset');
      setIsUploading(false);
    }
  }, [processCSVData, onDatasetLoaded]);

  /**
   * Handle drag events
   */
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  /**
   * Handle drop event
   */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        handleFileUpload(file);
      } else {
        alert('Please upload a CSV file');
      }
    }
  }, [handleFileUpload]);

  /**
   * Handle file input change
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  }, [handleFileUpload]);

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-secondary-300 hover:border-primary-400 hover:bg-primary-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              {isUploading ? 'Processing...' : 'Upload CSV File'}
            </h3>
            <p className="text-secondary-600">
              Drag and drop your CSV file here, or click to browse
            </p>
            <p className="text-sm text-secondary-500 mt-2">
              Supports CSV files with headers
            </p>
          </div>
        </div>
      </motion.div>

      {/* Demo Data Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Try Demo Datasets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => loadDemoDataset('iris')}
            disabled={isUploading}
            className="p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <h4 className="font-medium text-secondary-900 mb-2">Iris Dataset</h4>
            <p className="text-sm text-secondary-600">
              Classic classification dataset with flower measurements and species
            </p>
            <div className="mt-2 text-xs text-secondary-500">
              30 samples • 4 features • 3 classes
            </div>
          </button>

          <button
            onClick={() => loadDemoDataset('timeseries')}
            disabled={isUploading}
            className="p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <h4 className="font-medium text-secondary-900 mb-2">Sales Time Series</h4>
            <p className="text-sm text-secondary-600">
              Sales data with temperature and promotion features for regression
            </p>
            <div className="mt-2 text-xs text-secondary-500">
              20 samples • 3 features • Regression
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DataUploader;