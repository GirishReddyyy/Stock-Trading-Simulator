import mongoose from "mongoose";
import dotenv from "dotenv";

// Emulate models directly to avoid path/export issues if any
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "trader" },
  balance: { type: Number, default: 100000 },
});

const portfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  holdings: [{
    stock: { type: mongoose.Schema.Types.ObjectId, ref: "Stock" },
    quantity: { type: Number, default: 0 },
    averageBuyPrice: { type: Number, default: 0 },
  }],
});

const stockSchema = new mongoose.Schema({
  symbol: String,
  currentPrice: Number,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Portfolio = mongoose.models.Portfolio || mongoose.model("Portfolio", portfolioSchema);
const Stock = mongoose.models.Stock || mongoose.model("Stock", stockSchema);

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // Fetch an active stock to use for fake holdings
    const stock = await Stock.findOne();
    if (!stock) {
      console.log("No stocks found. Skipping portfolio creation.");
      process.exit(0);
    }

    const dummyUsers = [
      { name: "Rahul Sharma", email: "rahul@test.com", password: "password123", pnlTarget: 45000 },
      { name: "Aman Gupta", email: "aman@test.com", password: "password123", pnlTarget: 32000 },
      { name: "Sneha Patel", email: "sneha@test.com", password: "password123", pnlTarget: -15000 },
      { name: "Vikram Singh", email: "vikram@test.com", password: "password123", pnlTarget: 56000 },
    ];

    for (const u of dummyUsers) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        user = await User.create({
          name: u.name,
          email: u.email,
          password: "hashedpassword123", // Dummy hash
        });
      }

      // Create or update portfolio
      let portfolio = await Portfolio.findOne({ user: user._id });
      if (!portfolio) {
        portfolio = await Portfolio.create({ user: user._id, holdings: [] });
      }

      // We want the user to have a specific PnL.
      // PnL = (currentPrice - averageBuyPrice) * quantity
      // Let's set quantity = 100
      // So (currentPrice - averageBuyPrice) = pnlTarget / 100
      // averageBuyPrice = currentPrice - (pnlTarget / 100)
      
      const quantity = 100;
      const averageBuyPrice = stock.currentPrice - (u.pnlTarget / quantity);

      portfolio.holdings = [{
        stock: stock._id,
        quantity,
        averageBuyPrice,
      }];
      
      await portfolio.save();
      console.log(`Seeded user ${u.name} with PnL ~${u.pnlTarget}`);
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
};

seed();
