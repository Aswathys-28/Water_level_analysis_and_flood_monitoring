// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app'
import 'firebase/compat/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDjspDMaDIGzth_cMaPTpiV_MvWWK8Zl3g",
    authDomain: "ledtest-334bf.firebaseapp.com",
    databaseURL: "https://ledtest-334bf.firebaseio.com",
    projectId: "ledtest-334bf",
    storageBucket: "ledtest-334bf.appspot.com",
    messagingSenderId: "465713641219",
    appId: "1:465713641219:web:9db1b5bdae6a13d7e61b36"
  };
// Initialize Firebase         
firebase.initializeApp(firebaseConfig);
export const dataRef = firebase.database()
export default firebase