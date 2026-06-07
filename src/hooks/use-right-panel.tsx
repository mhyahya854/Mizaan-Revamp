/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

type RightPanelContextType = {
  isRightPanelOpen: boolean;
  setIsRightPanelOpen: (open: boolean) => void;
  toggleRightPanel: () => void;
};

const RightPanelContext = createContext<RightPanelContextType | undefined>(undefined);

export function RightPanelProvider({ children }: { children: React.ReactNode }) {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mizaan-right-panel-open");
      return stored !== "false"; // Default to true if not explicitly set to false
    }
    return true;
  });

  const toggleRightPanel = () => {
    setIsRightPanelOpen((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("mizaan-right-panel-open", String(next));
      }
      return next;
    });
  };

  const handleSetOpen = (open: boolean) => {
    setIsRightPanelOpen(open);
    if (typeof window !== "undefined") {
      localStorage.setItem("mizaan-right-panel-open", String(open));
    }
  };

  return (
    <RightPanelContext.Provider
      value={{
        isRightPanelOpen,
        setIsRightPanelOpen: handleSetOpen,
        toggleRightPanel,
      }}
    >
      {children}
    </RightPanelContext.Provider>
  );
}

export function useRightPanel() {
  const context = useContext(RightPanelContext);
  if (!context) {
    throw new Error("useRightPanel must be used within a RightPanelProvider");
  }
  return context;
}
