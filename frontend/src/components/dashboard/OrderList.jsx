import EmptyState from "../ui/EmptyState.jsx";

const OrderList = ({ orders, handleCancel }) => {
  if (orders.length === 0) {
    return <EmptyState title="No Active Orders" subtitle="Place your first trade to see it here" />;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="glass-panel rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
              order.orderType === 'BUY' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
            }`}>
              {order.orderType === 'BUY' ? 'B' : 'S'}
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                {order.stock?.symbol}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {order.orderType} Order • Qty: {order.quantity}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-200 dark:border-slate-700">
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Limit Price</p>
              <p className="font-bold text-lg text-slate-800 dark:text-white">₹{order.limitPrice}</p>
            </div>
            
            <div className="text-right min-w-[100px]">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${
                order.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : 
                order.status === 'EXECUTED' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 
                'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {order.status}
              </span>
            </div>

            {order.status === "PENDING" && (
              <button
                onClick={() => handleCancel(order._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
