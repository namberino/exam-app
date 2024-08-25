import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ name: '', userType: '', userId: '' });

  const signOut = () => {
    setUser({ name: '', userType: '', userId: '' });
  };

  return (
    <UserContext.Provider value={{ user, setUser, signOut }}>
      {children}
    </UserContext.Provider>
  );
};
