import { useNavigate, useParams } from "react-router-dom"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { reset, resetNewPassword } from "../../store/auth/authSlice";



const ResetNewPassword = () => {
    const { id, token } = useParams();
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const {isSuccess, isError, message} = useSelector((state) => state.auth);
    const navigate= useNavigate()


    useEffect(() => {
        if (isSuccess) {
            toast.success(message);
            setPassword("");
            navigate("/login");

        }
        if (isError) {
            toast.error(message);
        }

        return () => {
            dispatch(reset());
        }

    }, [isSuccess, isError]);



    const resetnewPassword = (e) => {
        e.preventDefault();

        if (password === "") {
            toast.error("Password is required");
            return false;
        } 
        
        let data = {
            password: password,
             id,
             token,
        };

        dispatch(resetNewPassword(data));
       

    }

    return (
      <div className="d-flex h-100 w-100 align-items-center justify-content-center text-secondary">
        <div className="d-flex flex-column align-items-center w-50 bg-dark p-4 rounded sm-w-50">
            <h1 className="ps-3 fs-1 fw-bold text-white">
              <span style={{"color": "#159AED"}}>A</span>rt
              <span style={{"color": "#159AED"}}>F</span>olio
              </h1>
          <hr className="w-75 bg-secondary" />
    
          <form className="w-100" onSubmit={resetnewPassword}>
            <label className="form-label fs-5">Enter New Password</label>
            <input
              type="password"
              placeholder="Your new Password"
              className="form-control bg-secondary border-1 border-info text-white px-3 py-2 mb-3"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
    
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-bold"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    );
    

}

export default ResetNewPassword