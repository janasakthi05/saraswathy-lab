import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
  const adminEmail = process.env.ADMIN_EMAIL || 'janasakthip2005@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecurePass123!';

  console.log(`Starting complete database seeding...`);
  console.log(`Admin Email: ${adminEmail}`);

  // 1. Admin Account
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: passwordHash,
      name: 'Saraswathy Admin',
    },
    create: {
      email: adminEmail,
      name: 'Saraswathy Admin',
      passwordHash: passwordHash,
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`✓ Admin user created/verified: ${adminEmail}`);

  // 2. Business Settings
  await prisma.businessSettings.upsert({
    where: { id: 'default' },
    update: {
      businessName: 'Saraswathy Lab & Medicals',
      address: 'No. 1, 1, Madukkarai Main Rd, Near Signal, Sundarapuram, Coimbatore - 641024',
      phone: '0422 267 4699',
      mobile: '94895 16699',
      timing: '7:00 AM – 9:30 PM',
      email: 'saraswathylab27@gmail.com',
      mapUrl: 'https://maps.google.com/?q=Saraswathy+Lab+Sundarapuram+Coimbatore',
    },
    create: {
      id: 'default',
      businessName: 'Saraswathy Lab & Medicals',
      address: 'No. 1, 1, Madukkarai Main Rd, Near Signal, Sundarapuram, Coimbatore - 641024',
      phone: '0422 267 4699',
      mobile: '94895 16699',
      timing: '7:00 AM – 9:30 PM',
      email: 'saraswathylab27@gmail.com',
      mapUrl: 'https://maps.google.com/?q=Saraswathy+Lab+Sundarapuram+Coimbatore',
    },
  });
  console.log(`✓ Business Settings seeded.`);

  // 3. Homepage Content
  await prisma.homepageContent.upsert({
    where: { id: 'default' },
    update: {
      heroHeading: 'Saraswathy Lab and Medicals',
      heroSubheading: 'Saraswathy Lab & Medicals provides local, professional diagnostic testing and laboratory services at Sundarapuram, Coimbatore. We deliver accurate findings under strict sanitary protocols.',
      heroCtaText: 'Book / Send Enquiry',
      heroCtaLink: '#contact',
      aboutHeading: 'Decades of Medical Diagnostics',
      aboutDescription: 'Saraswathy Lab & Medicals was built on a simple foundation: bringing reliable diagnostic services closer to the residents of Coimbatore since 1986.',
      contactHeading: 'Contact Saraswathy Lab & Medicals',
      contactDescription: 'Use our diagnostic contact form to ask about test preparations, request home phlebotomy visits, or query results.',
      contactButtonText: 'Submit Diagnostic Enquiry',
    },
    create: {
      id: 'default',
      heroHeading: 'Saraswathy Lab and Medicals',
      heroSubheading: 'Saraswathy Lab & Medicals provides local, professional diagnostic testing and laboratory services at Sundarapuram, Coimbatore. We deliver accurate findings under strict sanitary protocols.',
      heroCtaText: 'Book / Send Enquiry',
      heroCtaLink: '#contact',
      aboutHeading: 'Decades of Medical Diagnostics',
      aboutDescription: 'Saraswathy Lab & Medicals was built on a simple foundation: bringing reliable diagnostic services closer to the residents of Coimbatore since 1986.',
      contactHeading: 'Contact Saraswathy Lab & Medicals',
      contactDescription: 'Use our diagnostic contact form to ask about test preparations, request home phlebotomy visits, or query results.',
      contactButtonText: 'Submit Diagnostic Enquiry',
    },
  });
  console.log(`✓ Homepage Content seeded.`);

  // 4. Clear and populate complete Diagnostic Categories & 100+ Tests
  await prisma.diagnosticTest.deleteMany({});
  await prisma.diagnosticCategory.deleteMany({});

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
      displayOrder: 10,
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
      displayOrder: 11,
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
      displayOrder: 12,
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
      displayOrder: 13,
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
      displayOrder: 14,
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
      await prisma.diagnosticTest.create({
        data: {
          categoryId: createdCat.id,
          name: testName,
          slug: slugify(`${catData.slug}-${testName}`),
          shortDescription: `Standard clinical pathology examination for ${testName}. Precise reporting under quality-controlled protocols.`,
          overview: `Comprehensive diagnostic assay for ${testName} providing accurate findings for optimal medical review.`,
          displayOrder: i + 1,
          isActive: true,
        },
      });
    }
  }
  console.log(`✓ 14 Categories and 100+ Diagnostic Tests seeded.`);

  // 5. X-Ray Services (21 items)
  await prisma.xRayService.deleteMany({});
  const xrayItems = [
    { name: 'X-Ray Chest', bodyPart: 'Chest' },
    { name: 'X-Ray Abdomen', bodyPart: 'Abdomen' },
    { name: 'X-Ray Skull', bodyPart: 'Head' },
    { name: 'X-Ray Sinuses', bodyPart: 'Head' },
    { name: 'X-Ray Spine', bodyPart: 'Spine' },
    { name: 'X-Ray Cervical Spine', bodyPart: 'Spine' },
    { name: 'X-Ray Lumbar Spine', bodyPart: 'Spine' },
    { name: 'X-Ray Dorsal Spine', bodyPart: 'Spine' },
    { name: 'X-Ray Pelvis', bodyPart: 'Pelvis' },
    { name: 'X-Ray Hip', bodyPart: 'Pelvis' },
    { name: 'X-Ray Shoulder', bodyPart: 'Upper Limb' },
    { name: 'X-Ray Arm', bodyPart: 'Upper Limb' },
    { name: 'X-Ray Elbow', bodyPart: 'Upper Limb' },
    { name: 'X-Ray Forearm', bodyPart: 'Upper Limb' },
    { name: 'X-Ray Wrist', bodyPart: 'Upper Limb' },
    { name: 'X-Ray Hand', bodyPart: 'Upper Limb' },
    { name: 'X-Ray Finger', bodyPart: 'Upper Limb' },
    { name: 'X-Ray Knee', bodyPart: 'Lower Limb' },
    { name: 'X-Ray Leg', bodyPart: 'Lower Limb' },
    { name: 'X-Ray Ankle', bodyPart: 'Lower Limb' },
    { name: 'X-Ray Foot', bodyPart: 'Lower Limb' },
  ];

  for (let i = 0; i < xrayItems.length; i++) {
    const item = xrayItems[i];
    await prisma.xRayService.create({
      data: {
        name: item.name,
        slug: slugify(item.name),
        description: `High-resolution diagnostic radiography for ${item.name}. Rapid imaging and clear film reporting.`,
        bodyPart: item.bodyPart,
        displayOrder: i + 1,
        isActive: true,
      },
    });
  }
  console.log(`✓ Seeded ${xrayItems.length} X-Ray services.`);

  // 6. ECG Services (6 items)
  await prisma.eCGService.deleteMany({});
  const ecgItems = [
    { name: 'Resting ECG', type: 'Resting 12-Lead' },
    { name: '12-Lead ECG', type: 'Clinical 12-Lead' },
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
  console.log(`✓ Seeded ${ecgItems.length} ECG services.`);

  // 7. Healthcare Initiatives (4 items)
  await prisma.healthcareInitiative.deleteMany({});
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
  console.log(`✓ Seeded ${initiativesData.length} Healthcare Initiatives.`);

  // 8. Health Packages (4 checkup bundles)
  await prisma.healthPackage.deleteMany({});
  const packages = [
    { name: 'Master Health Checkup', slug: 'master-health-checkup', description: 'Comprehensive 50+ parameter screening evaluating blood counts, lipid cholesterol, liver, kidney, fasting sugar, and urine routine.', includedTests: 'Complete Blood Count (CBC), Lipid Profile, Liver Function Test (LFT), Kidney Function Test (KFT), Fasting Sugar, Routine Urine', targetAudience: 'Adults 30+ seeking annual full-body diagnostic baseline', displayOrder: 1, isFeatured: true },
    { name: 'Executive Diabetes Panel', slug: 'executive-diabetes-panel', description: 'Targeted glucose and metabolic profile measuring Fasting Sugar, Post-Prandial, HbA1c 3-month average, and Kidney filtration.', includedTests: 'FBS, PPBS, HbA1c, Serum Creatinine, Urine Microalbumin', targetAudience: 'Diabetic patients & prediabetes monitoring', displayOrder: 2, isFeatured: true },
    { name: 'Senior Citizen Vitality Checkup', slug: 'senior-citizen-vitality', description: 'Gentle, comprehensive profile tailored for seniors covering Vitamin D3, B12, bone calcium, cardiac hs-CRP, and renal health.', includedTests: 'Vitamin D3, B12, Serum Calcium, hs-CRP, KFT, CBC', targetAudience: 'Senior citizens aged 55+', displayOrder: 3, isFeatured: true },
    { name: 'Basic Cardiac Wellness', slug: 'basic-cardiac-wellness', description: 'Focuses on arterial risk factors combining Lipid Profile, hs-CRP inflammation, Fasting Sugar, and 12-Lead ECG.', includedTests: 'Lipid Profile Complete, hs-CRP, Fasting Sugar, 12-Lead ECG', targetAudience: 'Patients with hypertension or family cardiac history', displayOrder: 4, isFeatured: true },
  ];
  for (const pkg of packages) {
    await prisma.healthPackage.create({ data: pkg });
  }
  console.log(`✓ Seeded ${packages.length} Health Packages.`);

  // 9. Initial Testimonials
  const existingCount = await prisma.testimonial.count();
  if (existingCount === 0) {
    const testimonials = [
      { patientName: 'R. Murugesan', reviewText: 'Saraswathy Lab has been our family\'s trusted diagnostic center for over 25 years. Morning fasting blood draws are smooth, painless, and reports arrive promptly.', rating: 5, isPublished: true, status: 'PUBLISHED', displayOrder: 1 },
      { patientName: 'S. Lakshmi', reviewText: 'Their phlebotomist came for home sample collection for my elderly mother in Madukkarai. Very polite, sterile, and professional service.', rating: 5, isPublished: true, status: 'PUBLISHED', displayOrder: 2 },
      { patientName: 'K. Anand', reviewText: 'Clear reports and accurate values. Located right near Sundarapuram signal junction, making it easy to pick up signed physical copies.', rating: 5, isPublished: true, status: 'PUBLISHED', displayOrder: 3 },
    ];
    for (const t of testimonials) {
      await prisma.testimonial.create({ data: t });
    }
    console.log(`✓ Seeded initial Testimonials.`);
  }

  // 10. SEO Settings
  const seoPages = [
    { pageSlug: 'home', metaTitle: 'Saraswathy Lab & Medicals | Diagnostic Laboratory Sundarapuram Coimbatore', metaDescription: 'Trusted medical diagnostics laboratory in Sundarapuram, Coimbatore since 1986. Blood tests, diabetes sugar profiles, thyroid checkups, X-Ray, ECG, and home collections.', ogTitle: 'Saraswathy Lab & Medicals — 40 Years of Diagnostic Trust', ogDescription: 'Professional pathology & diagnostic services in Sundarapuram, Coimbatore.', keywords: 'Saraswathy Lab, blood test Coimbatore, lab Sundarapuram, HbA1c test, CBC blood test, home sample collection' },
    { pageSlug: 'about', metaTitle: 'About Us | Saraswathy Lab & Medicals Coimbatore', metaDescription: 'Serving Sundarapuram and Coimbatore with accurate laboratory diagnostics since 1986. Located near signal junction opposite Saraswathy Medicals.', ogTitle: 'About Saraswathy Lab & Medicals', ogDescription: 'Decades of patient-first diagnostic care in Coimbatore.', keywords: 'about Saraswathy lab, medical diagnostics Coimbatore history' },
    { pageSlug: 'services', metaTitle: 'Diagnostic Services & Test Catalog | Saraswathy Lab', metaDescription: 'Browse 100+ pathology tests: Blood pathology, Diabetes panels, Lipid profiles, Thyroid care, Liver & Kidney panels, Infection, Allergy, X-Ray, and ECG.', ogTitle: 'Diagnostic Tests & Services — Saraswathy Lab', ogDescription: 'Complete pathology test catalog with preparation guidance.', keywords: 'pathology tests, blood sugar test, thyroid test, Xray Sundarapuram, ECG' },
  ];
  for (const s of seoPages) {
    await prisma.sEOSettings.upsert({
      where: { pageSlug: s.pageSlug },
      update: s,
      create: s,
    });
  }
  console.log(`✓ SEO Settings seeded.`);

  console.log(`🎉 Master database seeding completed successfully!`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
