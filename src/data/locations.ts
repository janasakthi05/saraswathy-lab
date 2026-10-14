export interface LocalFAQ {
  q: string;
  a: string;
}

export interface NearLab {
  name: string;
  slug: string;
}

export interface LocationDetail {
  slug: string;
  name: string;
  metaDescription: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  directions?: string;
  laboratories: NearLab[];
  localFAQs: LocalFAQ[];
}

export const locationsData: Record<string, LocationDetail> = {
  'sundarapuram': {
    slug: 'sundarapuram',
    name: 'Sundarapuram (Coimbatore)',
    metaDescription: 'Trusted blood tests, urine diagnostics, and medical services at Sundarapuram, Madukkarai Main Road. Serving Coimbatore patients since 1986.',
    description: 'Saraswathy Lab & Medicals serves patients in the Sundarapuram area of Coimbatore. Located near the Sundarapuram Signal on Madukkarai Main Road, our laboratory provides walk-in diagnostic collections and pharmacy support.',
    address: 'No. 1/1, Madukkarai Main Road, Near Signal, Sundarapuram, Coimbatore - 641024',
    phone: '0422 2674699',
    hours: 'Daily: 7:00 AM – 10:00 PM',
    directions: 'Located right near the main Sundarapuram signal junction, opposite Saraswathy Medicals, with parking space available for cars and two-wheelers.',
    laboratories: [
      { name: 'Saraswathy Lab & Medicals (Coimbatore)', slug: 'saraswathy-lab-sundarapuram' }
    ],
    localFAQs: [
      { q: 'How do I book a blood test at Sundarapuram?', a: 'You can walk in directly to our lab from 7:00 AM onwards. You can also call us at 0422-2674699 or submit an online query to pre-verify test preparation requirements.' },
      { q: 'Is parking available at the Sundarapuram facility?', a: 'Yes. Dedicated street parking is available for two-wheelers and patients visiting our medical center.' }
    ]
  },
  'madukkarai': {
    slug: 'madukkarai',
    name: 'Madukkarai Main Road',
    metaDescription: 'Convenient medical testing and pharmacy access for Madukkarai regions at Saraswathy Lab & Medicals, Sundarapuram, Coimbatore.',
    description: 'We offer diagnostics services along the entire Madukkarai Main Road corridor. Our dispatch coordinator arranges collection guidelines for residents in this region, sending samples to our central laboratory opposite Saraswathy Medicals.',
    address: 'Opposite Saraswathy Medicals, Madukkarai Main Road, Sundarapuram, Coimbatore - 641024',
    phone: '0422 2674699',
    hours: 'Daily: 7:00 AM – 10:00 PM',
    directions: 'Located along the main Madukkarai highway junction, easily reachable via public transport heading towards Madukkarai.',
    laboratories: [
      { name: 'Saraswathy Lab & Medicals (Coimbatore)', slug: 'saraswathy-lab-sundarapuram' }
    ],
    localFAQs: [
      { q: 'Do you collect samples for Madukkarai residents?', a: 'Yes. We are located right on the Madukkarai Main Road, near the Sundarapuram Signal, making it a convenient walk-in diagnostic location for residents.' }
    ]
  }
};
