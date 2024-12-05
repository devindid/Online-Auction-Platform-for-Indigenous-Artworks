import { Link } from "react-router-dom";
import CountDownTimer from "../components/CountDownTimer";
import { useState } from "react";
import { RiShoppingBagFill } from "react-icons/ri";
import { BsCurrencyDollar } from "react-icons/bs";
import socket from "../socket";
import { convert_currency } from "../currency";
// eslint-disable-next-line react/prop-types
const SingleAuction = ({
  name,
  startingPrice,
  image,
  endTime,
  startTime,
  id,
  status,
  sellerImage,
  sellerName,
  sellerId,
  winnerFullName,
  bidLength,
  winnerProfilePicture,
  winnerBidAmount,
  winnerBidTime,
}) => {
  const [statusData, setStatusData] = useState(status);

  socket.on("setStatus", async () => {
    await setStatusData("over");
    ////console.log("handlewinner func in dashboard.,,,,,,,,,,");
  });

  const logInUser = JSON.parse(localStorage.getItem("user"));

  const price = convert_currency(startingPrice ?? 0);

  return (
    <div className="h-100 d-flex flex-column justify-content-between bg-dark rounded text-white p-3">
      <div>
        <div className="position-relative bg-white rounded overflow-hidden w-100">
          <img
            className="w-100 object-contain rounded transition-transform hover-transform"
            style={{ height: "300px" }}
            src={image}
            alt="item image"
          />
          <div className="position-absolute bottom-0 end-0 border border-primary rounded-pill py-1 px-3 text-sm bg-dark bg-opacity-75">
            <CountDownTimer
              startTime={startTime}
              endTime={endTime}
              status={status}
              id={id}
            />
          </div>
        </div>
        <h3 className="my-3 fs-5 fw-bold">{name}</h3>
      </div>
      <div>
        <div className="d-flex align-items-center">
          <img
            src={sellerImage}
            className="rounded-circle"
            style={{ width: "36px", height: "36px" }}
            alt="seller image"
          />
          <div className="ms-3">
            <h3 className="fs-6">{sellerName}</h3>
          </div>
        </div>
        {statusData === "over" ? (
          <div className="d-flex justify-content-between align-items-center my-2 border-top pt-2">
            <Link
              to={`/single-auction-detail/${id}`}
              className="btn btn-danger w-100 text-center mt-3"
            >
              View
            </Link>
          </div>
        ) : (
          <div className="d-flex justify-content-between align-items-center my-2 border-top pt-2">
            <div className="d-flex flex-column">
              <p className="mb-1 small">Current Bid</p>
              <p className="mt-2">{price.symbol} {price.value}</p>
            </div>
            <Link
              to={`/single-auction-detail/${id}`}
              className={`d-flex align-items-center gap-2 text-white fw-bold rounded px-3 py-2 text-center btn btn-primary hover-danger`}
            >
              
              <span>Place Bid</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
  

};

export default SingleAuction;
