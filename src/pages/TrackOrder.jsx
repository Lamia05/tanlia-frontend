import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Package,
  CheckCircle,
  Clock,
} from "lucide-react";

const TrackOrder = () => {
  const [searchParams] = useSearchParams();

  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trackOrder = async (id) => {
    if (!id.trim()) {
      setError("Please enter your order ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setOrder(null);

      const response = await fetch(
        `https://tanlia-backend.onrender.com/api/orders/track/${encodeURIComponent(
          id.trim()
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Order not found."
        );
      }

      setOrder(data);
    } catch (error) {
      console.error("Track order error:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     TRACK ORDER FROM URL
  ========================= */

  useEffect(() => {
    const urlOrderId = searchParams.get("orderId");

    if (urlOrderId) {
      setOrderId(urlOrderId);
      trackOrder(urlOrderId);
    }
  }, [searchParams]);

  const handleTrackOrder = async (e) => {
    e.preventDefault();

    await trackOrder(orderId);
  };

  const status =
    String(order?.status || "Pending").toLowerCase();

  const steps = [
    {
      label: "Order Placed",
      icon: Package,
      active: true,
    },
    {
      label: "Confirmed",
      icon: CheckCircle,
      active:
        status === "confirmed" ||
        status === "delivered",
    },
    {
      label: "Delivered",
      icon: CheckCircle,
      active: status === "delivered",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14">

        {/* Header */}

        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#B85028] mb-3">
            Tanlia Studio
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold">
            Track Your Order
          </h1>

          <p className="text-gray-500 text-sm mt-3">
            Enter your order ID to check your order status.
          </p>
        </div>

        {/* Search */}

        <div className="bg-white border border-gray-200 p-5 sm:p-6">
          <form
            onSubmit={handleTrackOrder}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={orderId}
              onChange={(e) =>
                setOrderId(e.target.value)
              }
              placeholder="Enter Order ID"
              className="flex-1 border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-3 text-sm flex items-center justify-center gap-2 hover:bg-[#B85028] transition disabled:opacity-60"
            >
              <Search size={17} />

              {loading ? "Tracking..." : "Track Order"}
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

        {/* Order Result */}

        {order && (
          <div className="mt-8 bg-white border border-gray-200">

            {/* Order Header */}

            <div className="p-5 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Order ID
                </p>

                <p className="font-medium mt-1">
                  {order.orderId}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Current Status
                </p>

                <p className="text-sm font-medium mt-1">
                  {order.status}
                </p>
              </div>

            </div>

            {/* Progress */}

            <div className="p-6 sm:p-8">

              <div className="flex items-start justify-between relative">

                {/* Line */}

                <div className="absolute top-5 left-[12%] right-[12%] h-px bg-gray-200" />

                {steps.map((step) => {
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.label}
                      className="relative z-10 flex flex-col items-center text-center w-1/3"
                    >
                      <div
                        className={`w-10 h-10 flex items-center justify-center border ${
                          step.active
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-400 border-gray-300"
                        }`}
                      >
                        <Icon
                          size={18}
                          strokeWidth={1.5}
                        />
                      </div>

                      <p
                        className={`text-xs mt-3 ${
                          step.active
                            ? "text-black font-medium"
                            : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}

              </div>

              {/* Delivery Info */}

              <div className="border-t border-gray-200 mt-10 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Order Date
                  </p>

                  <p className="text-sm">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
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

                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Order Total
                  </p>

                  <p className="text-sm font-medium">
                    BDT{" "}
                    {Number(
                      order.total || 0
                    ).toLocaleString()}
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Hint */}

        {!order && !loading && !error && (
          <div className="text-center mt-8">
            <Clock
              size={28}
              strokeWidth={1.3}
              className="mx-auto text-gray-400 mb-3"
            />

            <p className="text-sm text-gray-500">
              Your order ID was shown after checkout.
            </p>
          </div>
        )}

      </section>
    </div>
  );
};

export default TrackOrder;