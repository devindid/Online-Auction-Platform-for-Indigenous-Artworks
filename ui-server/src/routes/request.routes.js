import { Router } from "express";
import { protect, verifyAdmin, verifyUser,verifySeller } from "../middlewares/auth.middleware.js";

const router = Router();

import {
  addRequest,
  getAllRequests,
  getSingleRequestById,
  updateRequest,
  deleteRequest,
} from '../controllers/request.controller.js';

// Add Request (Create)
router.route("/").post(
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
  addRequest
);

// Get All Requests
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
  getAllRequests
);

// Get Single Request by ID
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
  getSingleRequestById
);

// Update Request by ID
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
  updateRequest
);

// Delete Request by ID
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
  deleteRequest
);



export default router;
