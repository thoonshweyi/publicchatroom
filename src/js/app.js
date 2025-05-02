import {Chatroom} from "./chat.js";
import {Lielements} from "./lielement.js";
import '@fortawesome/fontawesome-free/css/all.min.css'
// UI 
const chatrooms = document.querySelector('.chatrooms')
const chatul = document.querySelector('.chat-ul');
const chatform = document.querySelector('.chat-form');
const userform = document.querySelector('.user-form')
const msg = document.querySelector('.msg');
const roomtitle = document.querySelector('.roomtitle');


// console.log(userform);
const getlocalname = localStorage.username ? localStorage.username : "Guest";
userform.username.placeholder = `username is ${getlocalname}`;



// Chatroom instance 
const chatroom = Chatroom("general",getlocalname);
roomtitle.textContent = "General";

// Lielement instance
const domli = Lielements(chatul);

// Start chat 
chatform.addEventListener('submit',(e)=>{
     e.preventDefault();
     const message = chatform.message.value.trim();
     chatroom.addChat(message)
          .then(()=>chatform.reset())
          .catch(err=> console.log(err));
});



// Update username
userform.addEventListener('submit',(e)=>{
     e.preventDefault();

     const newusername = userform.username.value.trim();
     chatroom.updateUsername(newusername);
     userform.reset();


     // show & hide msg
     msg.innerText  = `New new name updated to ${newusername}`;
     userform.username.placeholder = `user name is ${newusername}`;
     setTimeout(()=> msg.innerText = '',3000);
})

// Update chat room 
chatrooms.addEventListener('click',(e)=>{
     e.preventDefault();

     const getbtn = e.target.closest('button');
     console.log(getbtn);

     if(getbtn){
          // reset li, clear all previous lis
          domli.resetli();

          const getroomid = getbtn.getAttribute('id');
          console.log(getroomid);
          const gettitle = getbtn.querySelector('h1').innerText;
          // update room title
          roomtitle.textContent = gettitle;

          // update chat room
          chatroom.updateChatroom(getroomid);

          // fetch chat datas
          chatroom.getChats((data)=>{
               domli.newli(data);
          });
     }
});





// What is userform.username?

// JavaScript allows you to access form elements by their name attribute directly from the form object.
// If your form contains an <input> with name="username", then userform.username is equivalent to:
// userform.querySelector('[name="username"]')


// Get chats
chatroom.getChats((data)=>{
     // return data;
     // console.log(data);

     domli.newli(data);
});