import { useEffect } from "react";
import { FaUserPlus } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { BsCurrencyExchange } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../store/auth/authSlice";

const ProfileComponent = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);  

  useEffect(() => {
    dispatch(getCurrentUser());
    //console.log("useEffect........");
  }, []);
  useEffect(() => {}, [user]);
  //console.log(user, "user............");

  return (
    <>
      <div className="d-flex flex-column gap-4 w-100">
        <div className="d-flex min-h-400px gap-4 flex-nowrap">
          <div className="px-4 py-4 w-50 bg-dark text-white rounded">
            <div className="fw-bold d-flex justify-content-between align-items-center border-bottom border-light pb-3 mb-5">
              <h2 className="h4">Personal Info</h2>
              <Link
                to="/user-profile/account-settings"
                className="d-flex align-items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg"
              >
                <FaRegEdit size={16} /> <span>Edit</span>
              </Link>
            </div>
            <ul className="d-flex flex-column gap-3 fw-medium text-light">
              <li>
                Name:{" "}
                <span className="float-end fw-normal">
                  {user?.fullName ? user?.fullName : "-"}
                </span>
              </li>
              <li>
                Email:{" "}
                <span className="float-end fw-normal">
                  {user?.email ? user.email : "-"}
                </span>
              </li>
              <li>
                Phone:{" "}
                <span className="float-end fw-normal">
                  {user?.number ? user.number : "---"}
                </span>
              </li>
              <li>
                Location:{" "}
                <span className="float-end fw-normal">
                  {user?.address ? user.address : "---"}
                </span>
              </li>
              <li>
                User Type:{" "}
                <span className="float-end fw-normal">
                  {user?.role ? user?.role : "---"}
                </span>
              </li>
              <li>
                Join Date:{" "}
                <span className="float-end fw-normal">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "---"}
                </span>
              </li>
            </ul>
          </div>
  
          <div className="px-4 py-4 w-50 bg-dark text-white rounded">
            <div className="fw-bold d-flex justify-content-between align-items-center border-bottom border-light pb-3 mb-5">
              <h2 className="h4">Your Bio</h2>
              <Link
                to="/user-profile/account-settings"
                className="d-flex align-items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg"
              >
                <FaRegEdit size={16} /> <span>Edit</span>
              </Link>
            </div>
            <p className="text-light">
              {user?.description ? user.description : "No bio available"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
  
};

export default ProfileComponent;
