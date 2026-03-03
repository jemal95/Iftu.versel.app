
import { Course, Grade, EducationLevel, Exam, Stream } from './types';

const getThumb = (subject: string, id: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=400&sig=${subject}`;

const CURRENT_YEAR = new Date().getFullYear();

export const NATIONAL_CENTER_INFO = {
  name: "IFTU National Digital Sovereign Education Center",
  shortName: "IFTU NDC",
  location: "Menelik II Square, Addis Ababa, Ethiopia",
  coordinates: { lat: 9.0336, lng: 38.7615 },
  mapsLink: "https://goo.gl/maps/KcLgTHsz6WKtSeda7/",
  authorizedBy: "Jemal Fano Haji"
};

export const MOCK_COURSES: Course[] = [
  { 
    id: 'g11-phys-core', 
    title: 'Grade 11 Core Physics', 
    code: 'PHYS-G11-C', 
    grade: Grade.G11, 
    stream: Stream.NATURAL_SCIENCE, 
    level: EducationLevel.SECONDARY, 
    thumbnail: getThumb('physics', 1532094349884), 
    description: 'Foundational mechanics and thermodynamics required for advanced studies.', 
    instructor: 'Dr. Tesfaye', 
    instructorEmail: 'dr.tesfaye@iftu.edu.et', 
    subject: 'Physics', 
    lessons: [
      { id: 'p11-l1', title: 'Kinematics', duration: '20m', content: 'Linear motion basics.', type: 'video', contentType: 'video', videoUrl: 'https://www.youtube.com/watch?v=5UfG_5iK_N8' }
    ]
  },
  { 
    id: 'g12-phys-adv', 
    title: 'Grade 12 Advanced Physics', 
    code: 'PHYS-G12-A', 
    grade: Grade.G12, 
    stream: Stream.NATURAL_SCIENCE, 
    level: EducationLevel.SECONDARY, 
    thumbnail: getThumb('quantum', 1451810166861), 
    description: 'Quantum mechanics and electromagnetism. Requires Core Physics mastery.', 
    instructor: 'Dr. Tesfaye', 
    instructorEmail: 'dr.tesfaye@iftu.edu.et', 
    subject: 'Physics', 
    prerequisites: ['g11-phys-core'],
    lessons: [
      { id: 'p12-l1', title: 'Quantum Duality', duration: '45m', content: 'Advanced wave-particle duality.', type: 'reading', contentType: 'reading', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ]
  },
  { 
    id: 'tvet-auto-l3', 
    title: 'Automotive Systems L3', 
    code: 'AUTO-L3', 
    grade: Grade.TVET_LEVEL_3, 
    stream: Stream.GENERAL, 
    level: EducationLevel.TVET, 
    thumbnail: getThumb('car', 1511919884224), 
    description: 'Advanced engine diagnostics and hybrid systems. Includes Live Oral Assessment.', 
    instructor: 'Kebede J.', 
    instructorEmail: 'kebede.j@iftu.edu.et', 
    subject: 'Automotive', 
    lessons: [
      { id: 'auto-l3-oral', title: 'Technical Interview: Hybrid Safety', duration: '15m', content: 'You will participate in a live oral examination with an AI Auditor regarding High-Voltage safety protocols.', type: 'quiz', contentType: 'quiz' }
    ] 
  }
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'exam-math-g9',
    title: 'Grade 9 Mathematics Mock',
    courseCode: 'MATH-G9',
    grade: Grade.G9,
    stream: Stream.GENERAL,
    academicYear: CURRENT_YEAR,
    durationMinutes: 60,
    totalPoints: 20,
    status: 'published',
    type: 'mock-eaes',
    semester: 1,
    subject: 'Mathematics',
    categories: ['Algebra', 'Geometry'],
    questions: [
      { id: 'q9m1', text: 'Solve for x: 3x - 12 = 0.', options: ['2', '3', '4', '6'], correctAnswer: 2, points: 10, category: 'Algebra' },
      { id: 'q9m2', text: 'Which is a prime number?', options: ['4', '9', '13', '15'], correctAnswer: 2, points: 10, category: 'Algebra' }
    ]
  }
];

export const MOCK_NEWS = [
  { id: 'n1', date: `Feb 22, ${CURRENT_YEAR}`, tag: 'Infrastructure', title: 'IFTU National Server Cluster Upgraded', summary: 'Improved latency for remote proctoring.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=600', content: 'The upgrade ensures stable connections for students in all regions.' }
];

export const SUMMER_STATS = [
  { label: 'Active Learners', value: '450K+', color: '#3b82f6', icon: '👤' },
  { label: 'Modules Completed', value: '1.2M', color: '#009b44', icon: '✅' },
  { label: 'System Uptime', value: '99.9%', color: '#ffcd00', icon: '⚡' },
  { label: 'Exam Integrity', value: '100%', color: '#ef3340', icon: '🛡️' }
];

export const SUMMER_ACTIVITIES = [
  { title: 'STEM Innovation Fair', date: 'August 15', desc: 'National exhibition of student projects.', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600', tag: 'Innovation' },
  { title: 'Digital Bootcamps', date: 'July - Aug', desc: 'Coding and engineering for TVET.', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600', tag: 'Skills' }
];
