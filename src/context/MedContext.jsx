import { createContext, useContext, useReducer, useEffect } from "react";

const MedContext = createContext();

const initialState = () => {
  const saved = localStorage.getItem("medivault_data");
  return saved
    ? JSON.parse(saved)
    : { meds: [], logs: [], user: { name: "" }, vitals: [] };
};

const medReducer = (state, action) => {
  switch (action.type) {
    case "ADD_MED":
      return { ...state, meds: [...state.meds, action.payload] };

    case "DELETE_MED":
      return {
        ...state,
        meds: state.meds.filter((med) => med.id !== action.payload),
        logs: state.logs.filter((log) => log.drugId !== action.payload),
      };

    case "EDIT_MED":
      return {
        ...state,
        meds: state.meds.map((med) =>
          med.id === action.payload.id ? action.payload : med
        ),
      };

    case "LOG_DOSE":
      return { ...state, logs: [...state.logs, action.payload] };

    case "ADD_VITAL":
      return { ...state, vitals: [...state.vitals, action.payload] };

    case "DELETE_VITAL":
      return {
        ...state,
        vitals: state.vitals.filter((v) => v.id !== action.payload),
      };

    default:
      return state;
  }
};

export const MedProvider = ({ children }) => {
  const [state, dispatch] = useReducer(medReducer, null, initialState);

  useEffect(() => {
    localStorage.setItem("medivault_data", JSON.stringify(state));
  }, [state]);

  const generateId = () =>
    Date.now().toString(36) + Math.random().toString(36).substr(2);

  return (
    <MedContext.Provider value={{ state, dispatch, generateId }}>
      {children}
    </MedContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMed = () => useContext(MedContext);
