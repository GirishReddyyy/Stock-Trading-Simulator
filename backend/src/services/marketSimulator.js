import Stock from "../models/StockModel.js";
import runOrderMatching from "./orderMatchingService.js";

const startMarketSimulation = (io) => {
  setInterval(async () => {
    try {
      const stocks = await Stock.find();

      for (const stock of stocks) {
        const movement = (Math.random() - 0.5) * 10;

        let newPrice = stock.currentPrice + movement;

        if (newPrice < 1) {
          newPrice = 1;
        }

        stock.currentPrice = Number(newPrice.toFixed(2));

        await stock.save();

        io.emit("priceUpdate", {
          stockId: stock._id,
          currentPrice: stock.currentPrice,
        });
      }

      await runOrderMatching();
    } catch (error) {
      console.log("Market simulator error:", error.message);
    }
  }, 5000);
};

export default startMarketSimulation;
