import React, { createContext, useContext, useReducer } from 'react';


export const SET_ROLE = 'SET_ROLE';

const initialState = {
    state: {
        rolesList: [],
        isLoading: false,
        currentRole: null
    },
    dispatch: () => undefined,
};

const RoleBasedContext = createContext(initialState);

const reducer = (state, action) => {
    switch (action.type) {
        case 'SELECTED_ROLE':
            return { ...state, currentRole: action.payload };
        case 'SET_ROLES_LIST': {
            return {
                ...state, rolesList: action.payload
            };
        }
        case 'UPDATE_ROLES_LIST': {
            const mappedData = action.payload
            return {
                ...state, rolesList: [...state.rolesList, ...mappedData]
            };
        }
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
};

const RoleBasedContextProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <RoleBasedContext.Provider value={{ state, dispatch }}>
            {props.children}
        </RoleBasedContext.Provider>
    );
};

const useRoleBasedContext = () => useContext(RoleBasedContext);
export { RoleBasedContextProvider, useRoleBasedContext };