import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

const googleProvider = new GoogleAuthProvider();

// Sign up with email and password
export const signUpWithEmail = async (email, password, name, role = 'athlete') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName: name });

    // Create user document in Firestore
    await createUserDocument(user, { role, name });

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async (role = 'athlete') => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user document exists, if not create one
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await createUserDocument(user, { role });
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Password reset
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Create user document in Firestore
const createUserDocument = async (user, additionalData = {}) => {
  const userRef = doc(db, 'users', user.uid);

  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || additionalData.name || '',
    photoURL: user.photoURL || '',
    role: additionalData.role || 'athlete',
    createdAt: serverTimestamp(),
    settings: {
      theme: 'dark',
      notifications: true,
      techMode: false,
    },
  };

  await setDoc(userRef, userData);

  // If athlete, create athlete profile
  if (userData.role === 'athlete') {
    await setDoc(doc(db, 'athletes', user.uid), {
      userId: user.uid,
      coachId: null,
      currentProgram: null,
      streak: 0,
      totalWorkouts: 0,
      prs: {},
      createdAt: serverTimestamp(),
    });
  }

  // If coach, create coach profile
  if (userData.role === 'coach') {
    await setDoc(doc(db, 'coaches', user.uid), {
      userId: user.uid,
      clients: [],
      programs: [],
      createdAt: serverTimestamp(),
    });
  }

  return userData;
};

// Get user data from Firestore
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { data: userDoc.data(), error: null };
    }
    return { data: null, error: 'User not found' };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// Auth state observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
