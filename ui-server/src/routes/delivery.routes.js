import { Router } from "express";
import { protect, verifyAdmin, verifyUser,verifySeller } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import { 
  addDelivery, 
  getAllDeliveries, 
  getSingleDeliveryById, 
  updateDelivery, 
  deleteDelivery 
} from '../controllers/delivery.controller.js';

const router = Router();

// Add Delivery (Create)
router.route("/").post(
  protect,
  upload.single('image'),
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
  addDelivery
);

// Get All Deliveries
router.route("/").get(
  protect,
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
  getAllDeliveries
);

// Get Single Delivery by ID
router.route("/:id").get(
  protect,
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
  getSingleDeliveryById
);

// Update Delivery by ID
router.route("/update/:id").put(
  protect,
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
  upload.single("image"),
  updateDelivery
);

// Delete Delivery by ID
router.route("/delete/:id").delete(
  protect,
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
  deleteDelivery
);

export default router;
