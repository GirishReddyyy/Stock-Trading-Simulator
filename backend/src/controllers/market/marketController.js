import StockModel from "../../models/StockModel.js";

export const getMarketStocks = async (req, res) => {
  try {
    const stocks = await StockModel.find({
      isActive: true,
    })
      .select("symbol companyName currentPrice sector marketCap")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: stocks.length,
      stocks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMarketStockById = async (req, res) => {
  try {
    const stock = await StockModel.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    return res.status(200).json({
      success: true,
      stock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
