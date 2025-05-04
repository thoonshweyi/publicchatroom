import {auth} from "./firebase.js"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signOut } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { updateProfile } from "firebase/auth";

export function Authorize(){

     // Signin
     const registerUser = async(fullname,email,password)=>{
          const defaultprofileimg = "https://static.thenounproject.com/png/65476-200.png";
          try{
               const userCredential = await createUserWithEmailAndPassword(auth, email, password)
               const user = userCredential.user;
               console.log(user);

               await updateProfile(user, {
                    displayName: fullname,
                    photoURL: defaultprofileimg
               }).then(() => {
                    // set name to localstprage
                    setLocalName(user);
                    

                    // Redirect to index.html
                    window.location.href = "../index.html"
               }).catch((error) => {
                    
               });
     
          }catch(err){
               console.error('Error registerering user: ',err)
          }
     }

     // Signin
     const loginUser = (email,password)=>{
          signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
               // console.log(userCredential.user);

               setLocalName(userCredential.user);

               // Redirect to index.html
               window.location.href = "../index.html"
          })
          .catch((error) => {
            console.error('Error logging in user: ',error.message)
          });
     }

     // Signout
     const logoutUser = ()=>{
          signOut(auth)
          .then(() => {

               // unset name from localstorage
               unsetLocalName('username'); 

               window.location.href = "../signin.html"
          }).catch((error) => {
               console.error("Error logging out = ",error.message);
          });
     }


     // Reset Password
     const resetPassword = async (email,msg)=>{
          try{
               await sendPasswordResetEmail(auth, email);
               msg.textContent = "Password reset email send. Please check your inbox.";
               msg.style.color = 'green';
               msg.style.fontSize = '11px';
          }catch{
               console.error("Error sending password reset email = ",error.message);
          
               msg.textContent = `Error: ${error.message}`;
               msg.style.color = 'red';
               msg.style.fontSize = '11px';
          }

          
     }

     // Google Signin
     const googleLogin = ()=>{
          const provider = new GoogleAuthProvider();
          signInWithPopup(auth, provider)
            .then((result) => {
               setLocalName(result.user);

               // Redirect to index.html
               window.location.href = "../index.html"

            }).catch((error) => {
               console.error("Error with Google sign-in = ",error.message);
              
            });
     }

     // Auth Check
     const isLoggedIn = ()=>{
          onAuthStateChanged(auth, (userdata) => {
               if (userdata) {
                    return true;
               } else {
                    // Redirect to signin.html
                    window.location.href = "../signin.html"
               }
          });
     }

     // Get User Info
     const getUser = (callback)=>{
          // callback('Hello sir');
          onAuthStateChanged(auth, (userdata) => {
               if (userdata) {
                    callback(userdata);
               } 
          });
     }

     const setLocalName = (userdata)=>{
          localStorage.setItem('username',userdata.displayName);
     }
     const unsetLocalName = (userdata)=>{
          localStorage.removeItem('username');
     }

     return {registerUser,loginUser,logoutUser,resetPassword,googleLogin,isLoggedIn,getUser}
}




// firebase.com

// docs > overview > fundamentals > web >  Authentication for web 


// => firebase dashboard
//  myfirstproject > Build > Authentication > Sign-in method > Email/Password

// *Error -bcz disabled method
// authorize.js:8 
//  POST https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDPFiI2CjnwT5-fYogUKxVwazbpY1Y7Lcw 400 (Bad Request)
// authorize.js:13 Error registerering user:  FirebaseError: Firebase: Error (auth/operation-not-allowed).
//     at async Object.registerUser (authorize.js:8:39)

// => Successful Signin
     // // *result user 
     // _UserImpl
     //      accessToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg1NzA4MWNhOWNiYjM3YzIzNDk4ZGQzOTQzYmYzNzFhMDU4ODNkMjgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbXktZmlyc3QtcHJvamVjdC0zYWY0YSIsImF1ZCI6Im15LWZpcnN0LXByb2plY3QtM2FmNGEiLCJhdXRoX3RpbWUiOjE3NDUxMzU1MzMsInVzZXJfaWQiOiJkczg5bGx3ck5jUEo2cGFoTzBVQnNKQWN0cnkxIiwic3ViIjoiZHM4OWxsd3JOY1BKNnBhaE8wVUJzSkFjdHJ5MSIsImlhdCI6MTc0NTEzNTUzMywiZXhwIjoxNzQ1MTM5MTMzLCJlbWFpbCI6ImF1bmdhdW5nQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhdW5nYXVuZ0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.csRP43mkUJswavpUTkRfuuFoSOCxqGQBjIXKIaYQzBtDO908G9QUvrd1HoIb8tRPeL7AzntuvnyLDVmutvG1D7EBMR3fQwrpJCqW9og1fyqOcSlQRRzpfodGQvPnfyvXsnkeljHPd6l0JiBBK0HObJntOtSOqPsqPGB9lCdLg93tmq16B6zr797DIGXE-gZv7QAaGofsRlywoc__aj-gFwmgLN3va14W91K0tScFl4eUpiLAlKEthgRb2qc2aNjI3Ga47nR6LNp6G1WwyPX8uIOfksWsQalj5r-oXS2VuHFLQSmobXbodQ6hqLF4CNoMyf0M5-lvObHAbI5xQ24WBA"
     //      auth: AuthImpl {app: FirebaseAppImpl, heartbeatServiceProvider: Provider, appCheckServiceProvider: Provider, config: {…}, currentUser: _UserImpl, …}
     //      displayName: null
     //      email: "aungaung@gmail.com"
     //      emailVerified: false
     //      isAnonymous: false
     //      metadata: UserMetadata {createdAt: '1745135533139', lastLoginAt: '1745135533139', lastSignInTime: 'Sun, 20 Apr 2025 07:52:13 GMT', creationTime: 'Sun, 20 Apr 2025 07:52:13 GMT'}
     //      phoneNumber: null
     //      photoURL: null
     //      proactiveRefresh: ProactiveRefresh {user: _UserImpl, isRunning: false, timerId: null, errorBackoff: 30000}
     //      providerData: [{…}]
     //      providerId: "firebase"
     //      reloadListener: null
     //      reloadUserInfo: {localId: 'ds89llwrNcPJ6pahO0UBsJActry1', email: 'aungaung@gmail.com', passwordHash: 'UkVEQUNURUQ=', emailVerified: false, passwordUpdatedAt: 1745135533139, …}
     //      stsTokenManager: _StsTokenManager {refreshToken: 'AMf-vByYRSvLu7zy6XFYJOErxEDe5CfskZu3up1n_hcAjDSQPT…rEfrhGodvrMPB3OMJFt-HQ257fZ8AQ_c19BTyaVZlBjFEczTA', accessToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg1NzA4MWNhOWNiYjM3Yz…S2VuHFLQSmobXbodQ6hqLF4CNoMyf0M5-lvObHAbI5xQ24WBA', expirationTime: 1745139294138}
     //      tenantId: null
     //      uid: "ds89llwrNcPJ6pahO0UBsJActry1"
     //      refreshToken: (...)
     //      [[Prototype]]: Object




//      ❓“Why does Firebase need to store user info from Google in Firebase Authentication, when Google already has that info?”

// Let’s answer it very simply, step-by-step.

// 🧠 First, what's happening when a user signs in with Google?
// The user clicks "Sign in with Google".

// Google asks for permission and signs them in.

// Google gives Firebase a token saying, “✅ This is a verified Google user.”

// Firebase Authentication saves basic user info (like name, email, and photo) to make your app work easily.

// 🟢 Now, Why Does Firebase Save Google User Info?
// ✅ 1. So your app can access it easily
// Firebase stores the Google user's:

// uid (unique ID)

// email

// displayName

// photoURL

// providerId (e.g., "google.com")

// This info is available immediately in your app, like this:

// js
// Copy
// Edit
// const user = firebase.auth().currentUser;
// console.log(user.displayName); // "John Doe"
// Without this, you'd need to talk to Google again every time you need the name or email.

// ✅ 2. To create a Firebase identity
// Firebase creates a unique Firebase user account from the Google user — even though the login comes from Google.

// Why? Because:

// Firebase needs to manage the user inside your Firebase project.

// This lets Firebase link that user to:

// Firestore documents

// Realtime Database records

// Files in Firebase Storage

// Security rules (using their uid)

// So Firebase isn't just copying Google’s info — it's creating a Firebase identity based on that info.

// ✅ 3. To handle login, logout, and session management
// When the user comes back later, Firebase:

// Knows who the user is

// Automatically keeps them logged in

// Doesn’t have to ask Google again every time

// ✅ 4. For security rules
// You can protect data in Firestore using the Firebase user:

// js
// Copy
// Edit
// allow read, write: if request.auth.uid == resource.data.uid;
// This is only possible because Firebase Auth stores the Google user and gives them a Firebase uid.

// 🎯 Think of it like this:

// Service	Role
// Google	Verifies the user is real and gives info
// Firebase Auth	Creates a secure user identity inside your app and keeps them logged in
// Your app	Uses that Firebase user info to access data securely