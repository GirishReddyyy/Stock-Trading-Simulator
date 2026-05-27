import StockModel from "../models/StockModel.js";
import { getIO } from "../sockets/socketServer.js";
import runOrderMatching from "./orderMatchingService.js";

export const startMarketSimulation = () => {
  setInterval(async () => {
    try {
      const stocks = await StockModel.find({
        isActive: true,
      });

      if (!stocks.length) return;

      for (const stock of stocks) {
        const percentChange = Math.random() * 4 - 2;

        const newPrice = Number(
          (stock.currentPrice * (1 + percentChange / 100)).toFixed(2),
        );

        stock.currentPrice = Math.max(1, newPrice);

        await stock.save();
        await runOrderMatching(getIO());

        getIO().emit("priceUpdate", {
          stockId: stock._id,

          symbol: stock.symbol,

          currentPrice: stock.currentPrice,

          percentChange: percentChange.toFixed(2),
        });

        console.log(`${stock.symbol} -> ${stock.currentPrice}`);
      }
    } catch (error) {
      console.log(error.message);
    }
  }, 10000);
};
