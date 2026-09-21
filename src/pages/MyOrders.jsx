import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const MyOrders = () => {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [openOrder, setOpenOrder] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setOrders([]);
      setSearched(false);
      setOpenOrder(null);

      const response = await fetch(
        `https://tanlia-backend.onrender.com/api/orders/customer/${encodeURIComponent(
          phone.trim()
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to find your orders."
        );
      }

      setOrders(Array.isArray(data) ? data : []);
      setSearched(true);
    } catch (error) {
      console.error("My orders error:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (orderId) => {
    setOpenOrder((current) =>
      current === orderId ? null : orderId
    );
  };

  const getPrice = (price) => {
    const number = Number(
      String(price || "").replace(/[^0-9.]/g, "")
    );

    return number.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">

        {/* HEADER */}

        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#B85028] mb-3">
            Tanlia Studio
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold">
            My Orders
          </h1>

          <p className="text-gray-500 text-sm mt-3">
            Enter the phone number used during checkout
            to view your orders.
          </p>
        </div>

        {/* SEARCH */}

        <div className="max-w-2xl mx-auto bg-white border border-gray-200 p-5 sm:p-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="flex-1 border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-3 text-sm flex items-center justify-center gap-2 hover:bg-[#B85028] transition disabled:opacity-60"
            >
              <Search size={17} />

              {loading ? "Searching..." : "Find Orders"}
            </button>
          </form>

          {error && (
            <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* ORDERS */}

        {searched && orders.length > 0 && (
          <div className="mt-10 space-y-5">

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">
                Your Orders
              </h2>

              <p className="text-xs text-gray-500">
                {orders.length}{" "}
                {orders.length === 1 ? "Order" : "Orders"}
              </p>
            </div>

            {orders.map((order) => {
              const isOpen = openOrder === order.orderId;

              return (
                <div
                  key={order.orderId}
                  className="bg-white border border-gray-200"
                >

                  {/* ORDER HEADER */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleOrder(order.orderId)
                    }
                    className="w-full p-5 sm:p-6 text-left"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-200 flex-shrink-0">
                          <Package
                            size={19}
                            strokeWidth={1.4}
                          />
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">
                            Order ID
                          </p>

                          <p className="text-sm font-medium mt-1">
                            {order.orderId}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(
                              order.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">

                        <div className="text-left sm:text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">
                            Status
                          </p>

                          <p className="text-sm font-medium mt-1">
                            {order.status}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">
                            Total
                          </p>

                          <p className="text-sm font-medium mt-1">
                            BDT{" "}
                            {Number(
                              order.total || 0
                            ).toLocaleString()}
                          </p>
                        </div>

                        {isOpen ? (
                          <ChevronUp
                            size={18}
                            strokeWidth={1.5}
                          />
                        ) : (
                          <ChevronDown
                            size={18}
                            strokeWidth={1.5}
                          />
                        )}

                      </div>
                    </div>
                  </button>

                  {/* ORDER DETAILS */}

                  {isOpen && (
                    <div className="border-t border-gray-200">

                      {/* PRODUCTS */}

                      <div className="p-5 sm:p-6">
                        <h3 className="text-sm font-medium mb-4">
                          Products
                        </h3>

                        <div className="space-y-4">
                          {order.items?.map(
                            (item, index) => (
                              <div
                                key={`${item.productId}-${index}`}
                                className="flex gap-4"
                              >
                                <div className="w-20 h-24 bg-gray-100 flex-shrink-0 overflow-hidden">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package
                                        size={20}
                                        className="text-gray-400"
                                      />
                                    </div>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium">
                                    {item.title}
                                  </p>

                                  <p className="text-xs text-gray-500 mt-1">
                                    Seller:{" "}
                                    {item.seller ||
                                      "Tanlia Studio"}
                                  </p>

                                  {item.color && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Color: {item.color}
                                    </p>
                                  )}

                                  {item.size && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Size: {item.size}
                                    </p>
                                  )}

                                  <p className="text-xs text-gray-500 mt-1">
                                    Quantity:{" "}
                                    {item.quantity || 1}
                                  </p>

                                  <p className="text-sm mt-2">
                                    BDT{" "}
                                    {getPrice(item.price)}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* CUSTOMER INFO */}

                      <div className="border-t border-gray-200 p-5 sm:p-6">
                        <h3 className="text-sm font-medium mb-4">
                          Delivery Information
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Name
                            </p>

                            <p className="text-sm">
                              {order.customer?.name}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Phone
                            </p>

                            <p className="text-sm">
                              {order.customer?.phone}
                            </p>
                          </div>

                          <div className="sm:col-span-2">
                            <p className="text-xs text-gray-500 mb-1">
                              Address
                            </p>

                            <p className="text-sm">
                              {order.customer?.address}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Delivery Location
                            </p>

                            <p className="text-sm">
                              {order.deliveryLocation ===
                              "insideDhaka"
                                ? "Inside Dhaka"
                                : "Outside Dhaka"}
                            </p>
                          </div>

                        </div>
                      </div>

                      {/* TOTAL */}

                      <div className="border-t border-gray-200 p-5 sm:p-6">

                        <div className="max-w-sm ml-auto space-y-3">

                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              Subtotal
                            </span>

                            <span>
                              BDT{" "}
                              {Number(
                                order.subtotal || 0
                              ).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              Delivery
                            </span>

                            <span>
                              BDT{" "}
                              {Number(
                                order.deliveryTotal || 0
                              ).toLocaleString()}
                            </span>
                          </div>

                          <div className="border-t border-gray-200 pt-3 flex justify-between">
                            <span className="font-medium">
                              Total
                            </span>

                            <span className="font-medium">
                              BDT{" "}
                              {Number(
                                order.total || 0
                              ).toLocaleString()}
                            </span>
                          </div>

                        </div>

                        {/* TRACK */}

                        <div className="mt-6 flex justify-end">
                          <Link
                            to={`/track-order?orderId=${encodeURIComponent(
                              order.orderId
                            )}`}
                            className="bg-black text-white px-5 py-3 text-xs uppercase tracking-wider hover:bg-[#B85028] transition"
                          >
                            Track Order
                          </Link>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* NO ORDERS */}

        {searched && orders.length === 0 && !error && (
          <div className="mt-10 bg-white border border-gray-200 py-14 px-5 text-center">
            <Package
              size={32}
              strokeWidth={1.2}
              className="mx-auto text-gray-400"
            />

            <h2 className="text-lg font-medium mt-4">
              No Orders Found
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              We couldn't find any orders with this
              phone number.
            </p>
          </div>
        )}

      </section>
    </div>
  );
};

export default MyOrders;