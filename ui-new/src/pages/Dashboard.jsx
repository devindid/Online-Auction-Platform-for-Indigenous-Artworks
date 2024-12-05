import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { reset } from "../store/auth/authSlice";
import { getAllAuctions } from "../store/auction/auctionSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SingleAuction from "../components/SingleAuction";
import SearchLocationCategory from "../components/SearchLocationCategory";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";
import axios from "axios";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [auctionData, setAuctionData] = useState([]);

  const { auction, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auction
  );
  //console.log(auctionData);

  useEffect(() => {
    dispatch(getAllAuctions());
    //console.log("dispatched");
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setAuctionData(auction);
    } else if (isError) {
      toast.error(message);
    }
  }, [auction]);

  //pagination part
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(12);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = auctionData?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  // 318f69a969db4f7599b7fbb5043e444e

  return (
    <div className="d-flex flex-column min-vh-100 w-100 bg-dark text-secondary">
      <div className="mb-4">
        <SearchLocationCategory />
      </div>
  
      {isLoading ? (
        <Loading />
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mx-auto" style={{ maxWidth: "1400px" }}>
          {auctionData &&
            currentItems.map((item, index) => (
              <div key={index} className="col">
                <SingleAuction
                  name={item?.name}
                  startingPrice={item?.startingPrice}
                  image={item?.image}
                  endTime={item?.endTime}
                  startTime={item?.startTime}
                  id={item?._id}
                  status={item?.status}
                  sellerImage={item?.seller?.profilePicture}
                  sellerName={item?.seller?.fullName}
                  sellerId={item?.seller?._id}
                  bidLength={item?.bids?.length}
                  winnerFullName={item?.winner?.bidder?.fullName}
                  winnerProfilePicture={item?.winner?.bidder?.profilePicture}
                  winnerBidAmount={item?.winner?.bidAmount}
                  winnerBidTime={item?.winner?.bidTime}
                />
              </div>
            ))}
        </div>
      )}
  
      {auctionData && auctionData.length !== 0 ? (
        <Pagination
          totalPosts={auctionData.length}
          postsPerPage={itemsPerPage}
          paginate={paginate}
          currentPage={currentPage}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      ) : null}
    </div>
  );
  

};

export default Dashboard;
