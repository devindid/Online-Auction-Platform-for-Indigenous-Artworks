import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordSendMail, reset } from "../../store/auth/authSlice";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSuccess, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess) {
      toast.success(message);
      dispatch(reset());
      navigate("/login")
    }
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }

    return () => {
      dispatch(reset());
    };
  }, [isSuccess, isError]);

  const handlePasswordReset = (e) => {
    e.preventDefault();
    //console.log(email);
    if (email === "") {
      toast.error("Email is required");
      return false;
    }
    dispatch(forgotPasswordSendMail({ email }));
  
  };

  return (
    <div className="d-flex h-100 w-100 align-items-center justify-content-center text-secondary p-3">
      <div className="d-flex flex-column align-items-center w-50 bg-dark p-5 rounded sm-w-50">
            <h1 className="ps-3 fs-1 fw-bold text-white">
              <span style={{"color": "#159AED"}}>A</span>rt
              <span style={{"color": "#159AED"}}>F</span>olio
              </h1>
        <p className="fs-4 mt-2">Reset your account password</p>
        <hr className="w-75 bg-secondary" />
  
        <form className="w-100" onSubmit={handlePasswordReset}>
          <label className="form-label fs-5">Email Address</label>
          <input
            type="email"
            placeholder="Your Email"
            className="form-control bg-secondary border-1 border-info text-white px-3 py-2 mb-3"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
  
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-bold"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
  

};

export default ForgotPassword;
