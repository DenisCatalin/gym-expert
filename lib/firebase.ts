
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const credentials = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

if(!firebase.apps.length) {
    firebase.initializeApp(credentials);
}

export default firebase;