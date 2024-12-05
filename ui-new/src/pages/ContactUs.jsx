import { Link } from "react-router-dom";
import {
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
} from "react-icons/io5";
import { useRef } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img from "../assets/profile-bg.png";

const DATA = {
  address: "No:134/5, Ambalangoda, Galle",
  phone: "+94 77 123 4567",
  email: "artfolio555@gmail.com",
}

const Contact = () => {
  const Notify =() => {
    toast("🦄 Message Sent Successfully !!!",{
    });
  }

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_xams4zx', 'template_7pbka1i', form.current, {
        publicKey: 'IIexl70jUBktXYy4i',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };
  return (
  <section className="py-3 py-md-5 py-xl-5">
  
<h2 className="text-danger text-uppercase text-center">Contact us</h2>
        <h6 className="text-center" ><p className="fw-normal, fs-6">We are at your disposal to answer any questions you may have regarding the artworks we offer at auction or for direct sale,<br></br> as well as the mechanism and process of purchase or the logistics for the transportation of the artworks.</p></h6>
  
  <div className="container">
    <div className="row gy-4 gy-md-5 gy-lg-0 align-items-md-center">
      <div className="col-12 col-lg-6">
      <div className="border overflow-hidden border-">
     <form ref={form} onSubmit={sendEmail} action="#!">
  <div className="row gy-4 gy-xl-4 p-2 p-xl-3">
    <div className="col-20">
      <label htmlFor="user_name" className="form-label">Full Name <span className="text-danger">*</span></label>
      <input type="text" className="form-control" id="user_name" name="user_name" defaultValue required />
    </div>
    <div className="col-12 col-md-6">
      <label htmlFor="user_email" user_name className="form-label">Email <span className="text-danger">*</span></label>
      <div className="input-group">
        <span className="input-group-text">
          <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
          </svg>
        </span>
        <input type="email" className="form-control" id="user_email" name="user_email" defaultValue required />
      </div>
    </div>
    <div className="col-12 col-md-6">
      <label htmlFor="user_number" className="form-label">Phone Number</label>
      <div className="input-group">
        <span className="input-group-text">
          <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-telephone" viewBox="0 0 16 16">
            <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
          </svg>
        </span>
        <input type="text" className="form-control" id="user_number" name="user_number" defaultValue />
      </div>
    </div>
    <div className="col-12">
      <label htmlFor="user_subject" className="form-label">Subject <span className="text-danger">*</span></label>
      <input type="text" className="form-control" id="user_subject" name="user_subject" defaultValue required />
    </div>
    <div className="col-12">
      <label htmlFor="message" className="form-label">Message <span className="text-danger">*</span></label>
      <textarea ype="text" className="form-control" id="message" name="message" rows={3} required defaultValue={""} />
    </div>
    <div className="col-12">
      <div className="d-grid">
        <button className="btn btn-danger btn-lg" type="submit" value="Send" onClick={e => Notify()}>Send Message</button>
    
      </div>
    </div>
  </div>
</form>

      </div>
      </div>

      <div className="col-12 col-lg-6">
        <div className="row justify-content-xl-center">
          <div className="col-12 col-xl-7">
            <div className="mb-1 mb-md-4">
              <div className="mb-1 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} fill="currentColor" className="bi bi-geo" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z" />
                </svg>
              </div>
              <div>
                <h5 className="mb-2">Address</h5>
                <p className="mb-0">Please visit us to have a discussion.</p>
                <hr className="w-0 mb-0 border-dark-subtle" />
                <address className="m-1 text-secondary">No:134/5, Ambalangoda, Galle</address>
              </div>
            </div>
           
            <div>
            <div className="mb-1 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width={27} height={27} fill="currentColor" className="bi bi-telephone-outbound" viewBox="0 0 16 16">
                      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5z" />
                    </svg>
                  </div>
            <div>
                    <h5 className="mb-2">Phone</h5>
                    <p className="mb-2">Please speak with us directly.</p>
                    <hr className="w-0 mb-0 border-dark-subtle" />
                    <p className="mb-0">
                    <a className="link-secondary text-decoration-none" href="tel:+15057922430">(505) 792-2430</a>
                    </p>
                  </div>
            </div>
            <br></br>
            <div>
            <div className="mb-1 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width={27} height={27} fill="currentColor" className="bi bi-envelope-at" viewBox="0 0 16 16">
                      <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z" />
                      <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648Zm-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z" />
                    </svg>
                  </div>
            <div>
                    <h5 className="mb-2">Email</h5>
                    <p className="mb-2">Please write to us directly.</p>
                    <hr className="w-0 mb-0 border-dark-subtle" />
                    <p className="mb-0">
                      <a className="link-secondary text-decoration-none" href="mailto:demo@yourdomain.com">artfolio555@gmail.com</a>
                    </p>
                  </div>
            </div>
          </div>
        </div>
      </div>
    </div>
 </div>
</section>
  );

};


const ContactUs = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_xams4zx", "template_7pbka1i", form.current, {
        publicKey: "IIexl70jUBktXYy4i",
      })
      .then(
        () => {
toast.success("Email Send Successfully.",{
  autoClose: 1000

})      
//empty inputs
          form.current.reset();
  },
        () => {
          toast.error("Error Sending Email.")
        }
      );
  };


  return (
    <>
      {/* Hero Section */}
      <div className="d-flex" 
      style={{ height: '280px', position: 'relative'}}>
        <img src={ img } style={{ width: '100%', position: 'absolute', top: '0%' }} alt="Background" />
        <div className="position-absolute top-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white">
        <h1 className="text-center fw-bold display-4">Contact Us</h1>
        <div className="d-flex gap-2 fw-medium pt-2">
          <Link to="/" className="text-decoration-none text-light hover-text-primary">
            Home
          </Link>
          <span>/</span>
          <span className="text-primary">Contact Us</span>
        </div>

        </div>
      </div>
  
      {/* Main Content */}
      <div className="container py-5">
        {/* Contact Info */}
        <div className="row text-center mb-5">
          <div className="col-md-4 mb-4">
            <div className="h-100 bg-dark text-white p-4 rounded-3 d-flex flex-column align-items-center">
              <div className="bg-primary rounded-circle p-3">
                <IoLocationOutline size={38} />
              </div>
              <h2 className="fs-4 fw-bold mt-3">Address</h2>
              <span>{DATA.address}</span>
            </div>
          </div>
  
          <div className="col-md-4 mb-4">
            <div className="bg-dark text-white p-4 rounded-3 d-flex flex-column align-items-center">
              <div className="bg-primary rounded-circle p-3">
                <IoCallOutline size={38} />
              </div>
              <h2 className="fs-4 fw-bold mt-3">Call Us</h2>
              <p>{DATA.phone}</p>
            </div>
          </div>
  
          <div className="col-md-4 mb-4">
            <div className="bg-dark text-white p-4 rounded-3 d-flex flex-column align-items-center">
              <div className="bg-primary rounded-circle p-3">
                <IoMailOutline size={38} />
              </div>
              <h2 className="fs-4 fw-bold mt-3">Email Us</h2>
              <p>{DATA.email}</p>
            </div>
          </div>
        </div>
  
        {/* Contact Form */}
        <div className="bg-dark text-light p-5 rounded-3">
          <h2 className="fw-bold text-white mb-4">Contact Form</h2>
          <form ref={form} onSubmit={sendEmail} className="needs-validation">
            <div className="mb-3">
              <input type="text" name="from_name" className="form-control" placeholder="Full Name" required />
            </div>
            <input type="hidden" value="Yasir" name="to_name" />
            <div className="mb-3">
              <input type="email" name="user_email" className="form-control" placeholder="Email" required />
            </div>
            <div className="mb-3">
              <input type="number" name="user_number" className="form-control" placeholder="Phone" required />
            </div>
            <div className="mb-3">
              <input type="text" name="user_subject" className="form-control" placeholder="Subject" required />
            </div>
            <div className="mb-3">
              <textarea
                name="message"
                className="form-control"
                rows="5"
                placeholder="Write your Message"
                required
              ></textarea>
            </div>
            <div>
              <input type="submit" value="Send Message" className="btn btn-primary w-100" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
  
};

export default ContactUs;
