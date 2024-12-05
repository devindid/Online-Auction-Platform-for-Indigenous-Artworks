import { convert_currency } from "../../currency";

const BidCard = (bid) => {
  const logInUser = JSON.parse(localStorage.getItem("user"));
  const price = convert_currency(bid?.bid?.bidAmount ?? 0 );

  return (
    <div class="d-flex align-items-center justify-content-between border mt-2 py-2 px-3 border-light rounded-pill" 
    style={{maxWidth: "100%"}}>
    <div class="d-flex gap-4 align-items-center text-white">
        <img src={bid?.bid?.bidder?.profilePicture} alt="bidder profilePicture" class="rounded-circle" 
        style={{width: "40px", height: "40px"}} />
        <div class="d-flex flex-column">
            <span class="fw-semibold">{bid?.bid?.bidder?.fullName}</span>
            <span class="text-muted" style={{fontSize: "0.75rem"}}>
                {new Date(bid?.bid?.bidTime).toLocaleDateString()}
                {""} 
                {new Date(bid?.bid?.bidTime).toLocaleTimeString()}
            </span>
        </div>
    </div>
    <div class="text-white">Bid Amount: {price.symbol} {price.value}</div>
</div>
  );

}

export default BidCard