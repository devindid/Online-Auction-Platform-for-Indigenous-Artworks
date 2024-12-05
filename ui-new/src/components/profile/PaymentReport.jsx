import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import { getCurrentUser } from "../../store/auth/authSlice.js";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { getUserWinnings } from "../../store/bid/bidSlice.js";
import {API_URL} from "../../store/chat/userService.js";
import { convert_currency, get_currency_symbol } from "../../currency.js";

const PaymentReport = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch=useDispatch()
  const {bid} = useParams();

  const [auction, setAuction] = useState(null);

  useEffect(() => {

    let url = API_URL + "/auctions/" + bid;
    axios
      .get(url,
        { withCredentials: true })
      .then((response) => {
        let data = response.data.data;
        setAuction(data);
      })
      .catch((error) => {
        console.error(error);
      });

  }, []);

  console.log(auction, "auction");
  useEffect(()=>{
    dispatch(getCurrentUser())
  },[])

  const time_format = (time) => {
    return time.split(".")[0].replace("T", " ");
  }
  const handleSubmit = async (event) => {};

  const TextField = ({ label, value }) => {
    return (
      <div className="w-100 d-flex">
        <span>{label}:</span> 
        <span style={{borderBottom:"1px dashed black", flexGrow:1, marginLeft:"12px"}}>{value}</span>
      </div>
    );
  };

  if (!auction) {
    return <></>;
  }

  return (
    <div className="p-4 pb-5 w-100 bg-dark rounded-lg">
      <div className="text-white fw-bold fs-4 border-bottom border-light pb-3 mb-4">
        Auction Winning Certificate

        <button onClick={() => window.print_recept("receipt")} className="btn btn-outline-primary float-end"><i className="fa fa-print"></i></button>
      </div>
      <div className="row">
      <div className="col-12">
        <div id="receipt" className="card bg-light border-light mt-2 p-0">
          <div className="card-header p-4 m-0">
            <div className="fs-2 text-center fw-bold">ArtFolio Auction Certificate</div>


            <div className="row mt-3">
              <div className="col-6">
                <TextField label="Date" value={new Date().toLocaleDateString()} />

                <div className="fs-6 fw-bold mt-2 mb-1">Auction information</div>
                <TextField label="Auction Name" value={auction?.name} />
                <TextField label="Seller's name" value={auction?.seller?.firstname + " " + auction?.seller?.lastname} />
                <TextField label="Seller's address" value={auction?.seller?.address} />
                <TextField label="Phone" value={auction?.seller?.number} />
                <TextField label="Time period" value={time_format(auction?.startTime) + " - " + time_format(auction?.endTime)} />
                <TextField label="Minimum bid" value={`\$ ${auction?.initialPrice} (${get_currency_symbol()} ${convert_currency(auction?.initialPrice).value})` } />

                <div className="fs-6 fw-bold mt-2 mb-1">Bidder information</div>
                <TextField label="Bidder's name" value={auction?.winner?.bidder.firstname + " " + auction?.winner?.bidder.lastname} />
                <TextField label="Bidder's address" value={auction?.winner?.bidder.address} />
                <TextField label="Phone" value={auction?.winner?.bidder.number} />


              </div>
              <div className="col-6">
                <TextField label={"Reciept No."} value={auction.payment?._id} />
              </div>

              <div className="col-12 mt-3">
                <table className="w-100 table table-bordered border-dark">
                  <thead>
                    <tr>
                      <th className="text-center">Item Won</th>
                      <th className="text-center">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">{auction?.name}</td>
                      <td className="text-center">{`\$ ${auction?.payment?.amount} (${get_currency_symbol()} ${convert_currency(auction?.payment?.amount).value})`}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="col-6 mt-3">
                <TextField label="Received By" value={"ArtFolio Organization"} />
              </div>
            </div>
            

          </div>

        </div>

      </div>
      </div>
    </div>
  );

};

export default PaymentReport;
