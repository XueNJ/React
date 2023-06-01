import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isLoginState, setIsLoginState] = useState(false);

    return (
        <AuthContext.Provider value={{ isLoginState, setIsLoginState }}>
            {children}
        </AuthContext.Provider>
    );
};
