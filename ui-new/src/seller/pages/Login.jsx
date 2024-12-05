import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login, reset } from "../../store/auth/authSlice";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  // const [showPassword, setShowPassword] = useState(false);

  // const togglePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  // };
  useEffect(() => {
    if (user) {
      navigate("/seller/users");
    }
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    if (isSuccess) {
      toast.success(message);
      dispatch(reset());
      if(user?.userType==="seller"){
        navigate("/seller/users");

      } else{
        navigate("/dashboard")
      }
    }

    return () => {
      dispatch(reset());
    };
  }, [isSuccess, isError, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    dispatch(login(formData));
  };

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center bg-dark text-light">
      <div className="w-90 w-sm-50 p-4 rounded-3 bg-primary">
        <h1 className="text-center text-white mb-4">
          <span className="text-info">A</span>rt
          <span className="text-info">F</span>olio
        </h1>
        <p className="text-center mb-3">Login with your account</p>
        <hr className="my-3 bg-secondary" style={{ height: '1px' }} />
        <form className="d-flex flex-column" onSubmit={handleSubmit}>
          <label htmlFor="email" className="mb-2">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Your Email"
            className="form-control mb-3"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <label htmlFor="password" className="mb-2">Password</label>
          <div className="input-group mb-4">
            <input
              type="password"
              id="password"
              placeholder="Your Password"
              className="form-control"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {/* Uncomment if you want to add a toggle password visibility button
            <button 
              className="btn btn-outline-secondary"
              type="button"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
            </button>
            */}
          </div>
          <button
            type="submit"
            className="btn btn-info btn-lg w-100"
          >
            Sign In
          </button>
        </form>
        {/* Uncomment if you want to add a "Forgot Password?" link
        <p className="mt-3 text-center">
          <Link to="/forgot-password" className="text-info">Forget Password?</Link>
        </p>
        */}
      </div>
    </div>
  );
  
};

export default Login;
