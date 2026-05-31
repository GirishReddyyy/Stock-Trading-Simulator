import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import StockModel from "../models/StockModel.js";
import { getAlphaVantageStock } from "../services/alphaVantageService.js";

// Load environment variables
dotenv.config();

const DEFAULT_STOCKS = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"];

const seedMarket = async () => {
  try {
    await connectDB();
    console.log("Connected to database. Starting market seed...");

    for (const symbol of DEFAULT_STOCKS) {
      console.log(`Checking ${symbol}...`);
      
      const existingStock = await StockModel.findOne({ symbol });
      if (existingStock) {
        console.log(`=> ${symbol} already exists in database. Skipping.`);
        continue;
      }

      console.log(`=> Fetching live data for ${symbol} from Alpha Vantage...`);
      try {
        const stockData = await getAlphaVantageStock(symbol);
        const quote = stockData["Global Quote"];

        if (!quote || !quote["01. symbol"]) {
          console.error(`=> Failed to fetch valid data for ${symbol}. Skipping.`);
          continue;
        }

        await StockModel.create({
          symbol: quote["01. symbol"],
          companyName: quote["01. symbol"] + " (Seeded)",
          currentPrice: Number(quote["05. price"]),
          marketCap: 0, // Not provided by GLOBAL_QUOTE
          sector: "Tech",
        });
        
        console.log(`=> Successfully added ${symbol} to the database!`);
      } catch (err) {
        console.error(`=> Error fetching ${symbol}:`, err.message);
      }
      
      // Add a small delay to avoid hitting rate limits immediately
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log("Market seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedMarket();
