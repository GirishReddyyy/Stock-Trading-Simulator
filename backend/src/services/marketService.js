import axios from "axios";

const getStockData = async (symbol) => {
    try {
        const apiKey =
            process.env.ALPHA_VANTAGE_API_KEY;

        const quoteResponse = await axios.get(
            "https://www.alphavantage.co/query",
            {
                params: {
                    function: "GLOBAL_QUOTE",
                    symbol,
                    apikey: apiKey
                }
            }
        );

        const overviewResponse = await axios.get(
            "https://www.alphavantage.co/query",
            {
                params: {
                    function: "OVERVIEW",
                    symbol,
                    apikey: apiKey
                }
            }
        );

        return {
            quote: quoteResponse.data["Global Quote"] || null,
            overview: overviewResponse.data || {}
        };

    } catch (error) {
        throw new Error(
            "Alpha Vantage API failed"
        );
    }
};

export {
    getStockData
};