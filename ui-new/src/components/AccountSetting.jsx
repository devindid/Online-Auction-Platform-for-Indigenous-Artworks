import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser, reset, updateProfile } from "../store/auth/authSlice";
import Loading from "./Loading";
import { toast } from "react-toastify";

const AccountSetting = () => {
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );
  console.log(user, "user.......");

  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",    
    email: user?.email,
    address: user?.address || "",
    country: user?.country || "",
    role: user?.role || "",
    description: user?.description || "",
    number: user?.number || "",
  });
  
  const dispatch = useDispatch();
  useEffect(() => {
    //console.log("useEffect........");
    dispatch(getCurrentUser());
  }, []);
  useEffect(() => {}, [user]);

  const [imgUrl, setImgUrl] = useState(user?.profilePicture);
  const imgRef = useRef(null);
  //console.log(imgUrl, "imgUrl......");
  //console.log(user?.profilePicture, "user?.profilePicture........");

  const handleFormSubmit = (e) => {
    dispatch(reset());
    e.preventDefault();
    const data = new FormData();

    data.append("firstname", formData.firstname);
    data.append("lastname", formData.lastname);
    data.append("email", formData.email);
    data.append("address", formData.address);
    data.append("country", formData.country);
    data.append("role", formData.role);
    data.append("description", formData.description);
    data.append("number", formData.number);
    if (imgRef.current.files[0]) {
      data.append("profilePicture", imgRef.current.files[0]);
    } else {
      data.append("profilePicture", imgUrl);
    }

    dispatch(updateProfile(data)).then(() => {
      if (isSuccess) {
        toast.success(message || "user profile updated successfully.", {
          autoClose: 500,
        });
      }
      if (isError) {
        toast.error(message, {
          autoClose: 500,
        });
      }
    });
    setImgUrl(null);
    dispatch(getCurrentUser());

    dispatch(reset());
  };

  return (
    <div className="p-4 w-100 bg-dark text-light rounded-lg">
      <h2 className="text-white fw-bold fs-4 border-bottom border-light pb-3 mb-4">
        Account Settings
      </h2>
  
      <form onSubmit={handleFormSubmit}>
        <div
          className="position-relative overflow-hidden d-inline-block rounded-lg cursor-pointer mb-4"
          onClick={() => imgRef.current.click()}
        >
          <img
            src={imgUrl ? imgUrl : user?.profilePicture}
            alt="Profile"
            className="w-100 object-contain"
          />
          <div className="position-absolute inset-0 bg-dark bg-opacity-75 d-flex flex-column align-items-center justify-content-center opacity-0 hover:opacity-100 transition-opacity">
            <p className="text-white fw-bold">Change Profile Picture</p>
          </div>
        </div>
        {/* INPUTS */}
        <div className="d-grid gap-4">
          <input
            type="file"
            className="d-none"
            onChange={(e) => setImgUrl(URL.createObjectURL(e.target.files[0]))}
            ref={imgRef}
          />
          <div className="row g-4">
          <div className="col-lg-4">
              <input
                type="text"
                className="form-control bg-dark text-light border-light"
                placeholder="First Name"
                value={formData.firstname}
                name="fullName"
                required
                onChange={(e) =>
                  setFormData({ ...formData, firstname: e.target.value })
                }
              />
            </div>
            <div className="col-lg-4">
              <input
                type="text"
                className="form-control bg-dark text-light border-light"
                placeholder="Last Name"
                value={formData.lastname}
                name="fullName"
                required
                onChange={(e) =>
                  setFormData({ ...formData, lastname: e.target.value })
                }
              />
            </div>
            <div className="col-lg-4">
              <input
                type="email"
                className="form-control bg-dark text-light border-light"
                placeholder="Email"
                value={formData.email}
                name="email"
                required
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-6">
              <input
                type="text"
                className="form-control bg-dark text-light border-light"
                placeholder="Address"
                value={formData.address}
                name="address"
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <div className="col-lg-6">
              <input
                type="text"
                className="form-control bg-dark text-light border-light"
                placeholder="Country"
                value={formData.country}
                name="city"
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              />
            </div>
          </div>
          <input
            type="number"
            className="form-control bg-dark text-light border-light"
            placeholder="Phone Number"
            value={formData.number}
            name="phone"
            onChange={(e) =>
              setFormData({ ...formData, number: e.target.value })
            }
          />
          <select
            className="form-select bg-dark text-light border-light"
            value={formData.role}
            name="userType"
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
          >
            <option value="Customer">Customer</option>
            <option value="Seller">Seller</option>
          </select>
          <textarea
            className="form-control bg-dark text-light border-light"
            cols="30"
            rows="10"
            placeholder="Description"
            value={formData.description}
            name="description"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          ></textarea>
          <input
            className="btn btn-primary text-white"
            type="submit"
            value={`${isLoading ? "Loading" : "Update"}`}
          />
        </div>
      </form>
    </div>
  );
  

  return (
    <div className=" px-7 py-4 w-full bg-theme-bg text-slate-300 rounded-2xl ">
      <h2 className=" text-white font-bold text-xl border-b border-border-info-color pb-3 mb-5 ">
        Account Settings
      </h2>

      <form onSubmit={handleFormSubmit}>
        <div
          className="relative overflow-hidden w-fit h-fit rounded-lg cursor-pointer mb-10"
          onClick={() => imgRef.current.click()}
        >
          <img
            src={imgUrl ? imgUrl : user?.profilePicture}
            alt="upload img"
            className="w-full md:w-[200px] object-contain"
          />
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <p className="text-white font-bold ">Change Profile Picture</p>
          </div>
        </div>
        {/* INPUTS*/}
        <div className="flex flex-col gap-4 inputs:outline-none inputs:px-3 inputs:py-4 inputs:rounded-xl inputs:bg-theme-bg2 [&_input[type=submit]]:bg-theme-color [&_input:hover[type=submit]]:bg-color-danger inputs:border inputs:border-border-info-color focus:inputs:border-theme-color select:border select:border-border-info-color inputs:placeholder-body-text-color  [&_*]:transition-all ">
          <input
            type="file"
            className="hidden"
            onChange={(e) => setImgUrl(URL.createObjectURL(e.target.files[0]))}
            ref={imgRef}
          />
          <div className="grid lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="FullName "
              value={formData.fullName}
              name="fullName"
              required
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={formData.email}
              name="email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />{" "}
            {/* {select field} */}
            <select
              className="outline-none bg-theme-bg2 rounded-xl px-3 py-4 cursor-pointer focus:border-theme-color"
              value={formData.gender}
              name="gender"
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              name="address"
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              name="city"
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
          </div>
          <input
            type="number"
            placeholder="Phone Number"
            value={formData.phone}
            name="phone"
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <select
            className="outline-none bg-theme-bg2 rounded-xl px-3 py-4 cursor-pointer focus:border-theme-color "
            value={formData.userType}
            name="userType"
            onChange={(e) =>
              setFormData({ ...formData, userType: e.target.value })
            }
          >
            <option value="user">User</option>
            <option value="seller">Seller</option>
          </select>
          <textarea
            className="outline-none bg-theme-bg2 rounded-xl px-3 py-4 border border-border-info-color focus:border-theme-color placeholder-body-text-color"
            cols="30"
            rows="10"
            placeholder="Description"
            value={formData.description}
            name="description"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          ></textarea>{" "}
          <input
            className="text-white cursor-pointer font-bold tracking-wide"
            type="submit"
            value={`${isLoading ? "Loaign" : "Update"}`}
          />
        </div>
      </form>
    </div>
  );
};

export default AccountSetting;
