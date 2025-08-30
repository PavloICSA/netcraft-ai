import { useEffect } from 'react';

/**
 * Custom hook to scroll to top of page or specific element
 */
export const useScrollToTop = (dependency?: any) => {
  useEffect(() => {
    // Scroll window to top
    window.scrollTo(0, 0);
    
    // Also scroll the main content area to top if it exists
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo(0, 0);
    }
  }, [dependency]);
};

/**
 * Function to manually scroll to top
 */
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  const mainElement = document.querySelector('main');
  if (mainElement) {
    mainElement.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

/**
 * Function to scroll to a specific element
 */
export const scrollToElement = (elementId: string, behavior: 'auto' | 'smooth' = 'smooth') => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior, block: 'start' });
  }
};