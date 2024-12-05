import { Link, Route, Routes } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AllAuctions from "../components/auctions/AllAuctions";
import EditAuction from "../components/auctions/EditAuction";
import CreateAuction from "../components/auctions/CreateAuction";

import ErrorPage from "./ErrorPage";
import SingleAuctionDetail from "../../pages/SingleAuctionDetail"
import AuctionWinners from "../components/AuctionWinners";
import Delivery from "../components/delivery/Delivery";
import AddDelivery from "../components/delivery/AddDelivery";
import EditDelivery from "../components/delivery/EditDelivery";
import ViewDelivery from "../components/delivery/ViewDelivery";

const Dashboard = () => {

  return (
    <div className="container-fluid">
      <div className="row gx-4 gy-4 p-3">
        <div className="col-lg-3 d-none d-lg-block">
          <Sidebar />
        </div>

        <div className="col-lg-9">
          <Routes>
            <Route path="/" element={<AllAuctions />} />

            <Route path="/auctions/*" element={<AllAuctions />} />
            <Route path="/auctions/create/" element={<CreateAuction />} />
            <Route path="/auctions/edit/:id" element={<EditAuction />} />
            <Route path="/auctions/view/:id" element={<SingleAuctionDetail noPadding />} />

            <Route path="/delivery/*" element={<Delivery />} />
            <Route path="/delivery/create/" element={<AddDelivery />} />
            <Route path="/delivery/edit/:id" element={<EditDelivery />} />
            <Route path="/delivery/view/:id" element={<ViewDelivery />} />



            <Route path="/winners" element={<AuctionWinners />} />

            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );


};

export default Dashboard;
