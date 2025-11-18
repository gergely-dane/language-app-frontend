"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { createContext, ReactNode, useContext, useState } from "react";

type AlertState = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  open: boolean;
};

type AlertContextProps = {
  showAlert: (options: Omit<AlertState, "open">) => void;
};

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertState>({
    title: "",
    description: "",
    variant: "default",
    open: false,
  });

  const [visible, setVisible] = useState(false);

  const showAlert = (options: Omit<AlertState, "open">) => {
    setAlert({ ...options, open: true });
    setVisible(true);

    setTimeout(() => {
      setVisible(false);
    }, 2500);

    setTimeout(() => {
      setAlert((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert.open && (
        <div
          className={`fixed bottom-6 right-6 z-50 transition-opacity duration-700 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <Alert variant={alert.variant}>
            {alert.variant === "default" ? (
              <IconCircleCheck className="text-[var(--success)]" />
            ) : (
              <IconCircleX className="text-destructive" />
            )}
            <AlertTitle>{alert.title}</AlertTitle>
            {alert.description && (
              <AlertDescription>{alert.description}</AlertDescription>
            )}
          </Alert>
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }

  return context;
};
