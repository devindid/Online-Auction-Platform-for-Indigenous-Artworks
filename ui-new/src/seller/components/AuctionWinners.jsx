import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers } from "../../store/user/userSlice";
import { useTable, useSortBy, usePagination, useFilters } from "react-table";
import { Link } from "react-router-dom";
import {
  deleteSingleAuctionById,
  getAllAuctions,
  getSellerAuction,
} from "../../store/auction/auctionSlice";
import { MdSkipPrevious, MdSkipNext } from "react-icons/md";
import {
  FaCaretUp,
  FaCaretDown,
  FaCaretRight,
  FaCaretLeft,
  FaEye,
  FaRegEdit,
} from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../store/chat/userService";
import { toast } from "react-toastify";


const AuctionWinners = () => {
  const dispatch = useDispatch();
  const [filterInput, setFilterInput] = useState("");
  const [filterField, setFilterField] = useState("name");
  const { sellerAuction, isLoading, isError, isSuccess, message } = useSelector((state) => state.auction);

  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const getAllDeliveries=async () => {
      const response = await axios.get(`${API_URL}/deliveries`,{
          withCredentials:true
      
      });
      let data = response.data.data;
  
      setDeliveries(data);
    }

    getAllDeliveries();
  }, []);


  let auction = sellerAuction.auctions;
  console.log(deliveries);


  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilter(filterField, value); // Use the selected field
    setFilterInput(value);
  };


  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getSellerAuction());
  }, [dispatch]);

  const data = useMemo(
    () =>
      Array.isArray(auction)
        ? auction.map((auc) => {
            const paymentStatus = auc?.paid === false ? "UnPaid" : "Paid";
            const statusClass = auc?.paid === false
            ? "text-danger px-2 py-1 border border-danger rounded-pill"
            : "text-success px-2 py-1 border border-success rounded-pill";

            let winner = auc?.winner?.bidder;
            
            return {
              picture: auc?.image,
              auction_data: {picture: auc?.image, id: auc?._id, name: auc?.name, status: auc?.status, paid: auc?.paid},
              name: auc?.name,
              delivery: {auction: auc, people: deliveries},
              category: auc?.category?.name || "---",
              seller: auc?.seller?.fullName || "---",
              location: auc?.location?.name,
              status: {status: auc?.status, paid: auc?.paid},
              details: {status: auc?.status},
              startingPrice: auc?.startingPrice,
              startTime: new Date(auc?.startTime).toLocaleString(),
              endTime: new Date(auc?.endTime).toLocaleString(),
              paymentStatus: paymentStatus,
              statusClass: statusClass,
              winner,
              actions: auc?._id,
            };
          })
        : [],
    [auction]
  );


const columns = useMemo(
  () => [
    {
      Header: "Auction details",
      accessor: "auction_data",
      Cell: ({ value }) => {
        const auction = value;
        return (
          <div className="row">
            <div className="col-3 h-100 d-flex justify-content-center align-items-center">
              <img
                src={auction?.picture}
                alt="Profile"
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                className="img-fluid" />
            </div>
            <div className="col-9">
              <table className="w-100 table text-white">
                <tbody>
                  <tr>
                    <td className="p-0 m-0 w-50">Name</td>
                    <td className="p-0 m-0 w-50">{auction?.name}</td>
                  </tr>
                  <tr>
                  <td className="p-0 m-0 w-50">Auction Status</td>
                    <td className="p-0 m-0 w-50">{auction?.status}</td>
                  </tr>
                  <tr>
                  <td className="p-0 m-0 w-50">Payment</td>
                    <td className="p-0 m-0 w-50">{auction?.paid ? "Paid" : "Unpaid"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      },
    },
    {
      Header: "Winner details",
      accessor: "winner",
      Cell: ({ value }) => (
        value ? 
        <div className="row">
          <div className="col-3 h-100 d-flex justify-content-center align-items-center">
          <img
            src={value?.profilePicture}
            alt="Profile"
            style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
            className="img-fluid"
          />
          </div>
          <div className="col-9">
            <span className="ms-2 w-100 text-left"><i className="fa fa-user me-2"></i>{value?.firstname + " " + value?.lastname}</span><br/>
            <span className="ms-2"><i className="fa fa-envelope me-2"></i>{value?.email}</span><br/>
            <span className="ms-2"><i className="fa fa-phone me-2"></i>{value?.number}</span>
          </div>
        </div> :
        <div className="text-danger text-center w-100">No Winner Yet</div>
      ),
    },
    {
      Header: "Delivery details",
      accessor: "delivery",
      Cell: ({ value }) => {

        const [deliveryPerson, setDeliveryPerson] = useState(null);

        const {auction, people} = value;



        if (!auction.paid){
          return <>
                    <div className="text-danger text-center w-100">Payment is not completed</div>
          </>;
        }

        if (!auction.delivery){

          const handleAssign = async () => {
            try{
              await axios.put(`${API_URL}/auctions/update-delivery/${auction._id}`,
                 {delivery: deliveryPerson?._id},
                 {withCredentials: true}
                );
              toast.success("Delivery person assigned.");
              dispatch(getSellerAuction());
            }catch(err){
              console.log(err);
              toast.error(err.message);
            }
          }

        
          return <>
            <div className="text-danger text-center w-100">No delivery person is assigned.</div>
            <select className="form-select "
              value={deliveryPerson?._id || ""} 
              onChange={(e) => {
                const selectedPerson = people.find(person => person._id === e.target.value);
                setDeliveryPerson(selectedPerson || null);
              }}
            >
              <option value="" disabled>Select Delivery Person</option>
              {people.map((person, index) => (
                <option onClick={() => setDeliveryPerson(person)} key={index} value={person._id}>{person.name}</option>
              ))}
            </select>
            <button onClick={handleAssign} className="btn btn-primary mt-2 float-end">Assign</button>
          </>;
        }

        let person = auction.delivery;
        let winner = auction?.winner?.bidder;

        const get_body = () => {
          const body = 
`Hello ${person.name},

I would like to assign you as the delivery person for the auction ${auction.name}.

Please find the details below:

Auction ID: ${auction._id}
Auction Name: ${auction.name}
Auction Description: ${auction.description}

Seller Name: ${auction.seller.firstname}
Seller Email: ${auction.seller.email}
Seller Phone: ${auction.seller.number}
Seller Address: ${auction.seller.address}

Winner Name: ${winner?.firstname + " " + winner?.lastname}
Winner Email: ${winner?.email}
Winner Phone: ${winner?.number}
Winner Address: ${winner?.address}

Please do not hesitate to contact me if you have any questions.
Thank you.`;

          return body;
        }

        const send = async () => {

          const recipient = person.email;
          const subject = "Delivery request";
          const body = get_body();
        
          const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          window.location.href = mailtoLink;

        }

        const copy = async () => {
          const body = get_body();
        
          await navigator.clipboard.writeText(body);
          toast.success("Email body copied to clipboard.");
        }


        return (
            <div className="row">
              <div className="col-3 h-100 d-flex justify-content-center align-items-center">
                <img
                  src={person?.image}
                  alt="Profile"
                  style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
                  className="img-fluid" />
              </div>
              <div className="col-9">
                <span className="ms-2 w-100 text-left"><i className="fa fa-user me-2"></i>{person?.name}</span><br />
                <span className="ms-2"><i className="fa fa-envelope me-2"></i>{person?.email}</span><br />
                <span className="ms-2"><i className="fa fa-phone me-2"></i>{person?.phone}</span>
              </div>
              <div className="col-12 d-flex justify-content-center">
              <button onClick={() => send()} className="btn btn-primary mt-2 mx-2">
                  <i className="fa fa-envelope"></i>
                </button>
                <button onClick={() => copy()} className="btn btn-primary mt-2 mx-2">
                  <i className="fa fa-clipboard"></i>
                </button>
              </div>
            </div>
        );
      },
    },

    {
      Header: "View",
      accessor: "actions",
      Cell: ({ row: { original } }) => (
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-primary" to={`/seller/auctions/view/${original.actions}`}>
            <i className="fa fa-eye"></i>
          </Link>
        </div>
      ),
    },
  ],
  []
);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    state: { pageIndex, pageSize },
    pageCount,
    gotoPage,
    setPageSize,
    setFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 8 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <>
      <div className="p-4 w-100 bg-dark text-white rounded">
        <div className="d-inline-flex justify-content-between w-100 pb-3 mb-4 border-bottom">
          <h2 className="text-white font-bold text-xl">
          Auction winners
          </h2>

        </div>

        <div className="d-flex flex-column flex-md-row gap-3 mb-3">
          <select
            className="form-select"
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
          >
            <option value="name">Select a Field</option>
            <option value="name">Auction Name</option>
            <option value="status">Auction Status</option>
            <option value="paymentStatus">Payment Status</option>
          </select>
          <input
            className="form-control"
            value={filterInput}
            onChange={handleFilterChange}
            placeholder="Search Name"
          />
        </div>
        <div className="table-responsive border rounded">
          <table {...getTableProps()} className="table text-white">
            <thead className="bg-dark">
              {headerGroups.map((headerGroup, headerGroupIndex) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                  {headerGroup.headers.map((column, columnIndex) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={columnIndex}
                      className="p-2"
                    >
                      <div className="d-flex align-items-center gap-2">
                        {column.render("Header")}
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FaCaretDown />
                            ) : (
                              <FaCaretUp />
                            )
                          ) : null}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody  {...getTableBodyProps()} className="align-middle">
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={row.id}>
                    {row.cells.map((cell, cellIndex) => (
                      <td {...cell.getCellProps()} key={cellIndex}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 my-4">
          <div className="d-flex align-items-center gap-2">
            <button
              className={`btn btn-primary ${pageIndex === 0 ? "disabled" : ""}`}
              onClick={() => gotoPage(0)}
            >
              <MdSkipPrevious />
            </button>
            <button
              className={`btn btn-primary ${!canPreviousPage ? "disabled" : ""}`}
              onClick={() => previousPage()}
            >
              <FaCaretLeft />
            </button>
            <span>
              Page <strong>{pageIndex + 1} of {pageCount}</strong>
            </span>
            <button
              className={`btn btn-primary ${!canNextPage ? "disabled" : ""}`}
              onClick={() => nextPage()}
            >
              <FaCaretRight />
            </button>
            <button
              className={`btn btn-primary ${pageIndex === pageCount - 1 ? "disabled" : ""}`}
              onClick={() => gotoPage(pageCount - 1)}
            >
              <MdSkipNext />
            </button>
          </div>

          <select
            className="form-select w-auto"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[8, 12, 16, 20, 24, 28, 32, 36, 40].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default AuctionWinners;
