import Order from "../models/OrderModel.js";
import Stock from "../models/StockModel.js";
import Portfolio from "../models/PortfolioModel.js";
import Transaction from "../models/TransactionModel.js";
import User from "../models/UserModel.js";

const runOrderMatching = async (io) => {
  try {
    const pendingOrders = await Order.find({
      status: "PENDING",
    })
      .populate("stock")
      .populate("user");

    for (const order of pendingOrders) {
      const stock = await Stock.findById(order.stock._id);

      if (!stock) continue;

      const marketPrice = stock.currentPrice;

      let shouldExecute = false;

      // BUY ORDER

      if (order.orderType === "BUY") {
        shouldExecute = marketPrice <= order.limitPrice;
      }

      // SELL ORDER
      else {
        shouldExecute = marketPrice >= order.limitPrice;
      }

      if (!shouldExecute) continue;

      const total = marketPrice * order.quantity;

      const user = await User.findById(order.user._id);

      if (!user) continue;

      // BUY EXECUTION

      if (order.orderType === "BUY") {
        if (user.balance < total) {
          continue;
        }

        user.balance -= total;

        let portfolio = await Portfolio.findOne({
          user: user._id,
          stock: stock._id,
        });

        if (portfolio) {
          const totalQty = portfolio.quantity + order.quantity;

          portfolio.averageBuyPrice =
            (portfolio.averageBuyPrice * portfolio.quantity +
              marketPrice * order.quantity) /
            totalQty;

          portfolio.quantity = totalQty;

          await portfolio.save();
        } else {
          await Portfolio.create({
            user: user._id,
            stock: stock._id,
            quantity: order.quantity,
            averageBuyPrice: marketPrice,
          });
        }
      }

      // SELL EXECUTION
      else {
        const portfolio = await Portfolio.findOne({
          user: user._id,
          stock: stock._id,
        });

        if (!portfolio || portfolio.quantity < order.quantity) {
          continue;
        }

        portfolio.quantity -= order.quantity;

        if (portfolio.quantity === 0) {
          await Portfolio.deleteOne({
            _id: portfolio._id,
          });
        } else {
          await portfolio.save();
        }

        user.balance += total;
      }

      await user.save();

      order.status = "EXECUTED";

      order.executedPrice = marketPrice;

      await order.save();

      await Transaction.create({
        user: user._id,
        stock: stock._id,
        type: order.orderType,
        quantity: order.quantity,
        price: marketPrice,
      });

      // SOCKET EVENT

      io?.emit("orderExecuted", {
        orderId: order._id,
        stock: stock.symbol,
        type: order.orderType,
        price: marketPrice,
        quantity: order.quantity,
      });

      console.log(
        `Order Executed: ${order.orderType} ${stock.symbol} @ ${marketPrice}`,
      );
    }
  } catch (error) {
    console.log("Matching error:", error.message);
  }
};

export default runOrderMatching;
