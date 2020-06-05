// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBWJcLksEcjBY8cxQ8J2N16oK3im3uUB7E",
    authDomain: "mobweb-94fd6.firebaseapp.com",
    databaseURL: "https://mobweb-94fd6.firebaseio.com",
    projectId: "mobweb-94fd6",
    storageBucket: "mobweb-94fd6.appspot.com",
    messagingSenderId: "1000467272107",
    appId: "1:1000467272107:web:e24427a4e4f73b5204c2ee",
    measurementId: "G-PCK40YNC8F"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();
  
  var userRef = database.ref("resep");
  userRef.orderByKey().on("value", snapshot => {
    console.log(snapshot.val());
  });
  