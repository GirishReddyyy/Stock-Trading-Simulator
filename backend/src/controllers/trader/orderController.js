import Order from "../../models/OrderModel.js";
import Stock from "../../models/StockModel.js";
import UserModel from "../../models/UserModel.js";
import PortfolioModel from "../../models/PortfolioModel.js";

// PLACE ORDER

export const placeOrder = async (req, res) => {
  try {
    const { stockId, quantity, limitPrice, orderType } = req.body;

    if (!stockId || !quantity || quantity <= 0 || !limitPrice || limitPrice <= 0 || !orderType) {
      return res.status(400).json({
        success: false,
        message: "Valid stock ID, positive quantity, limit price, and order type required",
      });
    }

    const stock = await Stock.findById(stockId);

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    // Import models if not already imported (will add at top)
    const user = await UserModel.findById(req.user.id);
    let portfolio = await PortfolioModel.findOne({ user: req.user.id });

    if (orderType === "BUY") {
      const totalCost = limitPrice * quantity;
      if (user.balance < totalCost) {
        return res.status(400).json({ success: false, message: "Insufficient balance for this order" });
      }
      // Hold the balance
      user.balance -= totalCost;
      await user.save();
    } else if (orderType === "SELL") {
      if (!portfolio) {
        return res.status(400).json({ success: false, message: "No portfolio found" });
      }
      const holding = portfolio.holdings.find((h) => h.stock.toString() === stockId);
      if (!holding || holding.quantity < quantity) {
        return res.status(400).json({ success: false, message: "Insufficient stock quantity" });
      }
      // Hold the stock
      holding.quantity -= quantity;
      if (holding.quantity === 0) {
        portfolio.holdings = portfolio.holdings.filter((h) => h.stock.toString() !== stockId);
      }
      await portfolio.save();
    }

    const order = await Order.create({
      user: req.user.id,
      stock: stockId,
      quantity,
      limitPrice,
      orderType,
      status: "PENDING",
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ORDERS

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("stock")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CANCEL ORDER

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled",
      });
    }

    order.status = "CANCELLED";
    await order.save();

    // Refund
    if (order.orderType === "BUY") {
      const user = await UserModel.findById(req.user.id);
      user.balance += order.limitPrice * order.quantity;
      await user.save();
    } else if (order.orderType === "SELL") {
      let portfolio = await PortfolioModel.findOne({ user: req.user.id });
      if (!portfolio) {
        portfolio = await PortfolioModel.create({ user: req.user.id, holdings: [] });
      }
      const holding = portfolio.holdings.find((h) => h.stock.toString() === order.stock.toString());
      if (holding) {
        holding.quantity += order.quantity;
      } else {
        portfolio.holdings.push({
          stock: order.stock,
          quantity: order.quantity,
          averageBuyPrice: 0 // Simplification since average was lost
        });
      }
      await portfolio.save();
    }

    res.json({
      success: true,
      message: "Order cancelled",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
