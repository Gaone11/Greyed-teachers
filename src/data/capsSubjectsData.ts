export interface CAPSTopic {
  name: string;
  terms?: string[];
}

export interface CAPSSubject {
  name: string;
  phases: string[];
  grades: string[];
  topics: CAPSTopic[];
}

export const CAPS_GRADES = [
  'Grade R',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
];

export const CAPS_TERMS = ['Term 1', 'Term 2', 'Term 3', 'Term 4'];

export const CAPS_SUBJECTS: CAPSSubject[] = [
  {
    name: 'Setswana Home Language',
    phases: ['Foundation', 'Intermediate', 'Senior'],
    grades: ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'],
    topics: [
      { name: 'Go Reetsa le go Bua (Listening and Speaking)' },
      { name: 'Go Bala le go Bogela (Reading and Viewing)' },
      { name: 'Go Kwala le go Tlhagisa (Writing and Presenting)' },
      { name: 'Tiriso ya Puo le Popego (Language Use and Structure)' },
      { name: 'Ditlhangwa tsa Monoana (Phonics)' },
      { name: 'Thanodi le Tlotlofoko (Vocabulary and Dictionary Work)' },
      { name: 'Mokwalo wa Seatla (Handwriting)' },
      { name: 'Dikwalo tsa Botlhami (Creative Writing)' },
      { name: 'Go Bala ka Tlhalogano (Reading Comprehension)' },
      { name: 'Dipadi le Dingwao (Stories and Folklore)' },
      { name: 'Puo ya Kamanong (Oral Communication)' },
      { name: 'Setwerka sa Puo (Grammar and Syntax)' },
    ],
  },
  {
    name: 'Siswati Home Language',
    phases: ['Foundation', 'Intermediate', 'Senior'],
    grades: ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'],
    topics: [
      { name: 'Kulalela nekukhuluma (Listening and Speaking)' },
      { name: 'Kufundza nekubuka (Reading and Viewing)' },
      { name: 'Kubhala nekwetfula (Writing and Presenting)' },
      { name: 'Kusebentisa lulwimi nesakhiwo (Language Use and Structure)' },
      { name: 'Imisindvo nemabito (Phonics and Vocabulary)' },
      { name: 'Kubhala ngesandla (Handwriting)' },
      { name: 'Kubhala ngekutfula (Creative Writing)' },
      { name: 'Kufundza ngekuvisisa (Reading Comprehension)' },
      { name: 'Tinganekwane netindzaba (Folklore and Stories)' },
      { name: 'Kukhuluma emphakatsini (Oral Communication)' },
      { name: 'Silulamagama nesipelinge (Grammar and Spelling)' },
    ],
  },
  {
    name: 'IsiXhosa Home Language',
    phases: ['Foundation', 'Intermediate', 'Senior'],
    grades: ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'],
    topics: [
      { name: 'Ukuphulaphula nokuthetha (Listening and Speaking)' },
      { name: 'Ukufunda nokujonga (Reading and Viewing)' },
      { name: 'Ukubhala nokwenza (Writing and Presenting)' },
      { name: 'Ukusetyenziswa kolwimi nesakhiwo (Language Use and Structure)' },
      { name: 'Izandi namagama (Phonics and Vocabulary)' },
      { name: 'Ukubhala ngesandla (Handwriting)' },
      { name: 'Ukubhala ngobuchule (Creative Writing)' },
      { name: 'Ukufunda ngokuqonda (Reading Comprehension)' },
      { name: 'Iintsomi namabali (Folklore and Stories)' },
      { name: 'Ukuthetha esidlangalaleni (Oral Communication)' },
      { name: 'Isigama nopelo (Grammar and Spelling)' },
    ],
  },
  {
    name: 'English First Additional Language',
    phases: ['Foundation', 'Intermediate', 'Senior'],
    grades: ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'],
    topics: [
      { name: 'Listening and Speaking' },
      { name: 'Reading and Phonics' },
      { name: 'Writing' },
      { name: 'Language Use and Structure' },
      { name: 'Reading Comprehension' },
      { name: 'Creative Writing' },
      { name: 'Visual Literacy' },
      { name: 'Vocabulary in Context' },
      { name: 'Grammar and Sentence Construction' },
      { name: 'Oral Presentation' },
    ],
  },
  {
    name: 'Mathematics',
    phases: ['Foundation', 'Intermediate', 'Senior'],
    grades: ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'],
    topics: [
      { name: 'Numbers, Operations and Relationships' },
      { name: 'Patterns, Functions and Algebra' },
      { name: 'Space and Shape (Geometry)' },
      { name: 'Measurement' },
      { name: 'Data Handling (Statistics)' },
      { name: 'Whole Numbers' },
      { name: 'Common Fractions' },
      { name: 'Decimal Fractions' },
      { name: 'Ratio and Rate' },
      { name: 'Percentages' },
      { name: 'Number Sentences and Equations' },
      { name: 'Properties of 2D Shapes' },
      { name: 'Properties of 3D Objects' },
      { name: 'Geometric Transformations' },
      { name: 'Time' },
      { name: 'Capacity and Volume' },
      { name: 'Mass and Weight' },
      { name: 'Length and Perimeter' },
      { name: 'Area' },
      { name: 'Probability' },
    ],
  },
  {
    name: 'Life Skills',
    phases: ['Foundation'],
    grades: ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3'],
    topics: [
      { name: 'Beginning Knowledge (Social Sciences)' },
      { name: 'Beginning Knowledge (Natural Sciences)' },
      { name: 'Personal and Social Well-being' },
      { name: 'Creative Arts (Visual Arts)' },
      { name: 'Creative Arts (Performing Arts)' },
      { name: 'Physical Education' },
      { name: 'Health and Environmental Responsibility' },
      { name: 'Social Relationships' },
      { name: 'Rights and Responsibilities' },
    ],
  },
  {
    name: 'Natural Sciences and Technology',
    phases: ['Intermediate', 'Senior'],
    grades: ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'],
    topics: [
      { name: 'Life and Living (Biodiversity)' },
      { name: 'Life and Living (Habitats and Ecosystems)' },
      { name: 'Life and Living (Plants and Animals)' },
      { name: 'Life and Living (Human Body Systems)' },
      { name: 'Matter and Materials (Properties of Materials)' },
      { name: 'Matter and Materials (Mixtures and Solutions)' },
      { name: 'Matter and Materials (Changes in Materials)' },
      { name: 'Energy and Change (Energy Sources)' },
      { name: 'Energy and Change (Heat and Temperature)' },
      { name: 'Energy and Change (Light and Sound)' },
      { name: 'Energy and Change (Electric Circuits)' },
      { name: 'Earth and Beyond (The Solar System)' },
      { name: 'Earth and Beyond (Rocks and Minerals)' },
      { name: 'Earth and Beyond (Weather and Climate)' },
      { name: 'Technology (Structures)' },
      { name: 'Technology (Processing Materials)' },
      { name: 'Technology (Systems and Control)' },
    ],
  },
  {
    name: 'Social Sciences',
    phases: ['Intermediate', 'Senior'],
    grades: ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'],
    topics: [
      { name: 'History: Local History and Heritage' },
      { name: 'History: Early Societies and Civilisations' },
      { name: 'History: Exploration and Trade Routes' },
      { name: 'History: Colonialism in Southern Africa' },
      { name: 'History: Democracy and Human Rights' },
      { name: 'History: Apartheid and Resistance' },
      { name: 'Geography: Mapwork and Map Skills' },
      { name: 'Geography: Physical Features of South Africa' },
      { name: 'Geography: Population and Settlement' },
      { name: 'Geography: Resources and Conservation' },
      { name: 'Geography: Climate and Weather' },
      { name: 'Geography: Water and Farming' },
      { name: 'Geography: Trade and Development' },
    ],
  },
  {
    name: 'Creative Arts',
    phases: ['Intermediate', 'Senior'],
    grades: ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'],
    topics: [
      { name: 'Visual Arts (Drawing and Painting)' },
      { name: 'Visual Arts (Sculpture and Crafts)' },
      { name: 'Visual Arts (Design and Patterns)' },
      { name: 'Performing Arts (Dance and Movement)' },
      { name: 'Performing Arts (Drama and Role-Play)' },
      { name: 'Performing Arts (Music: Rhythm and Melody)' },
      { name: 'Performing Arts (Music: Instruments)' },
      { name: 'Cultural Expression and Heritage Arts' },
    ],
  },
  {
    name: 'Life Orientation',
    phases: ['Intermediate', 'Senior'],
    grades: ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'],
    topics: [
      { name: 'Development of Self in Society' },
      { name: 'Health, Social and Environmental Responsibility' },
      { name: 'Constitutional Rights and Responsibilities' },
      { name: 'Physical Education and Movement' },
      { name: 'Personal Safety and Substance Abuse' },
      { name: 'Nutrition and Hygiene' },
      { name: 'Peer Pressure and Decision Making' },
      { name: 'Study Skills and Goal Setting' },
      { name: 'Career Awareness' },
    ],
  },
  {
    name: 'Economic and Management Sciences',
    phases: ['Senior'],
    grades: ['Grade 7'],
    topics: [
      { name: 'The Economy (Needs and Wants)' },
      { name: 'The Economy (Goods and Services)' },
      { name: 'Financial Literacy (Savings and Budgeting)' },
      { name: 'Financial Literacy (Income and Expenses)' },
      { name: 'Entrepreneurship (Business Ideas)' },
      { name: 'Entrepreneurship (Starting a Business)' },
      { name: 'The Role of Government in the Economy' },
      { name: 'Trade and Markets' },
    ],
  },
  {
    name: 'Technology',
    phases: ['Senior'],
    grades: ['Grade 7'],
    topics: [
      { name: 'Structures' },
      { name: 'Processing (Food and Textiles)' },
      { name: 'Mechanical Systems and Control' },
      { name: 'Electrical Systems and Control' },
      { name: 'Design Process and Investigation' },
      { name: 'Communication and Graphics' },
    ],
  },
];

export function getSubjectsByGrade(grade: string): CAPSSubject[] {
  return CAPS_SUBJECTS.filter((s) => s.grades.includes(grade));
}

export function getTopicsForSubject(subjectName: string): CAPSTopic[] {
  const subject = CAPS_SUBJECTS.find((s) => s.name === subjectName);
  return subject?.topics || [];
}
