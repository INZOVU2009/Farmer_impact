import express from "express";
import HarvestController from "../controllers/harvestController";
import verifyToken from "../middlewares/auth";
const harvestRouter = express.Router()

harvestRouter.get('/generalHarvest', HarvestController.GeneralHarvest)
harvestRouter.get('/seasons', HarvestController.getAllSeasons)  
export default harvestRouter