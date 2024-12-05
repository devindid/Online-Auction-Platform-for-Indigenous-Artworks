import { RiUserAddFill } from "react-icons/ri";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { MdSkipPrevious, MdSkipNext } from "react-icons/md";
import { FaShop } from "react-icons/fa6";
import { FaUsers, FaUserPlus } from "react-icons/fa6";
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
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  deleteAuctionByAdminById,
  getAllAuctions,
} from "../../store/auction/auctionSlice";


const UserList = () => {
  const dispatch = useDispatch();
  const [filterInput, setFilterInput] = useState("");
  const [filterField, setFilterField] = useState("name");
  const { auction, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auction
  );

  const { allUser, topSellers, reset } = useSelector((state) => state.user);
  const users = allUser.data;

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilter(filterField, value); // Use the selected field
    setFilterInput(value);
  };


  const handleDeleteUser = (id) => {
    dispatch(deleteUserById(id)).then(() => {
      dispatch(getAllUsers());
    });
  };

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllAuctions());
  }, [dispatch]);

  const data = useMemo(
    () =>
      Array.isArray(users)
        ? users.map((user) => {
            const paymentStatus = user?.paid === false ? "UnPaid" : "Paid";
            const statusClass = user?.paid === false
            ? "text-danger px-2 py-1 border border-danger rounded-pill"
            : "text-success px-2 py-1 border border-success rounded-pill";
          
            return {
              picture: user?.profilePicture,
              fullName: user?.fullName,
              userType: user?.role,
              country: user?.country,
              number: user?.number,
              email: user?.email,
              actions: user?._id,
            };
          })
        : [],
    [users]
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
      Header: "Full Name",
      accessor: "fullName",
    },
    {
      Header: "Type",
      accessor: "userType",
    },
    {
      Header: "Country",
      accessor: "country",
    },
    {
      Header: "Mobile",
      accessor: "number",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row: { original } }) => (
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-primary" to={`/admin/users/profile/${original.actions}`}>
            <i className="fa fa-eye"></i>
          </Link>
          <Link className="btn btn-outline-primary" to={`/admin/users/edit/${original.actions}`}>
              <i className="fa fa-edit"></i>
            </Link>
          <button onClick={() => handleDeleteUser(original.actions)} className="btn btn-outline-danger">
            <i className="fa fa-trash"></i>
          </button>

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
      <div className="py-4 w-100 bg-dark text-white rounded">
      <h2 className="text-white fw-bold fs-4 border-bottom border-info pb-3 mb-5">
          All Users
        </h2>
        <div className="d-flex flex-column flex-md-row gap-3 mb-3">
          <select
            className="form-select"
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
          >
            <option value="name">Select a Field</option>
            <option value="fullName">Full Name</option>
            <option value="userType">Type</option>
            <option value="city">City</option>
            <option value="phone">Mobile</option>
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


const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const { allUser, topSellers, reset } = useSelector((state) => state.user);
  const [filterInput, setFilterInput] = useState("");
  const [filterField, setFilterField] = useState("name");
  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilter(filterField, value); // Use the selected field
    setFilterInput(value);
  };

  const handleDeleteUser = (id) => {
    dispatch(deleteUserById(id)).then(() => {
      dispatch(getAllUsers());
    });
  };
  //console.log(topSellers, "top sellers ,,,");
  const columns = React.useMemo(
    () => [
      {
        Header: "Picture",
        accessor: "profilePicture",
        Cell: ({ value }) => (
          <img
            src={value}
            alt="Profile"
            style={{ width: "50px", height: "50px" }}
          />
        ),
      },
      {
        Header: "Name",
        accessor: "fullName",
      },
      {
        Header: "Type",
        accessor: "userType",
        Cell: ({ value }) => (
          <span
            className="capitalize"
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Verified",
        accessor: "paymentVerified",
        Cell: ({ value }) => (
          <span
            className={`py-1 px-2 border  rounded-lg ${
              value === "Unverified"
                ? "text-orange-500 border-orange-500"
                : value === "Verified"
                  ? "text-green-500 border-green-500"
                  : ""
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row: { original } }) => (
          <div className="flex gap-2">
            <Link to={`/admin/users/profile/${original.actions}`}>
              <FaEye
                size={38}
                className="inline mt-[-3px] text-theme-color hover:text-white hover:bg-theme-color rounded-lg border-2 border-theme-color  px-2 py-[5px] transition-all"
              />
            </Link>
            <button onClick={() => handleDeleteUser(original.actions)}>
              <MdDeleteForever
                size={38}
                className=" inline mt-[-3px] text-color-danger hover:text-white hover:bg-color-danger rounded-lg border-2 border-color-danger  px-[6px] py-[3px] transition-all"
              />
            </button>
            <Link to={`/admin/users/edit/${original.actions}`}>
              <FaRegEdit
                size={38}
                className="inline mt-[-3px] text-theme-color hover:text-white hover:bg-theme-color rounded-lg border-2 border-theme-color  px-2 py-[5px] transition-all"
              />
            </Link>

            {/* ...other buttons */}
          </div>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getTopSellers());
  }, []);

  const data = React.useMemo(
    () =>
      Array.isArray(allUser?.data)
        ? allUser.data.map((user) => ({
            profilePicture: user.profilePicture,
            fullName: user.fullName,
            userType: user.userType,
            paymentVerified:
              user.paymentVerified === false ? "Unverified" : "Verified",
            actions: user._id,
          }))
        : [],
    [allUser]
  );
  //console.log("data", data);

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

  const totalBuyers = allUser?.data?.filter(
    (user) => user.role === "Customer"
  ).length;
  const totalVerifiedUsers = allUser?.data?.filter(
    (user) => user.paymentVerified === true
  ).length;
  const totalSellers = allUser?.data?.filter(
    (user) => user.role === "Seller"
  ).length;
  // const totalAdmins=allUser?.data?.filter((user) => user.userType === "admin").length;

  const userCreatedAt = new Array(6).fill(0);
  allUser?.data?.forEach((user) => {
    const month = new Date(user.createdAt).getMonth();
    userCreatedAt[month] = userCreatedAt[month] + 1;
  });

  //console.log("userCreatedAt", userCreatedAt);

  const Card = ({ title, count, icon, color, has_x = false }) => {
    return (<div className="col d-flex px-1">
          <div className="d-flex justify-content-between border border-1 rounded p-3 w-100 h-100" style={{backgroundColor:"#0E294D"}}>
          <div>
            <span className="fs-2 text-primary fw-bold">{count}</span>
            <div className="fs-6 fw-semibold">
              {title}
              {has_x && <p className="text-primary fw-bold" style={{fontSize:12}}>within this week</p>}
            </div>
          </div>
          <i size={36} className={`rounded-circle p-2 ${icon}`} style={{backgroundColor:color}} />
        </div>
    </div>);
  } 

  return (
    <div className="w-100 bg-dark text-light rounded-4 p-5">
      <h2 className="text-white fw-bold fs-4 border-bottom border-info pb-3 mb-5">
        Users
      </h2>
      <div className="text-white row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
        <Card title="All Users" count={allUser?.data?.length} icon="fa fa-users" color="#3B82F6"/>
        <Card title="Sellers" count={totalSellers} icon="fa fa-shop" color="#CA8A04"/>
        <Card title="New Users" count={allUser?.data?.filter(
                (user) =>
                  new Date(user.createdAt).getTime() >
                  new Date().getTime() - 7 * 24 * 60 * 60 * 1000
              ).length} icon="fa fa-user-plus" color="#16A34A" has_x={true}/>
        <Card title="Buyers" count={totalBuyers} icon="fa fa-cart-plus" color="#14B8A6"/>
        <Card title="Verified Users" count={totalVerifiedUsers} icon="fa fa-user-check" color="#0EA5E9"/>

      </div>
  
      <div className="mt-4 row">
        <div className="col-12 col-lg-4 d-flex justify-content-center align-items-center bg-secondary border rounded-4 p-3">
          <Doughnut
            data={{
              labels: ["Sellers", "Buyers"],
              datasets: [
                {
                  data: [totalSellers, totalBuyers],
                  backgroundColor: [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(255, 206, 86)",
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    color: "white",
                  },
                },
                title: {
                  display: true,
                  text: "User Base",
                  color: "white",
                },
              },
            }}
          />
        </div>
  
        <div className="col-12 col-lg-8 d-flex justify-content-center align-items-center bg-secondary border rounded-4 p-3">
          <Line
            data={{
              labels: ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"],
              datasets: [
                {
                  label: "Total Users",
                  data: userCreatedAt,
                  fill: false,
                  backgroundColor: "rgb(75, 192, 192)",
                  borderColor: "rgba(75, 192, 192, 0.2)",
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    color: "white",
                  },
                },
                x: {
                  ticks: {
                    color: "white",
                  },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "white",
                  },
                },
                title: {
                  display: true,
                  text: "User Growth Over Time",
                  color: "white",
                },
              },
            }}
          />
        </div>
      </div>
  
      <div className="mt-5">
        <h2 className="text-white fw-bold fs-4 border-bottom border-info pb-3 mb-5">
          Top Sellers
        </h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-5 g-3">
          {topSellers?.map((seller) => (
            <div className="col bg-secondary p-3 rounded-4" key={seller._id}>
              <img
                className="w-50 rounded-4"
                src={seller.profilePicture}
                alt={seller.fullName}
              />
              <h2 className="fs-5 fw-semibold my-2">{seller.fullName}</h2>
              <div className="border-top border-info">
                <p>
                  Total Auctions:{" "}
                  <span className="text-white">
                    {seller.totalAuctions}
                  </span>
                </p>
                <p>
                  Successful:{" "}
                  <span className="text-white">
                    {seller.paidAuctions}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <UserList/>
    </div>
  );
  

  return (
    <div className="px-7 py-4 w-full bg-theme-bg text-slate-300 rounded-2xl">
      <h2 className=" text-white font-bold text-xl border-b border-border-info-color pb-3 mb-5 ">
        Users
      </h2>
      <div className="text-white grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 [&>div]:border [&>div]:rounded-lg [&>div]:bg-theme-bg2 [&>div]:border-border-info-color hover:[&>div]:border-theme-color [&>div]:p-5 [&>div]:transition-all  ">
        <div className="flex justify-between">
          <div>
            <div className="text-4xl text-color-primary font-bold">
              {allUser?.data?.length}
            </div>
            <h1 className="md:text-lg  font-semibold ">All Users</h1>
          </div>
          <FaUsers size={36} className="bg-blue-500  rounded-full p-2" />
        </div>
        <div className="flex justify-between">
          <div>
            <span className="text-4xl text-color-primary font-bold">
              {totalSellers}
            </span>
            <div className="md:text-lg font-semibold ">Sellers</div>
          </div>
          <FaShop
            size={36}
            stroke-width="1"
            className="bg-yellow-600  rounded-full p-2"
          />
        </div>
        <div className="flex justify-between">
          <div>
            <span className="text-4xl text-color-primary font-bold">
              {
                allUser?.data?.filter(
                  (user) =>
                    new Date(user.createdAt).getTime() >
                    new Date().getTime() - 7 * 24 * 60 * 60 * 1000
                ).length
              }
            </span>
            <div className="md:text-lg font-semibold  ">
              New Users
              <p className="text-[10px] text-color-primary mt-[-7px] ">
                within this week
              </p>
            </div>
          </div>
          <RiUserAddFill size={36} className="bg-green-600 rounded-full p-2" />
        </div>
        <div className="flex justify-between">
          <div>
            <span className="text-4xl text-theme-color font-bold">
              {totalBuyers}
            </span>
            <div className="md:text-lg font-semibold  ">Buyers</div>
          </div>
          <FaCartPlus size={36} className="bg-teal-500 rounded-full p-2" />
        </div>
        <div className="flex justify-between">
          <div>
            <span className="text-4xl text-theme-color font-bold">
              {totalVerifiedUsers}
            </span>
            <div className="md:text-lg font-semibold  ">Verified Users</div>
          </div>
          <RiVerifiedBadgeFill
            size={36}
            className="bg-sky-500 rounded-full p-1"
          />
        </div>
      </div>
      <div className=" mt-10 flex flex-col gap-4 lg:flex-row">
        <div className="bg-theme-bg2 border w-full lg:max-w-[400px] border-border-info-color rounded-lg flex justify-center items-center py-4">
          <div className="max-w-[400px] w-full ">
            <Doughnut
              data={{
                labels: ["Sellers", "Buyers"],
                datasets: [
                  {
                    data: [totalSellers, totalBuyers],
                    backgroundColor: [
                      "rgb(255, 99, 132)",
                      "rgb(54, 162, 235)",
                      "rgb(255, 206, 86)",
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      color: "white",
                    },
                  },
                  title: {
                    display: true,
                    text: "User Base",
                    color: "white",
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="flex-1  flex w-full justify-center items-center bg-theme-bg2 border border-border-info-color rounded-lg  py-4">
          <div className="w-full max-w-[900px]">
            <Line
              data={{
                labels: [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                ],
                datasets: [
                  {
                    label: "Total Users",
                    data: userCreatedAt, // replace this with your data
                    fill: false,
                    backgroundColor: "rgb(75, 192, 192)",
                    borderColor: "rgba(75, 192, 192, 0.2)",
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                      color: "white",
                    },
                  },
                  x: {
                    ticks: {
                      color: "white",
                    },
                  },
                },
                plugins: {
                  legend: {
                    labels: {
                      color: "white",
                    },
                  },
                  title: {
                    display: true,
                    text: "User Growth Over Time",
                    color: "white",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <>
        <div className="mt-12 ">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              className="outline-none bg-theme-bg2 rounded-xl px-3 py-3 cursor-pointer border border-border-info-color focus:border-theme-color  transition-all"
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
            >
              <option value="fullName">Select a field</option>
              <option value="fullName">Name</option>
              <option value="userType">Type</option>
              <option value="paymentVerified">Verified</option>
            </select>
            <input
              className="outline-none w-full md:w-[200px] bg-theme-bg2 rounded-xl px-3 py-3 border border-border-info-color focus:border-theme-color transition-all"
              value={filterInput}
              onChange={handleFilterChange}
              placeholder={"Search name"}
            />
          </div>
          <div className="overflow-auto px-4 rounded-2xl border border-border-info-color mt-4 max-h-[500px]">
            <table
              {...getTableProps()}
              className="text-left whitespace-nowrap w-full border-separate border-spacing-x-0 border-spacing-y-4 "
            >
              <thead className="sticky top-0 bg-theme-bg table-header-group">
                {headerGroups.map((headerGroup, headerGroupIndex) => (
                  <tr
                    className="table-row"
                    {...headerGroup.getHeaderGroupProps()}
                    key={headerGroupIndex}
                  >
                    {headerGroup.headers.map((column, i) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        key={i}
                        className="p-2 pr-5 select-none first:rounded-l-lg last:rounded-r-lg border-b border-border-info-color  hover:bg-theme-bg2  transition-all"
                      >
                        <div className="flex gap-4">
                          {column.render("Header")}
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <FaCaretDown size={24} className="mt-[-2px]" />
                              ) : (
                                <FaCaretUp size={24} />
                              )
                            ) : null}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="table-row-group" {...getTableBodyProps()}>
                {page.map((row, i) => {
                  prepareRow(row);
                  const rowProps = row.getRowProps();
                  return (
                    <tr {...rowProps} key={i} className=" border ">
                      {row.cells.map((cell, j) => {
                        const cellProps = cell.getCellProps();
                        return (
                          <td
                            className="pl-2 pr-5 border-b border-border-info-color pb-2"
                            {...cellProps}
                            key={`${i}-${j}`}
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-4 my-4 items-center md:button:px-4 md:button:py-2 button:px-2 button:py-1 button:rounded-lg  ">
          <div className="flex justify-center items-center gap-4">
            <button
              className={`bg-[#00A3FF] hover:bg-color-danger text-white transition-all ${
                pageIndex === 0 ? "bg-gray-500 hover:bg-gray-500" : ""
              }`}
              onClick={() => gotoPage(0)}
              disabled={pageIndex === 0 ? true : false}
            >
              <MdSkipPrevious size={18} />{" "}
            </button>
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className={`bg-[#00A3FF] hover:bg-color-danger text-white transition-all ${
                !canPreviousPage ? "bg-gray-500 hover:bg-gray-500" : ""
              }`}
            >
              <FaCaretLeft size={18} />
            </button>
            <span className="text-slate-300">
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageCount}{" "}
              </strong>
              {"  "}
            </span>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className={`bg-[#00A3FF] hover:bg-color-danger text-white transition-all ${
                !canNextPage ? "bg-gray-500 hover:bg-gray-500" : ""
              }`}
            >
              <FaCaretRight size={18} />
            </button>
            <button
              className={`bg-[#00A3FF] hover:bg-color-danger text-white transition-all ${
                pageIndex === pageCount - 1
                  ? "bg-gray-500 hover:bg-gray-500"
                  : ""
              }`}
              onClick={() => gotoPage(pageCount - 1)}
            >
              <MdSkipNext size={18} />{" "}
            </button>
          </div>

          <select
            className="outline-none hidden md:block bg-theme-bg2 rounded-xl px-4 py-3 cursor-pointer border border-border-info-color focus:border-theme-color  transition-all "
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[8, 12, 16, 20, 24, 28, 32, 36, 40].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </>
      
      <div className="text-white mt-10">
        <h2 className=" text-white font-bold text-xl border-b border-border-info-color pb-3 mb-5 ">
          Top Sellers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-5 flex-col gap-4 bg-theme-bg2 rounded-lg  p-4">
          {topSellers?.map((seller) => (
            <div
              className="w-full bg-theme-bg-light p-4 rounded-lg"
              key={seller._id}
            >
              <img
                className="w-[50px] md:w-full rounded-lg "
                src={seller.profilePicture}
                alt={seller.fullName}
              />
              <h2 className="text-lg font-semibold my-2 ">{seller.fullName}</h2>
              <div className="[&>*]:border-b [&>*]:border-border-info-color ">
                <p>
                  Total Auctions:{" "}
                  <span className="text-theme-color">
                    {seller.totalAuctions}
                  </span>
                </p>
                <p>
                  Successful:{" "}
                  <span className="text-theme-color">
                    {seller.paidAuctions}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
