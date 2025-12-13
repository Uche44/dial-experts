"use client";

import { createContext, useContext, useState } from "react";
import { Expert } from "@/lib/types";


interface ExpertsContextType {
    experts: Expert[];
    setExperts: (experts: Expert[]) => void;
}


const ExpertsContext = createContext<ExpertsContextType | null>(null);

const ExpertsProvider = ({ children }: { children: React.ReactNode }) => {
    const [experts, setExperts] = useState<Expert[]>([]);
   
    return (
        <ExpertsContext.Provider value={{ experts, setExperts }}>
            {children}
        </ExpertsContext.Provider>
    );
};

export default ExpertsProvider;

export const useExperts = () => {
    const context = useContext(ExpertsContext);
    if (!context) {
        throw new Error("useExperts must be used within an ExpertsProvider");
    }
    return context;
};