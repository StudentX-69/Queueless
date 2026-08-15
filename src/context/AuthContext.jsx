import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';
import { clearAuthSession, readAuthToken, readAuthUser, writeAuthSession } from '../services/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readAuthUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = readAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    api.get('/auth/me')
      .then(({ data }) => {
        setUser(data.user);
        writeAuthSession({ token, user: data.user });
        connectSocket(token);
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    writeAuthSession({ token: data.token, user: data.user });
    setUser(data.user);
    connectSocket(data.token);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    writeAuthSession({ token: data.token, user: data.user });
    setUser(data.user);
    connectSocket(data.token);
    return data.user;
  };

  function logout() {
    clearAuthSession();
    disconnectSocket();
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
