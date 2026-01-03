import { createContext, useContext, useReducer, useEffect } from "react";

const MedContext = createContext();

const initialState = () => {
  const savedSession = localStorage.getItem("medivault_session");
  const sessionUser = savedSession ? JSON.parse(savedSession) : null;

  const savedData = localStorage.getItem("medivault_data");
  const parsedData = savedData ? JSON.parse(savedData) : {};

  return {
    meds: parsedData.meds || [],
    logs: parsedData.logs || [],
    vitals: parsedData.vitals || [],
    user: sessionUser,
  };
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

    case "LOGIN": {
      const allUsers = JSON.parse(
        localStorage.getItem("medivault_users") || "[]"
      );

      const foundUser = allUsers.find(
        (u) =>
          u.name.toLowerCase() === action.payload.name.toLowerCase() &&
          u.password === action.payload.password
      );

      if (foundUser) {
        const userProfile = { ...foundUser };

        delete userProfile.password;
        localStorage.setItem("medivault_session", JSON.stringify(userProfile));
        return { ...state, user: userProfile };
      } else {
        throw new Error("Invalid credentials");
      }
    }

    case "REGISTER": {
      const existingUsers = JSON.parse(
        localStorage.getItem("medivault_users") || "[]"
      );

      if (
        existingUsers.find(
          (u) => u.name.toLowerCase() === action.payload.name.toLowerCase()
        )
      ) {
        throw new Error("User already exists");
      }

      const newUser = {
        id: Date.now().toString(),
        name: action.payload.name,
        password: action.payload.password,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "medivault_users",
        JSON.stringify([...existingUsers, newUser])
      );

      const safeProfile = { ...newUser };

      delete safeProfile.password;
      localStorage.setItem("medivault_session", JSON.stringify(safeProfile));

      return { ...state, user: safeProfile };
    }

    case "LOGOUT":
      localStorage.removeItem("medivault_session");
      return { ...state, user: null };

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
