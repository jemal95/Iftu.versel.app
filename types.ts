
export enum EducationLevel {
  SECONDARY = 'Secondary (Grades 9-12)',
  TVET = 'TVET College'
}

export enum Grade {
  G9 = 'Grade 9',
  G10 = 'Grade 10',
  G11 = 'Grade 11',
  G12 = 'Grade 12',
  TVET_LEVEL_1 = 'TVET Level 1',
  TVET_LEVEL_2 = 'TVET Level 2',
  TVET_LEVEL_3 = 'TVET Level 3',
  TVET_LEVEL_4 = 'TVET Level 4'
}

export enum Stream {
  GENERAL = 'General',
  NATURAL_SCIENCE = 'Natural Science',
  SOCIAL_SCIENCE = 'Social Science'
}

export type ExamType = 'mid' | 'final' | 'mock-eaes';
export type Language = 'en' | 'am' | 'om';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string;
  type: 'video' | 'reading' | 'quiz'; 
  contentType: 'video' | 'reading' | 'quiz' | 'assignment';
  videoUrl?: string;
  pdfUrl?: string;
  isCompleted?: boolean;
  questions?: Question[];
}

export interface Course {
  id: string;
  title: string;
  code: string;
  grade: Grade;
  stream: Stream;
  level: EducationLevel;
  thumbnail: string;
  description: string;
  lessons: Lesson[];
  instructor: string;
  instructorId?: string;
  instructorEmail?: string;
  instructorPhoto?: string;
  subject: string;
  enrolledStudents?: number;
  prerequisites?: string[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  points: number;
  category: string;
}

export interface Exam {
  id: string;
  title: string;
  courseCode: string;
  grade: Grade;
  stream: Stream;
  academicYear: number;
  durationMinutes: number;
  questions: Question[];
  categories?: string[];
  totalPoints: number;
  status: 'draft' | 'published' | 'closed';
  type: ExamType;
  semester: 1 | 2;
  subject: string;
}

export interface News {
  id: string;
  date: string;
  tag: string;
  title: string;
  summary: string;
  content: string;
  image: string;
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  earnedAt: string;
}

export interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  grade?: Grade;
  stream?: Stream;
  level?: EducationLevel;
  points: number;
  status: 'active' | 'pending' | 'suspended';
  email: string;
  joinedDate: string;
  nid?: string; // National ID
  gender?: 'Male' | 'Female' | 'Other';
  dob?: string;
  salary?: number; // Teacher Salary or Student Stipend
  photo?: string;
  department?: string;
  subjects?: string[]; 
  phoneNumber?: string;
  address?: string;
  preferredLanguage: Language;
  badges: Badge[];
  school?: string;
  completedLessons?: string[];
  completedExams?: string[];
  completedCourses?: string[];
  certificatesPaid?: string[];
}

export interface ExamResult {
  examId: string;
  studentId: string;
  score: number;
  totalPoints: number;
  completedAt: string;
  timeSpentSeconds: number;
  answers: Record<string, number>;
  categoryBreakdown: Record<string, { correct: number; total: number }>;
}
