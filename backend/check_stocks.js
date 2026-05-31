import mongoose from "mongoose";
import dotenv from "dotenv";
import StockModel from "./src/models/StockModel.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const stocks = await StockModel.find();
    console.log("Stocks in DB:", stocks.length);
    console.log(stocks);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
