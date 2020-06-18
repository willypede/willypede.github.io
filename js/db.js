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
  var mainMenuRef = database.ref("main_menu");
  mainMenuRef.orderByKey().on("value", snapshot => {
    var mainMenu = snapshot.val();
    var keys = Object.keys(mainMenu);
    console.log(keys);
    var resepSatuTitle = document.getElementById("titleResepSatu");
    var resepSatuDesc = document.getElementById("descResepSatu");
    // Resep 1
    var k = keys[0];
    var namaMenu = mainMenu[k].name;
    var descMenu = mainMenu[k].description;
    resepSatuTitle.innerHTML = namaMenu;
    resepSatuDesc.innerHTML = descMenu;

  });
  