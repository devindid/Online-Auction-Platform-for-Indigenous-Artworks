import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login, reset } from "../../store/auth/authSlice";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export const PasswordInput = ({value, onChange, placeholder, classes}) => {

  const [visible, setVisible] = useState(false);

  return (
    <div className={"input-group d-flex " + classes}>
      <input
        type= {visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-control text-white bg-secondary border border-info"
        name="password"
      />
      <button 
        type="button"
        className="btn btn-outline-secondary text-white bg-secondary border border-info"
        onClick={() => setVisible(!visible)}
      >
        {visible ? <FaRegEyeSlash /> : <FaRegEye />}
      </button>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const { isError, isSuccess, message, isLoading } = useSelector(
    (state) => state.auth
  );
  // const [showPassword, setShowPassword] = useState(false);

  // const togglePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  // };
  useEffect(() => {
    if (isError) {
      toast.error(message,{
        autoClose: 1000
      });
      dispatch(reset());
    }
    if (isSuccess) {
      toast.success(message,{
        autoClose: 1000
      });
      dispatch(reset());
      let type = localStorage.getItem("user_type");
      if (type === "admin") {
        navigate("/admin");
      }else {
        navigate("/dashboard");
      }
    }
    return () => {
      dispatch(reset());
    };
  }, [isSuccess, isError, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(formData);
    dispatch(reset());
    dispatch(login(formData));
  };

  

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center text-light">
      <div className="d-flex flex-column align-items-center w-50 p-4 rounded bg-dark text-center sm:w-50">

            <h1 className="ps-3 fs-1 fw-bold text-white">
              <span style={{"color": "#159AED"}}>A</span>rt
              <span style={{"color": "#159AED"}}>F</span>olio
              </h1>
  
        <p className="mt-2 mb-1 fs-5">Login with your account</p>
        <hr className="w-75 mb-3 bg-secondary" />
        
        <form className="w-100" onSubmit={handleSubmit}>
          {/* Email Field */}
          <label className="my-2 fs-5 w-100 text-start">Email Address</label>
          <input
            type="email"
            placeholder="Your Email"
            className="form-control mb-3 text-white bg-secondary border border-info"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
  
          {/* Password Field */}
          <label className="my-2 fs-5 w-100 text-start">Password</label>
          <PasswordInput value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Your Password" classes="mb-4" />
  
          {/* Forget Password */}
          <Link
            to="/forgot-password"
            className="text-primary text-decoration-none mb-3 d-block w-100 text-start"
          >
            Forget Password?
          </Link>
  
          {/* Sign In Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 mb-4 fw-bold"
          >
            Sign In
          </button>
        </form>
  
        {/* Sign Up Link */}
        <p>
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="fw-bold text-info text-decoration-none"
          >
            Sign Up.
          </Link>
        </p>
      </div>
    </div>
  );
  
};

export default Login;
