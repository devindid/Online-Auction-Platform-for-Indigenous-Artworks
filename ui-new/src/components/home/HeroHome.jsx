import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import herovector from "../../assets/heroimg.png";
import { RiFindReplaceLine } from "react-icons/ri";
const HeroHome = () => {
  const logInUser = JSON.parse(localStorage.getItem("user"));


return  (<>
  <div class="container-fluid text-center p-5" 
  style={{"height": "60vh",width: "100%"}}>
  <div class="row d-flex justify-content-center align-items-center">
     <div class="col-6 text-white text-start p-4">
         <span class="fs-6 " style={{"text-transform": "uppercase"}}>Discover, Collect and Sell</span><br/>
         <span class="fs-1 fw-bold">Discover Rare Artworks And Bid in Real-Time</span><br/>
         <span>Our real-time auctions let you join the thrill of selling, hunting and bidding live
              on rare Artworks. Explore our listings to start bidding or sell your own artworks!</span>
         <br />
         <br />
         
         <button 
         class="btn btn-primary text-white rounded rounded-3 mt-3 ms-2"
         onClick={() => logInUser ? window.location.href = "/create-auction" : window.location.href = "/login"} 
         >Create Now<i class="fa fa-arrow-right ps-2"></i></button>
     </div>
      <div class="col-6">
         <img src={herovector} style={{"height": "60vh"}}/>
      </div>
  </div>

  </div>
  </>);
  
};

export default HeroHome;
