import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('Seeding full diagnostic catalog into database...');

  // 1. CLEAR EXISTING TESTS, CATEGORIES, XRAYS, ECGS, INITIATIVES
  await prisma.diagnosticTest.deleteMany({});
  await prisma.diagnosticCategory.deleteMany({});
  await prisma.xRayService.deleteMany({});
  await prisma.eCGService.deleteMany({});
  await prisma.healthcareInitiative.deleteMany({});

  console.log('Cleared previous test data.');

  // 2. DIAGNOSTIC CATEGORIES & TESTS
  const categoriesWithTests = [
    {
      name: '🩸 Blood Tests',
      slug: 'blood-tests',
      description: 'Comprehensive blood count, hemogram, blood group, and cellular evaluations.',
      icon: 'Droplet',
      displayOrder: 1,
      tests: [
        'Complete Blood Count (CBC)',
        'Total Leukocyte Count (TLC)',
        'Differential Leukocyte Count (DLC)',
        'Hemoglobin (Hb)',
        'Erythrocyte Sedimentation Rate (ESR)',
        'Platelet Count',
        'Peripheral Blood Smear (PBS)',
        'Blood Group & Rh Typing',
        'Reticulocyte Count',
      ],
    },
    {
      name: '🍬 Diabetes Tests',
      slug: 'diabetes-tests',
      description: 'Fasting glucose, post-prandial, HbA1c 3-month average, and glucose tolerance testing.',
      icon: 'Activity',
      displayOrder: 2,
      tests: [
        'Fasting Blood Sugar (FBS)',
        'Post-Prandial Blood Sugar (PPBS)',
        'Random Blood Sugar (RBS)',
        'HbA1c',
        'Glucose Tolerance Test (GTT)',
      ],
    },
    {
      name: '❤️ Cardiac Tests',
      slug: 'cardiac-tests',
      description: 'Lipid cholesterol fractions, cardiac markers, and heart disease risk factors.',
      icon: 'Heart',
      displayOrder: 3,
      tests: [
        'Lipid Profile',
        'Total Cholesterol',
        'HDL Cholesterol',
        'LDL Cholesterol',
        'Triglycerides',
        'VLDL Cholesterol',
        'Cardiac Risk Profile',
        'Troponin',
      ],
    },
    {
      name: '🫀 Liver Tests',
      slug: 'liver-tests',
      description: 'Liver enzymes, bilirubin fractions, protein synthesis, and hepatic profiles.',
      icon: 'Activity',
      displayOrder: 4,
      tests: [
        'Liver Function Test (LFT)',
        'Total Bilirubin',
        'Direct Bilirubin',
        'Indirect Bilirubin',
        'SGOT / AST',
        'SGPT / ALT',
        'Alkaline Phosphatase (ALP)',
        'Total Protein',
        'Albumin',
        'Globulin',
      ],
    },
    {
      name: '🫘 Kidney Tests',
      slug: 'kidney-tests',
      description: 'Renal filtration, blood urea, creatinine, uric acid, and serum electrolyte balances.',
      icon: 'Shield',
      displayOrder: 5,
      tests: [
        'Kidney Function Test (KFT)',
        'Blood Urea',
        'Serum Creatinine',
        'Uric Acid',
        'Electrolytes',
        'Sodium',
        'Potassium',
        'Chloride',
        'Calcium',
      ],
    },
    {
      name: '🦋 Thyroid Tests',
      slug: 'thyroid-tests',
      description: 'Thyroid hormones (T3, T4, TSH) evaluating metabolic and endocrine balance.',
      icon: 'Zap',
      displayOrder: 6,
      tests: [
        'Thyroid Function Test (TFT)',
        'T3',
        'T4',
        'TSH',
        'Free T3',
        'Free T4',
      ],
    },
    {
      name: '🧬 Hormone Tests',
      slug: 'hormone-tests',
      description: 'Reproductive, adrenal, pituitary, and metabolic endocrine hormone assays.',
      icon: 'Dna',
      displayOrder: 7,
      tests: [
        'Insulin',
        'FSH',
        'LH',
        'Prolactin',
        'Testosterone',
        'Estradiol (E2)',
        'Progesterone',
        'Cortisol',
        'DHEA-S',
        'AMH',
        'β-hCG',
      ],
    },
    {
      name: '🦠 Infection Tests',
      slug: 'infection-tests',
      description: 'Serology markers for bacterial, viral, vector-borne, and autoimmune inflammatory response.',
      icon: 'Bug',
      displayOrder: 8,
      tests: [
        'CRP',
        'RA Factor',
        'ASO',
        'Widal Test',
        'Dengue NS1',
        'Dengue IgM / IgG',
        'Malaria Test',
        'Typhoid Test',
        'HIV I & II',
        'HBsAg',
        'HCV',
        'VDRL',
      ],
    },
    {
      name: '🤧 Allergy Tests',
      slug: 'allergy-tests',
      description: 'IgE antibody screens, food allergen panels, respiratory allergen profiles, and skin reaction panels.',
      icon: 'ShieldAlert',
      displayOrder: 9,
      tests: [
        'Total Serum IgE',
        'Comprehensive Food Allergy Panel',
        'Respiratory & Dust Allergy Panel',
        'Skin & Environmental Allergy Screen',
        'Drug & Chemical Sensitivity Panel',
      ],
    },
    {
      name: '🧪 Urine Tests',
      slug: 'urine-tests',
      description: 'Urine routine, microscopic sediment, protein, glucose, pregnancy, and microbial culture.',
      icon: 'TestTube',
      displayOrder: 9,
      tests: [
        'Urine Routine Examination',
        'Urine Microscopy',
        'Urine Sugar',
        'Urine Protein',
        'Urine Pregnancy Test',
        'Urine Culture',
      ],
    },
    {
      name: '🔬 Stool Tests',
      slug: 'stool-tests',
      description: 'Stool routine, occult blood, parasite detection, hanging drop, and culture assays.',
      icon: 'Microscope',
      displayOrder: 10,
      tests: [
        'Stool Routine Examination',
        'Stool Microscopy',
        'Occult Blood',
        'Stool for Parasites',
        'Stool Culture',
      ],
    },
    {
      name: '🧪 Clinical Biochemistry',
      slug: 'clinical-biochemistry',
      description: 'Essential serum minerals, enzymes, vitamins, and metabolic chemistry markers.',
      icon: 'FlaskConical',
      displayOrder: 11,
      tests: [
        'Serum Calcium',
        'Serum Phosphorus',
        'Magnesium',
        'Electrolytes',
        'Amylase',
        'Lipase',
        'LDH',
        'Ferritin',
        'Iron',
        'TIBC',
        'Vitamin B12',
        'Vitamin D',
      ],
    },
    {
      name: '🩺 Iron & Vitamin Tests',
      slug: 'iron-vitamin-tests',
      description: 'Nutritional deficiency markers including Vitamin D, B12, Folate, Iron binding, and Ferritin.',
      icon: 'Stethoscope',
      displayOrder: 12,
      tests: [
        'Vitamin D',
        'Vitamin B12',
        'Folate',
        'Serum Iron',
        'Ferritin',
        'TIBC',
        'Transferrin',
      ],
    },
    {
      name: '🔬 Special / Immunology Tests',
      slug: 'special-immunology-tests',
      description: 'Advanced immunology markers, autoimmune panels, and clinical tumor biomarkers.',
      icon: 'ShieldAlert',
      displayOrder: 13,
      tests: [
        'ANA',
        'Anti-CCP',
        'Immunoglobulins',
        'C3',
        'C4',
        'PSA',
        'CEA',
        'AFP',
        'CA-125',
        'CA 19-9',
        'CA 15-3',
      ],
    },
  ];

  for (const catData of categoriesWithTests) {
    const createdCat = await prisma.diagnosticCategory.create({
      data: {
        name: catData.name,
        slug: catData.slug,
        description: catData.description,
        icon: catData.icon,
        displayOrder: catData.displayOrder,
        isActive: true,
      },
    });

    for (let i = 0; i < catData.tests.length; i++) {
      const testName = catData.tests[i];
      const testSlug = slugify(testName);
      await prisma.diagnosticTest.create({
        data: {
          categoryId: createdCat.id,
          name: testName,
          slug: `${catData.slug}-${testSlug}`,
          shortDescription: `Standardized ${testName} diagnostic pathology evaluation conducted under calibrated sanitary laboratory protocols.`,
          overview: `Comprehensive ${testName} analysis for precise clinical diagnosis and health tracking.`,
          whoFor: `Recommended for patients with relevant clinical symptoms or physician referrals.`,
          preparation: `Standard laboratory preparation. Fasting may be required based on doctor prescription.`,
          displayOrder: i + 1,
          isActive: true,
        },
      });
    }
  }

  console.log(`Seeded ${categoriesWithTests.length} categories and their corresponding tests.`);

  // 3. X-RAY SERVICES (21 items)
  const xrayItems = [
    { name: 'X-Ray Chest', bodyPart: 'Chest / Lungs' },
    { name: 'X-Ray Abdomen', bodyPart: 'Abdomen' },
    { name: 'X-Ray Skull', bodyPart: 'Head / Skull' },
    { name: 'X-Ray Sinuses', bodyPart: 'Face / Sinuses' },
    { name: 'X-Ray Spine', bodyPart: 'Spine' },
    { name: 'X-Ray Cervical Spine', bodyPart: 'Neck / Cervical' },
    { name: 'X-Ray Lumbar Spine', bodyPart: 'Lower Back / Lumbar' },
    { name: 'X-Ray Dorsal Spine', bodyPart: 'Mid Back / Dorsal' },
    { name: 'X-Ray Pelvis', bodyPart: 'Pelvis' },
    { name: 'X-Ray Hip', bodyPart: 'Hip Joint' },
    { name: 'X-Ray Shoulder', bodyPart: 'Shoulder' },
    { name: 'X-Ray Arm', bodyPart: 'Upper Arm' },
    { name: 'X-Ray Elbow', bodyPart: 'Elbow Joint' },
    { name: 'X-Ray Forearm', bodyPart: 'Forearm' },
    { name: 'X-Ray Wrist', bodyPart: 'Wrist' },
    { name: 'X-Ray Hand', bodyPart: 'Hand' },
    { name: 'X-Ray Finger', bodyPart: 'Finger' },
    { name: 'X-Ray Knee', bodyPart: 'Knee Joint' },
    { name: 'X-Ray Leg', bodyPart: 'Lower Leg' },
    { name: 'X-Ray Ankle', bodyPart: 'Ankle Joint' },
    { name: 'X-Ray Foot', bodyPart: 'Foot' },
  ];

  for (let i = 0; i < xrayItems.length; i++) {
    const item = xrayItems[i];
    await prisma.xRayService.create({
      data: {
        name: item.name,
        slug: slugify(item.name),
        description: `Digital radiography imaging for ${item.name}. Evaluates structural alignment, bone integrity, and joint spaces.`,
        bodyPart: item.bodyPart,
        displayOrder: i + 1,
        isActive: true,
      },
    });
  }

  console.log(`Seeded ${xrayItems.length} X-Ray services.`);

  // 4. ECG SERVICES (6 items)
  const ecgItems = [
    { name: 'Resting ECG', type: 'Resting 12-Lead' },
    { name: '12-Lead ECG', type: '12-Lead Standard' },
    { name: 'Routine Health Check-up ECG', type: 'Routine Screening' },
    { name: 'Cardiac Evaluation ECG', type: 'Cardiac Screening' },
    { name: 'Pre-Employment ECG', type: 'Occupational Screening' },
    { name: 'Pre-Operative ECG', type: 'Pre-Op Clearance' },
  ];

  for (let i = 0; i < ecgItems.length; i++) {
    const item = ecgItems[i];
    await prisma.eCGService.create({
      data: {
        name: item.name,
        slug: slugify(item.name),
        description: `Non-invasive electrocardiogram assessment (${item.name}) measuring cardiac rhythm, electrical conductivity, and heart rate parameters.`,
        type: item.type,
        displayOrder: i + 1,
        isActive: true,
      },
    });
  }

  console.log(`Seeded ${ecgItems.length} ECG services.`);

  // 5. HEALTHCARE INITIATIVES (4 items)
  const initiativesData = [
    {
      title: 'Free Medical Camps',
      slug: 'free-medical-camps',
      shortDescription: 'We regularly organize free medical camps in association with hospitals and healthcare partners, helping communities access essential health screenings and medical consultations.',
      fullDescription: 'Our community medical camps provide free blood sugar checks, blood pressure screenings, and doctor consultations around Sundarapuram, Madukkarai, and Podanur.',
      icon: 'Building2',
      displayOrder: 1,
    },
    {
      title: 'Doctor Network & Clinical Support',
      slug: 'doctor-network-clinical-support',
      shortDescription: 'We maintain strong connections with experienced and trusted doctors across specialties, helping patients receive appropriate medical guidance and supporting better interpretation of diagnostic results.',
      fullDescription: 'Direct clinical collaboration ensuring immediate critical result reporting and seamless doctor referrals.',
      icon: 'Stethoscope',
      displayOrder: 2,
    },
    {
      title: 'Industry Health Partnerships',
      slug: 'industry-health-partnerships',
      shortDescription: 'We partner with industries and organizations to promote employee health through customized health-checkup packages, periodic screening programs, and preventive healthcare initiatives.',
      fullDescription: 'Custom occupational health evaluations and annual employee wellness checkups for industrial units along the Madukkarai corridor.',
      icon: 'Factory',
      displayOrder: 3,
    },
    {
      title: 'Customized Health Packages',
      slug: 'customized-health-packages-initiative',
      shortDescription: 'We offer tailored health packages designed for individuals, families, institutions, and corporate employees, based on their specific health-screening requirements.',
      fullDescription: 'Flexible multi-parameter health checkup bundles tailored for family preventive screening and chronic condition monitoring.',
      icon: 'ClipboardList',
      displayOrder: 4,
    },
  ];

  for (const init of initiativesData) {
    await prisma.healthcareInitiative.create({
      data: {
        title: init.title,
        slug: init.slug,
        shortDescription: init.shortDescription,
        fullDescription: init.fullDescription,
        icon: init.icon,
        displayOrder: init.displayOrder,
        isActive: true,
        isFeatured: true,
      },
    });
  }

  console.log(`Seeded ${initiativesData.length} Healthcare Initiatives.`);
  console.log('Diagnostic catalog seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
