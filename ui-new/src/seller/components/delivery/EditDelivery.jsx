import { useEffect, useRef, useState} from "react";
import "react-toastify/dist/ReactToastify.css";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "axios";
import { API_URL } from "../../../store/chat/userService";
import { useParams } from "react-router-dom";


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


const EditDelivery = () => {

  const {id} = useParams();
  const imgRef = useRef(null);
  const [imgUrl, setImgUrl] = useState(null);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    NIC: "",
    address: ""
  });

  const handleDeliveryUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("NIC", formData.NIC);
    data.append("address", formData.address);

    if (!imgRef.current.files[0]) {
      data.append("image", null);
    } else if (imgRef.current.files[0].size > 1024 * 1024) {
      return alert("Image size should be less than 1mb");
    } else {
      data.append("image", imgRef.current.files[0]);
    }

    const upload = async () => {
      try {
        const response = await axios.put(
          `${API_URL}/deliveries/update/${id}`,
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



  useEffect(() => {
    const getDelivery = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/deliveries/${id}`,
          { withCredentials: true }
        );
        let del = response.data.data;

        setImgUrl(del.image);
        setFormData({ name: del.name, email: del.email, phone: del.phone, NIC: del.NIC, address: del.address });
      } catch (error) {
        const message =
          (error.response && error.response.data.message) || error.message;
        return { message, isError: true };
      }
    };


    getDelivery();
  }, []);


  return (
    <div className="container-fluid my-4">
        <h1 className="text-white fs-3 fw-bold mb-4">Edit Delivery Person</h1>

      <form
        className="d-flex flex-column flex-lg-row gap-4 justify-center mx-auto ps-4 py-2"
        onSubmit={handleDeliveryUpdate}
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
            Update
          </button>
        </div>
      </form>
    </div>
  );

};

export default EditDelivery;
