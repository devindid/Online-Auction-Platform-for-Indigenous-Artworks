const ProcessHome = () => {

  const Card = ({ number, title, description }) => {
    return (
      <>
        <div className="col d-flex">
          <div className="d-flex flex-column text-white gap-3 p-4 rounded bg-dark">
            <h2 style={{ WebkitTextFillColor: "transparent", WebkitTextStroke: "2px blue" }}
             className="display-3 fw-bold">{number}</h2>
            <h3 className="h4 font-weight-bold">{title}</h3>
            <p className="text-muted">{description}</p>
          </div>
        </div>

      </>
    )    
  }


  return (
    <div className="mt-5">
      <h2 className="fw-bold display-5 text-white mb-4 text-center">
        Create And Sell <span className="text-primary">Your Artworks</span>
      </h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        <Card number="01" title="Setup your Account" description="Register for a free account and unlock the power to sell anything, anytime."/>
        <Card number="02" title="Create Your Auction" description="Create a compelling listing that showcases your item and attracts potential buyers."/>
        <Card number="03" title="Add Starting Price for Bid" description="Determine your starting bid and consider a reserve price for added control."/>
        <Card number="04" title="Start Bidding" description="Start the bidding process and let your buyers bid on your item."/>
        
      </div>
    </div>
  );
  
};

export default ProcessHome;
