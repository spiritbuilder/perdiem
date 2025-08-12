import { User } from "@react-native-google-signin/google-signin";
import { createContext, useState } from "react";

export interface ContextData {
  user?: {
    email: string;
    token: string;
  } & Partial<User["user"]>;
}

interface Context extends ContextData {
  setAppState?: React.Dispatch<React.SetStateAction<Context>>;
}

export const AppContext = createContext<Context>({});

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [appState, setAppState] = useState<Context>({});
  return (
    <AppContext.Provider value={{ ...appState, setAppState }}>
      {children}
    </AppContext.Provider>
  );
};
