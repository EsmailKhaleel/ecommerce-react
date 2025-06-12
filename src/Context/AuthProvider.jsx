import { createContext, useContext, useEffect, useState } from "react";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    console.log('user in AuthProvider:', user);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            toast.success('Successfully signed in!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return userCredential.user;
        } catch (error) {
            let errorMessage = 'Failed to sign in';
            switch (error.code) {
                case 'auth/invalid-credential':
                    errorMessage = 'Invalid email or password';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'User not found';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password';
                    break;
                default:
                    errorMessage = error.message;
            }
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return null;
        }
    };    const signInWithGoogle = async () => {
        try {
            // Check if the device is mobile
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            if (isMobile) {
                // Use redirect method for mobile devices
                await signInWithRedirect(auth, googleProvider);
            } else {
                // Use popup for desktop devices
                const userCredential = await signInWithPopup(auth, googleProvider);
                toast.success('Successfully signed in with Google!', {
                    position: "top-right",
                    autoClose: 3000,
                });
                return userCredential.user;
            }
        } catch (error) {
            console.error('Google Sign In Error:', error);
            toast.error('Failed to sign in with Google', {
                position: "top-right",
                autoClose: 3000,
            });
            return null;
        }
    };

    // Handle redirect result when the page loads
    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    toast.success('Successfully signed in with Google!', {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                console.error('Redirect Result Error:', error);
                toast.error('Failed to complete Google sign in', {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        };

        handleRedirectResult();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            toast.success('Successfully signed out!', {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            toast.error('Failed to sign out', {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const signUp = async (email, password, username) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            toast.success('Successfully registered!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return userCredential.user;
        } catch (error) {
            let errorMessage = 'Failed to register';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Email is already registered';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password should be at least 6 characters';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address';
                    break;
                default:
                    errorMessage = error.message;
            }
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            signIn, 
            signInWithGoogle, 
            signOut: handleSignOut, 
            signUp 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
