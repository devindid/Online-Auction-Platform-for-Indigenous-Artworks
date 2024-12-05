import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "../../store/auth/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import { IoIosNotificationsOutline } from "react-icons/io";
// import { getNotificationForUser } from "../store/notification/notificationSlice";
// import socket from "../socket";
import { FaBars, FaTimes } from "react-icons/fa";
import NavSidebar from "./NavSidebar";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);

  const dispatch = useDispatch();
   const { user } = useSelector((state) => state.auth);
//   const { notifications } = useSelector((state) => state.notification);
  let navigate = useNavigate();
  const closeNavbar=()=>{
    setNavbarOpen(false)
  
  }

  const logoutHandle = () => {
    dispatch(logout());
    toast.success("Logout Successfully!");
    setSidebarOpen(false);
    dispatch(reset());
    navigate("/login");
  };

  return (
    <div className="d-flex justify-content-between align-items-center px-2 px-sm-5 py-3 border-bottom border-info">
      <div className="d-flex align-items-center px-1 z-1">
        <Link to="/seller/dashboard" className="text-decoration-none">
        <img src="/res/img/logo.jpg" style={{ width: 32, height: 32 }} alt="" /> 
            <h1 className="ps-3 fs-3 fw-bold text-white">
              <span style={{"color": "#159AED"}}>A</span>rt
              <span style={{"color": "#159AED"}}>F</span>olio
              </h1>
        </Link>
      </div>

      <div className="d-flex align-items-center cursor-pointer z-1">
        {user ? (
          <div className="d-flex align-items-center">
            <img
              src={user?.profilePicture}
              key={user.profilePicture}
              alt="user profile"
              className="rounded-circle"
              style={{ width: '40px', height: '40px' }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <Link to="/user-profile/notifications" className="me-2"></Link>
            <Link
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="text-white d-sm-none h5 mx-3"
            >
              {navbarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </Link>
          </div>
        ) : (
          <>
            <Link
              to="/seller/login"
              className="btn btn-primary btn-sm text-white px-3 py-2 fw-semibold"
            >
              Sign In
            </Link>
            <Link
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="text-white d-sm-none h5 mx-3 z-50"
            >
              {navbarOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
            </Link>
          </>
        )}
      </div>

      {user && sidebarOpen ? (
        <div className={`dropdown-menu show p-0 mt-2 bg-dark rounded bg`} style={{ position: 'absolute', right: '10px', top: '60px' }}>
          <nav className="py-2">
          <Link
              className="dropdown-item text-white bg-dark"
              to="/seller/"
            >
              Dashboard
            </Link>
            <Link
              onClick={() => {
                logoutHandle();
                setSidebarOpen(false);
              }}
              className="dropdown-item text-white bg-dark"
            >
              Logout
            </Link>
          </nav>
        </div>
      ) : null}

      {navbarOpen && (
        <div className="d-flex flex-column justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100 bg-dark text-white z-10">
          <NavSidebar closeNavbar={closeNavbar} />
        </div>
      )}
    </div>
  );

};

export default Header;
