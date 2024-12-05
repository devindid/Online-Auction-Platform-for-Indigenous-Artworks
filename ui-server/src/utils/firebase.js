import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBfGdzFTbNX7EfVm9i5pb6tRc5i9-46ocA",
    authDomain: "bid-fair-app.firebaseapp.com",
    projectId: "bid-fair-app",
    storageBucket: "bid-fair-app.appspot.com",
    messagingSenderId: "570709581723",
    appId: "1:570709581723:web:29a20425a8599b2ee3cb3e"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const uploadOnFirebase = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Read file from local path
        const fileBuffer = fs.readFileSync(localFilePath);
        const fileName = localFilePath.split('/').pop();

        // Create a reference to Firebase Storage
        const storageRef = ref(storage, `uploads/${fileName}`);

        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, fileBuffer);

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Delete local file after upload
        fs.unlinkSync(localFilePath);

        return { downloadURL };
    } catch (error) {
        console.error('Error uploading file:', error);
        fs.unlinkSync(localFilePath);
        return null;
    }
};

const auth = getAuth(app);

export { uploadOnFirebase, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail };
