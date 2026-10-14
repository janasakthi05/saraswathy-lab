export interface FAQItem {
  q: string;
  a: string;
}

export interface RelatedService {
  title: string;
  slug: string;
}

export interface ServiceDetail {
  slug: string;
  title: string;
  heading: string;
  metaDescription: string;
  overview: string;
  whoFor: string;
  preparation: string;
  faqs: FAQItem[];
  relatedServices: RelatedService[];
}

export const servicesData: Record<string, ServiceDetail> = {
  'blood-tests': {
    slug: 'blood-tests',
    title: 'Routine Blood Pathology | Saraswathy Lab',
    heading: 'Complete Blood Count (CBC) & Pathology Tests',
    metaDescription: 'Get precise Complete Blood Count (CBC), biochemistry, and general pathology testing at Saraswathy Lab & Medicals, Coimbatore. Open from 7 AM daily.',
    overview: 'Routine blood tests assess overall health, immune cell counts, and metabolic indicators. Our laboratory, established in 1986 in Sundarapuram, offers automated diagnostics to evaluate cellular health, platelets, and hemoglobin markers.',
    whoFor: 'Recommended for annual checkups, patients monitoring fatigue or chronic disease flags, and doctor referrals.',
    preparation: 'Generally does not require fasting unless paired with sugar or lipid panels. Stay hydrated with plain water before your draw.',
    faqs: [
      { q: 'How long does a CBC take to process?', a: 'Routine blood pathology panels are completed within 12 hours. Reports are delivered directly to your WhatsApp or email.' },
      { q: 'Do you offer home blood collections in Sundarapuram?', a: 'Yes. We coordinate local phlebotomy visits. Please contact our main bookings line to check slot availability.' }
    ],
    relatedServices: [
      { title: 'Diabetes Screening', slug: 'diabetes-testing' },
      { title: 'Thyroid Panels', slug: 'thyroid-testing' }
    ]
  },
  'diabetes-testing': {
    slug: 'diabetes-testing',
    title: 'Diabetes & Glucose Testing | Saraswathy Lab',
    heading: 'Fasting Blood Sugar & HbA1c Sugar Profiles',
    metaDescription: 'Monitor glucose fluctuations with Fasting Blood Sugar, Post-Prandial, and HbA1c tests. Trusted since 1986 in Sundarapuram, Coimbatore.',
    overview: 'Diabetes evaluations check sugar levels. We process Fasting Blood Glucose (FBS), Post-Prandial Glucose (PP), and HbA1c (which tracks your 3-month sugar average) to help identify insulin levels and pre-diabetic risk factors.',
    whoFor: 'Crucial for individuals with diabetes, family histories of hyperglycemia, or symptoms like chronic thirst and fatigue.',
    preparation: 'Requires 8-12 hours of strict fasting for the fasting blood draw. Do not consume tea, coffee, or breakfast before collection.',
    faqs: [
      { q: 'What is the normal range for Fasting Blood Sugar?', a: 'Normal fasting glucose levels are generally under 100 mg/dL. Prediabetes ranges from 100 to 125 mg/dL.' },
      { q: 'How often should I check my HbA1c?', a: 'For active diabetic monitoring, HbA1c testing is recommended every 3 months. For general wellness screening, once a year is sufficient.' }
    ],
    relatedServices: [
      { title: 'Routine Blood Pathology', slug: 'blood-tests' },
      { title: 'Thyroid Panels', slug: 'thyroid-testing' }
    ]
  },
  'thyroid-testing': {
    slug: 'thyroid-testing',
    title: 'Thyroid Care Panel (T3, T4, TSH) | Saraswathy Lab',
    heading: 'Thyroid Function Evaluation (T3, T4 & TSH)',
    metaDescription: 'Diagnose hypo/hyperthyroidism with precise T3, T4, and TSH blood panels at Saraswathy Lab & Medicals, Sundarapuram.',
    overview: 'The thyroid panel measures essential hormones produced by the thyroid gland to check metabolic rates. Our automated analyzers test for Free/Total T3, T4, and Thyroid Stimulating Hormone (TSH).',
    whoFor: 'For people experiencing sudden weight fluctuations, unexplained fatigue, hair loss, or sensitivity to temperatures.',
    preparation: 'No active fasting is required. Inform our laboratory technicians if you are currently taking thyroid hormone prescriptions.',
    faqs: [
      { q: 'When is the best time for a TSH draw?', a: 'TSH levels fluctuate slightly throughout the day. A morning blood draw is recommended for the most consistent findings.' },
      { q: 'Can thyroid dysfunction cause weight changes?', a: 'Yes. An underactive thyroid (hypothyroidism) often slows metabolism causing weight gain, while an overactive thyroid accelerates it.' }
    ],
    relatedServices: [
      { title: 'Routine Blood Pathology', slug: 'blood-tests' },
      { title: 'Preventive Health Packages', slug: 'health-checkups' }
    ]
  },
  'health-checkups': {
    slug: 'health-checkups',
    title: 'Preventive Health Checkup Packages | Saraswathy Lab',
    heading: 'Full-Body Wellness & Pathology Checkups',
    metaDescription: 'Monitor lipid, liver, kidney, and sugar health. Affordable diagnostic health screening in Sundarapuram, Coimbatore.',
    overview: 'Our Preventive Health Checkup combines vital indicators into a single package. This comprehensive screening covers lipid cholesterol profiles, liver functions (LFT), kidney functions (KFT), and fasting sugar counts.',
    whoFor: 'Ideal for adults over 30 aiming to build a historical health baseline and monitor organ metrics.',
    preparation: 'Requires 10-12 hours of overnight fasting. Only plain water is permitted before the morning sample collection.',
    faqs: [
      { q: 'What tests are included in the Preventive Health Checkup?', a: 'It includes 45+ parameters covering CBC, Lipid profile, Liver Function Test (LFT), Kidney Function Test (KFT), Fasting Sugar, and Urine routine analysis.' },
      { q: 'How often should I get a full-body wellness screening?', a: 'Once a year is highly recommended for general preventive screening. If you have chronic conditions, consult your doctor.' }
    ],
    relatedServices: [
      { title: 'Diabetes Screening', slug: 'diabetes-testing' },
      { title: 'Thyroid Panels', slug: 'thyroid-testing' }
    ]
  }
};
