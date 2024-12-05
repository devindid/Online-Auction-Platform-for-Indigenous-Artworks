import React from "react";
import { Link, useNavigate } from "react-router-dom";
import errorimg from "../assets/error.png";
const ErrorPage = () => {

  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center text-white min-vh-100 p-4">
      <img
        className="img-fluid mb-4"
        src={errorimg}
        alt="Error"
        style={{ maxWidth: '600px', width: '100%' }}
      />
      <div className="mb-4">
        <h1 className="display-3 fw-bold">Oops... Page Not Found</h1>
        <p className="text-secondary">
          The page you are looking for is not found or has been removed.
        </p>
      </div>
      <Link
        to="/"
        className="btn btn-primary btn-lg"
      >
        Go To Home
      </Link>
    </div>
  );
 
};

export default ErrorPage;
