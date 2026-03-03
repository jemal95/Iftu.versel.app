
import { supabase } from './supabaseClient';
import { User, ExamResult, Course } from '../types';

export const dbService = {
  // SYNC USER DATA
  async syncUser(user: User) {
    const { data, error } = await supabase
      .from('users')
      .upsert({ 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        points: user.points,
        role: user.role,
        grade: user.grade,
        stream: user.stream,
        completed_lessons: user.completedLessons,
        last_sync: new Date().toISOString()
      });
    if (error) console.warn("Supabase Sync Warning:", error.message);
    return data;
  },

  // FETCH USERS (LEADERBOARD)
  async fetchTopStudents() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('points', { ascending: false })
      .limit(10);
    return error ? [] : data;
  },

  // SYNC EXAM RESULTS
  async saveExamResult(result: ExamResult) {
    const { data, error } = await supabase
      .from('exam_results')
      .insert({
        exam_id: result.examId,
        student_id: result.studentId,
        score: result.score,
        total_points: result.totalPoints,
        category_breakdown: result.categoryBreakdown,
        time_spent: result.timeSpentSeconds,
        completed_at: result.completedAt
      });
    if (error) console.warn("Result Persistence Error:", error.message);
    return data;
  },

  // FETCH PERFORMANCE HISTORY
  async fetchResults(userId: string) {
    const { data, error } = await supabase
      .from('exam_results')
      .select('*')
      .eq('student_id', userId);
    return error ? [] : data;
  }
};
