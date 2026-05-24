import StockModel from "../../models/StockModel.js";

const createStock = async (req, res) => {
    try {
        const {
            symbol,
            companyName,
            currentPrice,
            marketCap,
            sector
        } = req.body;

        // Validation
        if (
            !symbol ||
            !companyName ||
            !currentPrice
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Symbol, company name and price are required"
            });
        }

        // Check existing stock
        const existingStock =
            await StockModel.findOne({
                symbol: symbol.toUpperCase()
            });

        if (existingStock) {
            return res.status(400).json({
                success: false,
                message: "Stock already exists"
            });
        }

        // Create stock
        const stock = await StockModel.create({
            symbol: symbol.toUpperCase(),
            companyName,
            currentPrice,
            marketCap,
            sector
        });

        return res.status(201).json({
            success: true,
            message: "Stock created successfully",
            stock
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {
    createStock
};