import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserById,updateUserById, reset } from "../../store/user/userSlice";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditUser = () => {
  //id
  const { id } = useParams();
  const { singleUser } = useSelector((state) => state.user);
  //console.log(singleUser, "user.......");
  const [formData, setFormData] = useState({
    firstname: singleUser?.firstname || "",
    lastname: singleUser?.lastname || "",    
    email: singleUser?.email,
    gender: singleUser?.gender || "",
    address: singleUser?.address || "",
    country: singleUser?.country || "",
    userType: singleUser?.userType || "",
    description: singleUser?.description || "",
    number: singleUser?.number || "",
  });
  const dispatch = useDispatch();
  useEffect(() => {
    //console.log("useEffect........");
    dispatch(getUserById(id));
  }, []);
  useEffect(()=>{},[id])

  useEffect(() => {
    if (singleUser) {
      setFormData({
        firstname: singleUser?.firstname || "",
        lastname: singleUser?.lastname || "",    
            email: singleUser?.email,
        gender: singleUser?.gender || "",

        address: singleUser.address || "",
        country: singleUser.country || "",
        userType: singleUser.userType || "",
        description: singleUser.description || "",
        number: singleUser.number || "",
      });
      setImgUrl(singleUser.profilePicture);
    }
  }, [singleUser,dispatch]);

  const [imgUrl, setImgUrl] = useState(singleUser?.profilePicture);
  const imgRef = useRef(null);
  //console.log(imgUrl, "imgUrl......");
  //console.log(singleUser?.profilePicture, "singleUser?.profilePicture........");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    //console.log(imgUrl, "imgUrl");
    //image data so use new formdata
    const data = new FormData();
    //console.log(formData);

    data.append("firstname", formData.firstname);
    data.append("lastname", formData.lastname);
    data.append("email", formData.email);
    data.append("gender", formData.gender);
    data.append("address", formData.address);
    data.append("country", formData.country);
    data.append("userType", formData.userType);
    data.append("description", formData.description);
    data.append("number", formData.number);
    if (imgRef.current.files[0]) {
      data.append("profilePicture", imgRef.current.files[0]);
    } else {
      data.append("profilePicture", imgUrl);
    }
    //console.log(imgUrl);
    dispatch(updateUserById({data,id}));
    setImgUrl(null);
    dispatch(getUserById(id));

    dispatch(reset());
    toast.success("User profile successfully updated!");
  };


  return (
    <div className="container py-4 bg-dark text-light rounded-3">
      <h2 className="text-white font-weight-bold text-xl border-bottom border-light pb-3 mb-5">
        Account Settings
      </h2>
  
      <form onSubmit={handleFormSubmit}>
        <div className="position-relative mb-4">
          <img
            src={imgUrl ? imgUrl : singleUser?.profilePicture}
            alt="upload img"
            onClick={() => imgRef.current.click()}
            className="img-fluid rounded-3 border border-secondary cursor-pointer"
          />
          <input
            type="file"
            className="d-none"
            onChange={(e) => setImgUrl(URL.createObjectURL(e.target.files[0]))}
            ref={imgRef}
          />
        </div>
  
        {/* INPUTS */}
        <div className="row g-4">
        <div className="col-lg-4">
              <input
                type="text"
                className="form-control"
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
                className="form-control"
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
              required
              type="email"
              placeholder="Email"
              className="form-control"
              value={formData.email}
              name="email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
        </div>
  
        <div className="row g-4 mt-3">
          <div className="col-lg-6">
            <input
              type="text"
              placeholder="Address"
              className="form-control"
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
              placeholder="Country"
              className="form-control"
              value={formData.country}
              name="country"
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
            />
          </div>
        </div>
  
        <div className="mt-3">
          <input
            type="number"
            placeholder="Phone Number"
            className="form-control"
            value={formData.number}
            name="number"
            onChange={(e) =>
              setFormData({ ...formData, number: e.target.value })
            }
          />
        </div>
  
        <div className="mt-3">
          <select
            className="form-select"
            value={formData.role}
            name="role"
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
          >
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>
  
        <div className="mt-3">
          <textarea
            className="form-control"
            cols="30"
            rows="10"
            placeholder="Description"
            value={formData.description}
            name="description"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          ></textarea>
        </div>
  
        <div className="mt-4">
          <input
            className="btn btn-primary"
            type="submit"
            value="Update"
          />
        </div>
      </form>
    </div>
  );
  
};

export default EditUser;
