import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Phone,
  MapPin,
  User,
  Package,
  Banknote,
  X,
  Eye,
  Percent,
  Wallet,
} from "lucide-react";

const SellerOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem(
        "tanliaSellerToken"
      );

      const sellerData = localStorage.getItem(
        "tanliaSeller"
      );

      if (!token || !sellerData) {
        navigate("/seller-login");
        return;
      }

      try {
        setSeller(JSON.parse(sellerData));
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://tanlia-backend.onrender.com/api/orders/seller/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("tanliaSellerToken");
          localStorage.removeItem("tanliaSeller");

          navigate("/seller-login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load orders."
          );
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(
          "Seller orders error:",
          error
        );

        setError(
          error.message ||
            "Something went wrong while loading orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("tanliaSellerToken");
    localStorage.removeItem("tanliaSeller");

    navigate("/seller-login");
  };

  // ========================================
  // UPDATE ORDER STATUS
  // ========================================
  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    const token = localStorage.getItem(
      "tanliaSellerToken"
    );

    if (!token) {
      navigate("/seller-login");
      return;
    }

    try {
      setUpdatingOrder(orderId);

      const response = await fetch(
        `https://tanlia-backend.onrender.com/api/orders/${encodeURIComponent(
          orderId
        )}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("tanliaSellerToken");
        localStorage.removeItem("tanliaSeller");

        navigate("/seller-login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update status."
        );
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );

      setSelectedOrder((prevOrder) =>
        prevOrder?.orderId === orderId
          ? {
              ...prevOrder,
              status: newStatus,
            }
          : prevOrder
      );
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      setError(
        error.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  // ========================================
  // DASHBOARD SUMMARY
  // ========================================

  const activeOrders = orders.filter(
    (order) =>
      String(order.status || "").toLowerCase() !==
      "cancelled"
  );

  const totalOrders = orders.length;

  const totalSales = activeOrders.reduce(
    (sum, order) => {
      let sellerSales = Number(
        order.subtotal
      );

      // If seller subtotal is not available,
      // calculate sales from seller's products.
      if (
        !Number.isFinite(sellerSales) ||
        sellerSales <= 0
      ) {
        sellerSales = (order.items || []).reduce(
          (itemSum, item) => {
            const price = Number(
              String(item.price || "").replace(
                /[^0-9.-]/g,
                ""
              )
            );

            const quantity = Number(
              item.quantity || 1
            );

            return (
              itemSum +
              (Number.isFinite(price)
                ? price * quantity
                : 0)
            );
          },
          0
        );
      }

      return sum + sellerSales;
    },
    0
  );

  const commission = totalSales * 0.1;

  const youWillGet =
    totalSales - commission;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/sellers"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition mb-5"
          >
            <ArrowLeft size={16} />
            Back to Sellers
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#B85028] mb-2">
                Seller Dashboard
              </p>

              <h1 className="text-3xl md:text-4xl font-semibold">
                {seller?.name || "Seller"}
              </h1>

              <p className="text-gray-500 mt-2">
                Orders containing your products
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="border border-gray-300 px-5 py-2.5 text-sm hover:bg-black hover:text-white hover:border-black transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Summary */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {/* Total Orders */}
            <div className="bg-white border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Total Orders
                  </p>

                  <p className="text-2xl font-semibold mt-2">
                    {totalOrders}
                  </p>
                </div>

                <Package
                  size={22}
                  strokeWidth={1.5}
                  className="text-gray-500"
                />
              </div>
            </div>

            {/* Total Sales */}
            <div className="bg-white border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Total Sales
                  </p>

                  <p className="text-2xl font-semibold mt-2">
                    BDT{" "}
                    {totalSales.toLocaleString()}
                  </p>
                </div>

                <Banknote
                  size={22}
                  strokeWidth={1.5}
                  className="text-gray-500"
                />
              </div>
            </div>

            {/* Commission */}
            <div className="bg-white border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Commission (10%)
                  </p>

                  <p className="text-2xl font-semibold mt-2">
                    BDT{" "}
                    {commission.toLocaleString()}
                  </p>
                </div>

                <Percent
                  size={22}
                  strokeWidth={1.5}
                  className="text-gray-500"
                />
              </div>
            </div>

            {/* You Will Get */}
            <div className="bg-white border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    You Will Get
                  </p>

                  <p className="text-2xl font-semibold mt-2">
                    BDT{" "}
                    {youWillGet.toLocaleString()}
                  </p>
                </div>

                <Wallet
                  size={22}
                  strokeWidth={1.5}
                  className="text-gray-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white border border-gray-200 p-10 text-center">
            <p className="text-gray-500">
              Loading orders...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white border border-red-200 p-10 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* No Orders */}
        {!loading && !error && orders.length === 0 && (
          <div className="bg-white border border-gray-200 p-12 text-center">
            <ShoppingBag
              size={48}
              strokeWidth={1.2}
              className="mx-auto mb-5 text-gray-400"
            />

            <h2 className="text-xl font-medium mb-2">
              No Orders Yet
            </h2>

            <p className="text-gray-500 text-sm">
              There are no orders containing your products.
            </p>
          </div>
        )}

        {/* Orders */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white border border-gray-200"
              >
                {/* Order Header */}
                <div className="p-5 md:p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Order ID
                    </p>

                    <p className="font-medium mt-1">
                      {order.orderId}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={order.status || "Pending"}
                      disabled={
                        updatingOrder ===
                        order.orderId ||
                        String(order.status || "").toLowerCase() ===
                          "cancelled"
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          order.orderId,
                          e.target.value
                        )
                      }
                      className="border border-gray-300 px-3 py-1.5 text-xs bg-white outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Confirmed">
                        Confirmed
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>
                    </select>

                    {updatingOrder ===
                      order.orderId && (
                      <span className="text-xs text-gray-500">
                        Updating...
                      </span>
                    )}

                    <span className="text-sm text-gray-500">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="p-5 md:p-6">
                  {/* Customer */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
                    <div className="flex gap-3">
                      <User
                        size={18}
                        strokeWidth={1.5}
                        className="text-gray-500 mt-0.5"
                      />

                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Customer
                        </p>

                        <p className="text-sm font-medium">
                          {order.customer?.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Phone
                        size={18}
                        strokeWidth={1.5}
                        className="text-gray-500 mt-0.5"
                      />

                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Phone
                        </p>

                        <p className="text-sm">
                          {order.customer?.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <MapPin
                        size={18}
                        strokeWidth={1.5}
                        className="text-gray-500 mt-0.5"
                      />

                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Delivery Address
                        </p>

                        <p className="text-sm leading-5">
                          {order.customer?.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div>
                    <h3 className="text-sm font-medium mb-4">
                      Your Products
                    </h3>

                    <div className="space-y-4">
                      {order.items?.map(
                        (item, index) => {
                          const image =
                            Array.isArray(
                              item.image
                            )
                              ? item.image[0]
                              : item.image;

                          return (
                            <div
                              key={`${item.productId}-${index}`}
                              className="flex gap-4 border-t border-gray-100 pt-4"
                            >
                              <div className="w-20 h-24 bg-gray-100 shrink-0 overflow-hidden">
                                {image && (
                                  <img
                                    src={image}
                                    alt={
                                      item.title ||
                                      "Product"
                                    }
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>

                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {item.title}
                                </p>

                                {item.color && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Color:{" "}
                                    {item.color}
                                  </p>
                                )}

                                {item.size && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Size:{" "}
                                    {item.size}
                                  </p>
                                )}

                                <p className="text-xs text-gray-500 mt-1">
                                  Quantity:{" "}
                                  {item.quantity ||
                                    1}
                                </p>

                                <p className="text-sm mt-2">
                                  {item.price}
                                </p>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="border-t border-gray-200 mt-6 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-500">
                        Delivery
                      </p>

                      <p className="text-sm mt-1">
                        {order.deliveryLocation ===
                        "insideDhaka"
                          ? "Inside Dhaka"
                          : "Outside Dhaka"}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-3">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-500">
                          Your Order Total
                        </p>

                        <p className="text-xl font-semibold mt-1">
                          BDT{" "}
                          {Number(
                            order.total || 0
                          ).toLocaleString()}
                        </p>
                      </div>

                      {/* View Details */}
                      <button
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                        className="inline-flex items-center justify-center gap-2 border border-gray-300 px-5 py-2.5 text-sm hover:bg-black hover:text-white hover:border-black transition"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================
          ORDER DETAILS MODAL
      ======================================== */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 py-6"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-[#FDFBF7] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 p-5 md:p-6 flex items-center justify-between sticky top-0 z-10">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Order Details
                </p>

                <h2 className="text-xl font-semibold mt-1">
                  {selectedOrder.orderId}
                </h2>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-7">
              {/* Order Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Order Date
                  </p>

                  <p className="text-sm">
                    {new Date(
                      selectedOrder.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Status
                  </p>

                  <select
                    value={
                      selectedOrder.status ||
                      "Pending"
                    }
                    disabled={
                      updatingOrder ===
                        selectedOrder.orderId ||
                      String(
                        selectedOrder.status || ""
                      ).toLowerCase() ===
                        "cancelled"
                    }
                    onChange={(e) =>
                      handleStatusChange(
                        selectedOrder.orderId,
                        e.target.value
                      )
                    }
                    className="border border-gray-300 px-3 py-2 text-sm bg-white outline-none disabled:opacity-60"
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Confirmed">
                      Confirmed
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>
                  </select>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-sm font-medium mb-4">
                  Customer Information
                </h3>

                <div className="bg-white border border-gray-200 p-5 space-y-4">
                  <div className="flex gap-3">
                    <User
                      size={18}
                      strokeWidth={1.5}
                      className="text-gray-500 mt-0.5"
                    />

                    <div>
                      <p className="text-xs text-gray-500">
                        Name
                      </p>

                      <p className="text-sm mt-1">
                        {selectedOrder.customer?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Phone
                      size={18}
                      strokeWidth={1.5}
                      className="text-gray-500 mt-0.5"
                    />

                    <div>
                      <p className="text-xs text-gray-500">
                        Phone
                      </p>

                      <p className="text-sm mt-1">
                        {selectedOrder.customer?.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MapPin
                      size={18}
                      strokeWidth={1.5}
                      className="text-gray-500 mt-0.5"
                    />

                    <div>
                      <p className="text-xs text-gray-500">
                        Delivery Address
                      </p>

                      <p className="text-sm mt-1 leading-5">
                        {selectedOrder.customer?.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="text-sm font-medium mb-4">
                  Your Products
                </h3>

                <div className="space-y-4">
                  {selectedOrder.items?.map(
                    (item, index) => {
                      const image =
                        Array.isArray(item.image)
                          ? item.image[0]
                          : item.image;

                      return (
                        <div
                          key={`${item.productId}-${index}`}
                          className="bg-white border border-gray-200 p-4 flex gap-4"
                        >
                          <div className="w-24 h-28 bg-gray-100 shrink-0 overflow-hidden">
                            {image && (
                              <img
                                src={image}
                                alt={
                                  item.title ||
                                  "Product"
                                }
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {item.title}
                            </p>

                            {item.color && (
                              <p className="text-xs text-gray-500 mt-2">
                                Color:{" "}
                                {item.color}
                              </p>
                            )}

                            {item.size && (
                              <p className="text-xs text-gray-500 mt-1">
                                Size:{" "}
                                {item.size}
                              </p>
                            )}

                            <p className="text-xs text-gray-500 mt-1">
                              Quantity:{" "}
                              {item.quantity || 1}
                            </p>

                            <p className="text-sm font-medium mt-3">
                              {item.price}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Delivery */}
              <div className="border-t border-gray-200 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-500">
                      Delivery Location
                    </p>

                    <p className="text-sm mt-1">
                      {selectedOrder.deliveryLocation ===
                      "insideDhaka"
                        ? "Inside Dhaka"
                        : "Outside Dhaka"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Delivery Charge
                    </p>

                    <p className="text-sm mt-1">
                      BDT{" "}
                      {Number(
                        selectedOrder.delivery || 0
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-5 flex items-center justify-between">
                <p className="text-sm font-medium">
                  Your Order Total
                </p>

                <p className="text-xl font-semibold">
                  BDT{" "}
                  {Number(
                    selectedOrder.total || 0
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;