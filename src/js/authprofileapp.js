import { Authorize } from "./authorize.js";
import {UiElement} from "./uielelment.js";

// UI
const userinfodiv = document.getElementById('userinfo');
const logoutbtn = document.getElementById('logoutbtn');

// Authorize Instance
const authorize = Authorize();

// Uielement instance
const uiele = UiElement(userinfodiv);

// Get info & render
authorize.getUser((data)=>{
     // console.log(data);
     uiele.userInfoEle(data);
});

// Logout
logoutbtn.addEventListener('click',()=>{

     const {logoutUser} = Authorize();
     logoutUser();

});