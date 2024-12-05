import  { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <footer className="text-white shadow w-100 position-absolute bottom-0">
      <div className="container py-4 py-md-8">
        <div className="d-sm-flex align-items-center justify-content-between">
          <Link
            to="/dashboard"
            className="d-flex align-items-center mb-4 mb-sm-0 text-white text-decoration-none"
          >
          <img src="/res/img/logo.jpg" style={{ width: 32, height: 32 }} alt="" /> 
          <h1 className="ps-3 fs-3 fw-bold text-white">
            <span style={{"color": "#159AED"}}>A</span>rt
            <span style={{"color": "#159AED"}}>F</span>olio
            </h1>

          </Link>
          <ul className="d-flex flex-wrap align-items-center mb-0 list-unstyled">
            <li className="me-3 me-md-4">
              <Link
                to="/about-us"
                className="text-white text-decoration-none hover:text-primary"
              >
                About Us
              </Link>
            </li>
            <li className="me-3 me-md-4">
              <Link
                to="/privacy-policy"
                className="text-white text-decoration-none hover:text-primary"
              >
                Privacy Policy
              </Link>
            </li>
            {/* <li className="me-3 me-md-4">
              <Link
                to=""
                className="text-white text-decoration-none hover:text-primary"
              >
                Licensing
              </Link>
            </li> */}
            <li>
              <Link
                to="/contact-us"
                className="text-white text-decoration-none hover:text-primary"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-4 border-light" />
        <div className="text-center text-sm">
          © {new Date().getFullYear()} 
          <Link to="/admin/dashboard" className="text-decoration-none">
            <img src="/res/img/logo.jpg" style={{ width: 32, height: 32 }} alt="" /> 
            <h1 className="ps-3 fs-3 fw-bold text-white">
              <span style={{"color": "#159AED"}}>A</span>rt
              <span style={{"color": "#159AED"}}>F</span>olio
              </h1>
          </Link>
          . All Rights Reserved.
        </div>
      </div>
    </footer>
  );

  
};

export default Footer;
