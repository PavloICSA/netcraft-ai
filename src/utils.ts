/**
 * General utility functions
 */

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format number with specified decimal places
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

/**
 * Clamp a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Download data as a file
 */
export function downloadFile(data: string, filename: string, type: string = 'text/plain'): void {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const clonedObj = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Check if a value is a valid number
 */
export function isValidNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Convert string to number safely
 */
export function safeParseFloat(value: string | number): number {
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value);
  return isValidNumber(parsed) ? parsed : 0;
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get color for cluster visualization
 */
export function getClusterColor(clusterIndex: number): string {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#8B5CF6', // purple
    '#F59E0B', // orange
    '#EF4444', // red
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316', // orange
    '#EC4899', // pink
    '#6B7280'  // gray
  ];
  
  return colors[clusterIndex % colors.length];
}

/**
 * Download HTML element as image
 */
export function downloadElementAsImage(
  element: HTMLElement, 
  filename: string, 
  format: 'png' | 'jpeg' | 'svg' = 'png',
  quality: number = 1.0
): void {
  if (format === 'svg') {
    downloadElementAsSVG(element, filename);
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get canvas context');
    return;
  }

  const rect = element.getBoundingClientRect();
  const scale = 2; // Higher resolution
  canvas.width = rect.width * scale;
  canvas.height = rect.height * scale;
  
  ctx.scale(scale, scale);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, rect.width, rect.height);

  // Render the element content
  renderElementToCanvas(element, ctx, rect).then(() => {
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const dataURL = canvas.toDataURL(mimeType, quality);
    
    const link = document.createElement('a');
    link.download = `${filename}.${format}`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }).catch(error => {
    console.error('Error generating image:', error);
  });
}

/**
 * Download element as SVG
 */
function downloadElementAsSVG(element: HTMLElement, filename: string): void {
  const rect = element.getBoundingClientRect();
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', rect.width.toString());
  svg.setAttribute('height', rect.height.toString());
  svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  // Add white background
  const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  background.setAttribute('width', '100%');
  background.setAttribute('height', '100%');
  background.setAttribute('fill', '#ffffff');
  svg.appendChild(background);

  // Convert grid elements to SVG rectangles
  const gridElements = element.querySelectorAll('[style*="background"], .grid > div');
  gridElements.forEach((gridElement) => {
    const gridRect = gridElement.getBoundingClientRect();
    const relativeX = gridRect.left - rect.left;
    const relativeY = gridRect.top - rect.top;
    
    const computedStyle = window.getComputedStyle(gridElement);
    const bgColor = computedStyle.backgroundColor;
    
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
      const svgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      svgRect.setAttribute('x', relativeX.toString());
      svgRect.setAttribute('y', relativeY.toString());
      svgRect.setAttribute('width', gridRect.width.toString());
      svgRect.setAttribute('height', gridRect.height.toString());
      svgRect.setAttribute('fill', bgColor);
      svgRect.setAttribute('stroke', computedStyle.borderColor || '#ccc');
      svgRect.setAttribute('stroke-width', '1');
      svg.appendChild(svgRect);

      // Add text if present
      const textContent = gridElement.textContent?.trim();
      if (textContent) {
        const svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        svgText.setAttribute('x', (relativeX + gridRect.width / 2).toString());
        svgText.setAttribute('y', (relativeY + gridRect.height / 2).toString());
        svgText.setAttribute('text-anchor', 'middle');
        svgText.setAttribute('dominant-baseline', 'middle');
        svgText.setAttribute('fill', computedStyle.color || '#000');
        svgText.setAttribute('font-size', computedStyle.fontSize || '12px');
        svgText.setAttribute('font-family', computedStyle.fontFamily || 'Arial');
        svgText.textContent = textContent;
        svg.appendChild(svgText);
      }
    }
  });

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  
  downloadFile(svgString, `${filename}.svg`, 'image/svg+xml');
}

/**
 * Render HTML element to canvas
 */
function renderElementToCanvas(
  element: HTMLElement, 
  ctx: CanvasRenderingContext2D, 
  rect: DOMRect
): Promise<void> {
  return new Promise((resolve) => {
    // Render grid elements
    const gridElements = element.querySelectorAll('[style*="background"], .grid > div');
    gridElements.forEach((gridElement) => {
      const gridRect = gridElement.getBoundingClientRect();
      const relativeX = gridRect.left - rect.left;
      const relativeY = gridRect.top - rect.top;
      
      const computedStyle = window.getComputedStyle(gridElement);
      const bgColor = computedStyle.backgroundColor;
      
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(relativeX, relativeY, gridRect.width, gridRect.height);
      }
      
      // Add border if present
      const borderColor = computedStyle.borderColor;
      const borderWidth = parseFloat(computedStyle.borderWidth) || 1;
      if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(relativeX, relativeY, gridRect.width, gridRect.height);
      }

      // Add text content
      const textContent = gridElement.textContent?.trim();
      if (textContent) {
        ctx.fillStyle = computedStyle.color || '#000';
        ctx.font = `${computedStyle.fontSize || '12px'} ${computedStyle.fontFamily || 'Arial'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          textContent, 
          relativeX + gridRect.width / 2, 
          relativeY + gridRect.height / 2
        );
      }
    });

    resolve();
  });
}