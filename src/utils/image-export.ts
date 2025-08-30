/**
 * Utility functions for exporting UI elements as images
 */

/**
 * Convert an HTML element to a canvas and download as PNG
 */
export const downloadElementAsImage = async (
  element: HTMLElement,
  filename: string = 'download.png'
): Promise<void> => {
  try {
    // Dynamic import to avoid bundling html2canvas if not used
    const html2canvas = (await import('html2canvas')).default;
    
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      logging: false,
    } as any);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
    }, 'image/png', 1.0);
  } catch (error) {
    console.error('Failed to export image:', error);
    throw new Error('Failed to export image. Please try again.');
  }
};

/**
 * Generate a filename with timestamp
 */
export const generateImageFilename = (prefix: string = 'netcraft'): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${prefix}_${timestamp}.png`;
};