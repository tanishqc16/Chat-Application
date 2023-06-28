import "./App.css";
import io from "socket.io-client";
import {useState} from "react";
import Chat from './Chat';

const socket = io.connect("http://localhost:3001");

function App() {

  const[username, setUsername] = useState("");       // Usestate for username
  const[roomcode, setRoomcode] = useState("");       // Usestate for joining room
  const[showchat, setshowchat] = useState(false);       // Usestate to chat chat when user joins room


  const joinRoom=()=>{
    if (username !== "" && roomcode !== "") {
      socket.emit("join_room", roomcode, username);
      setshowchat(true);
    }
  };

  return (
    <div className="App">
      {!showchat?(
      <div className="joinChatContainer">
      <h3>CHIT CHAT</h3>
      <input
        type="text"
        placeholder="eg. Tanishq"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <input
        type="text"
        onChange={(event) => {
          setRoomcode(event.target.value);
        }}
        onKeyDown={(event)=>{
          event.key === "Enter" && joinRoom();
      }}
      />
      <button onClick={joinRoom}>Join</button>
      </div>
      )
      :(
      <Chat socket={socket} username={username} roomcode={roomcode}/>
      )}
      </div>
  );
}

export default App;