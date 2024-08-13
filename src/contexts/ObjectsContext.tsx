import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define the types for your objects and actions
interface ObjectType {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

type ObjectsState = ObjectType[];

type ObjectsAction =
  | { type: "SET_OBJECTS"; payload: ObjectsState }
  | { type: "ADD_OBJECT"; payload: ObjectType }
  | { type: "UPDATE_OBJECT"; payload: ObjectType }
  | { type: "REMOVE_OBJECT"; payload: { id: string } };

// Define the context type
interface ObjectsContextType {
  objects: ObjectsState;
  dispatch: React.Dispatch<ObjectsAction>;
}

// Create context with a default value of null
export const ObjectsContext = createContext<ObjectsContextType | null>(null);

// Reducer function
export const objectsReducer = (
  state: ObjectsState,
  action: ObjectsAction
): ObjectsState => {
  console.log("state, action", state, action);
  switch (action.type) {
    case "SET_OBJECTS":
      return action.payload;
    case "ADD_OBJECT":
      return [...state, action.payload];
    case "UPDATE_OBJECT":
      return state.map((obj) =>
        obj.id === action.payload.id ? action.payload : obj
      );
    case "REMOVE_OBJECT":
      return state.filter((obj) => obj.id !== action.payload.id);
    default:
      return state;
  }
};

// Provider component props interface
interface ObjectsProviderProps {
  children: ReactNode;
}

// Provider component
export const ObjectsProvider: React.FC<ObjectsProviderProps> = ({
  children,
}) => {
  const [objects, dispatch] = useReducer(objectsReducer, []);

  return (
    <ObjectsContext.Provider value={{ objects, dispatch }}>
      {children}
    </ObjectsContext.Provider>
  );
};

// Custom hook to use the objects context
export const useObjects = () => {
  const context = useContext(ObjectsContext);
  if (!context) {
    throw new Error("useObjects must be used within an ObjectsProvider");
  }

  return context;
};
