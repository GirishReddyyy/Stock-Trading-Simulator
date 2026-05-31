import axios from "axios";

export const getAlphaVantageStock = async (symbol) => {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    
    if (!apiKey) {
      throw new Error("Alpha Vantage API key is not configured.");
    }

    const response = await axios.get("https://www.alphavantage.co/query", {
      params: {
        function: "GLOBAL_QUOTE",
        symbol: symbol,
        apikey: apiKey,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.Information ||
        error.message ||
        "Failed to fetch stock from Alpha Vantage"
    );
  }
};
