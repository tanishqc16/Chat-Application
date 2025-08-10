import React, { useEffect} from 'react';
import {useState} from "react";
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({socket, username, roomcode}) {           //Passing props from App.js to Chat.js
  
    const[message, setMessage]=useState("");            // Create useState hook to keep track of message
    const[messagelist, setMessagelist]=useState([]);            // Create useState hook to keep track of message
    
    const sendMessage = async () => {
        if(message !==""){                              // Check whether message is empty or not
            const messageInfo = {
                room : roomcode,
                sender : username,
                message : message,
            }
            await socket.emit("send_message", messageInfo)
            setMessagelist((list)=>[...list, messageInfo]);
            console.log("messageInfo send", messageInfo);
            setMessage("");
        }
    }

    useEffect(()=>{   
        socket.on("messageRecieve", (data)=>{
            console.log("data", data);
            setMessagelist((list)=>[...list, data]);
            console.log("messageInfo recienve", data);
        })
    }, [socket]);

    return (
    <div className='chat-window'>
        <div className="chat-header">
            <p style={{color:'black'}}>Smart Dumbasses</p>
        </div>
        <div className="chat-body">
            <ScrollToBottom className='message-container'>
            {messagelist.map((messageContent)=>{
                return <div className="message" id={username === messageContent.sender ? "other" : "you"}>
                    <div>
                        <div className="message-meta">
                            <p id='author'>{messageContent.sender}</p>
                        </div>
                        <div className="message-content">
                            <p>{messageContent.message}</p>
                        </div>
                    </div>
                </div>
            })}
            </ScrollToBottom>
        </div>
        <div className="chat-footer">
            <input type="text" value={message} placeholder="Message" 
                onChange={(event) => {
                    setMessage(event.target.value);
                }}
                onKeyDown={(event)=>{
                    event.key === "Enter" && sendMessage();
                }}
            />
            <button onClick={sendMessage}>&#9658;</button>
        </div>
    </div>
  )
}

export default Chat
