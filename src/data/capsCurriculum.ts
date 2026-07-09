/**
 * NERDC curriculum data for Nigerian junior and senior secondary school.
 *
 * Source structure:
 * - Junior Secondary School (JSS 1-3) Basic Education Curriculum
 * - New Revised Senior Secondary Education Curriculum (SSEC), SSS 1-3
 *
 * The old export names are kept as aliases so existing generator and
 * knowledgebase code can keep working while the platform uses NERDC.
 */

export interface CAPSTopic {
  name: string;
  key: string;
}

export interface CAPSSubject {
  name: string;
  key: string;
  phase: ('junior' | 'senior')[];
  topics: CAPSTopic[];
}

const languageTopics: CAPSTopic[] = [
  { name: 'Listening and Speaking', key: 'listening-speaking' },
  { name: 'Reading and Comprehension', key: 'reading-comprehension' },
  { name: 'Writing and Composition', key: 'writing-composition' },
  { name: 'Grammar and Vocabulary', key: 'grammar-vocabulary' },
  { name: 'Literature and Oral Tradition', key: 'literature-oral-tradition' },
  { name: 'Speech Work and Presentation', key: 'speech-presentation' },
];

const mathematicsTopics: CAPSTopic[] = [
  { name: 'Number and Numeration', key: 'number-numeration' },
  { name: 'Algebraic Processes', key: 'algebraic-processes' },
  { name: 'Geometry and Mensuration', key: 'geometry-mensuration' },
  { name: 'Trigonometry', key: 'trigonometry' },
  { name: 'Statistics and Probability', key: 'statistics-probability' },
  { name: 'Financial Arithmetic', key: 'financial-arithmetic' },
  { name: 'Graphs and Functions', key: 'graphs-functions' },
];

const scienceTopics: CAPSTopic[] = [
  { name: 'Scientific Investigation', key: 'scientific-investigation' },
  { name: 'Living Things and Environment', key: 'living-things-environment' },
  { name: 'Matter and Materials', key: 'matter-materials' },
  { name: 'Energy, Forces and Motion', key: 'energy-forces-motion' },
  { name: 'Earth and Space', key: 'earth-space' },
  { name: 'Technology, Design and Practical Work', key: 'technology-design-practical' },
];

const biologyTopics: CAPSTopic[] = [
  { name: 'Cell Biology', key: 'cell-biology' },
  { name: 'Nutrition and Transport', key: 'nutrition-transport' },
  { name: 'Ecology and Conservation', key: 'ecology-conservation' },
  { name: 'Reproduction and Growth', key: 'reproduction-growth' },
  { name: 'Genetics and Evolution', key: 'genetics-evolution' },
  { name: 'Health and Disease', key: 'health-disease' },
];

const chemistryTopics: CAPSTopic[] = [
  { name: 'Particulate Nature of Matter', key: 'particulate-matter' },
  { name: 'Chemical Bonding and Structure', key: 'bonding-structure' },
  { name: 'Acids, Bases and Salts', key: 'acids-bases-salts' },
  { name: 'Organic Chemistry', key: 'organic-chemistry' },
  { name: 'Energy Changes and Rates', key: 'energy-rates' },
  { name: 'Industrial and Environmental Chemistry', key: 'industrial-environmental-chemistry' },
];

const physicsTopics: CAPSTopic[] = [
  { name: 'Measurement and Units', key: 'measurement-units' },
  { name: 'Motion and Forces', key: 'motion-forces' },
  { name: 'Work, Energy and Power', key: 'work-energy-power' },
  { name: 'Waves, Sound and Light', key: 'waves-sound-light' },
  { name: 'Electricity and Magnetism', key: 'electricity-magnetism' },
  { name: 'Modern Physics and Applications', key: 'modern-physics' },
];

const socialStudiesTopics: CAPSTopic[] = [
  { name: 'Family, Community and Society', key: 'family-community-society' },
  { name: 'Citizenship and National Values', key: 'citizenship-national-values' },
  { name: 'Culture, Identity and Heritage', key: 'culture-identity-heritage' },
  { name: 'Human Rights and Responsibilities', key: 'rights-responsibilities' },
  { name: 'Peace, Security and Conflict Resolution', key: 'peace-security-conflict' },
  { name: 'Leadership and Governance', key: 'leadership-governance' },
];

const historyGovernmentTopics: CAPSTopic[] = [
  { name: 'Nigerian History and Heritage', key: 'nigerian-history-heritage' },
  { name: 'Pre-colonial and Colonial Societies', key: 'precolonial-colonial' },
  { name: 'Nationalism and Independence', key: 'nationalism-independence' },
  { name: 'Constitution and Government', key: 'constitution-government' },
  { name: 'Democracy and Civic Participation', key: 'democracy-civic-participation' },
  { name: 'International Relations', key: 'international-relations' },
];

const businessTopics: CAPSTopic[] = [
  { name: 'Office Practice and Communication', key: 'office-practice-communication' },
  { name: 'Commerce and Trade', key: 'commerce-trade' },
  { name: 'Bookkeeping and Accounting', key: 'bookkeeping-accounting' },
  { name: 'Entrepreneurship', key: 'entrepreneurship' },
  { name: 'Marketing and Consumer Education', key: 'marketing-consumer-education' },
  { name: 'Business Ethics and Careers', key: 'business-ethics-careers' },
];

const digitalTopics: CAPSTopic[] = [
  { name: 'Digital Literacy', key: 'digital-literacy' },
  { name: 'Computer Systems and Hardware', key: 'computer-systems-hardware' },
  { name: 'Productivity Tools', key: 'productivity-tools' },
  { name: 'Data, Algorithms and Programming', key: 'data-algorithms-programming' },
  { name: 'Internet, Networks and Cyber Safety', key: 'internet-networks-cyber-safety' },
  { name: 'Emerging Technologies', key: 'emerging-technologies' },
];

const artsTopics: CAPSTopic[] = [
  { name: 'Drawing, Painting and Design', key: 'drawing-painting-design' },
  { name: 'Music and Performance', key: 'music-performance' },
  { name: 'Drama and Dance', key: 'drama-dance' },
  { name: 'Creative Production and Appreciation', key: 'creative-production-appreciation' },
  { name: 'Nigerian Arts and Cultural Heritage', key: 'nigerian-arts-cultural-heritage' },
];

const religiousTopics: CAPSTopic[] = [
  { name: 'Sacred Texts and Teachings', key: 'sacred-texts-teachings' },
  { name: 'Faith, Worship and Practice', key: 'faith-worship-practice' },
  { name: 'Moral Instruction and Values', key: 'moral-instruction-values' },
  { name: 'Religion and Society', key: 'religion-society' },
  { name: 'Peaceful Coexistence', key: 'peaceful-coexistence' },
];

const tradeTopics: CAPSTopic[] = [
  { name: 'Tools, Materials and Safety', key: 'tools-materials-safety' },
  { name: 'Practical Skills and Production', key: 'practical-skills-production' },
  { name: 'Maintenance and Troubleshooting', key: 'maintenance-troubleshooting' },
  { name: 'Entrepreneurship and Costing', key: 'entrepreneurship-costing' },
  { name: 'Project Work and Portfolio', key: 'project-work-portfolio' },
];

const agricultureTopics: CAPSTopic[] = [
  { name: 'Crop Production', key: 'crop-production' },
  { name: 'Animal Production', key: 'animal-production' },
  { name: 'Soil, Water and Farm Inputs', key: 'soil-water-inputs' },
  { name: 'Agricultural Economics and Extension', key: 'agric-economics-extension' },
  { name: 'Farm Tools, Machinery and Safety', key: 'farm-tools-machinery-safety' },
];

const geographyTopics: CAPSTopic[] = [
  { name: 'Map Reading and GIS', key: 'map-reading-gis' },
  { name: 'Physical Geography', key: 'physical-geography' },
  { name: 'Human and Economic Geography', key: 'human-economic-geography' },
  { name: 'Climate and Environmental Management', key: 'climate-environmental-management' },
  { name: 'Nigeria and Regional Geography', key: 'nigeria-regional-geography' },
];

const literatureTopics: CAPSTopic[] = [
  { name: 'Prose', key: 'prose' },
  { name: 'Poetry', key: 'poetry' },
  { name: 'Drama', key: 'drama' },
  { name: 'Literary Appreciation', key: 'literary-appreciation' },
  { name: 'Context and Themes', key: 'context-themes' },
];

const economicsTopics: CAPSTopic[] = [
  { name: 'Basic Economic Concepts', key: 'basic-economic-concepts' },
  { name: 'Demand, Supply and Markets', key: 'demand-supply-markets' },
  { name: 'Production and Costs', key: 'production-costs' },
  { name: 'Money, Banking and Public Finance', key: 'money-banking-public-finance' },
  { name: 'Economic Development and Planning', key: 'economic-development-planning' },
];

const healthPeTopics: CAPSTopic[] = [
  { name: 'Personal Health and Hygiene', key: 'personal-health-hygiene' },
  { name: 'Fitness, Games and Athletics', key: 'fitness-games-athletics' },
  { name: 'Safety, First Aid and Injury Prevention', key: 'safety-first-aid' },
  { name: 'Nutrition and Wellness', key: 'nutrition-wellness' },
  { name: 'Community Health', key: 'community-health' },
];

export const nerdcCurriculum: CAPSSubject[] = [
  { name: 'English Studies', key: 'english-studies', phase: ['junior'], topics: languageTopics },
  { name: 'English Language', key: 'english-language', phase: ['senior'], topics: languageTopics },
  { name: 'Mathematics', key: 'mathematics', phase: ['junior'], topics: mathematicsTopics },
  { name: 'General Mathematics', key: 'general-mathematics', phase: ['senior'], topics: mathematicsTopics },
  { name: 'Hausa Language', key: 'hausa-language', phase: ['junior', 'senior'], topics: languageTopics },
  { name: 'Igbo Language', key: 'igbo-language', phase: ['junior', 'senior'], topics: languageTopics },
  { name: 'Yoruba Language', key: 'yoruba-language', phase: ['junior', 'senior'], topics: languageTopics },
  { name: 'Arabic Language', key: 'arabic-language', phase: ['junior', 'senior'], topics: languageTopics },
  { name: 'French', key: 'french', phase: ['junior', 'senior'], topics: languageTopics },
  { name: 'Physical and Health Education', key: 'physical-health-education', phase: ['junior'], topics: healthPeTopics },
  { name: 'Physical Education', key: 'physical-education', phase: ['senior'], topics: healthPeTopics },
  { name: 'Health Education', key: 'health-education', phase: ['senior'], topics: healthPeTopics },
  { name: 'Christian Religious Studies', key: 'christian-religious-studies', phase: ['junior', 'senior'], topics: religiousTopics },
  { name: 'Islamic Studies', key: 'islamic-studies', phase: ['junior', 'senior'], topics: religiousTopics },
  { name: 'Nigerian History', key: 'nigerian-history', phase: ['junior', 'senior'], topics: historyGovernmentTopics },
  { name: 'Government', key: 'government', phase: ['senior'], topics: historyGovernmentTopics },
  { name: 'Social and Citizenship Studies', key: 'social-citizenship-studies', phase: ['junior'], topics: socialStudiesTopics },
  { name: 'Citizenship and Heritage Studies', key: 'citizenship-heritage-studies', phase: ['senior'], topics: socialStudiesTopics },
  { name: 'Cultural and Creative Arts (CCA)', key: 'cultural-creative-arts', phase: ['junior'], topics: artsTopics },
  { name: 'Visual Arts', key: 'visual-arts', phase: ['senior'], topics: artsTopics },
  { name: 'Music', key: 'music', phase: ['senior'], topics: artsTopics },
  { name: 'Intermediate Science', key: 'intermediate-science', phase: ['junior'], topics: scienceTopics },
  { name: 'Biology', key: 'biology', phase: ['senior'], topics: biologyTopics },
  { name: 'Chemistry', key: 'chemistry', phase: ['senior'], topics: chemistryTopics },
  { name: 'Physics', key: 'physics', phase: ['senior'], topics: physicsTopics },
  { name: 'Agriculture Science', key: 'agriculture-science', phase: ['senior'], topics: agricultureTopics },
  { name: 'Food & Nutrition', key: 'food-nutrition', phase: ['senior'], topics: healthPeTopics },
  { name: 'Geography', key: 'geography', phase: ['senior'], topics: geographyTopics },
  { name: 'Technical Drawing', key: 'technical-drawing', phase: ['senior'], topics: tradeTopics },
  { name: 'Digital Technologies', key: 'digital-technologies', phase: ['junior', 'senior'], topics: digitalTopics },
  { name: 'Business Studies', key: 'business-studies', phase: ['junior'], topics: businessTopics },
  { name: 'Financial Accounting', key: 'financial-accounting', phase: ['senior'], topics: businessTopics },
  { name: 'Commerce', key: 'commerce', phase: ['senior'], topics: businessTopics },
  { name: 'Marketing', key: 'marketing', phase: ['senior'], topics: businessTopics },
  { name: 'Economics', key: 'economics', phase: ['senior'], topics: economicsTopics },
  { name: 'Literature-in-English', key: 'literature-in-english', phase: ['senior'], topics: literatureTopics },
  { name: 'Home Management', key: 'home-management', phase: ['senior'], topics: healthPeTopics },
  { name: 'Catering Craft', key: 'catering-craft', phase: ['senior'], topics: tradeTopics },
  { name: 'Solar Photovoltaic Installation and Maintenance', key: 'solar-photovoltaic', phase: ['senior'], topics: tradeTopics },
  { name: 'Fashion Design and Garment Making', key: 'fashion-design-garment-making', phase: ['senior'], topics: tradeTopics },
  { name: 'Livestock Farming', key: 'livestock-farming', phase: ['senior'], topics: agricultureTopics },
  { name: 'Beauty and Cosmetology', key: 'beauty-cosmetology', phase: ['senior'], topics: tradeTopics },
  { name: 'Computer Hardware and GSM Repairs', key: 'computer-hardware-gsm-repairs', phase: ['senior'], topics: digitalTopics },
  { name: 'Crop Production and Horticulture', key: 'crop-production-horticulture', phase: ['senior'], topics: agricultureTopics },
];

export const capsCurriculum = nerdcCurriculum;

export const capsSubjectMap = new Map<string, CAPSSubject>(
  nerdcCurriculum.map(s => [s.key, s])
);

export function getSubjectsByPhase(phase: 'junior' | 'senior'): CAPSSubject[] {
  return nerdcCurriculum.filter(s => s.phase.includes(phase));
}

export function getPhaseFromGrade(grade: number): 'junior' | 'senior' {
  return grade <= 9 ? 'junior' : 'senior';
}

export const nerdcGrades = [
  { value: 'JSS 1', label: 'JSS 1', num: 7 },
  { value: 'JSS 2', label: 'JSS 2', num: 8 },
  { value: 'JSS 3', label: 'JSS 3', num: 9 },
  { value: 'SSS 1', label: 'SSS 1', num: 10 },
  { value: 'SSS 2', label: 'SSS 2', num: 11 },
  { value: 'SSS 3', label: 'SSS 3', num: 12 },
];

export const saGrades = nerdcGrades;
