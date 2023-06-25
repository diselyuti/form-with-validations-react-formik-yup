import React, { useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import IUser from '@/types/IUser';
import { calculateAge, formatDate } from '@/utils/dateUtils';
import useCities from '@/hooks/useCities';
import ICity from '@/types/ICity';
import useDoctorSpecialities from '@/hooks/useDoctorSpecialities';
import IDoctorSpeciality from '@/types/IDoctorSpeciality';
import useDoctors from '@/hooks/useDoctors';
import IDoctor from '@/types/IDoctor';

const Form = ({
  handleSubmit,
}: {
  handleSubmit: (formData: IUser) => void;
}) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      birthDate: '',
      sex: '',
      cityId: '',
      doctorSpecialityId: '',
      doctorId: '',
      email: '',
      mobileNumber: '',
    } as IUser,
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(/^\D+$/, 'Name should not contain numbers')
        .required('Required'),
      birthDate: Yup.string()
        .required('Birthday Date is required')
        .test('age', 'Age should be bigger than 0', function (value) {
          return Date.now() - new Date(value).getTime() > 0;
        }),
      sex: Yup.string().required('Sex is required'),
      cityId: Yup.number().required('City is required'),
      doctorSpecialityId: Yup.number(),
      doctorId: Yup.number().required('Doctor is required'),
      email: Yup.string()
        .email('Invalid email address')
        .test(
          'emailOrMobile',
          'Email or Mobile Number is required',
          function (value) {
            const { mobileNumber } = this.parent;
            return !!value || !!mobileNumber;
          }
        ),
      mobileNumber: Yup.string()
        .test(
          'emailOrMobile',
          'Email or Mobile Number is required',
          function (value) {
            const { email } = this.parent;
            return !!value || !!email;
          }
        )
        .matches(
          /^\+380\d{9}$/,
          'Invalid mobile number format. Please use the format +380XXXXXXXXX.'
        ),
    }),
    onSubmit: (values) => {
      const formattedDate = formatDate(values.birthDate);
      const formattedValues = {
        ...values,
        birthDate: formattedDate,
      };

      handleSubmit(formattedValues);
    },
  });

  const { cities, loadingCities, errorCities } = useCities();

  const {
    doctorSpecialities,
    loadingDoctorSpecialities,
    errorDoctorSpecialities,
  } = useDoctorSpecialities();

  const { doctors, loadingDoctors, errorDoctors } = useDoctors();

  const filteredDoctors = useMemo(() => {
    const { cityId, sex, doctorSpecialityId, birthDate } = formik.values;

    return doctors.filter((doctor: IDoctor) => {
      const age = calculateAge(birthDate);
      const isPediatrician = doctor.isPediatrician;
      const doctorSpeciality = doctorSpecialities.find(
        (speciality: IDoctorSpeciality) => speciality.id === doctor.specialityId
      );

      if (age < 18 && !isPediatrician) {
        return false; // Excluding adult doctors if the patient is a child
      }

      if (
        doctorSpeciality?.params?.minAge &&
        age < doctorSpeciality.params.minAge
      ) {
        return false; // Exclude doctors if the patient is under the minimum age for the specialty
      }

      if (
        doctorSpeciality?.params?.maxAge &&
        age > doctorSpeciality.params.maxAge
      ) {
        return false; // Exclude doctors if the patient is over the maximum age for the specialty
      }

      if (cityId && doctor.cityId !== cityId) {
        return false; // Exclude doctors who do not belong to the chosen city
      }

      if (
        sex &&
        doctorSpeciality &&
        doctorSpeciality.params?.gender &&
        doctorSpeciality.params.gender !== sex
      ) {
        return false; // Excluding doctors with the wrong specialty for the chosen gender
      }

      if (
        doctorSpecialityId &&
        doctor.specialityId &&
        doctor.specialityId !== doctorSpecialityId
      ) {
        return false; // Excluding doctors with an unsuitable chosen specialty
      }

      return true; // Include a doctor on the list if all the conditions are met
    });
  }, [
    formik.values.cityId,
    formik.values.sex,
    formik.values.doctorSpecialityId,
    formik.values.birthDate,
    doctors,
  ]);

  useEffect(() => {
    if (filteredDoctors.length === 0) {
      formik.setFieldValue('doctorId', '');
    }
  }, [filteredDoctors]);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col w-5/6 lg:w-1/2 max-w-3xl items-center justify-center gap-4 p-4 bg-white rounded-md shadow-md"
    >
      <label className="w-full flex flex-col gap-1">
        Name
        <input
          id="name"
          name="name"
          type="text"
          className="block w-full rounded-md px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          placeholder="John Snow"
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-red-500 text-sm">{formik.errors.name}</div>
        ) : null}
      </label>

      <label className="w-full flex flex-col gap-1">
        Birthday Date
        <input
          id="birthDate"
          name="birthDate"
          type="date"
          className="block w-full rounded-md px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.birthDate}
          data-testid="birthDate-input"
        />
        {formik.touched.birthDate && formik.errors.birthDate ? (
          <div className="text-red-500 text-sm">{formik.errors.birthDate}</div>
        ) : null}
      </label>

      <label className="w-full flex flex-col gap-1">
        Sex
        <select
          id="sex"
          name="sex"
          className="block w-full rounded-md border-0 py-1.5 pl-2 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.sex}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="">Not selected</option>
        </select>
        {formik.touched.sex && formik.errors.sex ? (
          <div className="text-red-500 text-sm">{formik.errors.sex}</div>
        ) : null}
      </label>

      <label className="w-full flex flex-col gap-1">
        City
        <select
          id="cityId"
          name="cityId"
          className="block w-full rounded-md border-0 py-1.5 pl-2 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.cityId}
        >
          <option value="">Not selected</option>
          {cities &&
            cities.map((city: ICity) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          {loadingCities && <option>Loading...</option>}
        </select>
        {formik.touched.cityId && formik.errors.cityId ? (
          <div className="text-red-500 text-sm">{formik.errors.cityId}</div>
        ) : null}
        {errorCities && (
          <div className="text-red-500 text-sm">{errorCities}</div>
        )}
      </label>

      <label className="w-full flex flex-col gap-1">
        Doctor Specialty
        <select
          id="doctorSpecialityId"
          name="doctorSpecialityId"
          className="block w-full rounded-md border-0 py-1.5 pl-2 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.doctorSpecialityId}
        >
          <option value="">Not selected</option>
          {doctorSpecialities &&
            doctorSpecialities.map((doctorSpeciality: IDoctorSpeciality) => (
              <option key={doctorSpeciality.id} value={doctorSpeciality.id}>
                {doctorSpeciality.name}
              </option>
            ))}
          {loadingDoctorSpecialities && <option>Loading...</option>}
        </select>
        {formik.touched.doctorSpecialityId &&
        formik.errors.doctorSpecialityId ? (
          <div className="text-red-500 text-sm">
            {formik.errors.doctorSpecialityId}
          </div>
        ) : null}
        {errorDoctorSpecialities && (
          <div className="text-red-500 text-sm">{errorDoctorSpecialities}</div>
        )}
      </label>

      <label className="w-full flex flex-col gap-1">
        Doctor
        <select
          id="doctorId"
          name="doctorId"
          className="block w-full rounded-md border-0 py-1.5 pl-2 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.doctorId}
        >
          <option value="">Not selected</option>
          {filteredDoctors &&
            filteredDoctors.map((doctor: IDoctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} {doctor.surname}
              </option>
            ))}
          {loadingDoctors && <option>Loading...</option>}
          {filteredDoctors &&
            !loadingDoctors &&
            filteredDoctors.length === 0 && (
              <option value="">
                No doctors with the specified characteristics were found
              </option>
            )}
        </select>
        {formik.touched.doctorId && formik.errors.doctorId ? (
          <div className="text-red-500 text-sm">{formik.errors.doctorId}</div>
        ) : null}
        {errorDoctors && (
          <div className="text-red-500 text-sm">{errorDoctors}</div>
        )}
      </label>

      <label className="w-full flex flex-col gap-1">
        Email Address
        <input
          id="email"
          name="email"
          type="email"
          className="block w-full rounded-md px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          placeholder="email@gmail.com"
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500 text-sm">{formik.errors.email}</div>
        ) : null}
      </label>

      <label className="w-full flex flex-col gap-1">
        Mobile Number
        <input
          id="mobileNumber"
          name="mobileNumber"
          type="tel"
          className="block w-full rounded-md px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.mobileNumber}
          placeholder="+380XXXXXXXXX"
        />
        {formik.touched.mobileNumber && formik.errors.mobileNumber ? (
          <div className="text-red-500 text-sm">
            {formik.errors.mobileNumber}
          </div>
        ) : null}
      </label>

      <button
        type="submit"
        className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
