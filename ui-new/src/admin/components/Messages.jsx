import { RiUserAddFill } from "react-icons/ri";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { MdSkipPrevious, MdSkipNext } from "react-icons/md";
import {
  FaCaretUp,
  FaCaretDown,
  FaCaretRight,
  FaCaretLeft,
  FaEye,
  FaRegEdit,
  FaPlus,
  FaCartPlus,
} from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllUsers,
  deleteUserById,
  getTopSellers,
} from "../../store/user/userSlice";
import { useTable, useSortBy, usePagination, useFilters } from "react-table";
import { Link } from "react-router-dom";

import axios from "axios";
import { API_URL } from "../../store/chat/userService";



const UserList = () => {
  const [filterInput, setFilterInput] = useState("");
  const [filterField, setFilterField] = useState("name");
  const [messages, setMessages] = useState([]);
  
  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilter(filterField, value); // Use the selected field
    setFilterInput(value);
  };


  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `${API_URL}/contact/`,
        { withCredentials: true }
      );
      let data = response.data.data;
      console.log(data);
      
      setMessages(data);
    })();

  }, []);

  const data = useMemo(
    () =>
      Array.isArray(messages)
        ? messages.map((message) => {          
            return {
              time: message?.createdAt.toString().replace("T", " ").split(".")[0],
              name: message?.name,
              email: message?.email,
              message: message?.message
            };
          })
        : [],
    [messages]
  );


const columns = useMemo(
  () => [
    {
      Header: "Time",
      accessor: "time",
    },
    {
      Header: "Full Name",
      accessor: "name",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Message",
      accessor: "message",
    }
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
      <div className="py-4 w-100 bg-dark text-white rounded">
      <h2 className="text-white fw-bold fs-4 border-bottom border-info pb-3 mb-5">
          All Messages
        </h2>
        <div className="d-flex flex-column flex-md-row gap-3 mb-3">
          <select
            className="form-select"
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
          >
            <option value="name">Select a Field</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
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


const Messages = () => {

  return (
    <div className="w-100 bg-dark text-light rounded-4 p-5">
      <UserList/>
    </div>
  );
  
};

export default Messages;
