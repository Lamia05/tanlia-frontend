import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
} from "lucide-react";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [deliveryLocation, setDeliveryLocation] =
    useState("insideDhaka");

  // Load cart
  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("tanliaCart") || "[]"
    );

    setCart(Array.isArray(savedCart) ? savedCart : []);
  }, []);

  // Load sellers
  useEffect(() => {
    fetch("/data/sellers.json")
      .then((res) => res.json())
      .then((data) => {
        setSellers(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error loading sellers:", error);
      });
  }, []);

  // Update cart in state + localStorage
  const updateCart = (updatedCart) => {
    setCart(updatedCart);

    localStorage.setItem(
      "tanliaCart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Increase quantity
  const increaseQuantity = (index) => {
    const updatedCart = [...cart];

    updatedCart[index].quantity =
      (updatedCart[index].quantity || 1) + 1;

    updateCart(updatedCart);
  };

  // Decrease quantity
  const decreaseQuantity = (index) => {
    const updatedCart = [...cart];

    const currentQuantity =
      updatedCart[index].quantity || 1;

    if (currentQuantity <= 1) return;

    updatedCart[index].quantity = currentQuantity - 1;

    updateCart(updatedCart);
  };

  // Remove item
  const removeItem = (index) => {
    const updatedCart = cart.filter(
      (_, itemIndex) => itemIndex !== index
    );

    updateCart(updatedCart);
  };

  // Get numeric price
  const getNumericPrice = (price) => {
    if (!price) return 0;

    const number = String(price).replace(/[^0-9.]/g, "");

    return Number(number) || 0;
  };

  // Find seller delivery information
  const getSellerDelivery = (sellerName) => {
    if (!sellerName) return null;

    return sellers.find(
      (seller) =>
        seller.name?.toLowerCase() ===
        sellerName?.toLowerCase()
    );
  };

  // Get unique sellers from cart
  const uniqueSellers = [
    ...new Set(
      cart
        .map((item) => item.seller || item.sellerName)
        .filter(Boolean)
    ),
  ];

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => {
    const price = getNumericPrice(item.price);
    const quantity = item.quantity || 1;

    return sum + price * quantity;
  }, 0);

  // Calculate delivery
  const deliveryDetails = uniqueSellers.map((sellerName) => {
    const seller = getSellerDelivery(sellerName);

    const charge =
      deliveryLocation === "insideDhaka"
        ? seller?.delivery?.insideDhaka || 0
        : seller?.delivery?.outsideDhaka || 0;

    return {
      sellerName,
      charge,
    };
  });

  const deliveryTotal = deliveryDetails.reduce(
    (sum, item) => sum + item.charge,
    0
  );

  // Calculate final total
  const total = subtotal + deliveryTotal;

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="bg-[#FDFBF7] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-10">
            <ShoppingBag size={24} />

            <h1 className="text-3xl md:text-4xl font-semibold">
              Your Cart
            </h1>
          </div>

          <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
            <ShoppingBag
              size={50}
              strokeWidth={1.2}
              className="mb-5 text-gray-500"
            />

            <h2 className="text-xl font-medium mb-2">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mb-7">
              Looks like you haven't added anything yet.
            </p>

            <Link
              to="/products"
              className="bg-black text-white px-7 py-3 text-sm flex items-center gap-2 hover:bg-gray-800 transition"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <ShoppingBag size={24} />

            <h1 className="text-3xl md:text-4xl font-semibold">
              Your Cart
            </h1>
          </div>

          <Link
            to="/products"
            className="text-sm underline underline-offset-4"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-5">
            {cart.map((item, index) => {
              const image =
                item.selectedImage ||
                (Array.isArray(item.image)
                  ? item.image[0]
                  : item.image);

              const quantity = item.quantity || 1;

              return (
                <div
                  key={`${item.id}-${index}`}
                  className="bg-white border border-gray-200 p-4 sm:p-5"
                >
                  <div className="flex gap-4 sm:gap-6">
                    {/* Image */}
                    <Link
                      to={`/products/${item.id}`}
                      className="w-28 h-36 sm:w-32 sm:h-40 shrink-0 bg-gray-100 overflow-hidden"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={item.title || "Product"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            {item.seller ||
                              item.sellerName ||
                              ""}
                          </p>

                          <Link
                            to={`/products/${item.id}`}
                            className="text-base sm:text-lg font-medium hover:underline"
                          >
                            {item.title || "Product"}
                          </Link>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-gray-500 hover:text-black transition"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <p className="text-sm mt-3">
                        {item.price || ""}
                      </p>

                      {/* Selected Options */}
                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                        {(item.color ||
                          item.selectedColor) && (
                          <span>
                            Color:{" "}
                            {item.color ||
                              item.selectedColor}
                          </span>
                        )}

                        {(item.size ||
                          item.selectedSize) && (
                          <span>
                            Size:{" "}
                            {item.size ||
                              item.selectedSize}
                          </span>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center justify-between mt-5">
                        <div className="flex items-center border border-gray-300 h-10">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(index)
                            }
                            className="w-10 h-full flex items-center justify-center hover:bg-gray-100 transition"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="w-10 text-center text-sm">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(index)
                            }
                            className="w-10 h-full flex items-center justify-center hover:bg-gray-100 transition"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <p className="font-medium text-sm sm:text-base">
                          BDT{" "}
                          {(
                            getNumericPrice(item.price) *
                            quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white border border-gray-200 p-6 sticky top-28">
              <h2 className="text-xl font-semibold mb-6">
                Order Summary
              </h2>

              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-gray-600">
                  Subtotal
                </span>

                <span>
                  BDT {subtotal.toLocaleString()}
                </span>
              </div>

              {/* Delivery Location */}
              <div className="mb-5">
                <p className="text-sm text-gray-600 mb-3">
                  Delivery Location
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setDeliveryLocation("insideDhaka")
                    }
                    className={`py-3 border text-xs transition ${
                      deliveryLocation === "insideDhaka"
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-black"
                    }`}
                  >
                    Inside Dhaka
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeliveryLocation("outsideDhaka")
                    }
                    className={`py-3 border text-xs transition ${
                      deliveryLocation === "outsideDhaka"
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-black"
                    }`}
                  >
                    Outside Dhaka
                  </button>
                </div>
              </div>

              {/* Seller Delivery */}
              <div className="border-t border-gray-200 pt-4 mb-5">
                <p className="text-sm text-gray-600 mb-3">
                  Delivery
                </p>

                <div className="space-y-3">
                  {deliveryDetails.map((item) => (
                    <div
                      key={item.sellerName}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">
                        {item.sellerName}
                      </span>

                      <span>
                        BDT {item.charge.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-5 flex items-center justify-between">
                <span className="font-medium">
                  Total
                </span>

                <span className="text-lg font-semibold">
                  BDT {total.toLocaleString()}
                </span>
              </div>

              {/* Proceed to Checkout */}
              <Link
                to="/checkout"
                className="w-full bg-black text-white py-4 mt-6 text-sm font-medium hover:bg-gray-800 transition flex items-center justify-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;