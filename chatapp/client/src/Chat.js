import { useState, useRef, useEffect } from 'react';
// import usersData from './users.json';
import axios from 'axios';
// import messagesData from './messages.json';

function Chat({ username, handleLogout }) {
    // const [messages, setMessages] = useState([])
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([])
    // const users = usersData.users;
    const chatBoxRef = useRef(null);

    // Handles messages entered by the user
    const handleSubmit = async (event) => {
        event.preventDefault();
        const messageInput = event.target.elements.message;
        const newMessageContent = messageInput.value;

        try {
            const response = await axios.post('http://localhost:5000/messages', {
                user_name: username,
                message: newMessageContent,
            });
            const newMessage = response.data;
            // setMessages([...messages, newMessage]);
            fetchUserMessage();
            messageInput.value = '';
        } catch (error) {
            console.error(error);
        }
    };

    // Gets list of current logged in users and displayes them in the user box
    useEffect(() => {
        console.log("useEffect function to list users has ran")
        // Fetch the list of users from the server when the component mounts
        axios.get('http://localhost:5000/users')
            .then(response => setUsers(response.data.users))
            .catch(error => console.error(error));
    }, []);

    // Gets the messasges from the server on startup
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/messages');
                setMessages(response.data.messages);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMessages();
    }, []);

    // This function allows the user who just submitted a message to see their message they just typed in.
    // Adding the variable "messages" to the useEffect only causes unnessary pings to the server every second.
    async function fetchUserMessage() {
        try {
            const response = await axios.get('http://localhost:5000/messages');
            setMessages(response.data.messages);
        } catch (error) {
            console.error(error);
        }
    };

    // Scroll to the bottom of the message container when a new message is received
    useEffect(() => {
        if (chatBoxRef && chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            <h1>SUPER SIMPLE CHAT</h1>
            <div className="container">
                <div className="row">
                    <div className="col-md-2">
                        <div className="user-list-box border border-primary border-2" style={{ minHeight: '475px', overflowY: 'auto' }}>
                            <h4 className="user-list-heading border border-primary border-2">Users</h4>
                            <ul className="list-unstyled">
                                <li>{username}</li>
                                {users.map((user) => {
                                    if (user.name !== username) {
                                        return <li key={user.id}>{user.name}</li>;
                                    } else {
                                        return null;
                                    }
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-10">
                        <div className="row h-100">
                            <div className="col-md-12">
                                <div className="chat-box border-primary h-100 overflow-auto" style={{ minHeight: '400px', maxHeight: "400px", overflowY: 'auto' }} ref={chatBoxRef}>
                                    {messages.map((message) => (
                                        <div className="outgoing-message" key={message.message_id}>
                                            <span className="message-user pull-left">{message.user_name}:</span> {message.message}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-md-12">
                                <form
                                    className="d-flex flex-row justify-content-between align-items-center m-0 p-0 mt-4"
                                    onSubmit={handleSubmit}
                                >
                                    <input
                                        className="form-control w-100 border-primary"
                                        type="text"
                                        placeholder="Enter your message here"
                                        aria-label="Search"
                                        name="message"
                                    />
                                    <button className="btn btn-outline-success border-primary" type="submit">Send</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chat