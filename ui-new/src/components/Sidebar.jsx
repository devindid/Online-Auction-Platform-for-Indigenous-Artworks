import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { reset, logout } from "../store/auth/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { FaUser, FaCirclePlus } from "react-icons/fa6";
import { IoIosNotifications, IoMdSettings, IoIosListBox } from "react-icons/io";
import { FaEdit, FaListAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoLogOutSharp, IoWalletOutline } from "react-icons/io5";


const check_user_type = (user, type) => {

  if(!user){
    return false
  }
  
  if(user.userType && user.userType === type){
    return true
  }

  if(user.role && user.role.toLowerCase() === type){
    return true
  }
  
  return false
}



const Sidebar = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  //console.log(user, "user in sidebar..........,,,,,,.. usertype..");

  useEffect(() => {}, [user]);

  const logoutHandle = () => {
    dispatch(logout());
    toast.success("Logout Successfully!");
    dispatch(reset());
    navigate("/login");
  };
  
  const Item = ({ title, path, icon }) => {
    return (
      <li>
        <Link
          className={`d-flex align-items-center gap-2 py-2 px-4 rounded-lg cursor-pointer text-decoration-none transition-all duration-500 ${
            activeLink === path ? "bg-primary text-white" : "text-light"
          }`}
          to={path}
          onClick={() => handleLinkClick(path)}
        >
          <i className={`${icon} transition-all duration-500 ${activeLink === path ? "text-white" : "text-primary"}`}
           />
        {title}
      </Link>
    </li>
    );
  };

  return (
    <div className="w-25">
      <div className="text-white bg-dark p-2 rounded">
        <ul className="d-flex flex-column gap-1 fw-medium cursor-pointer list-unstyled">
          <Item title="Profile" path="/user-profile/profile" icon={"fa fa-user"} />
  
          {user && check_user_type(user, "seller") && (
            <>
            <Item title="Manage Auction" path="/user-profile/manage-items" icon={"fa fa-edit"} />
            <Item title="Create Auction" path="/create-auction" icon={"fa fa-circle-plus"} />
            </>
          )}
          
          <Item title="My Winnings" path="/user-profile/winnings" icon={"fa fa-list"} />
          <Item title="Auction History" path="/user-profile/auction-history" icon={"fa fa-list"} />
          <Item title="Auction Winners" path="/user-profile/auction-winners" icon={"fa fa-list"} />

          <Item title="Notifications" path="/user-profile/notifications" icon={"fa fa-bell"} />
          <Item title="Account Settings" path="/user-profile/account-settings" icon={"fa fa-cog"} />
          <Item title="Change Password" path="/user-profile/change-password" icon={"fa fa-lock"} />
          <Item title="Payment Method" path="/user-profile/payment-method" icon={"fa fa-credit-card"} />
  
          <li>
            <Link
              className="text-decoration-none d-flex align-items-center gap-2 py-2 px-4 rounded-lg cursor-pointer transition-all duration-500"
              onClick={logoutHandle}
            >
              <IoLogOutSharp size={18} className="text-primary" />
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );

};

export default Sidebar;
