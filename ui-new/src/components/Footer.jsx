import  { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);


  return (
    <footer className="position-absolute bottom-0 w-100 bg-theme-bg shadow">
      <div className="container-lg py-4">
        <div className="d-flex justify-content-between align-items-center">
          {/* Brand Logo */}
          <Link
            to="/dashboard"
            className="d-flex align-items-center mb-4 mb-sm-0 text-decoration-none"
          >
            <img src="/res/img/logo.jpg" style={{ width: 32, height: 32 }} alt="" /> 
            <h1 className="ps-3 fs-3 fw-bold text-white">
              <span style={{"color": "#159AED"}}>A</span>rt
              <span style={{"color": "#159AED"}}>F</span>olio
              </h1>
          </Link>

          {/* Footer Navigation */}
          <ul className="d-flex flex-wrap align-items-center text-white list-unstyled mb-0">
            <li className="me-4">
              <Link
                to="/about-us"
                className="text-white text-decoration-none hover-text-theme"
              >
                About Us
              </Link>
            </li>
            <li className="me-4">
              <Link
                to="/privacy-policy"
                className="text-white text-decoration-none hover-text-theme"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/contact-us"
                className="text-white text-decoration-none hover-text-theme"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Divider */}
        <hr className="my-4 border-info" />

        {/* Footer Copyright */}
        <div className="d-flex justify-content-center align-items-center text-white text-sm">
          © {new Date().getFullYear()}
          <Link to="/" className="ms-1 text-decoration-none">
        
            <span className="fw-bold text-theme-color">
              <span className="text-uppercase">A</span>rt
              <span className="text-uppercase">F</span>olio
            </span>
          </Link>
          . All Rights Reserved.
        </div>
      </div>
    </footer>
  );


};

export default Footer;
