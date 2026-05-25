import OrderModel from "../models/OrderModel.js";
import StockModel from "../models/StockModel.js";
import UserModel from "../models/UserModel.js";
import PortfolioModel from "../models/PortfolioModel.js";
import TransactionModel from "../models/TransactionModel.js";

export const processPendingOrders =
    async () => {

        try {

            const pendingOrders =
                await OrderModel.find({
                    status: "PENDING"
                });

            for (
                const order of pendingOrders
            ) {

                const stock =
                    await StockModel.findById(
                        order.stock
                    );

                if (!stock) continue;

                const currentPrice =
                    stock.currentPrice;

                let shouldExecute =
                    false;

                if (
                    order.orderType ===
                    "BUY"
                ) {

                    shouldExecute =
                        currentPrice <=
                        order.limitPrice;

                } else {

                    shouldExecute =
                        currentPrice >=
                        order.limitPrice;
                }

                if (
                    !shouldExecute
                )
                    continue;

                const user =
                    await UserModel.findById(
                        order.user
                    );

                let portfolio =
                    await PortfolioModel.findOne(
                        {
                            user:
                                order.user
                        }
                    );

                if (
                    !portfolio
                ) {
                    portfolio =
                        await PortfolioModel.create(
                            {
                                user:
                                    order.user,
                                holdings:
                                    []
                            }
                        );
                }

                const totalAmount =
                    currentPrice *
                    order.quantity;

                if (
                    order.orderType ===
                    "BUY"
                ) {

                    if (
                        user.balance <
                        totalAmount
                    )
                        continue;

                    user.balance -=
                        totalAmount;

                    const holding =
                        portfolio.holdings.find(
                            (
                                h
                            ) =>
                                h.stock.toString() ===
                                stock._id.toString()
                        );

                    if (
                        holding
                    ) {

                        const totalQty =
                            holding.quantity +
                            order.quantity;

                        const totalCost =
                            (
                                holding.averageBuyPrice *
                                holding.quantity
                            ) +
                            totalAmount;

                        holding.averageBuyPrice =
                            totalCost /
                            totalQty;

                        holding.quantity =
                            totalQty;

                    } else {

                        portfolio.holdings.push(
                            {
                                stock:
                                    stock._id,
                                quantity:
                                    order.quantity,
                                averageBuyPrice:
                                    currentPrice
                            }
                        );
                    }

                } else {

                    const holding =
                        portfolio.holdings.find(
                            (
                                h
                            ) =>
                                h.stock.toString() ===
                                stock._id.toString()
                        );

                    if (
                        !holding ||
                        holding.quantity <
                            order.quantity
                    )
                        continue;

                    holding.quantity -=
                        order.quantity;

                    if (
                        holding.quantity ===
                        0
                    ) {
                        portfolio.holdings =
                            portfolio.holdings.filter(
                                (
                                    h
                                ) =>
                                    h.stock.toString() !==
                                    stock._id.toString()
                            );
                    }

                    user.balance +=
                        totalAmount;
                }

                await user.save();
                await portfolio.save();

                await TransactionModel.create(
                    {
                        user:
                            user._id,
                        stock:
                            stock._id,
                        type:
                            order.orderType,
                        quantity:
                            order.quantity,
                        price:
                            currentPrice,
                        totalAmount
                    }
                );

                order.status =
                    "EXECUTED";

                order.executedPrice =
                    currentPrice;

                order.executedAt =
                    new Date();

                await order.save();

                console.log(
                    `Order Executed: ${order._id}`
                );
            }

        } catch (error) {

            console.log(
                error.message
            );

        }
    };