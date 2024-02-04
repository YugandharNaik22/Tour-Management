import { verifyUser, verifyAdmin} from "../utils/verifyToken.js";
import express from "express";
import {  updateTour,deleteTour, getSingleTour, getAllTour } from "../controllers/tourController.js";

const router = express.Router();

router.get("/:id", verifyUser, getSingleTour);

router.put("/:id", verifyUser,updateTour);


router.delete("/:id",verifyUser, deleteTour);


router.get("/", verifyAdmin,getAllTour);

export default router;