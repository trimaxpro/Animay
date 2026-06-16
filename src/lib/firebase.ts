import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDh2WolLRE08dseUt9VDxIO2vcrV-WTT28',
  authDomain: 'animay-8697a.firebaseapp.com',
  projectId: 'animay-8697a',
  storageBucket: 'animay-8697a.firebasestorage.app',
  messagingSenderId: '468671356294',
  appId: '1:468671356294:web:7db910153d85e37906a007',
  measurementId: 'G-MF7PR1YRPK',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
