import { createContext, useState } from "react";

const AppContext = createContext()

const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    return (
        <AppContext.Provider value={{ user, setUser }}>
            {children}
        </AppContext.Provider>
    )
}

export { AppContext, AppProvider }