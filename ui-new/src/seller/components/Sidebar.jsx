import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { reset, logout } from "../../store/auth/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { FaUser, FaCirclePlus } from "react-icons/fa6";
import { IoIosNotifications, IoMdSettings, IoIosListBox } from "react-icons/io";
import { FaEdit, FaListAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoLogOutSharp, IoWalletOutline } from "react-icons/io5";
import { BiSolidCategory } from "react-icons/bi";
import { RiAuctionFill } from "react-icons/ri";


const NavItem = ({title, link, icon, activeLink, setActiveLink}) => {

  const handleLinkClick = (path) => {
    setActiveLink(path);
  }
  return (
    <li className="nav-item">
    <Link
      className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded ${
        activeLink === link ? "bg-primary text-white" : "text-white"
      }`}
      to={link}
      onClick={() => handleLinkClick(link)}
    >
      <div
        style={{ fontSize: "16px" }}
        className={`${icon} ${"text-white" }`}
      />

      {title}
    </Link>
  </li>

  );
}



const Sidebar = ({ closeNavbar }) => {
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

  return (
    <div className="d-none d-sm-block position-sticky top-5 vh-100" style={{ maxWidth: '280px' }}>
      <div className="bg-dark text-white p-4 rounded-3">
        <ul className="nav flex-column">
          <NavItem title="Auctions" link="/seller/auctions" icon="fa fa-gavel" 
            activeLink={activeLink} setActiveLink={setActiveLink} />
          <NavItem title="Winners" link="/seller/winners" icon="fa fa-trophy" 
            activeLink={activeLink} setActiveLink={setActiveLink} />
          <NavItem title="Delivery Persons" link="/seller/delivery" icon="fa fa-truck" 
            activeLink={activeLink} setActiveLink={setActiveLink} />
          <NavItem title="Chat" link="/chat" icon="fa fa-message" 
            activeLink={activeLink} setActiveLink={setActiveLink} />
          
        </ul>
      </div>
    </div>
  );
  
};

export default Sidebar;
