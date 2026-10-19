import { createContext, useContext, useState, useEffect } from "react";

const API = "http://localhost:3001/api";
const AuthContext = createContext();

export function AuthProvider({children}){
  const[token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token");
    }catch{
      return null;
    }
  });
  const [user, setUser] = useState(null);
  const [checking, setChecking] =useState(Boolean(token));

  //whenever the token changes , ask the server who it belongs to
  useEffect(() =>{
    if (!token) {
      setUser(null);
      setChecking(false);
      return;      
    }
    fetch(`${API}/auth/me`, {headers: {Authorisation: `Bearer ${token}`}})
    .then((res) => (res.ok ? res.json(): Promise.reject()))
    .then((data) => setUser(data))
    .catch(() => {
      try {
        localStorage.removeItem("token");
      } catch{
        // storage unavailable
      }
      setToken(null);
      setUser(null);
    })
    .finally(() => setChecking(false));
  },[token]);

  async function authenticate(path, body) {
    const res = await fetch(`${API}/auth/${path}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() =>({}));
    if (!res.ok)throw new Error(data.error || `server error ${res.status}`);
    try {
      localStorage.setItem("token", data.token);
    }catch {
      // storage unavailable; login lasts until refresh
    }
    setToken(data.token);
    setUser(data.user);        
  }

  const login =(email, password) => authenticate("login", {email, password});
  const register =(name, email, password) =>
    authenticate("register", { name, email, password});

  function logout() {
    try{
      localStorage.removeItem("token");
    }catch{
      // storage unavailable
    }
    setToken(null);
    setUser(null);    
  }
  // Like fetch, but seds the login token
  function authFetch(url, options ={}) {
    return fetch(url, {...options,
      headers:{...options.headers, Authorization: `Bearer ${token}`},
    });    
  }

  return (
    <AuthContext.Provider value = {{user, checking, login, register, logout, authFetch}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(){
  return useContext(AuthContext);
}