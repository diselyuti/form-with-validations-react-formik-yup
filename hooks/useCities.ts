import { useState, useEffect } from 'react';
import { CITY_API_URL } from '@/consts/apiUrls';
import ICity from '@/types/ICity';

const useCities = () => {
  const [cities, setCities] = useState<ICity[]>([]);
  const [loadingCities, setLoadingCities] = useState<Boolean>(true);
  const [errorCities, setErrorCities] = useState<string>('');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(CITY_API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }
        const data = await response.json();
        setCities(data);
        setLoadingCities(false);
      } catch (error) {
        if (error instanceof Error) {
          setErrorCities(error.message);
        }
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  return {
    cities,
    loadingCities,
    errorCities,
  };
};

export default useCities;
