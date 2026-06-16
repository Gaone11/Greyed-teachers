import React from 'react';
import StudentLayout from '../../components/students/StudentLayout';
import { 
  Award, 
  CheckCircle, 
  BookOpen, 
  Flame, 
  TrendingUp, 
  Users,
  Lock
} from 'lucide-react';

const AchievementsPage: React.FC = () => {
  const categories = [
    {
      id: 'attendance',
      title: 'Attendance',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-700 border-green-200',
      badges: [
        { id: 1, title: 'Early Bird', description: 'Arrive early to 5 classes', earned: true, date: 'Oct 1' },
        { id: 2, title: 'Perfect Month', description: '100% attendance in September', earned: true, date: 'Oct 1' },
        { id: 3, title: 'Iron Student', description: '100% attendance for a semester', earned: false, progress: '45/90 days' },
      ]
    },
    {
      id: 'homework',
      title: 'Homework Completion',
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      badges: [
        { id: 4, title: 'First Submission', description: 'Submit your first assignment', earned: true, date: 'Sep 5' },
        { id: 5, title: 'On Time Streak', description: 'Submit 10 assignments before the deadline', earned: true, date: 'Oct 10' },
        { id: 6, title: 'Homework Hero', description: 'Submit 50 assignments on time', earned: false, progress: '24/50' },
      ]
    },
    {
      id: 'grades',
      title: 'Good Grades',
      icon: Award,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      badges: [
        { id: 7, title: 'A+ Ace', description: 'Score an A+ on a major exam', earned: true, date: 'Oct 15' },
        { id: 8, title: 'Top of the Class', description: 'Score the highest grade in a quiz', earned: false, progress: 'Keep trying!' },
        { id: 9, title: 'Honor Roll', description: 'Maintain a 3.8 GPA for a term', earned: false, progress: 'GPA: 3.8 (In Progress)' },
      ]
    },
    {
      id: 'streaks',
      title: 'Reading Streaks',
      icon: Flame,
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      badges: [
        { id: 10, title: 'Bookworm (7 Days)', description: 'Read for 7 consecutive days', earned: true, date: 'Sep 14' },
        { id: 11, title: 'Scholar (30 Days)', description: 'Read for 30 consecutive days', earned: false, progress: '12/30 days' },
      ]
    },
    {
      id: 'participation',
      title: 'Participation',
      icon: Users,
      color: 'bg-pink-100 text-pink-700 border-pink-200',
      badges: [
        { id: 12, title: 'Hand Raiser', description: 'Participate 10 times in a week', earned: true, date: 'Sep 20' },
        { id: 13, title: 'Team Player', description: 'Help a peer in a group project', earned: true, date: 'Oct 5' },
      ]
    },
    {
      id: 'improvement',
      title: 'Improvement Milestones',
      icon: TrendingUp,
      color: 'bg-teal-100 text-teal-700 border-teal-200',
      badges: [
        { id: 14, title: 'Comeback Kid', description: 'Improve a grade by 2 letter levels', earned: false, progress: '0/1' },
        { id: 15, title: 'Steady Growth', description: 'Show improvement in 3 consecutive tests', earned: true, date: 'Oct 12' },
      ]
    }
  ];

  return (
    <StudentLayout activePage="achievements">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <Award className="w-8 h-8 text-greyed-blue" />
            Achievement System
          </h1>
          <p className="text-greyed-beige/70 mt-1">Unlock badges, build streaks, and celebrate your wins!</p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-sm">
          <Award className="w-5 h-5 text-yellow-600" />
          <span>Total Badges: <span className="text-xl">9</span></span>
        </div>
      </div>

      <div className="space-y-8 pb-10">
        {categories.map((category, index) => {
          const CategoryIcon = category.icon;
          return (
            <div key={category.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${category.color}`}>
                  <CategoryIcon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-greyed-navy font-headline">{category.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.badges.map((badge) => (
                  <div 
                    key={badge.id} 
                    className={`relative p-5 rounded-2xl border transition-all ${
                      badge.earned 
                        ? 'bg-white border-greyed-navy/10 shadow-sm hover:shadow-md hover:border-greyed-blue/30' 
                        : 'bg-greyed-navy/5 border-greyed-navy/10 grayscale-[50%] opacity-80'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-full flex flex-shrink-0 items-center justify-center shadow-inner border-2 ${
                        badge.earned ? category.color : 'bg-greyed-navy/10 text-greyed-navy/40 border-greyed-navy/20'
                      }`}>
                        {badge.earned ? <CategoryIcon className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className={`font-bold text-sm mb-1 ${badge.earned ? 'text-greyed-navy' : 'text-greyed-navy/60'}`}>
                          {badge.title}
                        </h3>
                        <p className="text-xs text-greyed-navy/60 line-clamp-2 mb-2">
                          {badge.description}
                        </p>
                        {badge.earned ? (
                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                            Earned on {badge.date}
                          </span>
                        ) : (
                          <div className="w-full">
                            <span className="text-[10px] font-bold text-greyed-navy/50 block mb-1">{badge.progress}</span>
                            {badge.progress.includes('/') && (
                              <div className="w-full h-1.5 bg-greyed-navy/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-greyed-navy/30 rounded-full" 
                                  style={{ 
                                    width: `${(parseInt(badge.progress.split('/')[0]) / parseInt(badge.progress.split('/')[1].split(' ')[0])) * 100}%` 
                                  }}
                                ></div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Confetti or Sparkle decoration for earned badges */}
                    {badge.earned && (
                      <div className="absolute -top-1 -right-1">
                        <svg className="w-6 h-6 text-yellow-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </StudentLayout>
  );
};

export default AchievementsPage;
