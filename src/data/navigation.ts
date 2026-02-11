import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  GraduationCap,
  Snowflake,
  Sparkles,
  LucideIcon,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  special?: boolean;
}

/**
 * Single source of truth for teacher sidebar + mobile bottom nav items.
 * Settings and Logout are handled separately in the sidebar component.
 */
export const teacherNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/teachers/dashboard',
  },
  {
    id: 'classes',
    label: 'Classes',
    icon: Users,
    path: '/teachers/classes',
  },
  {
    id: 'lesson-planner',
    label: 'Lesson Planner',
    icon: BookOpen,
    path: '/teachers/lesson-planner',
  },
  {
    id: 'assessments',
    label: 'Assessments',
    icon: FileText,
    path: '/teachers/assessments',
  },
  {
    id: 'families',
    label: 'Family Updates',
    icon: MessageSquare,
    path: '/teachers/families',
  },
  {
    id: 'courses',
    label: 'Courses',
    icon: GraduationCap,
    path: '/teachers/courses',
  },
  {
    id: 'el-ai',
    label: 'Siyafunda AI',
    icon: Snowflake,
    path: '/teachers/el-ai',
    special: true,
  },
  {
    id: 'grey-ed-ta',
    label: 'Teaching Assistant',
    icon: Sparkles,
    path: '/teachers/grey-ed-ta',
    special: true,
  },
];

/** Items shown in mobile bottom nav (subset of full nav) */
export const mobileBottomNavItems: NavItem[] = [
  teacherNavItems[0], // Dashboard
  teacherNavItems[1], // Classes
  teacherNavItems[6], // Siyafunda AI
  teacherNavItems[2], // Lesson Planner
];
