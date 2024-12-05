import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers } from "../../store/user/userSlice";
import { useTable, useSortBy, usePagination, useFilters } from "react-table";
import { Link } from "react-router-dom";
// import {
//   deleteSingleAuctionById,
//   getAllAuctions,
//   getSellerAuction,
// } from "../../store/auction/auctionSlice";
import { MdSkipPrevious, MdSkipNext } from "react-icons/md";
import {
  FaCaretUp,
  FaCaretDown,
  FaCaretRight,
  FaCaretLeft,
  FaEye,
  FaRegEdit,
} from "react-icons/fa";
import { getUserWinnings } from "../../store/bid/bidSlice";
import { convert_currency, get_currency_symbol } from "../../currency";

const MyWinnings = () => {
  const dispatch = useDispatch();
  const [filterInput, setFilterInput] = useState("");
  const [filterField, setFilterField] = useState("name");
  const { bids, isLoading, isError, isSuccess, message } = useSelector((state) => state.bid);


  let auction = bids;
  console.log(auction, "auction");

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilter(filterField, value); // Use the selected field
    setFilterInput(value);
  };

  useEffect(() => {
    dispatch(getUserWinnings());
  }, [dispatch]);

  const data = useMemo(
    () =>
      Array.isArray(auction)
        ? auction.map((auc) => {
          let bid = auc;
          auc = auc.auction;
            const paymentStatus = auc?.paid === false ? "UnPaid" : "Paid";
            const statusClass = auc?.paid === false
            ? "text-danger px-2 py-1 border border-danger rounded-pill"
            : "text-success px-2 py-1 border border-success rounded-pill";
          
            return {
              picture: auc?.image,
              name: auc?.name,
              category: auc?.category?.name || "---",
              seller: auc?.seller?.fullName || "---",
              location: auc?.location?.name,
              status: auc?.status,
              startingPrice: auc?.startingPrice,
              startTime: new Date(auc?.startTime).toLocaleString(),
              endTime: new Date(auc?.endTime).toLocaleString(),
              paymentStatus: paymentStatus,
              statusClass: statusClass,
              paid: auc?.paid,
              bidAmount: convert_currency(bid?.bidAmount).value,
              bidTime: bid?.bidTime,
              actions: auc?._id,
              winner: auc?.winner?.bidder?.fullName || "No winner",
            };
          })
        : [],
    [auction]
  );


const columns = useMemo(
  () => [
    {
      Header: "Artwork",
      accessor: "picture",
      Cell: ({ value }) => (
        <img
          src={value}
          alt="Profile"
          style={{ width: "50px", height: "50px" }}
          className="img-fluid"
        />
      ),
    },
    {
      Header: "Auction Name",
      accessor: "name",
    },
    {
      Header: "Seller",
      accessor: "seller",
    },
    {
      Header: `Winning Bid (${get_currency_symbol()})`,
      accessor: "bidAmount",
      Cell: ({ value }) => <div className="w-100">{value}</div>,
    },
    {
      Header: "Bid Time",
      accessor: "bidTime",
      Cell: ({ value }) => (
        <span>{new Date(value).toLocaleString()}</span>
      ),
    },
    {
      Header: "Payment Status",
      accessor: "paymentStatus",
      Cell: ({ value, row: { original } }) => (
        <span className={original.statusClass}>{value}</span>
      ),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row: { original } }) => (
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-primary" to={`/single-auction-detail/${original.actions}`}>
            <i className="fa fa-eye"></i>
          </Link>
          {original.paid && <Link to={"/user-profile/report/" + original.actions} className="btn btn-outline-primary">
            <i className="fa fa-file"></i>
          </Link>}

          {original.paid === false && <Link to={"/user-profile/pay/" + original.actions} className="btn btn-outline-success">
            <i className="fa fa-dollar"></i>
          </Link>}

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
          My Winnings
          </h2>
        </div>

        <div className="d-flex flex-column flex-md-row gap-3 mb-3">
          <select
            className="form-select"
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
          >
            <option value="name">Select a Field</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="seller">Seller</option>
            <option value="status">Status</option>
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
            <tbody {...getTableBodyProps()}>
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

export default MyWinnings;
