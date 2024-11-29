const reportWebVitals = async (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    try {
      const webVitals = await import('web-vitals');
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitals;

      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    } catch (error) {
      console.error('Erreur lors du chargement de web-vitals:', error);
    }
  }
};

export default reportWebVitals;