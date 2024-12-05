import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSingleAuctionById,
  reset,
  updateSingleAuction,
} from "../../../store/auction/auctionSlice.js";
import { getAllCategories } from "../../../store/category/categorySlice.js";
import { getAllCities } from "../../../store/city/citySlice.js";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditAuction = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { singleAuction, isLoading } = useSelector((state) => state.auction);
  const [singleAuctionData, setSingleAuctionData] = useState(singleAuction);
  const [imgUrl, setImgUrl] = useState(singleAuction?.image || "");
  const imgRef = useRef(null);
  const { categories } = useSelector((state) => state.category);
  const { cities } = useSelector((state) => state.city);
  //console.log("singleAuction........", singleAuction);

  useEffect(() => {
    dispatch(getSingleAuctionById(id));
  }, [id]);

  useEffect(() => {
    if (singleAuction) {
      setSingleAuctionData(singleAuction);
    }
  }, [singleAuction]);

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllCities());
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    category: "",
    location: "",
    startingPrice: 0,
    imgUrl: "",
  });

  useEffect(() => {
    setFormData({
      name: singleAuctionData?.name,
      description: singleAuctionData?.description || "",
      startTime: singleAuctionData?.startTime
        ? new Date(singleAuctionData?.startTime).toISOString().slice(0, 16)
        : "",
      endTime: singleAuctionData?.endTime
        ? new Date(singleAuctionData?.endTime).toISOString().slice(0, 16)
        : "",
      category: singleAuctionData?.category?._id || "",
      location: singleAuctionData?.location?._id || "",
      startingPrice: parseFloat(singleAuctionData?.startingPrice) || 0,
    });
    setImgUrl(singleAuctionData?.image || "");
  }, [singleAuctionData]);


  const handleProductUpload = (e) => {
    e.preventDefault();

    console.log("X");
    //image data so use new formdata
    const data = new FormData();
    //console.log(formData);
    data.append("name", formData.name);
    data.append("startingPrice", formData.startingPrice);
    data.append("category", formData.category);
    data.append("startTime", formData.startTime);
    data.append("endTime", formData.endTime);
    data.append("location", formData.location);
    data.append("description", formData.description);

    if (imgRef.current.files[0]) {
      data.append("image", imgRef.current.files[0]);
    } else {
      data.append("image", imgUrl);
    }

    console.log(data);
    dispatch(updateSingleAuction({ data: data, id: id }));
    toast.success("Auction updated successfully");

    const timer = setTimeout(() => {
      window.history.back();
    }, 600);
    

    dispatch(reset());
  };

  return (
    <div>
      <form
        className="d-flex flex-column flex-lg-row gap-4 justify-content-center mx-auto px-3"
        onSubmit={handleProductUpload}
      >
        <div className="text-white w-100 w-lg-25 mb-4">
          <h1 className="text-white display-6 mb-4">Upload Item</h1>
  
          {imgUrl ? (
            <img
              src={imgUrl}
              alt="upload img"
              onClick={() => imgRef.current.click()}
              className="w-100 h-100 rounded border p-2 object-contain cursor-pointer"
            />
          ) : (
            <div
              onClick={() => imgRef.current.click()}
              className="w-100 h-100 rounded border border-dashed d-flex align-items-center justify-content-center cursor-pointer"
            >
              <p className="text-white">Click to upload</p>
            </div>
          )}
  
          <input
            type="file"
            className="d-none"
            onChange={(e) => setImgUrl(URL.createObjectURL(e.target.files[0]))}
            ref={imgRef}
          />
        </div>
  
        <div className="d-flex flex-column gap-3 w-100 p-4 border rounded bg-dark text-white">
          <div className="form-group">
            <label htmlFor="product_name">Product Name</label>
            <input
              required
              id="product_name"
              type="text"
              className="form-control"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              value={formData.name}
            />
          </div>
  
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              required
              id="category"
              className="form-select"
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              value={formData.category}
            >
              {categories.data &&
                categories.data.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
  
          <div className="row">
            <div className="col-lg-6">
              <div className="form-group">
                <label htmlFor="start_time">Start Time</label>
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
  
            <div className="col-lg-6">
              <div className="form-group">
                <label htmlFor="end_time">End Time</label>
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
  
          <div className="row">
            <div className="col-lg-6">
              <div className="form-group">
                <label htmlFor="starting_price">Starting Price</label>
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
  
            <div className="col-lg-6">
              <div className="form-group">
                <label htmlFor="category">Area</label>
                <select
                  required
                  id="category"
                  className="form-select"
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  value={formData.location}
                >
                  {cities.data &&
                    cities.data.map((location) => (
                      <option key={location._id} value={location._id}>
                        {location.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
  
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
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
  
          <button type="submit" className="btn btn-primary w-100 py-3 fw-bold">
            Update
          </button>
        </div>
      </form>
    </div>
  );

  

};

export default EditAuction;
