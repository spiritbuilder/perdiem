import { createContext, useState } from "react";

interface ContextData {
  user?: {
    email: string;
    token: string;
  };
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
