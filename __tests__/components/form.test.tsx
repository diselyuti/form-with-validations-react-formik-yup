import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Form from '@/components/Form';
import React from 'react';
import 'jest-fetch-mock';
import * as useCities from '../../hooks/useCities';
import * as useDoctors from '../../hooks/useDoctors';
import * as useDoctorSpecialities from '../../hooks/useDoctorSpecialities';

jest.mock('../../hooks/useCities');
jest.mock('../../hooks/useDoctors');
jest.mock('../../hooks/useDoctorSpecialities');

const mockedUseCities = jest.spyOn(useCities, 'default');
const mockedDoctors = jest.spyOn(useDoctors, 'default');
const mockedDoctorSpecialities = jest.spyOn(useDoctorSpecialities, 'default');
describe('Form', () => {
  beforeEach(() => {
    mockedUseCities.mockReturnValue({
      cities: [],
      loadingCities: false,
      errorCities: '',
    });
    mockedDoctors.mockReturnValue({
      doctors: [],
      loadingDoctors: false,
      errorDoctors: '',
    });
    mockedDoctorSpecialities.mockReturnValue({
      doctorSpecialities: [],
      loadingDoctorSpecialities: false,
      errorDoctorSpecialities: '',
    });
  });

  afterEach(() => {});

  it('should render', () => {
    mockedUseCities.mockReturnValue({
      cities: [],
      loadingCities: false,
      errorCities: '',
    });
    const { getByText } = render(<Form />);
    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('Birthday Date')).toBeInTheDocument();
    expect(getByText('Sex')).toBeInTheDocument();
    expect(getByText('City')).toBeInTheDocument();
    expect(getByText('Doctor Specialty')).toBeInTheDocument();
    expect(getByText('Doctor')).toBeInTheDocument();
    expect(getByText('Mobile Number')).toBeInTheDocument();
  });

  it('should render loading', () => {
    mockedUseCities.mockReturnValue({
      cities: [],
      loadingCities: true,
      errorCities: '',
    });
    const { getByText } = render(<Form />);
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('should render error', () => {
    mockedUseCities.mockReturnValue({
      cities: [],
      loadingCities: false,
      errorCities: 'Error',
    });
    const { getByText } = render(<Form />);
    expect(getByText('Error')).toBeInTheDocument();
  });

  it('should render cities', () => {
    mockedUseCities.mockReturnValue({
      cities: [
        { id: '1', name: 'city1' },
        { id: '2', name: 'city2' },
      ],
      loadingCities: false,
      errorCities: '',
    });
    const { getByText } = render(<Form />);
    expect(getByText('city1')).toBeInTheDocument();
    expect(getByText('city2')).toBeInTheDocument();
  });

  it('should render doctors', () => {
    mockedDoctors.mockReturnValue({
      doctors: [
        {
          id: '1',
          name: 'doctor1',
          surname: 'doctor1',
          specialityId: '1',
          cityId: '1',
          isPediatrician: false,
        },
        {
          id: '2',
          name: 'doctor2',
          surname: 'doctor2',
          specialityId: '2',
          cityId: '2',
          isPediatrician: false,
        },
      ],
      loadingDoctors: false,
      errorDoctors: '',
    });
    const { getByText } = render(<Form />);
    expect(getByText('doctor1 doctor1')).toBeInTheDocument();
    expect(getByText('doctor2 doctor2')).toBeInTheDocument();
  });

  it('should render doctor specialities', () => {
    mockedDoctorSpecialities.mockReturnValue({
      doctorSpecialities: [
        { id: '1', name: 'speciality1' },
        { id: '2', name: 'speciality2' },
      ],
      loadingDoctorSpecialities: false,
      errorDoctorSpecialities: '',
    });
    const { getByText } = render(<Form />);
    expect(getByText('speciality1')).toBeInTheDocument();
    expect(getByText('speciality2')).toBeInTheDocument();
  });
});
