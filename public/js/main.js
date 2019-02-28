let db = firebase.firestore();

try {
  let app = firebase.app();
} catch (e) {
  console.error(e);
}

var provider = new firebase.auth.GoogleAuthProvider();
function login() {
  firebase.auth().signInWithPopup(provider).then(function (result) {
    var token = result.credential.accessToken;
    var user = result.user;
    sessionStorage.setItem('user', user.displayName)
    sessionStorage.setItem('email', user.email)
    sessionStorage.setItem('token', token)
    db.collection("users").doc(user.email).set({
      displayname: user.displayName,
      authToken: token
    })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
    window.location.replace('/airtable.html')
  }).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
    console.log(`${errorCode},${errorMessage},${email},${credential}`)

  });
}

loginbutton.addEventListener("click", login);

