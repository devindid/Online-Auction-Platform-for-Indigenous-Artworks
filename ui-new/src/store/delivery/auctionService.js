import axios from "axios";

const API_URL = "http://localhost:8000/api/v1";

const createDelivery = async (data) => {
  //console.log("data..... create delivery ........", data);
  try {
    const response = await axios.post(
      `${API_URL}/deliverys/create-delivery`,
      data,
      { withCredentials: true }
    );
    //console.log("response createDelivery", response.data);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data.message) || error.message;
    //console.error("Error with createDelivery", error);
    return { message, isError: true };
  }
};

const getAllDeliverys = async (data) => {
  try {
    //console.log(data, "data");
    const response = await axios.post(`${API_URL}/deliverys`, data);
    //console.log("response getAllDeliverys", response.data);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data.message) || error.message;
    // //console.error("Error with getAllDeliverys", error);
    return { message, isError: true };
  }
};

const getSingleDeliveryById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/deliverys/${id}`);
    //console.log("res.data", res.data);
    return res.data;
  } catch (err) {
    //console.error("Error in getSingleDeliveryById", err);
    return null;
  }
};


//update delivery status

const updateDeliveryStatus = async (data) => {
  try {
    //console.log("data updateDeliveryStatus", data);
    const response = await axios.post(
      `${API_URL}/deliverys/${data.id}/status`,
      { status: data.status },
      { withCredentials: true }
    );
    //console.log("response updateDeliveryStatus", response.data);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data.message) || error.message;
    //console.error("Error with updateDeliveryStatus", error);
    return { message, isError: true };
  }
};

const selectDeliveryWinner = async (data) => {
  try {
    //console.log("data selectDeliveryWinner", data);
    const response = await axios.get(
      `http://localhost:8000/api/v1/bids/${data.id}/winner`
    );
    //console.log("response selectDeliveryWinner", response.data);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data.message) || error.message;
    //console.error("Error with selectDeliveryWinner", error);
    return { message, isError: true };
  }
};

const getSellerDelivery = async () => {
  try {
    const response = await axios.get(`${API_URL}/deliverys/user-deliverys`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data.message) || error.message;
    //console.error("Error with getSellerDelivery", error);
    return { message, isError: true };
  }
};

const deleteSingleDeliveryById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/deliverys/delete/${id}`, {
      withCredentials: true,
    });
    //console.log("response deleteSingleDeliveryById", response.data);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data.message) || error.message;
    //console.error("Error with deleteSingleDeliveryById", error);
    return { message, isError: true };
  }
};

const deleteDeliveryByAdminById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/deliverys/admin-delete/${id}`, {
      withCredentials: true,
    });
    //console.log("response deleteSingleDeliveryById", response.data);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data.message) || error.message;
    //console.error("Error with deleteSingleDeliveryById", error);
    return { message, isError: true };
  }
};

const updateSingleDelivery=async(data)=>{
    //console.log(data.data, "data updateSingleDelivery");

    try{
        const response = await axios.put(`${API_URL}/deliverys/update/${data.id}`,data.data, {withCredentials:true});
        //console.log("response updateSingleDelivery", response.data);
        return response.data;
    }catch(error){
        const message = (error.response && error.response.data.message) || error.message;
        //console.error("Error with updateSingleDelivery", error);
        return {message, isError:true};
    }
}

const getWinnerDetail=async(id)=>{
    try{
        const response = await axios.get(`${API_URL}/deliverys/${id}/winner`);
        //console.log("response getWinnerDetail", response.data);
        return response.data;
    }catch(error){
        const message = (error.response && error.response.data.message) || error.message;
        //console.error("Error with getWinnerDetail", error);
        return {message, isError:true};
    }
}


const getLiveDeliverys=async()=>{
    try{
        const response = await axios.get(`${API_URL}/deliverys/live-deliverys`);
        //console.log("response getLiveDeliverys", response.data);
        return response.data;
    }catch(error){
        const message = (error.response && error.response.data.message) || error.message;
        //console.error("Error with getLiveDeliverys", error);
        return {message, isError:true};
    }
}

const getUpcomingDeliverys=async()=>{
  try{
      const response = await axios.get(`${API_URL}/deliverys/upcoming-deliverys`);
      //console.log("response getLiveDeliverys", response.data);
      return response.data;
  }catch(error){
      const message = (error.response && error.response.data.message) || error.message;
      //console.error("Error with getLiveDeliverys", error);
      return {message, isError:true};
  }
}
const updatePaymentStatus=async(id)=>{
  try{
      const response = await axios.put(`${API_URL}/deliverys/update-payment-status/${id}`,{
          withCredentials:true
      });
      //console.log("response getLiveDeliverys", response.data);
      return response.data;
  }catch(error){
      const message = (error.response && error.response.data.message) || error.message;
      //console.error("Error with getLiveDeliverys", error);
      return {message, isError:true};
  }

}


const deliveryService = {
  getWinnerDetail,
  createDelivery,
  getAllDeliverys,
  getSingleDeliveryById,
  updateDeliveryStatus,
  selectDeliveryWinner,
  getSellerDelivery,
  deleteSingleDeliveryById,
  updateSingleDelivery,
  getLiveDeliverys,
  getUpcomingDeliverys,
  updatePaymentStatus,
  deleteDeliveryByAdminById
};

export default deliveryService;
