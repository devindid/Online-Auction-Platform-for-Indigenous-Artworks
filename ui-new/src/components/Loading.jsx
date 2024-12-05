import { VscLoading } from "react-icons/vsc";
function Loading(props) {


  return (
    <>
      <div
        className={`position-relative text-white text-center d-flex flex-column ${
          props?.width === "sidebar" ? "h-400" : "vh-100"
        } justify-content-center align-items-center gap-5`}
        style={{ marginTop: "-60px" }}
      >
        <VscLoading
          size={110}
          className="position-absolute text-primary spin-clockwise"
        />
        <VscLoading
          size={70}
          className="position-absolute text-primary spin-counterclockwise"
        />
        {/* <span className="mt-5">Loading your assets</span> */}
      </div>
    </>
  );
  

  return (
    <>
      <div className={`relative text-white text-center flex flex-col mt-[-60px] gap-5 items-center justify-center ${props?.width==="sidebar" ? "h-[400px]" : "h-screen"}`} >
        <VscLoading
          size={110}
          className="absolute text-color-primary animate-[clockspin_1s_infinite]"
        />
        <VscLoading
          size={70}
          className="absolute text-color-primary animate-[counterspin_1s_linear_infinite]"
        />
        {/* <span className="mt-[200px]">Loading your assets</span> */}
      </div>
    </>
  );

}

export default Loading;
