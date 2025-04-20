// Firebase configuration
// Replace XXXXX with your actual values from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyAL01JTNRi9mTaOBIX39_2wEWVZ5KltYeE",
    authDomain: "stem-3cd9d.firebaseapp.com",
    projectId: "stem-3cd9d",
    storageBucket: "stem-3cd9d.firebasestorage.app",
    messagingSenderId: "968751445623",
    appId: "1:968751445623:web:f35abac57d17cdc47ff872",
    measurementId: "G-ECHP46C9J4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore(); 