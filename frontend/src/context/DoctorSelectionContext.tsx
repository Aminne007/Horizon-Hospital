import React, { createContext, useContext, useMemo, useState } from "react";

type DoctorSelectionContextValue = {
  selectedDoctor: string;
  setSelectedDoctor: (name: string) => void;
};

const DoctorSelectionContext = createContext<DoctorSelectionContextValue>({
  selectedDoctor: "",
  setSelectedDoctor: () => {},
});

export const DoctorSelectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const value = useMemo(
    () => ({
      selectedDoctor,
      setSelectedDoctor,
    }),
    [selectedDoctor]
  );

  return <DoctorSelectionContext.Provider value={value}>{children}</DoctorSelectionContext.Provider>;
};

export const useDoctorSelection = () => {
  return useContext(DoctorSelectionContext);
};
