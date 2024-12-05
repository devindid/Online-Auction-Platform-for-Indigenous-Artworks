import { Link, Route, Routes } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProfileComponent from "../components/ProfileComponent";
import AllUsers from "../components/AllUsers";
import EditUser from "../components/EditUser";
import AllAuctions from "../components/auctions/AllAuctions";
import EditAuction from "../components/auctions/EditAuction";

import ErrorPage from "./ErrorPage";
import AllCategories from "../components/AllCategories";
import EditCategory from "../components/EditCategory";
import CreateCategory from "../components/CreateCategory";
import SingleAuctionDetail from "../../pages/SingleAuctionDetail"
import Messages from "../components/Messages";

const Dashboard = () => {

  return (
    <div className="container-fluid">
      <div className="row gx-4 gy-4 p-3">
        <div className="col-lg-3 d-none d-lg-block">
          <Sidebar />
        </div>

        <div className="col-lg-9">
          <Routes>
            <Route path="/" element={<AllUsers />} />
            <Route path="/users/" element={<AllUsers />} />
            <Route path="/messages/" element={<Messages />} />
            <Route path="/users/profile/:id" element={<ProfileComponent />} />
            <Route path="/users/edit/:id" element={<EditUser />} />
            <Route path="/auctions/*" element={<AllAuctions />} />
            <Route path="/auctions/edit/:id" element={<EditAuction />} />
            <Route path="/auctions/view/:id" element={<SingleAuctionDetail noPadding />} />
            <Route path="/categories/*" element={<AllCategories />} />
            <Route path="/categories/edit/:id" element={<EditCategory />} />
            <Route path="/categories/create-category" element={<CreateCategory />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );


};

export default Dashboard;
