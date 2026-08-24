'use client';

import { useCallback, useState } from 'react';

const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setLocation({
          latitude,
          longitude,
        });

        setLoading(false);
      },
      (err) => {
        setLoading(false);

        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(
              'Location permission was denied. Please allow location access to use this feature.'
            );
            break;

          case err.POSITION_UNAVAILABLE:
            setError(
              'Your location could not be determined. Please try again.'
            );
            break;

          case err.TIMEOUT:
            setError(
              'Location request timed out. Please try again.'
            );
            break;

          default:
            setError('Unable to determine your location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  return {
    location,
    loading,
    error,
    getLocation,
  };
};

export default useGeolocation;