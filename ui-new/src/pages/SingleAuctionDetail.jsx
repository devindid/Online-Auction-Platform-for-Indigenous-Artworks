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
import { convert_currency, get_currency_symbol, reverse_convert_currency } from "../currency.js";

const SingleAuctionDetail = ({ noPadding }) => {
  const [newBidAmount, setNewBidAmount] = useState("");
  const logInUser = JSON.parse(localStorage.getItem("user"));
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("description");
  const params = useParams();
  const dispatch = useDispatch();
  const { singleAuction } = useSelector((state) => state.auction);
  const { bids } = useSelector((state) => state.bid);
  const [auctionStarted, setAuctionStarted] = useState(false);
  const [singleAuctionData, setSingleAuctionData] = useState();
  const [auctionWinnerDetailData, setAuctionWinnerDetailData] = useState();
  const [bidsData, setBidsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const auctionStartTime = new Date(singleAuction?.startTime).getTime();
      const auctionEndTime = new Date(singleAuction?.endTime).getTime();

      if (
        currentTime >= auctionStartTime &&
        currentTime <= auctionEndTime &&
        !auctionStarted
      ) {
        setAuctionStarted(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [singleAuction?.startTime]);

  socket.on("winnerSelected", async (data) => {
    setAuctionStarted(false);

    setAuctionWinnerDetailData(data);
    
  });

  const handleWinner = () => {
    socket.emit("selectWinner", params?.id);
  };

  useEffect(() => {
    setIsLoading(true);

    Promise.all([dispatch(getSingleAuctionById(params?.id))]).then(() => {
      setIsLoading(false);
    });
    dispatch(getAllBidsForAuction(params?.id));
  }, [params?.id]);

  socket.on("newBidData", async (data) => {
    setBidsData([
      {
        _id: new Date().getTime(),
        bidder: {
          fullName: data.fullName,
          profilePicture: data.profilePicture,
        },
        bidAmount: data.bidAmount,
        bidTime: data.bidTime,
        auction: data.auctionId,
      },
      ...bidsData,
    ]);

    
    setSingleAuctionData((prevState) => ({
      ...prevState,
      startingPrice: data.bidAmount,
    }));
    
    // handleNewBid()
  });

  useEffect(() => {
  }, [bidsData]);

  useEffect(() => {
    setBidsData(bids);
    setSingleAuctionData(singleAuction);
  }, [bids, singleAuction]);

  useEffect(() => {
    socket.on("connect", () => {
    });
    socket.emit("joinAuction", logInUser?._id);
    socket.on("newUserJoined", (data) => {
      
    });
  }, []);

  const placeBidHandle = async (e) => {
    e.preventDefault();

    const amount = reverse_convert_currency(newBidAmount).value;

    if (user?.paymentVerified === false) {
      toast.info(
        "Please verify your payment method to place a bid. Go to settings..."
      );
    }
    let bidData = {
      id: params.id,
      amount: amount,
    };
    if (amount <= singleAuctionData?.startingPrice) {
      toast.info("Bid amount should be greater than the currnt bid");
    } else if (singleAuction?.endTime < new Date().getTime() / 1000) {
      toast.info("Auction time is over");
    } else {
      dispatch(placeABid(bidData));
      setNewBidAmount("");
 
      socket.emit("newBid", {
        profilePicture: logInUser?.profilePicture,
        fullName: logInUser?.fullName,
        bidAmount: amount,
        bidTime: new Date().getTime(),
        auctionId: params.id,
      });

      await socket.emit("sendNewBidNotification", {
        auctionId: params.id,
        type: "BID_PLACED",
        newBidAmount: amount,
        fullName: logInUser?.fullName,
        id: logInUser?._id,
      });
      setActiveTab("bids");
      dispatch(
        sendNewBidNotification({
          auctionId: params.id,
          type: "BID_PLACED",
          newBidAmount: amount,
        })
      );
    }
  };
  if (isLoading) {
    return <Loading />;
  }

  const TabButton = ({id, name}) => {
    return (
      <button
        className={`btn rounded-pill px-4 py-2 ${activeTab === id
            ? "btn-primary"
            : "btn-secondary text-light"}`}
        onClick={() => setActiveTab(id)}
      >
        {name}
      </button>
  );
  }

  const Others = () => {
    const price = convert_currency(singleAuctionData?.startingPrice ?? 0);

    return (
    <>
              <div>
            {/* Description */}
            <div
              id="description"
              className={`pt-3 border-top border-info ${
                activeTab === "description" ? "d-block" : "d-none"
              }`}
            >
              <h3 className="text-light font-weight-medium">Description</h3>
              <p className="text-light">
                {singleAuction?.description}
              </p>
            </div>

            {/* Bids */}
            <div
              id="bids"
              className={`pt-3 border-top border-info ${
                activeTab === "bids" ? "d-block" : "d-none"
              }`}
              style={{ maxHeight: '250px', overflowY: 'auto' }}
            >
              {singleAuction?.bids?.length > 0 || bidsData.length > 0 ? (
                bidsData?.map((bid) => <BidCard key={bid._id} bid={bid} />)
              ) : (
                <h1 className="text-light">No bids yet</h1>
              )}
            </div>
          </div>

          {/* Countdown timer */}
          <div className="pt-3 border-top border-info">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex flex-column gap-2">
                <h3 className="text-light font-weight-medium">
                  {singleAuction?.bids?.length > 0 ? "Current Bid" : "Starting Price"}
                </h3>
                <p className="text-light">
                  {price.symbol} {price.value}
                </p>
              </div>
              <div className="d-flex flex-column gap-2">
                <h3 className="text-light font-weight-medium">Time</h3>
                <p className="text-light">
                  <CountDownTimer
                    startTime={singleAuction?.startTime}
                    endTime={singleAuction?.endTime}
                    id={singleAuction?._id}
                    Winner={handleWinner}
                  />
                </p>
              </div>
            </div>
          </div>

          {/* Detail about current bid and timer */}
          <div className="pt-3 border-top border-info">
            {singleAuction?.status === "over" || auctionWinnerDetailData ? (
              bidsData.length > 0 ? (
                <div>
                  <h1 className="font-weight-bold text-light">Winner</h1>
                  <div className="d-flex justify-content-between align-items-center border mt-2 py-1 px-2 rounded-pill border-light">
                    <div className="d-flex align-items-center text-light">
                      <img
                        src={
                          auctionWinnerDetailData?.bidder?.profilePicture ||
                          singleAuction?.winner?.bidder?.profilePicture
                        }
                        alt="bidder profilePicture"
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px' }}
                      />
                      <div className="d-flex flex-column ms-2">
                        <span className="font-weight-semibold">
                          {auctionWinnerDetailData?.bidder?.fullName ||
                            singleAuction?.winner?.bidder?.fullName}
                        </span>
                        <span className="text-muted">
                          {new Date(
                            auctionWinnerDetailData?.bidTime ||
                              singleAuction?.winner?.bidTime
                          ).toLocaleDateString()}{" "}
                          {new Date(
                            auctionWinnerDetailData?.bidTime ||
                              singleAuction?.winner?.bidTime
                          ).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-light">
                      Bid Amount: {get_currency_symbol()}
                      {convert_currency(auctionWinnerDetailData?.bidAmount ||
                        singleAuction?.winner?.bidAmount).value}
                    </div>
                  </div>
                </div>
              ) : (
                <h1 className="text-light">No bids</h1>
              )
            ) : (
              auctionStarted && (
                <form
                  className="d-flex flex-wrap gap-3 align-items-center"
                  onSubmit={placeBidHandle}
                >
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter your bid"
                    value={newBidAmount}
                    onChange={(e) => setNewBidAmount(e.target.value)}
                    required
                  />
                  {logInUser ? (
                    user?.paymentVerified ? (
                      <button
                        type="submit"
                        disabled={
                          singleAuction?.seller?._id === logInUser?._id
                            ? true
                            : !auctionStarted
                        }
                        className={`btn ${
                          singleAuction?.seller?._id === logInUser?._id
                            ? "btn-secondary"
                            : "btn-primary"
                        } ${!auctionStarted ? "btn-secondary" : "btn-primary"}`}
                      >
                        Place Bid
                      </button>
                    ) : (
                      <Link
                        to="/user-profile/payment-method"
                        className="btn btn-primary"
                      >
                        Attach Payment Method to Bid
                      </Link>
                    )
                  ) : (
                    <Link
                      to="/login"
                      className="btn btn-primary"
                    >
                      Place Bid
                    </Link>
                  )}
                </form>
              )
            )}
          </div>

    </>
    );

  }

  const Comments = () => {

    const auction = singleAuction;
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    const getAll = async () => {
      const response = await axios.get(`${API_URL}/comments/auction/${auction._id}`,{
        withCredentials:true
    
    });
    let data = response.data.data;

    setComments(data);
    }

    useEffect(() => {
      getAll();
    }, []);


    const placeComment = async () => {
      if (comment.trim() === "") {
        alert("Please enter a comment!");
        return;
      }
      const response = await axios.post(`${API_URL}/comments/`,{
        comment, auction: auction._id
      },{
        withCredentials:true
      });

      setComment("");
      getAll();

    }

    console.log(comments);

    const Comments = () => {
      return comments.map((comment) => {
        return (<div className="border mt-2 py-2 px-3 border-light" 
            style={{maxWidth: "100%"}}>
            <div className="d-flex gap-4 align-items-center text-white border-bottom border-light pb-2">
                <img src={comment?.user?.profilePicture} alt="bidder profilePicture" className="rounded-circle" 
                style={{width: "40px", height: "40px"}} />
                <div className="d-flex flex-column">
                    <span className="fw-semibold">{comment?.user?.firstname + " " + comment?.user?.lastname}</span>
                    <span className="text-muted" style={{fontSize: "0.75rem"}}>
                      {comment?.createdAt.split(".")[0].replace("T", " ")}
                    </span>
                </div>
            </div>
            <div className="text-white p-2 mt-1" >{comment?.comment}</div>
        </div>);
      });

    }

    return (
     <>

     <div className="d-inline-flex w-100">
      <textarea
        className="form-control"
        placeholder="Enter your comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
      ></textarea>
      <button type="button" onClick={placeComment} className={"btn btn-primary"}>
        <i className="fas fa-paper-plane"></i>
      </button>
     </div>

     <div className="w-100">
     {comments.length === 0 && <div className="text-white">No Comments yet</div>}
     {comments.length !== 0 && <Comments/>}
     </div>
     </> 
    );
  }

  return (
    <>
      <div
        className={`d-flex flex-nowrap justify-content-between align-items-center px-3 py-5 px-lg-4 gap-3 gap-lg-5 ${noPadding ? "py-0 px-0" : ""}`}
        id="item01"
      >
        <img
          className="rounded"
          src={singleAuction?.image}
          alt="product image"
          style={{width: "50%", aspectRatio: "1 / 1", objectFit: "cover"}}
        />
        <div className="w-100 d-flex flex-column">
          <div>
            <h2 className="h2 text-white font-weight-bold">
              {singleAuction?.name}
            </h2>

            <div className="pt-3 d-flex flex-wrap gap-2">
              <a
                href="#"
                className="btn btn-outline-info rounded-pill px-3 py-1 text-light"
              >
                {singleAuction?.category?.name}
              </a>
              <a
                href="#"
                className="btn btn-outline-info rounded-pill px-3 py-1 text-light"
              >
                {singleAuction?.seller?.city}
              </a>
            </div>
          </div>

          <div className="pt-3 border-top border-info">
            {/* Creator */}
            <div className="d-flex gap-4">
              <div id="author-item" className="text-light">
                <span className="font-weight-medium">Seller</span>
                <div id="author-info" className="d-flex align-items-center gap-2 pt-2">
                  <img
                    src={singleAuction?.seller?.profilePicture}
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: '45px' }}
                  />
                  <a href="#" className="font-weight-medium text-decoration-none text-white">
                    {singleAuction?.seller?.fullName}
                  </a>
                </div>
              </div>
            </div>

            {/* TABS buttons */}
            <div className="d-flex gap-3 pt-3">
            <TabButton id={"description"} name={"Details"} />
            <TabButton id={"bids"} name={"Bids"} />
            <TabButton id={"comment"} name={"Comments"} />
              <a
                className={`btn rounded-pill px-4 py-2 btn-secondary text-light`}
                href={`/chat/${singleAuction?.seller?._id}`}
              >
                Chat
              </a>

            </div>
          </div>

          {activeTab !== "comment" && <Others/>}
          {activeTab === "comment" && <Comments/>}
          
        </div>
      </div>
    </>
  );

};

export default SingleAuctionDetail;
