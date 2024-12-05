import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers } from "../../../store/user/userSlice";
import { useTable, useSortBy, usePagination, useFilters } from "react-table";
import { Link } from "react-router-dom";
import {
  deleteSingleAuctionById,
  getAllAuctions,
  getSellerAuction,
} from "../../../store/auction/auctionSlice";
import { MdSkipPrevious, MdSkipNext } from "react-icons/md";
import {
  FaCaretUp,
  FaCaretDown,
  FaCaretRight,
  FaCaretLeft,
  FaEye,
  FaRegEdit,
} from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";
import { API_URL } from "../../../store/chat/userService";

const Delivery = () => {

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

  const [filterInput, setFilterInput] = useState("");
  const [filterField, setFilterField] = useState("name");

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilter(filterField, value); // Use the selected field
    setFilterInput(value);
  };

  const handleDeleteDelivery = (id) => {
    const del = async () => {
      try {
        const response = await axios.delete(
          `${API_URL}/deliveries/delete/${id}`,
          { withCredentials: true }
        );
        alert("Delivery deleted successfully");
      } catch (error) {
        const message =
          (error.response && error.response.data.message) || error.message;
        return { message, isError: true };
      }
    };

    del().then((data) => {
      if (!data.isError) {
        window.location.reload();
      } else {
        alert(data.message);
      }          
    })


  };


  const data = useMemo(
    () =>
      Array.isArray(deliveries)
        ? deliveries.map((person) => {          
            return {
              picture: person?.image,
              name: person?.name,
              email: person?.email,
              phone: person?.phone,
              address: person?.address,
              NIC: person?.NIC,
              actions: person?._id,
            };
          })
        : [],
    [deliveries]
  );


const columns = useMemo(
  () => [
    {
      Header: "Picture",
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
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Phone",
      accessor: "phone",
    },
    {
      Header: "Address",
      accessor: "address",
    },
    {
      Header: "NIC",
      accessor: "NIC",
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row: { original } }) => (
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-primary" to={`/seller/delivery/view/${original.actions}`}>
            <i className="fa fa-eye"></i>
          </Link>
          <button onClick={() => handleDeleteDelivery(original.actions)} className="btn btn-outline-danger">
            <i className="fa fa-trash"></i>
          </button>
          <Link className="btn btn-outline-primary" to={`/seller/delivery/edit/${original.actions}`}>
              <i className="fa fa-edit"></i>
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
          Delivery people
          </h2>
          <a href="/seller/delivery/create" className="btn btn-primary ms-auto">
            <i className="fa fa-plus pe-2"></i>
            Add Delivery Person
          </a>
        </div>

        <div className="d-flex flex-column flex-md-row gap-3 mb-3">
          <select
            className="form-select"
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
          >
            <option value="name">Select a Field</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="address">Address</option>
            <option value="NIC">NIC</option>
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

export default Delivery;
