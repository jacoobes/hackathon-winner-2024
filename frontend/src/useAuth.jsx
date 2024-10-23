import { createContext, useContext, useEffect, useMemo, useState } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false);
        useEffect(() => {
            fetch("/api/me", { credentials: 'include' })
            .then(res => res.json())
            .then(jon => setAuth(jon.success))
            .catch((e) => setAuth(false))
        }, [])

    const value = useMemo(() => ({ user: auth }), [auth]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
/**
 *
 * @return {ReturnType<typeof AuthProvider>}
 */
export const useAuth = () => {
    return useContext(AuthContext);
};
