import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import { getCurrentUser } from "../../store/auth/authSlice";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { getUserWinnings } from "../../store/bid/bidSlice";
import {API_URL} from "../../store/chat/userService.js";

const stripe = await loadStripe(
  "pk_test_51P5t81Lvvxf0OOpItZ5a94EMI92eFidBTy8oWVF7XTsHTwu17Q9BB292AQjV6s3fjSoWdp60vlG1jG090s6QgDm100UKAL5SIR"
);

const BidPaymentCtr = () => {
  const { user } = useSelector((state) => state.auth);
  const stripe = useStripe();
  const elements = useElements();
  const dispatch=useDispatch()
  const {bid} = useParams();

  const [pay, setPay] = useState(null);

  const [name, setName] = useState(user?.firstname + " " + user?.lastname);
  const [email, setEmail] = useState(user?.email);
  const [address, setAddress] = useState(user?.address);

  const { bids, isLoading, isError, isSuccess, message } = useSelector((state) => state.bid);

  const wonBid = bids.find((b) => b.auction._id === bid);
  console.log(wonBid);

  useEffect(()=>{
    dispatch(getCurrentUser())
    dispatch(getUserWinnings());
  },[])

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: name,
        email: email,
        address: {
          line1: address,
        },
      },
    });


    const on_payment_made = async () => {
      let url = API_URL + "/auctions/update-payment-status/" + wonBid.auction._id;

      const { brand, last4, exp_month, exp_year } = paymentMethod.card;

      let pay = {brand, last4, exp_month, exp_year, bid: wonBid._id, amount: wonBid.bidAmount};

      axios
        .put(url,
          pay,
          { withCredentials: true })
        .then((response) => {

          toast.success("Payment was made successfully");
          setPay(pay);
        })
        .catch((error) => {
          console.error(error);
        });
  
    }

    if (error) {
      ////console.log("[error]", error.message);
    } else {
      ////console.log("[PaymentMethod]", paymentMethod);

      // Send paymentMethod.id to your server
      //use axios
      if (user?.paymentVerified){
        axios
          .post(
            "http://localhost:8000/api/v1/payments/update-payment-method",
            { paymentMethodId: paymentMethod.id },
            { withCredentials: true }
          )
          .then((response) => {
            on_payment_made();
            
          })
          .catch((error) => {
            ////console.error(error);
          });

          ////console.log("Payment method updating........");

        } else {
        axios
          .post(
            "http://localhost:8000/api/v1/payments/add-payment-method",
            {
              paymentMethodId: paymentMethod.id,
            },
            { withCredentials: true }
          )
          .then((response) => {
            if (response.status === 200) {
              toast.success("Payment was made successfully");
              on_payment_made();
            } else {
              ////console.log("Failed to add payment method");
            }
          })
          .catch((error) => {
            ////console.error(error);
          });
          ////console.log("Payment method adding........");

      }
    }
  };

  return (
    <div className="p-4 pb-5 w-100 bg-dark rounded-lg">
      <h1 className="text-white fw-bold fs-4 border-bottom border-light pb-3 mb-4">
        Pay for auction
      </h1>
      <div className="row">
      <div className="col-6">
        {wonBid && <table className="table table-bordered text-white">
          <tbody>
          <tr>
              <td>Auction name</td>
              <td>{wonBid.auction.name}</td>
            </tr>
            <tr>
              <td>Auction category</td>
              <td>{wonBid.auction.category.name}</td>
            </tr>
            <tr>
              <td>Bid time</td>
              <td>{wonBid.bidTime}</td>
            </tr>
            <tr>
              <td>Seller</td>
              <td>{wonBid.auction.seller.firstname + " " + wonBid.auction.seller.lastname}</td>
            </tr>
            <tr>
              <td>Bid amount</td>
              <td>$ {wonBid.bidAmount}</td>
            </tr>
          </tbody>
        </table>}

      </div>
      <div className="col-6">
      {/* let pay = {brand, last4, exp_month, exp_year, bid: wonBid._id, amount: wonBid.bidAmount}; */}

      {pay ?
        <>
          <div className="fs-4 fw-bold text-white w-100 border-bottom border-light pb-2">
            Payment Reciept
            <button onClick={() => window.print_recept("receipt")} className="btn btn-outline-primary float-end"><i className="fa fa-print"></i></button>
          </div>

          <div id="receipt" className="card bg-light border-light mt-2 p-1">
            <div className="card-header p-0 m-0">
              <div className="d-inline-flex w-100 p-2" style={{backgroundColor: "#2C3252"}}>

                  <h1 className="ps-3 fs-3 fw-bold text-white">
                    <span style={{"color": "#159AED"}}>A</span><span style={{"color": "#FFF"}}>rt</span>
                    <span style={{"color": "#159AED"}}>F</span><span style={{"color": "#FFF"}}>olio</span>
                  </h1>
              </div>
              <div className="d-inline-flex w-100 p-1 justify-content-end text-white" style={{backgroundColor: "#5D617C"}}>
                {new Date().toLocaleDateString()} {" "} { new Date().toLocaleTimeString()}
              </div>
            </div>
            <div className="card-body">
              <div className="fs-5 fw-bold">Auction Payment Reciept</div>

              <table className="table table-bordered mt-2">
                <tbody>
                <tr>
                    <td style={{"width": "50%"}}>Reference Number</td>
                    <td style={{"width": "50%"}}>{wonBid._id}</td>
                  </tr>
                  <tr>
                    <td style={{"width": "50%"}}>Transfer To</td>
                    <td style={{"width": "50%"}}>{wonBid.auction.seller.firstname + " " + wonBid.auction.seller.lastname}</td>
                  </tr>
                  <tr>
                    <td style={{"width": "50%"}}>Auction Name</td>
                    <td style={{"width": "50%"}}>{wonBid.auction.name}</td>
                  </tr>
                  <tr>
                    <td style={{"width": "50%"}}>Card Number</td>
                    <td style={{"width": "50%"}}>{"xxxx-xxxx-xxxx-" + pay.last4}</td>
                  </tr>
                  <tr>
                    <td style={{"width": "50%"}}>Card Type</td>
                    <td style={{"width": "50%"}}>{pay.brand}</td>
                  </tr>
                  <tr>
                    <td style={{"width": "50%"}}>Amount</td>
                    <td style={{"width": "50%"}}>$ {pay.amount}</td>
                  </tr>
                  <tr>
                    <td style={{"width": "50%"}}>Purpose</td>
                    <td style={{"width": "50%"}}>Payment for auction</td>
                  </tr>
                </tbody>
              </table>

              <div className="text-center border-top border-light mt-3 pt-3">
                Thank you for using ArtFolio
              </div>
            </div>
          </div>
        </> :
        <form
          onSubmit={handleSubmit}
          className="d-flex flex-column gap-3" // Centering and spacing
          style={{ maxWidth: '450px' }} // Setting max width
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name on card"
            className="form-control bg-light border border-light rounded-md"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="form-control bg-light border border-light rounded-md"
            required
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            className="form-control bg-light border border-light rounded-md"
            required
          />
          <CardElement
            className="form-control bg-white border border-light rounded-md px-2 py-3"
          />
          <button
            type="submit"
            disabled={!stripe}
            className="btn btn-primary text-white rounded-lg px-3 py-2 mt-3"
          >
            Pay
          </button>
        </form>
        }

      </div>
      </div>
    </div>
  );

};

const BidPayment = () => {

  return (
    <Elements stripe={stripe}>
      <BidPaymentCtr />
    </Elements>
  );
};

export default BidPayment;
