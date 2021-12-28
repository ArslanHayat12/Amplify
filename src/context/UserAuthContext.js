import React, { createContext, useContext, useReducer } from 'react';


export const SET_USER = 'SET_USER';

const initialState = {
    state: {
        user: null,
        usersList: [],
        isLoading: false,
        currentUser:null,
        role: {
            practioner: 0,
            business: 0,
            admin: 0
        }
    },
    dispatch: () => undefined,
};

const UserAuthContext = createContext(initialState);

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'SELECTED_USER':
            return { ...state, currentUser: action.payload };
        case 'SET_USERS_List': {
            const mappedData = action.payload.map(user => {
                const role = user.Attributes.map(attribute => {
                    return attribute.Name === 'custom:role' ? attribute.Value.split(",") : null
                }).filter(Boolean)[0]
                const email = user.Attributes.map(attribute => {
                    return attribute.Name === 'email' ? attribute.Value : null
                }).filter(Boolean)[0]
                const email_verified = user.Attributes.map(attribute => {
                    return attribute.Name === 'email_verified' ? attribute.Value : null
                }).filter(Boolean)[0]
                return { ...user, role: role || ['Admin'], email, email_verified }
            })
            const practioner = mappedData.filter(data => data.role?.includes("Practioner")).length;
            const business = mappedData.filter(data => data.role?.includes("Business")).length;
            const admin = mappedData.filter(data => data.role?.includes("Admin")).length;
            return {
                ...state, usersList: mappedData, role: {
                    practioner,
                    business,
                    admin
                }
            };
        }
        case 'UPDATE_USERS_LIST': {
            const mappedData = action.payload
            const practioner = mappedData.role?.includes("Practioner") ? 1 : 0;
            const business = mappedData.role?.includes("Business") ? 1 : 0;
            const admin = mappedData.role?.includes("Admin") ? 1 : 0;
            return {
                ...state, usersList: [...state.usersList, mappedData], role: {
                    practioner,
                    business,
                    admin
                }
            };
        }
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
};

const UserAuthProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <UserAuthContext.Provider value={{ state, dispatch }}>
            {props.children}
        </UserAuthContext.Provider>
    );
};

const useUserContext = () => useContext(UserAuthContext);
export { UserAuthProvider, useUserContext };