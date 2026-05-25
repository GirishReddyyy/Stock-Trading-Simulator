import StockModel from "../../models/StockModel.js";
import { getStockData } from "../../services/marketService.js";

export const createStock = async (
    req,
    res
) => {
    try {

        const { symbol } = req.body;

        if (!symbol) {
            return res.status(400).json({
                success: false,
                message:
                    "Stock symbol required"
            });
        }

        const upperSymbol =
            symbol.toUpperCase();

        const existingStock =
            await StockModel.findOne({
                symbol: upperSymbol
            });

        if (existingStock) {
            return res.status(400).json({
                success: false,
                message:
                    "Stock already exists"
            });
        }

        const {
            quote,
            overview
        } = await getStockData(
            upperSymbol
        );

        if (
            !quote ||
            !quote["01. symbol"]
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "Invalid symbol or API limit reached"
            });
        }

        const stock =
            await StockModel.create({
                symbol:
                    quote["01. symbol"],

                companyName:
                    overview.Name ||
                    upperSymbol,

                currentPrice:
                    Number(
                        quote["05. price"]
                    ),

                marketCap:
                    Number(
                        overview.MarketCapitalization
                    ) || 0,

                sector:
                    overview.Sector ||
                    "General"
            });

        return res.status(201).json({
            success: true,
            message:
                "Stock added successfully",
            stock
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getAllStocks = async (
    req,
    res
) => {
    try {

        const stocks =
            await StockModel.find()
                .sort({
                    createdAt: -1
                });

        return res.status(200).json({
            success: true,
            count: stocks.length,
            stocks
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getSingleStock = async (
    req,
    res
) => {
    try {

        const stock =
            await StockModel.findById(
                req.params.id
            );

        if (!stock) {
            return res.status(404).json({
                success: false,
                message:
                    "Stock not found"
            });
        }

        return res.status(200).json({
            success: true,
            stock
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const updateStock = async (
    req,
    res
) => {
    try {

        const stock =
            await StockModel.findById(
                req.params.id
            );

        if (!stock) {
            return res.status(404).json({
                success: false,
                message:
                    "Stock not found"
            });
        }

        const updatedStock =
            await StockModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        return res.status(200).json({
            success: true,
            message:
                "Stock updated successfully",
            stock: updatedStock
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const deactivateStock = async (
    req,
    res
) => {
    try {

        const stock =
            await StockModel.findById(
                req.params.id
            );

        if (!stock) {
            return res.status(404).json({
                success: false,
                message:
                    "Stock not found"
            });
        }

        stock.isActive = false;

        await stock.save();

        return res.status(200).json({
            success: true,
            message:
                "Stock deactivated successfully",
            stock
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};