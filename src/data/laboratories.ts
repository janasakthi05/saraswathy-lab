export interface LaboratoryDetail {
  slug: string;
  name: string;
  metaDescription: string;
  description: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  hours: string;
  labId: string;
  services: string[];
}

export const laboratoriesData: Record<string, LaboratoryDetail> = {
  'saraswathy-lab-sundarapuram': {
    slug: 'saraswathy-lab-sundarapuram',
    name: 'Saraswathy Lab & Medicals (Coimbatore)',
    metaDescription: 'Visit our central laboratory near Sundarapuram Signal, Madukkarai Main Road, Coimbatore. Providing accurate diagnostic pathology since 1986.',
    description: 'Saraswathy Lab & Medicals is a trusted local diagnostics facility in Coimbatore. Established in 1986, we operate an automated testing facility opposite Saraswathy Medicals, delivering precise results for blood, urine, and pathology testing.',
    address: 'No. 1/1, Madukkarai Main Road, Near Signal, Sundarapuram',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    postalCode: '641024',
    phone: '0422 2674699',
    email: 'saraswathylab27@gmail.com',
    hours: 'Monday – Sunday: 7:00 AM – 10:00 PM',
    labId: 'ESTD-1986-CBE',
    services: [
      'Complete Blood Count (CBC)',
      'Fasting Blood Glucose',
      'Thyroid Panels (T3, T4, TSH)',
      'Liver Function Test (LFT)',
      'Kidney Function Test (KFT)',
      'Stool pH & Hanging Drop Analysis',
      'Urine Routine Examination',
    ]
  }
};
