"use client";

import React, { createContext, useContext, useState } from "react";

interface SignUpModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const SignUpModalContext = createContext<SignUpModalContextType | undefined>(
  undefined
);

export function SignUpModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <SignUpModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </SignUpModalContext.Provider>
  );
}

export function useSignUpModal() {
  const context = useContext(SignUpModalContext);
  if (!context)
    throw new Error("useSignUpModal must be used within SignUpModalProvider");
  return context;
}
