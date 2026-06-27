import { signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { COLLECTIONS } from "../../constants/firebaseCollections";
import { auth, db, googleProvider } from "./firebase";

export const signInWithGoogle = async () => {
const result = await signInWithPopup(auth, googleProvider);
const user = result.user;

const userRef = doc(db, COLLECTIONS.USERS, user.uid);
const userSnap = await getDoc(userRef);

if (!userSnap.exists()) {
await setDoc(userRef, {
uid: user.uid,
displayName: user.displayName || "",
email: user.email || "",
photoURL: user.photoURL || null,
createdAt: new Date().toISOString(),
updatedAt: new Date().toISOString(),
totalSurahs: 0,
streakDays: 0,
});
}

return user;
};

export const logout = async () => {
return signOut(auth);
};
