import Order from "../../models/OrderModel.js";
import Stock from "../../models/StockModel.js";

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
