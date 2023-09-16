import "./App.css";
import watss from "./assets/wats2.jpg";
import chat from "./chatt.json";
import Lottie from "lottie-react";
import {
  Box,
  Button,
  Container,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import Message from "./components/Message";
import { onAuthStateChanged, signOut, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./Firebase";
import { useEffect, useRef, useState } from "react";
import {getFirestore,addDoc, collection, serverTimestamp,onSnapshot,query,orderBy} from "firebase/firestore"
import { color } from "framer-motion";



const auth = getAuth(app);
const db=getFirestore(app);

const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};
const logoutHandler=()=> signOut(auth);




function App() {
  
  const [user,setUser]=useState(false);
  const [message,setMessage]=useState("");
  const [messages,setMessages]=useState([]);
  const divforscroll=useRef(null);


  const submitHandler= async(e)=>{
    e.preventDefault();
    try {
      setMessage("");
      await addDoc(collection(db,"Messages"),{
        text:message,
        uid:user.uid,
        uri:user.photoURL,
        createdAt:serverTimestamp()
      })
      
      divforscroll.current.scrollIntoView({ behavior :"smooth"});
  
      
    } catch (error) {
      alert(error);
      
    }
  }

  useEffect(()=>{
    const q=query(collection(db,"Messages"),orderBy("createdAt","asc"));
     const unsubscribe=onAuthStateChanged(auth,(data)=>{
      setUser(data);
    });
   const unsubscribeFormsg= onSnapshot(q,(snap)=>{
      setMessages(
        snap.docs.map((item)=>{
        const id=item.id;
        return {id, ...item.data()}
      })
      );
    })
    return()=>{
      unsubscribe();
      unsubscribeFormsg();
    }
  },[])
  return (
    <Box bg={"black"}>
      {user ? (
        <Container h={"100vh"} bgImage={watss} bgPosition={"center"} bgSize={"cover"} border={"2px solid black"}>
          <VStack h="full" paddingY={3}>
            <Button onClick={logoutHandler} colorScheme={"red"} w={"full"} mt={3}>
              Logout
            </Button>
            <VStack 
            h="full" w={"full"} 
            overflowY={"auto"} 
            css={{"&::-webkit-scrollbar":{display:"none",},}}>
              {
                messages.map(item=>(
                  <Message 
                  key={item.id}
                  text={item.text} 
                  uri={item.uri} 
                  user={item.uid===user.uid ? "me" :"other"} />
                ))
              }

            <div ref={divforscroll}></div>
            </VStack>
            <form onSubmit={submitHandler} style={{ width: "100%" }}>
              <HStack>
                <Input color={"white"} value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Enter a Message.." />
                <Button colorScheme="green" type="submit">
                  Send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack justifyContent={'center'} h="100vh" bgColor={"black"} padding={"8px"} >
          <Lottie animationData={chat} />
          <Button onClick={loginHandler} bgColor={"blue.400"} color={"black"}>Sign In with Google</Button>
        </VStack>
      )}
    </Box>
  );
}

export default App;
