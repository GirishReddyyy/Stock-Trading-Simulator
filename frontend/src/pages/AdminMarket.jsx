import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar.jsx";

import { addStock, getAdminStocks, deleteStock } from "../api/adminApi.js";

const AdminMarket = () => {
  const [symbol, setSymbol] = useState("");

  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      const res = await getAdminStocks();

      setStocks(res.data.stocks);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      await addStock({
        symbol,
      });

      setSymbol("");

      loadStocks();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStock(id);

      loadStocks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="p-6">
        <h1
          className="
                        text-3xl
                        font-bold
                        mb-6
                    "
        >
          Admin Market
        </h1>

        <form
          onSubmit={handleAdd}
          className="
                        bg-white
                        rounded-xl
                        shadow
                        p-5
                        mb-6
                        flex
                        gap-3
                    "
        >
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="AAPL"
            className="
                            border
                            rounded-lg
                            px-4
                            py-2
                            flex-1
                        "
          />

          <button
            className="
                            bg-green-600
                            text-white
                            px-5
                            rounded-lg
                        "
          >
            Add
          </button>
        </form>

        <div
          className="
                        bg-white
                        rounded-xl
                        shadow
                        overflow-hidden
                    "
        >
          <table
            className="
                            w-full
                        "
          >
            <thead
              className="
                                bg-slate-200
                            "
            >
              <tr>
                <th className="p-4 text-left">Symbol</th>

                <th className="p-4 text-left">Company</th>

                <th className="p-4 text-left">Price</th>

                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {stocks.map((stock) => (
                <tr
                  key={stock._id}
                  className="
                                                border-t
                                            "
                >
                  <td className="p-4">{stock.symbol}</td>

                  <td className="p-4">{stock.companyName}</td>

                  <td className="p-4">₹{stock.currentPrice}</td>

                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(stock._id)}
                      className="
                                                        bg-red-500
                                                        text-white
                                                        px-3
                                                        py-1
                                                        rounded-lg
                                                    "
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMarket;
