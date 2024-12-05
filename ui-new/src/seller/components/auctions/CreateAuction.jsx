import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAuction, reset } from "../../../store/auction/auctionSlice";
import { getAllCategories } from "../../../store/category/categorySlice";
import { getAllCities } from "../../../store/city/citySlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoCloudUploadOutline } from "react-icons/io5";

const CreateAuction = () => {
  const dispatch = useDispatch();
  const [imgUrl, setImgUrl] = useState("");
  const imgRef = useRef(null);
  const { auction, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auction
  );
  const { categories } = useSelector((state) => state.category);
  const { cities } = useSelector((state) => state.city);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllCities());
  }, [dispatch]);

  ////console.log("categoreik   ", categories);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    startTime: "",
    endTime: "",
    location: "",
    startingPrice: "",
    description: "",
  });

  useEffect(() => {
    dispatch(reset());
    ////console.log(isSuccess  , " and ", isError);

    if ( isError) {
      toast.error(message, {
        autoClose: 500,
      });
      dispatch(reset());
    } else if (isSuccess &&  isError===undefined  ) {
      ////console.log(isSuccess  , " and ", isError);
      toast.success(message, {
        autoClose: 500,
      });
      dispatch(reset());
      //clear form data
      setFormData({
        name: "",
        category: "",
        startTime: "",
        endTime: "",
        location: "",
        startingPrice: "",
        description: "",
      });
      setImgUrl("");
    }
    dispatch(reset());
  }, [isSuccess, isError, isLoading]);

  const handleProductUpload = async (e) => {
    e.preventDefault();
    //image data so use new formdata
    const data = new FormData();
    ////console.log(formData);
    data.append("name", formData.name);
    data.append("startingPrice", formData.startingPrice);
    data.append("category", formData.category);
    data.append("startTime", formData.startTime);
    data.append("endTime", formData.endTime);
    data.append("location", formData.location);
    data.append("description", formData.description);

    if (!imgRef.current.files[0]) {
      return alert("Image is required");
    } else if (imgRef.current.files[0].size > 1024 * 1024) {
      return alert("Image size should be less than 1mb");
    } else {
      data.append("image", imgRef.current.files[0]);
    }

    dispatch(createAuction(data));

    //dispatch(getAllAuctions());
    dispatch(reset());
  };

  return (
    <div className="container-fluid my-4">
      <form
        className="d-flex flex-column flex-lg-row gap-4 justify-center mx-auto ps-4 py-5"
        onSubmit={handleProductUpload}
      >
        <div className="text-white col-lg-3 col-md-6">
          <h1 className="text-white fs-3 fw-bold mb-4">Schedule Auction</h1>
  
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
          <div className="mb-3">
            <label htmlFor="product_name" className="form-label">Artwork Name</label>
            <input
              required
              id="product_name"
              placeholder="e.g (Modern Abstract Painting)"
              type="text"
              className="form-control"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              value={formData.name}
            />
          </div>
  
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              className="form-select"
              required
              id="category"
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              value={formData.category}
            >
              <option value="">Select Category</option>
              {categories.data &&
                categories.data.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="start_time" className="form-label">Start Time</label>
                <input
                  required
                  id="startTime"
                  type="datetime-local"
                  className="form-control"
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  value={formData.startTime}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="end_time" className="form-label">End Time</label>
                <input
                  required
                  id="endTime"
                  type="datetime-local"
                  className="form-control"
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  value={formData.endTime}
                />
              </div>
            </div>
          </div>
  
          <div className="row g-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="starting_price" className="form-label">Starting Price</label>
                <input
                  required
                  id="starting_price"
                  type="number"
                  className="form-control"
                  onChange={(e) =>
                    setFormData({ ...formData, startingPrice: e.target.value })
                  }
                  value={formData.startingPrice}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="location" className="form-label">City</label>
                <input
                  required
                  id="location"
                  type="text"
                  className="form-control"
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  value={formData.location}
                />
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              placeholder="Describe your product, art, etc."
              required
              id="description"
              rows="7"
              className="form-control"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              value={formData.description}
            />
          </div>
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

export default CreateAuction;
