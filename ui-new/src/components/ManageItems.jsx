import { useDispatch, useSelector } from "react-redux";
import { useEffect ,useState} from "react";
import { Link } from "react-router-dom";
import {
  deleteSingleAuctionById,
  getSellerAuction,
  reset,
} from "../store/auction/auctionSlice";
import { FaEye } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import Loading from "./Loading"
import Pagination from "./Pagination";
const ManageItems = () => {
  const dispatch = useDispatch();
  const { sellerAuction, isLoading } = useSelector((state) => state.auction);

  // componentDidMount and component
  useEffect(() => {
    dispatch(getSellerAuction());
  }, [dispatch]);
  //console.log(sellerAuction, "sellerAuction....");

  const handleDeleteAuction = async (id) => {
    //console.log(id, "delete id....");
    await dispatch(deleteSingleAuctionById(id)).then(() => {
      toast.success("item deleted.", {
        autoClose: 500,
      });
    });
    dispatch(getSellerAuction());
  };

   //pagination part
   const [currentPage, setCurrentPage] = useState(1)
   const [itemsPerPage, setitemsPerPage] = useState(6)
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = sellerAuction?.auctions?.slice(indexOfFirstItem, indexOfLastItem);
 
   const paginate = (pageNumber) => {
     setCurrentPage(pageNumber)
   }
   const prevPage = () => {
     setCurrentPage(currentPage-1)
   }
   const nextPage = () => {
     setCurrentPage(currentPage+1)
   }

   return (
    <div className="p-4 w-100 bg-dark text-white rounded-lg">
      <h2 className="text-white fw-bold fs-4 border-bottom border-light pb-3 mb-4">
        Manage Items
      </h2>
      <div className="overflow-auto p-3 bg-secondary rounded-lg border border-light">
        <table className="table table-striped table-bordered text-white">
          <thead className="bg-primary text-light">
            <tr>
              <th className="rounded-start">Product</th>
              <th>Category</th>
              <th>Bids</th>
              <th>Status</th>
              <th>Your Bid</th>
              <th>Winner</th>
              <th className="rounded-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {sellerAuction?.auctions?.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-5">No Item</td>
              </tr>
            ) : isLoading ? (
              <tr>
                <td colSpan="7" className="text-center py-5">
                  <Loading width="sidebar"/>
                </td>
              </tr>
            ) : (
              currentItems?.map((auction) => (
                <tr key={auction?._id}>
                  <td className="d-flex align-items-center gap-2">
                    <img
                      src={auction?.image}
                      alt="auction"
                      className="w-25 h-25 rounded-circle"
                    />
                    <span>{auction?.name}</span>
                  </td>
                  <td>{auction?.category?.name || "---"}</td>
                  <td>{auction?.bids?.length}</td>
                  <td>
                    <span className="badge bg-secondary">
                      {auction?.status}
                    </span>
                  </td>
                  <td>{auction?.startingPrice}</td>
                  <td>{auction?.winner?.bidder?.fullName || "----"}</td>
                  <td className="d-flex gap-2">
                    <Link
                      className="btn btn-outline-primary btn-sm"
                      to={`/single-auction-detail/${auction?._id}`}
                    >
                      <FaEye size={16} />
                    </Link>
                    {auction?.status === "upcoming" && (
                      <Link
                        className="btn btn-outline-primary btn-sm"
                        to={`/edit-auction/${auction?._id}`}
                      >
                        <FaRegEdit size={16} />
                      </Link>
                    )}
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteAuction(auction?._id)}
                    >
                      <MdDeleteForever size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {sellerAuction?.auctions?.length > 0 && (
        <Pagination
          totalPosts={sellerAuction?.auctions?.length}
          postsPerPage={itemsPerPage}
          paginate={paginate}
          currentPage={currentPage}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      )}
    </div>
  );
  
  return (
    <div className=" overflow-auto px-7 py-4 w-full bg-theme-bg text-white rounded-2xl ">
      <h2 className=" text-white font-bold text-xl border-b border-border-info-color pb-3 mb-5 ">
        Manage Items
      </h2>
      <div className=" overflow-auto px-4 bg-theme-bg2 rounded-2xl  border border-border-info-color">
        <table className="text-left whitespace-nowrap w-full border-separate border-spacing-x-0 border-spacing-y-4">
          <thead className="table-header-group ">
            <tr className="table-row bg-theme-color [&_th]:table-cell [&_th]:pl-5 [&_th]:pr-3 [&_th]:py-3">
              <th className="rounded-l-lg ">Product</th>
              <th>Catagory</th>
              <th>Bids</th>
              <th>Status</th>
              <th>Your Bid</th>
              <th>Winner</th>

              <th className="rounded-r-lg">Action</th>
            </tr>
          </thead>
          
          <tbody className="table-row-group">
            {sellerAuction?.auctions?.length === 0 ? (
              <tr className="table-row bg-theme-bg ">
                <td colSpan="7" className="text-center m-2 w-full p-10 h-[400px]">No Item</td>
              </tr>
            ) : (
              isLoading ? <tr>
                <td colSpan="7" className="text-center">
                  <Loading width="sidebar"/>
                </td>
              </tr> : currentItems?.map((auction) => (
                <tr
                  key={auction?._id}
                  className="table-row bg-theme-bg [&_td]:table-cell [&_td]:pl-5 [&_td]:pr-3 [&_td]:py-3"
                >
                  <td className="rounded-l-lg">
                    <div className="flex items-center gap-2">
                      <img
                        src={auction?.image}
                        alt="auction image"
                        className="w-[50px] h-[50px] rounded-full"
                      />
                      <span className="pr-10">{auction?.name}</span>
                    </div>
                  </td>
                  <td>
                    <span>{auction?.category?.name || "---"}</span>
                  </td>
                  <td>
                    <span>{auction?.bids?.length}</span>
                  </td>
                  <td className="capitalize">
                    <span className="px-3 py-1 rounded-full text-sm border bg-theme-bg2 border-border-info-color">
                      {auction?.status}
                    </span>
                  </td>
                  <td>
                    <span>{auction?.startingPrice}</span>
                  </td>
                  <td>
                    <span>{auction?.winner?.bidder?.fullName || "----"}</span>
                  </td>
                  <td className="link:mr-2 capitalize rounded-r-lg">
                    <Link
                      className="text-theme-color hover:text-white hover:bg-theme-color rounded-lg border-2 border-theme-color  px-2 py-[5px] transition-all"
                      to={`/single-auction-detail/${auction?._id}`}
                    >
                      <FaEye size={16} className="inline mt-[-2px]" />
                    </Link>
                    {auction?.status === "upcoming" && (
                      <>
                        <Link
                          className="text-theme-color hover:text-white hover:bg-theme-color rounded-lg border-2 border-theme-color  px-2 py-[5px] transition-all"
                          to={`/edit-auction/${auction?._id}`}
                        >
                          <FaRegEdit size={16} className="inline mt-[-3px]" />
                        </Link>
                      </>
                    )}

                    <button
                      className="text-color-danger hover:text-white hover:bg-color-danger rounded-lg border-2 border-color-danger  px-[6px] py-[3px] transition-all"
                      onClick={() => handleDeleteAuction(auction?._id)}
                    >
                      <MdDeleteForever
                        size={20}
                        className=" inline mt-[-3px]"
                      />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
 { sellerAuction?.auctions?.length ===0 ? <></> :<Pagination totalPosts={sellerAuction?.auctions?.length} postsPerPage={itemsPerPage} 
        paginate={paginate}
        currentPage={currentPage}
        nextPage={nextPage}
        prevPage={prevPage}
        />}
    </div>
  );
};

export default ManageItems;
