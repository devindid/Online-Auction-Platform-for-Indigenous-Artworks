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

const NavSidebar = ({closeNavbar}) => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    closeNavbar()
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
    <div className="w-100 h-100">
      <div className="text-white bg-dark p-4">
        <ul className="nav flex-column font-weight-medium">
          <li className="nav-item">
            <Link
              className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded cursor-pointer transition-all ${
                activeLink === "/seller/dashboard" ? "bg-primary text-white" : "text-light"
              }`}
              to="/seller/dashboard"
              onClick={() => handleLinkClick("/seller/dashboard")}
            >
              <FaUser size={16} />
              Dashboard
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded cursor-pointer transition-all ${
                activeLink === "/seller/users" ? "bg-primary text-white" : "text-light"
              }`}
              to="/seller/users"
              onClick={() => handleLinkClick("/seller/users")}
            >
              <FaEdit size={16} />
              Users
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded cursor-pointer transition-all ${
                activeLink === "/seller/auctions" ? "bg-primary text-white" : "text-light"
              }`}
              to="/seller/auctions"
              onClick={() => handleLinkClick("/seller/auctions")}
            >
              <FaCirclePlus size={16} />
              Auctions
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded cursor-pointer transition-all ${
                activeLink === "/seller/categories" ? "bg-primary text-white" : "text-light"
              }`}
              to="/seller/categories"
              onClick={() => handleLinkClick("/seller/categories")}
            >
              <IoIosListBox size={18} />
              Category
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded cursor-pointer transition-all ${
                activeLink === "/user-profile/notifications" ? "bg-primary text-white" : "text-light"
              }`}
              to="/user-profile/notifications"
              onClick={() => handleLinkClick("/user-profile/notifications")}
            >
              <IoIosNotifications size={18} />
              Notifications
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded cursor-pointer transition-all ${
                activeLink === "/user-profile/account-settings" ? "bg-primary text-white" : "text-light"
              }`}
              to="/user-profile/account-settings"
              onClick={() => handleLinkClick("/user-profile/account-settings")}
            >
              <IoMdSettings size={18} />
              Account Settings
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded cursor-pointer transition-all ${
                activeLink === "/user-profile/change-password" ? "bg-primary text-white" : "text-light"
              }`}
              to="/user-profile/change-password"
              onClick={() => handleLinkClick("/user-profile/change-password")}
            >
              <RiLockPasswordFill size={16} />
              Change Password
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded cursor-pointer transition-all ${
                activeLink === "/user-profile/payment-method" ? "bg-primary text-white" : "text-light"
              }`}
              to="/user-profile/payment-method"
              onClick={() => handleLinkClick("/user-profile/payment-method")}
            >
              <IoWalletOutline size={18} />
              Payment Method
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link d-flex align-items-center gap-2 py-2 px-3 rounded cursor-pointer text-light transition-all"
              onClick={logoutHandle}
            >
              <IoLogOutSharp size={18} />
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );

};

export default NavSidebar;
