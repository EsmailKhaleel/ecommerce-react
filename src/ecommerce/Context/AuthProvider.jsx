import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dkcdvrtssgtufoofhqor.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrY2R2cnRzc2d0dWZvb2ZocW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5OTE2NjAsImV4cCI6MjA1NTU2NzY2MH0.TmnGQ0P-2wdNnCqKTZtgeVDkOxbbDEk7vzZUh9wbkpE";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            console.log(session)
        };
        fetchUser();
        const {
            data: authListener
        } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
        });
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);


    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error("Login Error:", error.message);
            return null;
        }
        setUser(data.user);
        return data.user;
    };

    const signOut = async () => {
        if(user){
            await supabase.auth.signOut();
            setUser(null);
        }
        alert("You already not signed in!")
    };
    const signUp = async (email, password, username) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { username } },
            });
            if (error) {
                console.log("Error Registration:", error.message);
                return null;
            }
            console.log("User Registered:", data);
            return data;
        } catch (error) {
            console.log("Signup error:", error.message);
            return null;
        }
    }
    return (
        <AuthContext.Provider value={{ user, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
