import {db} from "./firebase.js";
import {collection,addDoc,onSnapshot, Timestamp, query, where, orderBy, getDocs, deleteDoc, doc} from "firebase/firestore"

export function Chatroom(room,username){

     let curroom = room;
     let curuser = username;
     const dbRef = collection(db,'chats')
     let unsubscribe = null;

     const addChat = async (message)=>{
          const now = new Date();
          const chatdata = {
               username:curuser,
               room:curroom,
               message,
               created_at: Timestamp.fromDate(now)
          }

          try{
               const response = await addDoc(dbRef,chatdata);
               return response;
          }catch(err){
               console.log("Error addchat = ",err)
               throw err;
          }
     }

     const getChats = (callback)=>{
          // onSnapshot(
          //      query(dbRef,where('room','==',curroom),orderBy('created_at'))
          //      ,docSnap=>{
          //      docSnap.forEach((doc)=>{

          //           // console.log(doc.data());
          //           callback(doc.data());
          //      });
          //  });

          // if(unsubscribe){
          //      unsubscribe();
          // }

          if(unsubscribe) unsubscribe();

          unsubscribe = onSnapshot(
               query(dbRef,where('room','==',curroom),orderBy('created_at'))
               ,(docSnap)=>{
               docSnap.docChanges().forEach(item=>{
                    // console.log(item)
                    // console.log(item.doc);

                    if(item.type === 'added'){
                         callback(item.doc.data());
                    }
               });
           });

           console.log(unsubscribe);
     }

     const updateChatroom = (newroom)=>{
          curroom = newroom;
          console.log(`Room changed to ${curroom}`);
     }

     const updateUsername = (newusername)=>{
          curuser = newusername;
          localStorage.setItem('username',curuser);
          console.log(`Username changed to ${curuser}`);
     }


     // Delete all messages every 15s
     const deleteAllMessages = ()=>{
          let deleteinter = setInterval(async()=>{
               try{
                    const getdatas = await getDocs(dbRef);

                    // stop function call if no data in firebase
                    if(getdatas.empty){
                         console.log("No message to delete");
                         clearInterval(deleteinter); // stop the interval

                         return true;
                    }

                    getdatas.forEach(async(getdata)=>{
                         await deleteDoc(doc(db,'chats',getdata.id));
                    });
                    console.log("All messages deleted successfully");
               }catch(error){
                    console.error("Error deleting message: ",error)
               }
          }
          ,15000)
     }
     // deleteAllMessages()

     return {addChat,getChats,updateChatroom,updateUsername};
}


// **** Double message occur when click the one chatroom multiple time.
// **** Because, it listen the same row changes results more than one time.


// () => {
//      i2.eu(), e2.asyncQueue.enqueueAndForget(async () => __PRIVATE_eventManagerUnlisten(await __PRIVATE_getEventManager(e2), s2));
//    }