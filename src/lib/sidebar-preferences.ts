export type SidebarHub = 'teacher' | 'student' | 'parent';

const collapsedKeys: Record<SidebarHub, string> = {
  teacher: 'teacherSidebarCollapsed',
  student: 'studentSidebarCollapsed',
  parent: 'parentSidebarCollapsed',
};

const userSetKeys: Record<SidebarHub, string> = {
  teacher: 'teacherSidebarCollapsedUserSet',
  student: 'studentSidebarCollapsedUserSet',
  parent: 'parentSidebarCollapsedUserSet',
};

export function getSidebarCollapsedPreference(hub: SidebarHub): boolean {
  if (typeof window === 'undefined') return false;

  const userChoseCollapsedState = window.localStorage.getItem(userSetKeys[hub]) === 'true';
  if (!userChoseCollapsedState) return false;

  return window.localStorage.getItem(collapsedKeys[hub]) === 'true';
}

export function setSidebarCollapsedPreference(hub: SidebarHub, collapsed: boolean): void {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(collapsedKeys[hub], String(collapsed));
  window.localStorage.setItem(userSetKeys[hub], 'true');
}
