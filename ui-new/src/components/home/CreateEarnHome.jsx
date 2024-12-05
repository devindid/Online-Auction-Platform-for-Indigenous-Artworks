import { Link } from "react-router-dom"
import { FaArrowRightLong } from "react-icons/fa6";
import img from "../../assets/profile-bg.png";

const CreateEarnHome = () => {
    const logInUser = JSON.parse(localStorage.getItem("user"));


    return (
      <div style={{ width: '100%', position: 'relative' }} className=" mt-5 text-start">
        <img src={ img } style={{ width: '100%' }} alt="Background" />
        <div style={{ position: 'absolute', top: '0%' }} className="p-4">
          <div className="fs-1 fw-bold text-white">
            Create, Sell & Earn at <span style={{ color: '#0a53be' }}>A</span>rt
            <span style={{ color: '#0a53be' }}>F</span>olio
          </div>
          <div className="fs-6 text-white">Start Selling your Amazing Artworks now!</div>
          <button
          onClick={() => logInUser ? window.location.href = "/create-auction" : window.location.href = "/login"}
          className="btn btn-primary text-white rounded-3 mt-3 ms-2">
            Get Started <i className="fa fa-arrow-right ps-2"></i>
          </button>
        </div>
      </div>
    );

}

export default CreateEarnHome