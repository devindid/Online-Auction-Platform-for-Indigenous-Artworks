import { useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "axios";
import { API_URL } from "../../../store/chat/userService";


const InputField = ({id, label, placeholder, formData, setFormData}) => {
  return (
    <div className="">
    <label htmlFor={id} className="form-label">{label}</label>
    <input
      required
      id={id}
      placeholder={placeholder}
      type="text"
      className="form-control"
      onChange={(e) =>
        setFormData({ ...formData, [id]: e.target.value })
      }
      value={formData[id]}
    />
  </div>
  );
}


const AddDelivery = () => {

  const [imgUrl, setImgUrl] = useState("");
  const imgRef = useRef(null);

  ////console.log("categoreik   ", categories);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    NIC: "",
    address: ""
  });

  const handleProductUpload = async (e) => {
    e.preventDefault();
    //image data so use new formdata
    const data = new FormData();
    ////console.log(formData);
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("NIC", formData.NIC);
    data.append("address", formData.address);

    if (!imgRef.current.files[0]) {
      return alert("Image is required");
    } else if (imgRef.current.files[0].size > 1024 * 1024) {
      return alert("Image size should be less than 1mb");
    } else {
      data.append("image", imgRef.current.files[0]);
    }

    const upload = async () => {
      try {
        const response = await axios.post(
          `${API_URL}/deliveries/`,
          data,
          { withCredentials: true }
        );
        return response.data;
      } catch (error) {
        const message =
          (error.response && error.response.data.message) || error.message;
        return { message, isError: true };
      }
    };

    upload().then((data) => {
      if (!data.isError) {
        window.location.href = "/seller/delivery/";
      } else {
        alert(data.message);
      }          
    })



  };


  return (
    <div className="container-fluid my-4">
        <h1 className="text-white fs-3 fw-bold mb-4">Add Delivery Person</h1>

      <form
        className="d-flex flex-column flex-lg-row gap-4 justify-center mx-auto ps-4 py-2"
        onSubmit={handleProductUpload}
      >
        <div className="text-white col-lg-3 col-md-6">
  
          {imgUrl ? (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <img
              src={imgUrl}
              alt="upload img"
              onClick={() => imgRef.current.click()}
              className="w-100 rounded border-2 border-solid p-2 object-contain cursor-pointer"
            />
            </div>
          ) : (
            <div
              onClick={() => imgRef.current.click()}
              className="w-100 h-100 rounded border-2 border-dashed border-light d-flex align-items-center justify-content-center cursor-pointer"
            >
              <div className="text-center d-flex flex-column align-items-center gap-2">
                <IoCloudUploadOutline size={68} className="text-primary" />
                <p>Click to Upload</p>
                <span className="text-secondary">
                  PNG, JPG, JPEG | Max Size 1MB
                </span>
              </div>
            </div>
          )}
  
          <input
            type="file"
            className="d-none"
            onChange={(e) => setImgUrl(URL.createObjectURL(e.target.files[0]))}
            ref={imgRef}
            accept=".png, .jpg, .jpeg"
          />
        </div>
        {/* INPUTS */}
        <div className="d-flex flex-column gap-4 col-lg-6 p-4 border rounded border-light bg-dark text-light">

          <InputField id="name" label="Delivery Person Name" placeholder="Enter Delivery Person Name" setFormData={setFormData} formData={formData}/>
          <InputField id="email" label="Email" placeholder="Enter Email"  setFormData={setFormData} formData={formData}/>
          <InputField id="phone" label="Phone Number" placeholder="Enter Phone Number" setFormData={setFormData} formData={formData} />
          <InputField id="NIC" label="NIC" placeholder="Enter NIC" setFormData={setFormData} formData={formData} />
          <InputField id="address" label="Address" placeholder="Enter Address" setFormData={setFormData} formData={formData} />

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );

};

export default AddDelivery;
