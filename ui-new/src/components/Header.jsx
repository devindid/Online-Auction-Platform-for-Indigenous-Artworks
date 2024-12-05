import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "../store/auth/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import { IoIosNotificationsOutline } from "react-icons/io";
import { getNotificationForUser } from "../store/notification/notificationSlice";
import socket from "../socket";
import { FaBars, FaTimes } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";


const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notification);
  let navigate = useNavigate();
  let location = useLocation();
  const logInUser = JSON.parse(localStorage.getItem("user"));

  const unReadNotifications = notifications.filter(
    (notification) => notification.isRead === false
  );

  useEffect(() => {}, [user]);
  useEffect(() => {
    if (logInUser) {
      dispatch(getNotificationForUser());
    }
    socket.on("newBidNotification", (data) => {
      
      socket.emit("joinAuction", logInUser?._id);

      dispatch(getNotificationForUser());
    });

    //console.log(notifications, "notification dispatch............");
  }, [location]);

  const logoutHandle = () => {
    dispatch(logout());
    toast.success("Logout Successfully!");
    setSidebarOpen(false);
    dispatch(reset());
    navigate("/login");
  };

  return (
    <div 
    style={{borderBottom: "1px solid grey"}}
    className="d-flex justify-content-between align-items-center px-2
     px-sm-5 py-4 bg-body-bg">


      <Link to="/" className="navbar-brand fs-3 fw-bold text-white d-flex"> 
        <img src="/res/img/logo.jpg" style={{ width: 32, height: 32 }} alt="" /> 
        <h1 className="ps-3 fs-3 fw-bold text-white">
          <span style={{"color": "#159AED"}}>A</span>rt
          <span style={{"color": "#159AED"}}>F</span>olio
          </h1>
      </Link>

      {/* Navigation Links (Desktop) */}
      <div className="d-none d-sm-block text-center" style={{ width: "70%" }}>
        <Link to="/" className="text-white fs-6 mx-3 text-decoration-none">
          Home
        </Link>
        <Link to="/contact-us" className="text-white fs-6 mx-3 text-decoration-none">
          Contact
        </Link>
        <Link to="/about-us" className="text-white fs-6 mx-3 text-decoration-none">
          About
        </Link>
      </div>

      {/* User and Cart Section */}
      <div className="d-flex align-items-center cursor-pointer z-1">
        {user ? (
          <div className="d-flex justify-content-end align-items-center">
            {/* <Link to="/user-profile/cart" className="text-white fs-5 mx-3">
              <BsCart3 className="text-white hover-text-theme transition" />
            </Link> */}

            <Link to="/user-profile/notifications" className="position-relative me-2">
              {unReadNotifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle bg-theme-color text-white rounded-circle p-1 fs-6">
                  {unReadNotifications.length}
                </span>
              )}
              <IoIosNotificationsOutline
                size={37}
                className="text-white bg-theme-bg hover-text-theme rounded-circle p-2 transition"
              />
            </Link>
            <img
              src={user?.profilePicture}
              alt="user"
              style={{ width: "12%", height: "10%" }}
              className="rounded-circle cursor-pointer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="btn btn-primary text-white mx-3"
            >
              Sign In
            </Link>
            <Link
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="text-white fs-5 d-sm-none mx-3 z-50"
            >
              {navbarOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
            </Link>
          </>
        )}
      </div>

      {/* User Sidebar (for Logged-In Users) */}
      {user && sidebarOpen && (
        <div 
        style={{top: "65px", zIndex: "1000"}}
        className="position-absolute end-0 mt-2 bg-dark rounded shadow-lg w-25 me-2">
          <nav className="pt-2">
          {
            user.role.toLowerCase() === "seller" && <Link to="/seller" className="d-block text-white px-4 py-2 text-decoration-none">
              Dashboard
            </Link>}
            {
            user.role.toLowerCase() === "customer" && <Link to="/dashboard" className="d-block text-white px-4 py-2 text-decoration-none">
              Dashboard
            </Link>}
            {
              (user.role === "admin" || user.userType === "admin") && <Link to="/admin" className="d-block text-white px-4 py-2 text-decoration-none">
              Dashboard
            </Link>}
            <Link to="/" className="d-block text-white px-4 py-2 text-decoration-none">
              Home
            </Link>            
            <Link to="/user-profile/profile" className="d-block text-white px-4 py-2 text-decoration-none">
              My Profile
            </Link>
         
            <Link to="/user-profile/account-settings" className="d-block text-white px-4 py-2 text-decoration-none">
              Account Settings
            </Link>
            <Link
              onClick={() => {
                logoutHandle();
                setSidebarOpen(false);
              }}
              className="d-block text-white px-4 py-2 text-decoration-none"
            >
              Logout
            </Link>
          </nav>

          
        </div>
      )}

    </div>
  );    

};

export default Header;
