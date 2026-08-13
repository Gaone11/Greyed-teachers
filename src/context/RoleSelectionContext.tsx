import React, { createContext, useState, useContext, ReactNode } from 'react';

type Role = 'student' | 'teacher' | 'parent' | null;
type ActionType = 'login' | 'signup' | null;

interface RoleSelectionContextType {
  isOpen: boolean;
  selectedRole: Role;
  actionType: ActionType;
  showSignupModal: boolean;
  showLoginModal: boolean;
  openRoleSelection: (action?: ActionType, callback?: () => void) => void;
  closeRoleSelection: () => void;
  selectRole: (role: Role) => void;
  currentCallback: (() => void) | null;
  openTeacherSignup: () => void;
  openSignupModal: () => void;
  closeSignupModal: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const RoleSelectionContext = createContext<RoleSelectionContextType>({
  isOpen: false,
  selectedRole: null,
  actionType: null,
  showSignupModal: false,
  showLoginModal: false,
  openRoleSelection: () => {},
  closeRoleSelection: () => {},
  selectRole: () => {},
  currentCallback: null,
  openTeacherSignup: () => {},
  openSignupModal: () => {},
  closeSignupModal: () => {},
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
  const [actionType, setActionType] = useState<ActionType>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentCallback, setCurrentCallback] = useState<(() => void) | null>(null);

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  const openRoleSelection = (action: ActionType = 'signup', callback?: () => void) => {
    // Show the role selection modal
    setActionType(action);
    setIsOpen(true);
    
    if (callback) {
      setCurrentCallback(() => callback);
    }
  };

  const closeRoleSelection = () => {
    setIsOpen(false);
    setActionType(null);
    setCurrentCallback(null);
  };

  const openSignupModal = () => {
    setShowSignupModal(true);
    setIsOpen(false);
  };

  const openTeacherSignup = () => {
    setSelectedRole('teacher');
    setShowSignupModal(true);
    setIsOpen(false);
  };

  const closeSignupModal = () => {
    setShowSignupModal(false);
  };

  const selectRole = (role: Role) => {
    setSelectedRole(role);
    setIsOpen(false);
    
    // Open the appropriate modal based on action type
    if (actionType === 'login') {
      openLoginModal();
    } else {
      openSignupModal();
    }
  };

  return (
    <RoleSelectionContext.Provider 
      value={{
        isOpen,
        selectedRole,
        actionType,
        showSignupModal,
        showLoginModal,
        openRoleSelection,
        closeRoleSelection,
        selectRole,
        currentCallback,
        openTeacherSignup,
        openSignupModal,
        closeSignupModal,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </RoleSelectionContext.Provider>
  );
};
