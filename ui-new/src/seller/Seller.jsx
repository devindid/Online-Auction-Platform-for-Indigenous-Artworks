import {  Route, Routes } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import {
  SellerProtected,
  SellerRoutes,
  SellerPublicRoute,
} from "../auth/Protected";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<SellerPublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<SellerProtected />}>
          <Route element={<SellerRoutes />}>
            <Route path="/*" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
};

export default App;
