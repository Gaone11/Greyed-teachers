import React, { createContext, useState, useContext, ReactNode } from 'react';

type Role = 'student' | 'teacher' | null;

interface RoleSelectionContextType {
  isOpen: boolean;
  selectedRole: Role;
  showTeacherSignup: boolean;
  showLoginModal: boolean;
  openRoleSelection: (callback?: () => void) => void;
  closeRoleSelection: () => void;
  selectRole: (role: Role) => void;
  currentCallback: (() => void) | null;
  openTeacherSignup: () => void;
  closeTeacherSignup: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const RoleSelectionContext = createContext<RoleSelectionContextType>({
  isOpen: false,
  selectedRole: null,
  showTeacherSignup: false,
  showLoginModal: false,
  openRoleSelection: () => {},
  closeRoleSelection: () => {},
  selectRole: () => {},
  currentCallback: null,
  openTeacherSignup: () => {},
  closeTeacherSignup: () => {},
  openLoginModal: () => {},
  closeLoginModal: () => {},
});

export const useRoleSelection = () => useContext(RoleSelectionContext);

interface RoleSelectionProviderProps {
  children: ReactNode;
}

export const RoleSelectionProvider: React.FC<RoleSelectionProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [showTeacherSignup, setShowTeacherSignup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentCallback, setCurrentCallback] = useState<(() => void) | null>(null);

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  const openRoleSelection = (callback?: () => void) => {
    // Instead of showing the role selection, directly open teacher signup
    setIsOpen(false);
    setShowTeacherSignup(true);
    
    if (callback) {
      setCurrentCallback(() => callback);
    }
  };

  const closeRoleSelection = () => {
    setIsOpen(false);
    setCurrentCallback(null);
  };

  const openTeacherSignup = () => {
    setShowTeacherSignup(true);
    setIsOpen(false);
  };

  const closeTeacherSignup = () => {
    setShowTeacherSignup(false);
  };

  const selectRole = (role: Role) => {
    setSelectedRole(role);
    setIsOpen(false);
    
    // Always open teacher signup regardless of selected role
    if (role === 'student' || role === 'teacher' || role === null) {
      openTeacherSignup();
    }
  };

  return (
    <RoleSelectionContext.Provider 
      value={{
        isOpen,
        selectedRole,
        showTeacherSignup,
        showLoginModal,
        openRoleSelection,
        closeRoleSelection,
        selectRole,
        currentCallback,
        openTeacherSignup,
        closeTeacherSignup,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </RoleSelectionContext.Provider>
  );
};