import { useState, useEffect } from 'react';
import IDoctor from '@/types/IDoctor';
import { DOCTOR_API_URL } from '@/consts/apiUrls';

const useCities = () => {
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState<Boolean>(true);
  const [errorDoctors, setErrorDoctors] = useState<string>('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(DOCTOR_API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctors(data);
        setLoadingDoctors(false);
      } catch (error) {
        if (error instanceof Error) {
          setErrorDoctors(error.message);
        }
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  return {
    doctors,
    loadingDoctors,
    errorDoctors,
  };
};

export default useCities;
