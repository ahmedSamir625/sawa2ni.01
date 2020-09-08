import firebase from 'firebase/app';
import  "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyDwdGE8GR7SLbqkkTpTqZW0wKRmH7jweMs",
    authDomain: "sawa2ni-uploads.firebaseapp.com",
    databaseURL: "https://sawa2ni-uploads.firebaseio.com",
    projectId: "sawa2ni-uploads",
    storageBucket: "sawa2ni-uploads.appspot.com",
    messagingSenderId: "702990850490",
    appId: "1:702990850490:web:81d86044ddb3abe5cd6583",
    measurementId: "G-GQ0822CPY3"
  };


firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

export {storage , firebase as default}