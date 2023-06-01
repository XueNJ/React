import React, { createContext, useState } from 'react';

const ConfirmationContext = createContext({
    confirmation: false,
    setConfirmation: () => { }
});

export const ConfirmationProvider = ({ children }) => {
    const [confirmation, setConfirmation] = useState(false);

    return (
        <ConfirmationContext.Provider value={{ confirmation, setConfirmation }}>
            {children}
        </ConfirmationContext.Provider>
    );
};

export default ConfirmationContext;
