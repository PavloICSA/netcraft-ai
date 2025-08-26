/**
 * CSV utility functions for data processing
 */

/**
 * Convert array of objects to CSV string
 */
export function arrayToCSV(data: Record<string, any>[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ];
  
  return csvRows.join('\n');
}

/**
 * Infer data type from array of values
 */
export function inferDataType(values: any[]): 'numeric' | 'categorical' | 'datetime' {
  const nonEmptyValues = values.filter(val => val !== null && val !== undefined && val !== '');
  
  if (nonEmptyValues.length === 0) return 'categorical';
  
  // Check if numeric
  const numericValues = nonEmptyValues.filter(val => !isNaN(Number(val)) && val !== '');
  if (numericValues.length > nonEmptyValues.length * 0.8) {
    return 'numeric';
  }
  
  // Check if datetime
  const dateValues = nonEmptyValues.filter(val => !isNaN(Date.parse(val)));
  if (dateValues.length > nonEmptyValues.length * 0.8) {
    return 'datetime';
  }
  
  return 'categorical';
}

/**
 * Calculate basic statistics for numeric data
 */
export function calculateNumericStats(values: number[]) {
  if (values.length === 0) return null;
  
  const validValues = values.filter(val => !isNaN(val));
  if (validValues.length === 0) return null;
  
  const mean = validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
  const variance = validValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / validValues.length;
  
  return {
    min: Math.min(...validValues),
    max: Math.max(...validValues),
    mean,
    std: Math.sqrt(variance),
    unique: new Set(validValues).size,
    nullCount: values.length - validValues.length
  };
}