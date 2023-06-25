import { useState, useEffect } from 'react';
import IDoctorSpeciality from '@/types/IDoctorSpeciality';
import { DOCTOR_SPECIALITY_API_URL } from '@/consts/apiUrls';

const useDoctorSpecialities = () => {
  const [doctorSpecialities, setDoctorSpecialities] = useState<
    IDoctorSpeciality[]
  >([]);
  const [loadingDoctorSpecialities, setLoadingDoctorSpecialities] =
    useState<Boolean>(true);
  const [errorDoctorSpecialities, setErrorDoctorSpecialities] =
    useState<string>('');

  useEffect(() => {
    const fetchDoctorSpecialities = async () => {
      try {
        const response = await fetch(DOCTOR_SPECIALITY_API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch doctor specialities');
        }
        const data = await response.json();
        setDoctorSpecialities(data);
        setLoadingDoctorSpecialities(false);
      } catch (error) {
        if (error instanceof Error) {
          setErrorDoctorSpecialities(error.message);
        }
        setLoadingDoctorSpecialities(false);
      }
    };

    fetchDoctorSpecialities();
  }, []);

  return {
    doctorSpecialities,
    loadingDoctorSpecialities,
    errorDoctorSpecialities,
  };
};

export default useDoctorSpecialities;
