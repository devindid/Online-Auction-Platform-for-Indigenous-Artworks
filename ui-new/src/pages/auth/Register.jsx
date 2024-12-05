import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { register, reset } from "../../store/auth/authSlice";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Select from 'react-select';
import { PasswordInput } from "./Login";
import { COUNTRIES, CURRENCIES } from "../../currency";

const Countries = COUNTRIES;
const Currencies = CURRENCIES.map((currency) => {
  return currency.name
});

const NormalInput = ({label, id, placeholder, type="text", formData, setFormData}) => {
  return (
    <>
        <label className="form-label fs-5">{label}</label>
        {
        type === "password" ?
        <PasswordInput 
          value={formData[id]} 
          onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
           placeholder={placeholder} classes="mb-4" /> :
         <input
          type={type}
          placeholder={placeholder}
          className="form-control mb-4 text-white bg-secondary border border-info"
          name={id}
          value={formData[id] ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, [id]: e.target.value })
          }
          required
          minLength={5}
        />
        }
    </>  
  );
};


const Register = () => {
  const [formData, setFormData] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {  isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    
    if (isSuccess) {
      toast.success("Registration successful", {
        autoClose: 1000
      });
      dispatch(reset())

      navigate("/login");
    } else if (isError) {
      toast.error(message, {
        autoClose: 1000
      })
      dispatch(reset())
    }
   
  }, [isSuccess, isError, isLoading]);

  // Submit the form data to the server
  const handleRegister = async (e) => {
    e.preventDefault();

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!emailRegex.test(formData.email)) {
    toast.error("Email format is invalid",{
      autoClose: 1000
    });
    return false;
  } else if (!passwordRegex.test(formData.password)) {
    toast.error(
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character",{
      autoClose: 1000
      }
    );
    return false;
  }else if(formData.password !== formData.confirm){
    toast.error("Passwords do not match",{
      autoClose: 1000
    });
    return false;
  } else{
    dispatch(reset())

    dispatch(register(formData)) 
    }

  
  
  };



  const SearchableDropdown = ({ label, id, placeholder, options }) => {

  const [isLoading, setIsLoading] = useState(false);  

  return (
    <>
      <label className="form-label fs-5">{label}</label>
      <Select
        className="form-control mb-2 text-dark bg-secondary border border-info"
        classNamePrefix="select"
        isLoading={isLoading}
        isClearable={true}
        isSearchable={true}
        name={id}
        value={formData[id]}
        options={options.map((option) => ({
          value: option,
          label: option
        }))}
        onChange={(value) => setFormData({ ...formData, [id]: value })}

      />

    </>
  );
};

// const ids = ["firstname", "lastname", "email", "address", "number", "role", "username",  "password", "confirm", "answer", "country", "currency"];

  return (
    <div className="d-flex min-vh-100 w-100 align-items-center justify-content-center text-secondary">
      <div className="d-flex w-75 flex-column align-items-center justify-content-center rounded bg-dark p-4 sm:w-50">
            <h1 className="ps-3 fs-1 fw-bold text-white">
              <span style={{"color": "#159AED"}}>A</span>rt
              <span style={{"color": "#159AED"}}>F</span>olio
              </h1>
        <p className="fs-4 mt-2 mb-3">Create your new account</p>
        <hr className="w-75 bg-secondary mb-3" />
        
        <form className="w-100" onSubmit={handleRegister}>

          <div className="row">
          <div className="col-4">
            <NormalInput label="First Name" id="firstname" placeholder="Your First Name" formData={formData} setFormData={setFormData}/>
            <NormalInput label="Tel Number" id="number" placeholder="Your Tel Number" formData={formData} setFormData={setFormData}/>
            <NormalInput label="Email" id="email" placeholder="Your Email" formData={formData} setFormData={setFormData}/>
            <NormalInput label="Address" id="address" placeholder="Your Address" formData={formData} setFormData={setFormData}/>
          </div>
          <div className="col-4">
            <NormalInput label="Last Name" id="lastname" placeholder="Your Last Name" formData={formData} setFormData={setFormData}/>
            <SearchableDropdown options={["Customer", "Seller"]} label="Role" id="role" placeholder="Select your Role" />
            <SearchableDropdown options={Countries} label="Country" id="country" placeholder="Select your Country" />
            <SearchableDropdown options={Currencies} label="Currency" id="currency" placeholder="Select your Currency" />
          </div>
          <div className="col-4">
            <NormalInput label="What is Your Favorite Artwork" id="answer" placeholder="Your Answer" formData={formData} setFormData={setFormData}/>
            <NormalInput label="Username" id="username" placeholder="Your Username" formData={formData} setFormData={setFormData}/>
            <NormalInput label="Password" id="password" placeholder="Your Password" type="password" formData={formData} setFormData={setFormData}/>
            <NormalInput label="Confirm Password" id="confirm" placeholder="Confirm Your Password" type="password" formData={formData} setFormData={setFormData}/>
          </div>
          </div>

  
  
          {/* Sign Up Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 mb-4 fw-bold"
            disabled={isLoading}
          >
            Sign Up
          </button>
        </form>
  
        {/* Already have an account link */}
        <p>
          Already have an account?{" "}
          <Link to="/login" className="fw-bold text-info text-decoration-none">
            Sign In.
          </Link>
        </p>
      </div>
    </div>
  );
  
};

export default Register;
