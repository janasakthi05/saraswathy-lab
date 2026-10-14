export interface ArticleDetail {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
  medicalDisclaimer: string;
}

export const articlesData: Record<string, ArticleDetail> = {
  'how-to-prepare-for-blood-test': {
    slug: 'how-to-prepare-for-blood-test',
    title: 'How to Properly Prepare for Your Upcoming Blood Test',
    excerpt: 'Learn the difference between fasting and non-fasting sugar panels, how hydration affects draws, and instructions to get precise results.',
    author: 'Saraswathy Lab Pathology Team',
    date: 'July 14, 2026',
    readTime: '4 Min Read',
    content: `
      <h3>Understanding Fasting Guidelines</h3>
      <p>Many common clinical tests, especially Fasting Blood Sugar (FBS), Lipid profiles (cholesterol), and comprehensive wellness screening panels, require you to fast overnight. Fasting ensures that the nutrients in food do not temporarily skew glucose and fat levels in your blood system.</p>
      
      <h3>1. What Counts as Fasting?</h3>
      <p>True clinical fasting means consuming absolutely no food or drink (other than plain water) for 8 to 12 hours before your sample collection. Consuming tea, coffee (even without sugar), juices, or sodas will trigger insulin releases and impact the test results.</p>
      
      <h3>2. Why Hydration is Crucial</h3>
      <p>Drinking adequate amounts of plain water is highly recommended before a blood test. Proper hydration expands your veins, making it much easier for the phlebotomist to locate a clean vein and complete the draw quickly with minimal discomfort.</p>
      
      <h3>3. Managing Medications</h3>
      <p>Do not stop taking standard chronic prescriptions (such as blood pressure medication) unless explicitly instructed by your physician. However, tell your lab technician about any regular supplements or medicines you are taking, as they can interact with diagnostic reagents.</p>
    `,
    medicalDisclaimer: 'This article is for educational purposes only and does not substitute for specific instructions provided by your doctor. Always follow your physician\'s preparation guidelines.'
  },
  'understanding-common-blood-tests': {
    slug: 'understanding-common-blood-tests',
    title: 'A Simple Guide to Understanding Your Blood Count (CBC) Report',
    excerpt: 'Translate complex clinical reports into plain language. Learn about red blood cells, hemoglobin, and white blood cell levels.',
    author: 'Saraswathy Lab Clinical Staff',
    date: 'June 28, 2026',
    readTime: '5 Min Read',
    content: `
      <h3>What is a Complete Blood Count (CBC)?</h3>
      <p>A Complete Blood Count (CBC) is one of the most common blood test profiles ordered. It measures the different types of cells that circulate in your bloodstream, helping doctors detect flags like anemia, infections, or leukemia.</p>
      
      <h3>1. Red Blood Cells (RBC) & Hemoglobin</h3>
      <p>Red Blood Cells carry oxygen from your lungs to the rest of your body. Hemoglobin is the iron-rich protein inside the red blood cells that actually binds the oxygen. Low levels of hemoglobin or RBCs usually point to anemia, which causes fatigue and weakness.</p>
      
      <h3>2. White Blood Cells (WBC)</h3>
      <p>White Blood Cells are the immune system\'s primary defense force. Elevated WBC counts often indicate that your body is fighting off a bacterial or viral infection, or managing inflammation. Abnormally low counts may indicate bone marrow issues or autoimmune flags.</p>
      
      <h3>3. Platelets (PLT)</h3>
      <p>Platelets are small cell fragments crucial for blood clotting. If you get a cut, platelets gather to seal the blood vessel. Normal counts range from 150,000 to 450,000 platelets per microliter. Low counts (thrombocytopenia) increase the risk of bruising or bleeding.</p>
    `,
    medicalDisclaimer: 'Clinical lab reference ranges vary. Always present your final printed report to a qualified doctor for diagnosis and clinical interpretation.'
  }
};
