import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDBAbWp5Of0pCJSZWMbNtr4Cg8xuWSHX2U",                         
  authDomain: "fir-tutorial-fdfef.firebaseapp.com",  
  projectId: "fir-tutorial-fdfef",                   
  storageBucket: "fir-tutorial-fdfef.firebasestorage.app",   
  messagingSenderId: "624460200909",           
  appId: "1:624460200909:web:7a814d6716089cee3d2284",                         
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
