import { Link, Route, Routes } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChangePassword from "./auth/ChangePassword";
import ProfileComponent from "../components/ProfileComponent";
import ManageItems from "../components/ManageItems";
import BidsItem from "../components/profile/BidsItem";
import Notifications from "../components/Notifications";
import AccountSetting from "../components/AccountSetting";
import {SellerRoutes} from '../auth/Protected'
import PaymentMethod from "../components/PaymentMethod";
import Cart from "../components/Cart";
import ErrorPage from "./ErrorPage";
import img from "../assets/profile-bg.png";
import AuctionWinners from "../components/profile/AuctionWinners";
import ParticipatedAuctions from "../components/profile/ParticipatedAuctions";
import MyWinnings from "../components/profile/MyWinnings";
import BidPayment from "../components/profile/BidPayment";
import PaymentReport from "../components/profile/PaymentReport";




const UserProfile = () => {

  return (
    <div className="">
      {/* Hero Section */}
      <div className="d-flex" 
      style={{ height: '280px', position: 'relative'}}>
        <img src={ img } style={{ width: '100%', position: 'absolute', top: '0%' }} alt="Background" />
        <div className="position-absolute top-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white">
        <h1 className="text-center fw-bold display-4">My Profile</h1>
        <div className="d-flex gap-2 fw-medium pt-2">
          <Link to="/" className="text-decoration-none text-light hover-text-primary">
            Home
          </Link>
          <span>/</span>
          <span className="text-primary">My Profile</span>
        </div>

        </div>
      </div>
  
      {/* Main Content Section */}
      <div className="d-flex gap-4 p-4 flex-wrap flex-lg-nowrap">
        <Sidebar />
        <Routes>
          <Route path="/profile" element={<ProfileComponent />} />
          <Route element={<SellerRoutes />}>
            <Route path="/manage-items" element={<ManageItems />} />
          </Route>
          <Route path="/winnings" element={<MyWinnings />} />
          <Route path="/pay/:bid" element={<BidPayment />} />
          <Route path="/report/:bid" element={<PaymentReport />} />

          <Route path="/auction-history" element={<ParticipatedAuctions />} />
          <Route path="/auction-winners" element={<AuctionWinners />} />
          
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/account-settings" element={<AccountSetting />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/payment-method" element={<PaymentMethod />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/logout" element={<ChangePassword />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </div>
  );
  
  return (
    <div className="">
      <div className="text-white flex items-center justify-center flex-col h-[280px] bg-hero-img bg-cover">
        <h1 className="text-center font-bold text-3xl">Profile</h1>
        <div className="flex gap-2 font-medium pt-2">
          <Link
            to="/"
            className=" no-underline hover:text-theme-color transition-all"
          >
            Home
          </Link>
          <span>/</span>
          <span className="text-theme-color">Profile</span>
        </div>
      </div>
      <div className="flex gap-4 px-5 py-10 flex-wrap lg:flex-nowrap ">
        <Sidebar />
        <Routes>
          <Route path="/profile" element={<ProfileComponent />} />

          <Route element={<SellerRoutes />}>
            <Route path="/manage-items" element={<ManageItems />} />

          </Route>
          <Route path="/bids-items" element={<BidsItem />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/account-settings" element={<AccountSetting />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/payment-method" element={<PaymentMethod />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/logout" element={<ChangePassword />} />
          <Route path="*" element={<ErrorPage />} />


        </Routes>
      </div>
    </div>
  );
};

export default UserProfile;
