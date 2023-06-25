export default interface IDoctorSpeciality {
  id: string;
  name: string;
  params?: {
    gender?: string;
    maxAge?: number;
    minAge?: number;
  };
}
