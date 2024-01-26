import { createContext, useReducer, useContext } from "react";

const StateContext = createContext();
 
export const StateProvider = ({initialState, reducer, children}) => ( 
    // We pass the useReducer to provider So, all descendend can access those reducer state and dispatch function();
    // We then pass this state and dispatch function as a value to the StateContext.Provider. This makes them available to all the child components within the StateProvider.

    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
)


// "useStateProvider" is a custom hook created using useContext.
// It allows any component to easily access the state and dispatch function from the StateContext without needing to go through multiple layers of props drilling.
// When a component calls "useStateProvider", it will return the state and dispatch function obtained from the StateContext.

export const useStateProvider = () =>{return useContext(StateContext)}
