import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { reset, changeCurrentPassword } from "../../store/auth/authSlice";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
const {isLoading,isSuccess , isError,message}=useSelector((state)=>state.auth)
  const dispatch = useDispatch();

  const handleChangeCurrentPassword = (e) => {
    e.preventDefault();

    if (formData.oldPassword === "" || formData.newPassword === "") {
      toast.error("All fields are required");
      return false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      toast.error(
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character",{
          autoClose:700
        }
      );
      return false;
    }

    dispatch(changeCurrentPassword(formData)).then(()=>{
      if(isSuccess){
        toast.success(message,{
          autoClose:500
        })
      }
      if(isError){

        toast.error(message,{
          autoClose:500
        })
      }
    
    })
  };

  return (
    <div className="d-flex flex-column w-100 p-4 bg-dark text-light rounded-lg">
      <h2 className="text-white fw-bold fs-4 border-bottom border-light pb-3 mb-4">
        Change Password
      </h2>
      <form
        className="d-flex flex-column gap-4"
        style={{ maxWidth: '50%' }}
        onSubmit={handleChangeCurrentPassword}
      >
        <div className="d-flex flex-column">
          <label className="mb-1 fs-5">Old Password</label>
          <input
            type="password"
            placeholder="Enter old Password"
            className="form-control bg-dark text-light border-light"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={(e) =>
              setFormData({ ...formData, oldPassword: e.target.value })
            }
            required
          />
          <label className="my-1 fs-5">New Password</label>
          <input
            type="password"
            placeholder="Enter new Password"
            className="form-control bg-dark text-light border-light"
            name="newPassword"
            value={formData.newPassword}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
            required
          />
        </div>
  
        <button
          type="submit"
          className="btn btn-danger text-white rounded-lg px-4 py-2 mt-3"
        >
          Change Password
        </button>
      </form>
    </div>
  );
  
};

export default ChangePassword;
