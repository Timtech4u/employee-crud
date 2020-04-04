import firebase from "firebase";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC9J2hIQ1XQFx5NAD6pr37xBwNPQCTZZwY",
  authDomain: "employee-crud-app-a3a32.firebaseapp.com",
  databaseURL: "https://employee-crud-app-a3a32.firebaseio.com",
  projectId: "employee-crud-app-a3a32",
  storageBucket: "employee-crud-app-a3a32.appspot.com",
  messagingSenderId: "87613015171",
  appId: "1:87613015171:web:e60ee5139c56e5fc02c7b6"
};

// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);
