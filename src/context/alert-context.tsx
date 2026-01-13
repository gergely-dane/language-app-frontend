"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type AlertState = {
  title: string;
  message?: string;
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
    message: "",
    variant: "default",
    open: false,
  });

  const [visible, setVisible] = useState(false);

  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showAlert = useCallback((options: Omit<AlertState, "open">) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    setAlert({ ...options, open: true });
    setVisible(true);

    hideTimeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, 2500);

    closeTimeoutRef.current = setTimeout(() => {
      setAlert((prev) => ({ ...prev, open: false }));
    }, 3000);
  }, []);

  const value = useMemo(() => ({ showAlert }), [showAlert]);

  return (
    <AlertContext.Provider value={value}>
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
            {alert.message && (
              <AlertDescription>{alert.message}</AlertDescription>
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
