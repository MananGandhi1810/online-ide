import { createContext, useContext, useEffect, useState } from "react";

const defaultAuthState = {
    user: {
        name: null,
        email: null,
        token: null,
        isAuthenticated: false,
    },
    setUser: ({ name, email, token, isAuthenticated }) => {
        localStorage.setItem(
            storageKey,
            JSON.stringify({ name, email, token, isAuthenticated }),
        );
        setUser({ ...user, user: { name, email, token, isAuthenticated } });
    },
};

const AuthContext = createContext(defaultAuthState);

export default AuthContext;
