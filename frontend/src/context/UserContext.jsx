import { Children, createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

const UserContextProvider = ({ children }) => {
  const [userAccessToken, setUserAccessToken] = useState(
    localStorage.getItem("UserAccessToken")
  );
  const contextValue = { userAccessToken, setUserAccessToken };
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
