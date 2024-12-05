import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSingleAuctionById, reset } from "../store/auction/auctionSlice";
import CountDownTimer from "../components/CountDownTimer";
import BidCard from "../components/profile/BidCard";
import { placeABid } from "../store/bid/bidSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendNewBidNotification } from "../store/notification/notificationSlice";
import socket from "../socket";
import { getAllBidsForAuction } from "../store/bid/bidSlice";
import Loading from "../components/Loading";
import LiveHome from "../components/home/LiveHome";
import { API_URL } from "../store/chat/userService.js";
import axios from "axios";

const Chat = ({ noPadding }) => {

  const params = useParams();
  const [users, setUsers] = useState([]);
  const { user } = useSelector((state) => state.auth);


  useEffect(() => {
    const getAllUsers=async () => {
      const response = await axios.get(`${API_URL}/messages`,{
          withCredentials:true
      
      });
      let data = response.data.data;

      setUsers(data);
  }
    getAllUsers();
  }, []);



  const chats = [];
  let inbox = users.find((user) => user._id === params.id);

  const Inbox = ({inbox}) => {

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
      setMessage(e.target.value);
    };

    const handleSendMessage = () => {
      if (message.trim()) {
        let to = inbox._id;
        
        let url = `${API_URL}/messages/`;

        const send = async () => {
          try {
            const response = await axios.post(
              `${API_URL}/messages/`,
              {
                to,
                message
              },
              { withCredentials: true }
            );
            return response.data;
          } catch (error) {
            const message =
              (error.response && error.response.data.message) || error.message;
            return { message, isError: true };
          }
        };
        send().then((data) => {
          if (!data.isError) {
            setMessage('');
            getAllMessages();
          } else {
            alert(data.message);
          }          
        })

      }
    };

    const getAllMessages=async () => {
      let url = `${API_URL}/messages/with/${params.id}`;
      console.log(url);

      const response = await axios.get(url,{
          withCredentials:true
      
      });
      let data = response.data.data;

      setMessages(data);
    }


    useEffect(() => {  
      getAllMessages();
    }, []);
  

    let chat = inbox;
    return (<div className="card bg-dark border-info">
      <div className="card-header d-flex justify-content-between p-3 border-info">
        <ChatHeader avatar={chat.profilePicture} name={chat.fullName}  type={inbox.role} />
      </div>
      <div className="card-body">
      <ul className="list-unstyled" style={{ height: "calc(70vh - 220px)", overflowY: "auto" }}>
      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} inbox={inbox} />
      ))}
    </ul>
    <div className="bg-white  d-inline-flex w-100" style={{height: "50px"}}>

      <textarea 
        placeholder="Type a message..." 
        className="form-control bg-body-tertiary" 
        value={message}
        onChange={handleInputChange}
        rows="2"></textarea>
      <button type="button" className="btn btn-outline-info" onClick={handleSendMessage}>
        <i className="fa fa-paper-plane"></i>
      </button>

      </div>

      </div>
    </div>);
  }

  const MemberCard = ({ id, icon, name, message, count }) => {

    if(!message){ message = {}} 

    let time_ = message.createdAt;
    if (!time_) {
      time_ = "  ";
    };

    let times = time_.split(".")[0].split("T");
    console.log(times);

   return <li className="p-2 border-bottom border-info">
      <a href={"/chat/" + id} className="d-flex justify-content-between text-light text-decoration-none">
        <div className="d-flex flex-row">
          <img
            src={icon}
            alt="avatar"
            className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
            width="60"
          />
          <div className="pt-1">
            <p className="fw-bold mb-0">{name}</p>
            <p className="small">{message.message}</p>
          </div>
        </div>
        <div className="pt-1 text-muted">
        <p className="small mb-1">{times[0]}</p>
        <p className="small mb-1">{times[1]}</p>
        {count && <span className="badge bg-danger float-end">{count}</span>}
        </div>
      </a>
    </li>
  }
  
  const ChatMessage = ({ inbox, message }) => {

    const { user } = useSelector((state) => state.auth);


    let sent = message.from._id !== inbox._id;

    let icon = sent ? user.profilePicture : inbox.profilePicture;
    let name = sent ? (user.fullName ? user.fullName : user.firstname + " " + user.lastname) : (inbox.fullName ? inbox.fullName : inbox.firstname + " " + inbox.lastname);

   return <li className={"d-flex mb-4" + (sent ? " justify-content-end" : "justify-content-start")}>
      <img
        src={icon}
        alt="avatar"
        className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
        width="60"
      />
      <div className="card bg-dark border-info text-light">
        <div className="card-header d-flex justify-content-between p-3">
          <p className="fw-bold mb-0 me-3">{name}</p>
          <p className="text-muted small mb-0">
            <i className="far fa-clock"></i> {message.createdAt.replace("T", " ").split(".")[0]}
          </p>
        </div>
        <div className="card-body">
          <p className="mb-0">{message.message}</p>
        </div>
      </div>
    </li>
  };
  
  const ChatHeader = ({ avatar, name, type }) => (
      <li className="d-flex justify-content-between align-items-center mb-4 w-100">
      <img
        src={avatar}
        alt="avatar"
        className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
        width="60"
      />
      <p className="fw-bold fs-5 mb-0">{name}</p>

      <div className="card bg-dark border-info text-light ">
        <div className="card-body d-flex justify-content-between p-3">
          <p className="text-muted small mb-0">
            <i className="far fa-user me-2"></i>{type}
          </p>
        </div>
      </div>
    </li>

  );


  const ChatSection = () => {
  
    return (
      <section className="bg-transparent text-light">
        <div className="container py-5">
          <div className="row" style={{ height: "70vh", overflowY: "hidden" }}>
            <div className="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
              <div className="card bg-dark border-info">
                <div className="card-header d-flex justify-content-between p-3 border-info">
                  <div className="fs-5 fw-bold text-center">Chats</div>
                </div>

                <div className="card-body">
                  <ul className="list-unstyled mb-0" style={{ height: "calc(70vh - 100px)", overflowY: "auto" }}>
                    {users.map((chat, index) => (
                      <MemberCard key={index} id={chat._id} icon={chat.profilePicture} 
                      name={chat.fullName || (chat.firstname + ' ' + chat.lastname)}
                       message={chat.lastMessage} />
                    ))}
                  </ul>
                </div>

              </div>
            </div>
            <div className="col-md-6 col-lg-7 col-xl-8">
              {inbox ? 
              <Inbox inbox={inbox} /> :
              <div className="card bg-dark border-info h-100">
                <div className="card-body d-flex justify-content-center align-items-center">
                  <div>Please select a chat</div>
                  </div>
              </div>
            }
              
            </div>
          </div>
        </div>
      </section>
    );
  };

return ChatSection();

};

export default Chat;
