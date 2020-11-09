// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyCTjqIZ1nyPDuGGk7Ps0DhstoTbp-SFiBQ",
    authDomain: "artful-turbine-287615.firebaseapp.com",
    databaseURL: "https://artful-turbine-287615.firebaseio.com",
    projectId: "artful-turbine-287615",
    storageBucket: "artful-turbine-287615.appspot.com",
    messagingSenderId: "526496917788",
    appId: "1:526496917788:web:86fa93dfd8169a0ea2b2d9",
    measurementId: "G-T6NF3XHGMZ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const signUpButton = document.getElementById("signUp");
if(signUpButton){
    signUpButton.addEventListener('click', function handleSignUp(){
        let email = document.getElementById("email-input-field");
        let password = document.getElementById("password-input-field");
        let repeatPassword = document.getElementById("repeat-password-input-field");
        let firstName = document.getElementById("first-name-input-field");
        let lastName = document.getElementById("last-name-input-field");
        let phone = document.getElementById("phone-input-field");
        let address = document.getElementById("address-input-field");
        let city = document.getElementById("city-input-field");
        let animal = document.getElementById("animal-input-field");
        let price = document.getElementById("price-input-field");


        const regular = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

        if(!regular.test(email.value)){
            alert("You have entered an invalid email address!");
            email.value = '';
            password.value = '';
            repeatPassword.value = '';
            return ;
        }
        if(password.value !== repeatPassword.value){
            alert('Passwords not similar Please try again');
            password.value = '';
            repeatPassword.value = '';
            return;
        }
        firebase.auth().createUserWithEmailAndPassword(email.value, password.value).catch(function(error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            // [END_EXCLUDE]
        });

        let featuresRef = firebase.database().ref().child('features');
        let size;
        featuresRef.once('value').then((snapshot)=>{
            size = snapshot.numChildren();
            let lat,lng;
            let location = address.value +" "+city.value;
            axios.get("https://maps.googleapis.com/maps/api/geocode/json",{
                params:{
                    address:location,
                    key:'AIzaSyDU6DgkGlhivWxccazkQCh9SIqv8NtKPkE'
                }
            }).then(function(response) {
                //all response
                console.log(response);

                lat = response.data.results[0].geometry.location.lat;
                lng = response.data.results[0].geometry.location.lng;
                featuresRef.child(size).set({
                    "geometry" : {
                        "coordinates" : [lat,lng],
                        "type" : "Point"
                    },
                    "properties" : {
                        "address" : address.value,
                        "city" : city.value,
                        "email" : email.value,
                        "firstName" : firstName.value,
                        "animal" : animal.value,
                        "lastName" : lastName.value,
                        "phone" : phone.value,
                        'price' : price.value
                    },
                    "type" : "Feature"
                }).key=size;
            }).catch(function (err) {
                console.log(err);
            });
        })

        function moveIndex(){
            setTimeout(()=>{
                window.location.href = "./index.html";
            },3000);
        }
        moveIndex();

    });
}

const logInButton = document.getElementById('logInBtn');
if(logInButton){
    logInButton.addEventListener('click',()=>{

        let email = document.getElementById('login-email');
        let password = document.getElementById('login-password');
        // Sign in with email and pass.
        // [START authwithemail]
        let signIn = firebase.auth().signInWithEmailAndPassword(email.value, password.value).catch(function(error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }

            console.log(error);
            logInButton.disabled =false;
            // [END_EXCLUDE]
        });
        // [END authwithemail]
        logInButton.disabled = true;
        signIn.then((result) => {
            if(result !== undefined){
                window.location.href = "./index.html";
            }
        console.log(result);
        });

    },false);

}
