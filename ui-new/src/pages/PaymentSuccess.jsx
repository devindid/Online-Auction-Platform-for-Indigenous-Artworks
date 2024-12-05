import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteCartItem } from "../store/cart/cartSlice";
import { updatePaymentStatus } from "../store/auction/auctionSlice";
import { FaRegCheckCircle } from "react-icons/fa";
const PaymentSuccess = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(updatePaymentStatus(id));
    dispatch(deleteCartItem(id));

    setTimeout(() => {
      navigate("/");
    }, 5000);
  }, []);

  return (
    <div className="text-white d-flex flex-column justify-content-center align-items-center min-vh-100">
        <FaRegCheckCircle
            size={96}
            className="text-primary animate__animated animate__fadeIn"
        />
        <div className="d-flex flex-column align-items-center text-center mt-3">
            <h2 className="display-4 font-weight-bold">Payment Successful!</h2>
            <p className="lead">Thank you for your billing.</p>
        </div>
    </div>
);

  return (
    <div className="text-white flex gap-4 flex-col justify-center items-center h-screen ">
      <FaRegCheckCircle
        size={96}
        className="text-theme-color animate-[successkey_500ms]"
      />
      <div className="flex flex-col gap-2 text-center animate-[successkey_700ms]">
        <h2 className="text-3xl font-bold ">Payment Successfull!</h2>
        <p className="text-[16px]">Thank You For Your Billing.</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
