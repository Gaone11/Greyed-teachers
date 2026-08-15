import React, { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import StudentLayout from '../../components/students/StudentLayout';
import {
  BookOpen,
  CheckCircle,
  Download,
  FileDown,
  FileText,
  Filter,
  Globe2,
  HelpCircle,
  Search,
  Upload
} from 'lucide-react';
import { downloadMarkdownAsDocx } from '../../lib/markdown-to-docx';

type FileFormat = 'PDF' | 'Word';
type UploadIntent = 'ai-help' | 'tutor-help' | 'practice-match';

interface CurriculumOption {
  country: string;
  curricula: string[];
}

interface AssessmentResource {
  id: string;
  title: string;
  country: string;
  curriculum: string;
  subject: string;
  grade: string;
  format: FileFormat;
  questions: number;
  level: string;
  description: string;
}

interface UploadedAssessment {
  id: string;
  fileName: string;
  country: string;
  curriculum: string;
  subject: string;
  grade: string;
  intent: UploadIntent;
  uploadedAt: string;
  fileType: string;
}

const defaultCurricula = ['National Curriculum', 'Cambridge International', 'IB Diploma Programme'];

const countryOption = (country: string, curricula = defaultCurricula): CurriculumOption => ({
  country,
  curricula
});

const curriculumOptions: CurriculumOption[] = [
  countryOption('Botswana', ['Botswana General Education Curriculum', 'PSLE', 'JCE', 'BGCSE', 'Cambridge International']),
  countryOption('International', ['IB PYP', 'IB MYP', 'IB Diploma Programme', 'Cambridge Primary', 'Cambridge Lower Secondary', 'IGCSE', 'Cambridge AS & A Level']),
  countryOption('Afghanistan'),
  countryOption('Albania'),
  countryOption('Algeria'),
  countryOption('Andorra'),
  countryOption('Angola'),
  countryOption('Antigua and Barbuda'),
  countryOption('Argentina'),
  countryOption('Armenia'),
  countryOption('Australia', ['Australian Curriculum', 'NSW HSC', 'VCE', 'QCE', 'WACE', 'IB Diploma Programme']),
  countryOption('Austria'),
  countryOption('Azerbaijan'),
  countryOption('Bahamas'),
  countryOption('Bahrain'),
  countryOption('Bangladesh'),
  countryOption('Barbados'),
  countryOption('Belarus'),
  countryOption('Belgium'),
  countryOption('Belize'),
  countryOption('Benin'),
  countryOption('Bhutan'),
  countryOption('Bolivia'),
  countryOption('Bosnia and Herzegovina'),
  countryOption('Brazil'),
  countryOption('Brunei'),
  countryOption('Bulgaria'),
  countryOption('Burkina Faso'),
  countryOption('Burundi'),
  countryOption('Cabo Verde'),
  countryOption('Cambodia'),
  countryOption('Cameroon'),
  countryOption('Canada', ['Ontario Curriculum', 'British Columbia Curriculum', 'Alberta Curriculum', 'Quebec Education Program', 'IB Diploma Programme']),
  countryOption('Central African Republic'),
  countryOption('Chad'),
  countryOption('Chile'),
  countryOption('China'),
  countryOption('Colombia'),
  countryOption('Comoros'),
  countryOption('Congo'),
  countryOption('Costa Rica'),
  countryOption("Cote d'Ivoire"),
  countryOption('Croatia'),
  countryOption('Cuba'),
  countryOption('Cyprus'),
  countryOption('Czechia'),
  countryOption('Democratic Republic of the Congo'),
  countryOption('Denmark'),
  countryOption('Djibouti'),
  countryOption('Dominica'),
  countryOption('Dominican Republic'),
  countryOption('Ecuador'),
  countryOption('Egypt'),
  countryOption('El Salvador'),
  countryOption('Equatorial Guinea'),
  countryOption('Eritrea'),
  countryOption('Estonia'),
  countryOption('Eswatini'),
  countryOption('Ethiopia'),
  countryOption('Fiji'),
  countryOption('Finland'),
  countryOption('France', ['French National Curriculum', 'Brevet', 'Baccalaureate', 'IB Diploma Programme']),
  countryOption('Gabon'),
  countryOption('Gambia'),
  countryOption('Georgia'),
  countryOption('Germany', ['Grundschule', 'Gymnasium', 'Realschule', 'Abitur', 'IB Diploma Programme']),
  countryOption('Ghana', ['NaCCA Curriculum', 'BECE', 'WASSCE', 'Cambridge International']),
  countryOption('Greece'),
  countryOption('Grenada'),
  countryOption('Guatemala'),
  countryOption('Guinea'),
  countryOption('Guinea-Bissau'),
  countryOption('Guyana'),
  countryOption('Haiti'),
  countryOption('Honduras'),
  countryOption('Hungary'),
  countryOption('Iceland'),
  countryOption('India', ['CBSE', 'ICSE', 'ISC', 'State Boards', 'Cambridge International']),
  countryOption('Indonesia'),
  countryOption('Iran'),
  countryOption('Iraq'),
  countryOption('Ireland'),
  countryOption('Israel'),
  countryOption('Italy'),
  countryOption('Jamaica'),
  countryOption('Japan'),
  countryOption('Jordan'),
  countryOption('Kazakhstan'),
  countryOption('Kenya', ['CBC', 'KCPE', 'KCSE', 'Cambridge International']),
  countryOption('Kiribati'),
  countryOption('Kuwait'),
  countryOption('Kyrgyzstan'),
  countryOption('Laos'),
  countryOption('Latvia'),
  countryOption('Lebanon'),
  countryOption('Lesotho', ['Lesotho Basic Education Curriculum', 'LGCSE', 'Cambridge International']),
  countryOption('Liberia'),
  countryOption('Libya'),
  countryOption('Liechtenstein'),
  countryOption('Lithuania'),
  countryOption('Luxembourg'),
  countryOption('Madagascar'),
  countryOption('Malawi', ['Malawi National Curriculum', 'MSCE', 'Cambridge International']),
  countryOption('Malaysia'),
  countryOption('Maldives'),
  countryOption('Mali'),
  countryOption('Malta'),
  countryOption('Marshall Islands'),
  countryOption('Mauritania'),
  countryOption('Mauritius'),
  countryOption('Mexico'),
  countryOption('Micronesia'),
  countryOption('Moldova'),
  countryOption('Monaco'),
  countryOption('Mongolia'),
  countryOption('Montenegro'),
  countryOption('Morocco'),
  countryOption('Mozambique'),
  countryOption('Myanmar'),
  countryOption('Namibia', ['Namibian Curriculum', 'NSSCAS', 'NSSCO', 'Cambridge International']),
  countryOption('Nauru'),
  countryOption('Nepal'),
  countryOption('Netherlands'),
  countryOption('New Zealand'),
  countryOption('Nicaragua'),
  countryOption('Niger'),
  countryOption('Nigeria', ['National Curriculum', 'BECE', 'WAEC', 'NECO', 'Cambridge International']),
  countryOption('North Korea'),
  countryOption('North Macedonia'),
  countryOption('Norway'),
  countryOption('Oman'),
  countryOption('Pakistan'),
  countryOption('Palau'),
  countryOption('Panama'),
  countryOption('Papua New Guinea'),
  countryOption('Paraguay'),
  countryOption('Peru'),
  countryOption('Philippines'),
  countryOption('Poland'),
  countryOption('Portugal'),
  countryOption('Qatar'),
  countryOption('Romania'),
  countryOption('Russia'),
  countryOption('Rwanda'),
  countryOption('Saint Kitts and Nevis'),
  countryOption('Saint Lucia'),
  countryOption('Saint Vincent and the Grenadines'),
  countryOption('Samoa'),
  countryOption('San Marino'),
  countryOption('Sao Tome and Principe'),
  countryOption('Saudi Arabia'),
  countryOption('Senegal'),
  countryOption('Serbia'),
  countryOption('Seychelles'),
  countryOption('Sierra Leone'),
  countryOption('Singapore', ['MOE Syllabus', 'GCE N-Level', 'GCE O-Level', 'GCE A-Level', 'IB Diploma Programme']),
  countryOption('Slovakia'),
  countryOption('Slovenia'),
  countryOption('Solomon Islands'),
  countryOption('Somalia'),
  countryOption('South Africa', ['CAPS', 'IEB', 'NSC', 'Cambridge International']),
  countryOption('South Korea'),
  countryOption('South Sudan'),
  countryOption('Spain'),
  countryOption('Sri Lanka'),
  countryOption('Sudan'),
  countryOption('Suriname'),
  countryOption('Sweden'),
  countryOption('Switzerland'),
  countryOption('Syria'),
  countryOption('Tajikistan'),
  countryOption('Tanzania', ['NECTA', 'CSEE', 'ACSEE', 'Cambridge International']),
  countryOption('Thailand'),
  countryOption('Timor-Leste'),
  countryOption('Togo'),
  countryOption('Tonga'),
  countryOption('Trinidad and Tobago'),
  countryOption('Tunisia'),
  countryOption('Turkey'),
  countryOption('Turkmenistan'),
  countryOption('Tuvalu'),
  countryOption('Uganda', ['Uganda National Curriculum', 'PLE', 'UCE', 'UACE', 'Cambridge International']),
  countryOption('Ukraine'),
  countryOption('United Arab Emirates', ['UAE MOE', 'British Curriculum', 'American Curriculum', 'IB Diploma Programme']),
  countryOption('United Kingdom', ['National Curriculum', 'GCSE', 'A Level', 'Scottish Curriculum for Excellence', 'IB Diploma Programme']),
  countryOption('United States', ['Common Core', 'NGSS', 'Advanced Placement', 'State Standards', 'IB Diploma Programme']),
  countryOption('Uruguay'),
  countryOption('Uzbekistan'),
  countryOption('Vanuatu'),
  countryOption('Venezuela'),
  countryOption('Vietnam'),
  countryOption('Yemen'),
  countryOption('Zambia', ['Zambian Curriculum', 'ECZ', 'Cambridge International']),
  countryOption('Zimbabwe', ['Zimbabwe Curriculum', 'ZIMSEC', 'Cambridge International']),
  countryOption('Holy See'),
  countryOption('State of Palestine')
];

const globalSubjects = [
  'Accounting',
  'Agriculture',
  'Arabic',
  'Art & Design',
  'Biology',
  'Business Studies',
  'Chemistry',
  'Computer Science',
  'Design & Technology',
  'Drama',
  'Economics',
  'Engineering',
  'English Language',
  'English Literature',
  'Environmental Science',
  'French',
  'Geography',
  'History',
  'Information Technology',
  'Life Orientation',
  'Mandarin',
  'Mathematics',
  'Music',
  'Physical Education',
  'Physics',
  'Psychology',
  'Religious Studies',
  'Social Studies',
  'Spanish',
  'Statistics'
];

const gradeOptions = [
  'Foundation / Kindergarten',
  'Grade 1 / Year 1',
  'Grade 2 / Year 2',
  'Grade 3 / Year 3',
  'Grade 4 / Year 4',
  'Grade 5 / Year 5',
  'Grade 6 / Year 6',
  'Grade 7 / Year 7',
  'Grade 8 / Year 8',
  'Grade 9 / Year 9',
  'Grade 10 / Year 10',
  'Grade 11 / Year 11',
  'Grade 12 / Year 12',
  'Year 13 / A Level / IB DP'
];

const assessmentResources: AssessmentResource[] = [
  {
    id: 'botswana-bgcse-math-functions',
    title: 'BGCSE Mathematics Functions and Graphs',
    country: 'Botswana',
    curriculum: 'BGCSE',
    subject: 'Mathematics',
    grade: 'Grade 10 / Year 10',
    format: 'Word',
    questions: 18,
    level: 'Exam prep',
    description: 'Functions, gradients, graph interpretation, and structured algebra questions for Botswana senior secondary learners.'
  },
  {
    id: 'botswana-jce-science-cells',
    title: 'JCE Integrated Science Cell Structure',
    country: 'Botswana',
    curriculum: 'JCE',
    subject: 'Biology',
    grade: 'Grade 9 / Year 9',
    format: 'PDF',
    questions: 14,
    level: 'Core',
    description: 'Cell structure, microscope diagrams, functions of organelles, and short-response practice.'
  },
  {
    id: 'caps-math-10-algebra',
    title: 'Algebra and Functions Practice Assessment',
    country: 'South Africa',
    curriculum: 'CAPS',
    subject: 'Mathematics',
    grade: 'Grade 10 / Year 10',
    format: 'Word',
    questions: 18,
    level: 'Core',
    description: 'Linear equations, simultaneous equations, functions, and interpretation questions.'
  },
  {
    id: 'ib-biology-dp-cells',
    title: 'Cell Biology Source-Based Assessment',
    country: 'International',
    curriculum: 'IB Diploma Programme',
    subject: 'Biology',
    grade: 'Year 13 / A Level / IB DP',
    format: 'PDF',
    questions: 14,
    level: 'Higher thinking',
    description: 'Data response, microscopy interpretation, and extended cell structure questions.'
  },
  {
    id: 'gcse-english-language-paper',
    title: 'Reading Comprehension and Creative Writing',
    country: 'United Kingdom',
    curriculum: 'GCSE',
    subject: 'English Language',
    grade: 'Grade 11 / Year 11',
    format: 'Word',
    questions: 9,
    level: 'Exam prep',
    description: 'A full language-style assessment with comprehension, analysis, and writing tasks.'
  },
  {
    id: 'common-core-statistics',
    title: 'Statistics and Probability Checkpoint',
    country: 'United States',
    curriculum: 'Common Core',
    subject: 'Statistics',
    grade: 'Grade 8 / Year 8',
    format: 'PDF',
    questions: 16,
    level: 'Mixed',
    description: 'Sampling, probability models, two-way tables, and short explanations.'
  },
  {
    id: 'cbse-physics-motion',
    title: 'Motion and Forces Assessment',
    country: 'India',
    curriculum: 'CBSE',
    subject: 'Physics',
    grade: 'Grade 9 / Year 9',
    format: 'Word',
    questions: 20,
    level: 'Core',
    description: 'Numerical questions, graph interpretation, and conceptual force explanations.'
  },
  {
    id: 'waec-economics-markets',
    title: 'Demand, Supply, and Market Structures',
    country: 'Nigeria',
    curriculum: 'WAEC',
    subject: 'Economics',
    grade: 'Grade 12 / Year 12',
    format: 'PDF',
    questions: 15,
    level: 'Exam prep',
    description: 'Structured short-answer and essay prompts for senior economics revision.'
  }
];

const intentLabels: Record<UploadIntent, string> = {
  'ai-help': 'Get AI help',
  'tutor-help': 'Share with tutor',
  'practice-match': 'Find similar assessments'
};

const sanitizePdfText = (value: string) =>
  value
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const createPdfBlob = (title: string, lines: string[]) => {
  const safeTitle = sanitizePdfText(title);
  const safeLines = lines.map(sanitizePdfText).slice(0, 26);
  const streamLines = [
    'BT',
    '/F1 18 Tf',
    '50 790 Td',
    `(${safeTitle}) Tj`,
    '/F1 11 Tf',
    ...safeLines.flatMap((line) => ['0 -20 Td', `(${line}) Tj`]),
    'ET'
  ];
  const stream = streamLines.join('\n');
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    `5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += object;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
};

const buildAssessmentMarkdown = (resource: AssessmentResource) => `# ${resource.title}

**Country:** ${resource.country}
**Curriculum:** ${resource.curriculum}
**Subject:** ${resource.subject}
**Grade:** ${resource.grade}
**Level:** ${resource.level}

## Instructions
Answer all questions. Show your working where calculations are required. Use full sentences for explanation questions.

## Questions
1. Define the key vocabulary for this topic.
2. Complete two short knowledge-check questions from your class notes.
3. Solve a multi-step problem and explain each step.
4. Interpret a table, graph, image, source, or extract linked to the topic.
5. Write one extended response that connects the topic to a real-world example.

## Reflection
List the two questions you found hardest and explain what help you need next.
`;

const buildPdfLines = (resource: AssessmentResource) => [
  `Country: ${resource.country}`,
  `Curriculum: ${resource.curriculum}`,
  `Subject: ${resource.subject}`,
  `Grade: ${resource.grade}`,
  `Level: ${resource.level}`,
  '',
  'Instructions: Answer all questions and show your working.',
  '1. Define the key vocabulary for this topic.',
  '2. Complete two short knowledge-check questions.',
  '3. Solve a multi-step problem and explain each step.',
  '4. Interpret a table, graph, image, source, or extract.',
  '5. Write one extended response with a real-world example.',
  'Reflection: List the two questions you found hardest.'
];

const AssessmentLibraryPage: React.FC = () => {
  const [country, setCountry] = useState('Botswana');
  const [curriculum, setCurriculum] = useState('BGCSE');
  const [subject, setSubject] = useState('Mathematics');
  const [grade, setGrade] = useState('Grade 10 / Year 10');
  const [intent, setIntent] = useState<UploadIntent>('ai-help');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formatFilter, setFormatFilter] = useState<'all' | FileFormat>('all');
  const [uploads, setUploads] = useState<UploadedAssessment[]>([]);

  const selectedCurricula = curriculumOptions.find((option) => option.country === country)?.curricula ?? curriculumOptions[0].curricula;

  const filteredResources = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return assessmentResources.filter((resource) => {
      const matchesSelection =
        resource.country === country ||
        resource.curriculum === curriculum ||
        resource.subject === subject ||
        resource.grade === grade;
      const matchesFormat = formatFilter === 'all' || resource.format === formatFilter;
      const matchesSearch = `${resource.title} ${resource.country} ${resource.curriculum} ${resource.subject} ${resource.grade}`
        .toLowerCase()
        .includes(search);

      return matchesSelection && matchesFormat && matchesSearch;
    });
  }, [country, curriculum, subject, grade, formatFilter, searchTerm]);

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextCountry = event.target.value;
    const nextCurricula = curriculumOptions.find((option) => option.country === nextCountry)?.curricula ?? [];
    setCountry(nextCountry);
    setCurriculum(nextCurricula[0] ?? '');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] ?? null);
  };

  const handleUpload = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) return;

    const nextUpload: UploadedAssessment = {
      id: `${selectedFile.name}-${Date.now()}`,
      fileName: selectedFile.name,
      country,
      curriculum,
      subject,
      grade,
      intent,
      uploadedAt: new Date().toLocaleString(),
      fileType: selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE'
    };

    setUploads((current) => [nextUpload, ...current]);
    setSelectedFile(null);
    event.currentTarget.reset();
  };

  const downloadAssessment = async (resource: AssessmentResource, format: FileFormat) => {
    const filenameBase = resource.title.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '');

    if (format === 'Word') {
      await downloadMarkdownAsDocx(buildAssessmentMarkdown(resource), `${filenameBase}.docx`, resource.title);
      return;
    }

    downloadBlob(createPdfBlob(resource.title, buildPdfLines(resource)), `${filenameBase}.pdf`);
  };

  return (
    <StudentLayout activePage="assessment-library">
      <div className="mb-6 animate-slide-up flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <FileText className="w-8 h-8 text-greyed-blue" />
            Assessment Library
          </h1>
          <p className="text-greyed-navy/75 mt-1 font-medium">
            Upload PDF or Word assessments for help, then find another assessment by country, curriculum, subject, and grade.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:w-auto">
          <div className="rounded-xl bg-white border border-greyed-navy/10 px-4 py-3 shadow-sm">
            <p className="text-xs font-bold text-greyed-navy/55">Countries</p>
            <p className="text-xl font-headline font-bold text-greyed-navy">{curriculumOptions.length}</p>
          </div>
          <div className="rounded-xl bg-white border border-greyed-navy/10 px-4 py-3 shadow-sm">
            <p className="text-xs font-bold text-greyed-navy/55">Subjects</p>
            <p className="text-xl font-headline font-bold text-greyed-navy">{globalSubjects.length}</p>
          </div>
          <div className="rounded-xl bg-white border border-greyed-navy/10 px-4 py-3 shadow-sm">
            <p className="text-xs font-bold text-greyed-navy/55">Uploads</p>
            <p className="text-xl font-headline font-bold text-greyed-navy">{uploads.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.35fr] gap-6">
        <div className="space-y-6">
          <form onSubmit={handleUpload} className="bg-white rounded-2xl shadow-sm border border-greyed-navy/5 overflow-hidden animate-slide-up" style={{ animationDelay: '50ms' }}>
            <div className="p-5 border-b border-greyed-navy/10 bg-greyed-white/50">
              <h2 className="font-headline font-bold text-xl text-greyed-navy flex items-center gap-2">
                <Upload className="w-5 h-5 text-greyed-blue" />
                Upload assessment for help
              </h2>
              <p className="mt-1 text-sm text-greyed-navy/65">
                Share PDFs, Word documents, exam papers, worksheets, rubrics, or marked scripts.
              </p>
            </div>

            <div className="p-5 space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-greyed-navy">Assessment file</span>
                <div className="mt-2 rounded-xl border-2 border-dashed border-greyed-blue/70 bg-greyed-blue/10 p-5 text-center">
                  <Upload className="mx-auto mb-3 h-8 w-8 text-greyed-navy" />
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="mx-auto block w-full max-w-xs text-sm text-greyed-navy file:mr-3 file:rounded-lg file:border-0 file:bg-greyed-navy file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                  <p className="mt-3 text-xs font-semibold text-greyed-navy/60">
                    PDF, DOC, or DOCX supported
                  </p>
                  {selectedFile && (
                    <p className="mt-2 text-sm font-bold text-greyed-navy">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-bold text-greyed-navy">Country</span>
                  <select value={country} onChange={handleCountryChange} className="mt-2 w-full rounded-xl border border-greyed-navy/10 bg-white px-3 py-3 text-sm text-greyed-navy focus:outline-none focus:border-greyed-blue">
                    {curriculumOptions.map((option) => (
                      <option key={option.country} value={option.country}>{option.country}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-greyed-navy">Curriculum</span>
                  <select value={curriculum} onChange={(event) => setCurriculum(event.target.value)} className="mt-2 w-full rounded-xl border border-greyed-navy/10 bg-white px-3 py-3 text-sm text-greyed-navy focus:outline-none focus:border-greyed-blue">
                    {selectedCurricula.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-greyed-navy">Subject</span>
                  <select value={subject} onChange={(event) => setSubject(event.target.value)} className="mt-2 w-full rounded-xl border border-greyed-navy/10 bg-white px-3 py-3 text-sm text-greyed-navy focus:outline-none focus:border-greyed-blue">
                    {globalSubjects.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-greyed-navy">Grade</span>
                  <select value={grade} onChange={(event) => setGrade(event.target.value)} className="mt-2 w-full rounded-xl border border-greyed-navy/10 bg-white px-3 py-3 text-sm text-greyed-navy focus:outline-none focus:border-greyed-blue">
                    {gradeOptions.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>

              <fieldset>
                <legend className="text-sm font-bold text-greyed-navy">What do you need?</legend>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {([
                    { id: 'ai-help', label: 'AI help', icon: HelpCircle },
                    { id: 'tutor-help', label: 'Tutor help', icon: BookOpen },
                    { id: 'practice-match', label: 'Similar paper', icon: FileDown }
                  ] as { id: UploadIntent; label: string; icon: typeof HelpCircle }[]).map((option) => {
                    const Icon = option.icon;
                    const isSelected = intent === option.id;

                    return (
                      <label
                        key={option.id}
                        className={`cursor-pointer rounded-xl border p-3 text-sm font-bold transition-colors focus-within:ring-2 focus-within:ring-greyed-blue ${
                          isSelected ? 'border-greyed-navy bg-greyed-navy text-white' : 'border-greyed-navy/10 bg-white text-greyed-navy hover:border-greyed-blue'
                        }`}
                      >
                        <input
                          type="radio"
                          name="assessment-intent"
                          value={option.id}
                          checked={isSelected}
                          onChange={() => setIntent(option.id)}
                          className="sr-only"
                        />
                        <span className="flex items-center gap-2">
                          <Icon className={isSelected ? 'text-greyed-blue' : 'text-greyed-navy'} size={18} />
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={!selectedFile}
                className={`w-full rounded-xl px-4 py-3 font-bold transition-colors ${
                  selectedFile
                    ? 'bg-greyed-navy text-white hover:bg-[#2a2f6e]'
                    : 'bg-greyed-navy/10 text-greyed-navy/40 cursor-not-allowed'
                }`}
              >
                Share assessment
              </button>
            </div>
          </form>

          <div className="bg-white rounded-2xl shadow-sm border border-greyed-navy/5 overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="p-5 border-b border-greyed-navy/10 bg-greyed-white/50">
              <h2 className="font-headline font-bold text-xl text-greyed-navy flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-greyed-blue" />
                Shared assessments
              </h2>
            </div>
            <div className="divide-y divide-greyed-navy/5">
              {uploads.length === 0 ? (
                <div className="p-5 text-sm text-greyed-navy/65">
                  Uploaded assessments will appear here with their country, curriculum, subject, and grade.
                </div>
              ) : (
                uploads.map((upload) => (
                  <div key={upload.id} className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-greyed-blue/20 text-greyed-navy flex items-center justify-center flex-shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-greyed-navy truncate">{upload.fileName}</h3>
                        <p className="mt-1 text-xs font-semibold text-greyed-navy/55">
                          {upload.fileType} • {upload.country} • {upload.curriculum}
                        </p>
                        <p className="mt-1 text-sm text-greyed-navy/70">
                          {upload.subject}, {upload.grade} • {intentLabels[upload.intent]}
                        </p>
                        <p className="mt-2 text-xs text-greyed-navy/50">Shared {upload.uploadedAt}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-greyed-navy/5 overflow-hidden animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="p-5 border-b border-greyed-navy/10 bg-greyed-white/50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="font-headline font-bold text-xl text-greyed-navy flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-greyed-blue" />
                  Download another assessment
                </h2>
                <p className="mt-1 text-sm text-greyed-navy/65">
                  Browse a global starter bank filtered by your selected country, curriculum, subject, or grade.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-greyed-navy/40" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search global assessments..."
                    className="w-full sm:w-64 pl-9 pr-3 py-2.5 rounded-xl border border-greyed-navy/10 text-sm text-greyed-navy focus:outline-none focus:border-greyed-blue"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-greyed-navy/40" />
                  <select
                    value={formatFilter}
                    onChange={(event) => setFormatFilter(event.target.value as 'all' | FileFormat)}
                    className="w-full sm:w-36 pl-9 pr-3 py-2.5 rounded-xl border border-greyed-navy/10 text-sm text-greyed-navy focus:outline-none focus:border-greyed-blue"
                  >
                    <option value="all">All files</option>
                    <option value="PDF">PDF</option>
                    <option value="Word">Word</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredResources.map((resource) => (
              <article key={resource.id} className="rounded-2xl border border-greyed-navy/10 bg-white p-5 shadow-sm hover:border-greyed-blue/60 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-greyed-blue">{resource.curriculum}</p>
                    <h3 className="mt-1 font-headline font-bold text-lg text-greyed-navy">{resource.title}</h3>
                  </div>
                  <span className="rounded-lg bg-greyed-navy/5 px-2.5 py-1 text-xs font-bold text-greyed-navy">{resource.format}</span>
                </div>
                <p className="mt-3 text-sm text-greyed-navy/70">{resource.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-greyed-navy/65">
                  <span className="rounded-lg bg-greyed-white px-2 py-1">{resource.country}</span>
                  <span className="rounded-lg bg-greyed-white px-2 py-1">{resource.subject}</span>
                  <span className="rounded-lg bg-greyed-white px-2 py-1">{resource.grade}</span>
                  <span className="rounded-lg bg-greyed-white px-2 py-1">{resource.questions} questions</span>
                  <span className="rounded-lg bg-greyed-white px-2 py-1">{resource.level}</span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => downloadAssessment(resource, 'Word')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-greyed-navy px-3 py-2.5 text-sm font-bold text-white hover:bg-[#2a2f6e]"
                  >
                    <Download size={16} />
                    Word
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadAssessment(resource, 'PDF')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-greyed-navy/10 bg-greyed-white px-3 py-2.5 text-sm font-bold text-greyed-navy hover:border-greyed-blue"
                  >
                    <Download size={16} />
                    PDF
                  </button>
                </div>
              </article>
            ))}

            {filteredResources.length === 0 && (
              <div className="lg:col-span-2 rounded-2xl border border-dashed border-greyed-navy/20 bg-greyed-white/60 p-8 text-center">
                <Globe2 className="mx-auto mb-3 h-8 w-8 text-greyed-blue" />
                <h3 className="font-headline font-bold text-greyed-navy">No assessment found for this exact filter</h3>
                <p className="mt-2 text-sm text-greyed-navy/65">
                  Try a broader search, switch file type to all files, or change the selected country, curriculum, subject, or grade.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </StudentLayout>
  );
};

export default AssessmentLibraryPage;
