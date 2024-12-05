import { Router } from "express";
import { 
        createAuction,
        getAllAuctions, 
        getSingleAuctionById,
        updateAuctionStatus,
        getBidsAuctionsByUser,
        getAuctionsByUser,
        deleteSingleAuctionById,
        updateSingleAuactionById,
        getAuctionWinner,
        getLiveAuctions,
        getUpcomingAuctions,
        updatePaymentStatus,
        updateDeliveryPerson
    } from "../controllers/auction.controller.js";
import { verifyAdmin, verifyUser,verifySeller } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";




const router = Router();

// router.route("/register").post(registerUser);

router.route("/upcoming-auctions").get(getUpcomingAuctions);
router.route("/live-auctions").get(getLiveAuctions);
router.route("/:id/winner").get(getAuctionWinner);
router.route("/").post( getAllAuctions);
router.route("/:id/status").post(updateAuctionStatus);

router.route("/update-payment-status/:id").put(
  (req, res, next) => {
    verifyUser(req, res, (err) => {
      if (err) {
        verifySeller(req, res, (err) => {
            next();
        });
      } else {
        next();
      }
    });
  },
  updatePaymentStatus
 );

 router.route("/update-delivery/:id").put(
  (req, res, next) => {
    verifyUser(req, res, (err) => {
      if (err) {
        verifySeller(req, res, (err) => {
            next();
        });
      } else {
        next();
      }
    });
  },
  updateDeliveryPerson
 );


router.route("/user-bids").get(verifyUser, getBidsAuctionsByUser);
router.route("/delete/:id").delete(verifyUser, verifySeller, deleteSingleAuctionById);
// router.route("/update/:id").put(verifyUser, verifySeller, upload.single("image") ,  updateSingleAuactionById);
router.route("/update/:id").put(
    (req, res, next) => {
      verifyUser(req, res, (err) => {
        if (err) {
          verifySeller(req, res, (err) => {
            if (err) {
              verifyAdmin(req, res, next);
            } else {
              next();
            }
          });
        } else {
          next();
        }
      });
    },
    upload.single("image"),
    updateSingleAuactionById
);  
router.route("/user-auctions").get(verifyUser,verifySeller, getAuctionsByUser);
router.route("/create-auction").post(
  (req, res, next) => {
    verifyUser(req, res, (err) => {
      if (err) {
        verifySeller(req, res, (err) => {
          if (err) {
            verifyAdmin(req, res, next);
          } else {
            next();
          }
        });
      } else {
        next();
      }
    });
  },
  upload.single("image"),
  createAuction
);  

router.route("/:id").get(getSingleAuctionById);

router.route("/admin-delete/:id").delete(verifyUser, verifyAdmin, deleteSingleAuctionById);









export default router;
