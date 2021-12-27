import { createContext, useContext, useState } from "react";
import { initialSession } from "../models/session";

export const SessionContext = createContext([initialSession, () => {}]);
export const useSessionContext = () => useContext(SessionContext);

export const SessionContextProvider= (props) => {
  const [sessionState, setSessionState] = useState(initialSession);
  const defaultSessionContext= [sessionState, setSessionState];

  return (
    <SessionContext.Provider value={defaultSessionContext}>
      {props.children}
    </SessionContext.Provider>
  );
}