import UserModel from "../../models/UserModel.js";
import StockModel from "../../models/StockModel.js";
import PortfolioModel from "../../models/PortfolioModel.js";
import TransactionModel from "../../models/TransactionModel.js";
import OrderModel from "../../models/OrderModel.js";

export const buyStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;

    if (!stockId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Stock and quantity required",
      });
    }

    const stock = await StockModel.findById(stockId);

    if (!stock || !stock.isActive) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    const user = await UserModel.findById(req.user.id);

    const totalAmount = stock.currentPrice * quantity;

    if (user.balance < totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    let portfolio = await PortfolioModel.findOne({
      user: req.user.id,
    });

    if (!portfolio) {
      portfolio = await PortfolioModel.create({
        user: req.user.id,
        holdings: [],
      });
    }

    const existingHolding = portfolio.holdings.find(
      (holding) => holding.stock.toString() === stockId,
    );

    if (existingHolding) {
      const totalQty = existingHolding.quantity + quantity;

      const totalCost =
        existingHolding.averageBuyPrice * existingHolding.quantity +
        totalAmount;

      existingHolding.averageBuyPrice = totalCost / totalQty;

      existingHolding.quantity = totalQty;
    } else {
      portfolio.holdings.push({
        stock: stockId,
        quantity,
        averageBuyPrice: stock.currentPrice,
      });
    }

    await portfolio.save();

    user.balance -= totalAmount;

    await user.save();

    const transaction = await TransactionModel.create({
      user: req.user.id,
      stock: stockId,
      type: "BUY",
      quantity,
      price: stock.currentPrice,
      totalAmount,
    });

    return res.status(201).json({
      success: true,
      message: "Stock purchased successfully",
      transaction,
      portfolio,
      balance: user.balance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPortfolio = async (req, res) => {
  try {
    const portfolio = await PortfolioModel.findOne({
      user: req.user.id,
    }).populate("holdings.stock", "symbol companyName currentPrice");

    if (!portfolio) {
      return res.status(200).json({
        success: true,
        holdings: [],
      });
    }

    return res.status(200).json({
      success: true,
      portfolio,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await TransactionModel.find({
      user: req.user.id,
    })
      .populate("stock", "symbol companyName")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sellStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;

    if (!stockId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Stock and quantity required",
      });
    }

    const stock = await StockModel.findById(stockId);

    if (!stock || !stock.isActive) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    const portfolio = await PortfolioModel.findOne({
      user: req.user.id,
    });

    if (!portfolio) {
      return res.status(400).json({
        success: false,
        message: "No portfolio found",
      });
    }

    const holding = portfolio.holdings.find(
      (item) => item.stock.toString() === stockId,
    );

    if (!holding) {
      return res.status(400).json({
        success: false,
        message: "Stock not owned",
      });
    }

    if (holding.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock quantity",
      });
    }

    const totalAmount = stock.currentPrice * quantity;

    holding.quantity -= quantity;

    if (holding.quantity === 0) {
      portfolio.holdings = portfolio.holdings.filter(
        (item) => item.stock.toString() !== stockId,
      );
    }

    await portfolio.save();

    const user = await UserModel.findById(req.user.id);

    user.balance += totalAmount;

    await user.save();

    const transaction = await TransactionModel.create({
      user: req.user.id,
      stock: stockId,
      type: "SELL",
      quantity,
      price: stock.currentPrice,
      totalAmount,
    });

    return res.status(200).json({
      success: true,
      message: "Stock sold successfully",
      transaction,
      portfolio,
      balance: user.balance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const portfolio = await PortfolioModel.findOne({
      user: req.user.id,
    }).populate("holdings.stock");

    if (!portfolio || portfolio.holdings.length === 0) {
      return res.status(200).json({
        success: true,
        totalInvestment: 0,
        currentValue: 0,
        totalProfitLoss: 0,
        holdings: [],
      });
    }

    let totalInvestment = 0;
    let currentValue = 0;

    const holdingsAnalytics = portfolio.holdings.map((holding) => {
      const buyValue = holding.averageBuyPrice * holding.quantity;

      const marketValue = holding.stock.currentPrice * holding.quantity;

      const profitLoss = marketValue - buyValue;

      totalInvestment += buyValue;

      currentValue += marketValue;

      return {
        stockId: holding.stock._id,

        symbol: holding.stock.symbol,

        companyName: holding.stock.companyName,

        quantity: holding.quantity,

        averageBuyPrice: holding.averageBuyPrice,

        currentPrice: holding.stock.currentPrice,

        investment: buyValue,

        currentValue: marketValue,

        profitLoss,
      };
    });

    const totalProfitLoss = currentValue - totalInvestment;

    return res.status(200).json({
      success: true,
      totalInvestment,
      currentValue,
      totalProfitLoss,
      holdings: holdingsAnalytics,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const { stockId, quantity, limitPrice, orderType } = req.body;

    if (!stockId || !quantity || !limitPrice || !orderType) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const stock = await StockModel.findById(stockId);

    if (!stock || !stock.isActive) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    const order = await OrderModel.create({
      user: req.user.id,
      stock: stockId,
      orderType,
      quantity,
      limitPrice,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({
      user: req.user.id,
    })
      .populate("stock", "symbol companyName")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    const portfolio = await PortfolioModel.findOne({
      user: req.user.id,
    }).populate("holdings.stock");

    const recentTransactions = await TransactionModel.find({
      user: req.user.id,
    })
      .populate("stock", "symbol companyName")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    const pendingOrders = await OrderModel.countDocuments({
      user: req.user.id,
      status: "PENDING",
    });

    let totalInvestment = 0;
    let portfolioValue = 0;
    let holdingsCount = 0;

    if (portfolio && portfolio.holdings.length) {
      holdingsCount = portfolio.holdings.length;

      portfolio.holdings.forEach((holding) => {
        totalInvestment += holding.averageBuyPrice * holding.quantity;

        portfolioValue += holding.stock.currentPrice * holding.quantity;
      });
    }

    const totalProfitLoss = portfolioValue - totalInvestment;

    return res.status(200).json({
      success: true,

      balance: user.balance,

      portfolioValue,

      totalInvestment,

      totalProfitLoss,

      holdingsCount,

      pendingOrders,

      recentTransactions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
