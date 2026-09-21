import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ShoppingBag,
  Truck,
  ShieldCheck,
  X,
  Heart,
  Minus,
  Plus,
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [showQuickView, setShowQuickView] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);

  // Fetch products from JSON
  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  // Find current product
  const product = products.find(
    (item) => String(item.id) === String(id)
  );

  // Get images
  const getProductImages = (item) => {
    if (!item) return [];

    if (item.media) {
      const images = [];

      if (item.media.cover) {
        images.push(item.media.cover);
      }

      if (Array.isArray(item.media.images)) {
        images.push(...item.media.images);
      }

      return images.filter(Boolean);
    }

    if (Array.isArray(item.image)) {
      return item.image.filter(Boolean);
    }

    if (item.image) {
      return [item.image];
    }

    return [];
  };

  const images = getProductImages(product);

  // Set default image
  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    } else {
      setSelectedImage("");
    }
  }, [id, products]);

  // Get colors
  const getColorOptions = (item) => {
    if (!item) return [];

    if (Array.isArray(item.colors)) {
      return item.colors.filter(Boolean);
    }

    if (
      item.variants?.colors &&
      Array.isArray(item.variants.colors)
    ) {
      return item.variants.colors.filter(Boolean);
    }

    if (
      item.product?.colors &&
      Array.isArray(item.product.colors)
    ) {
      return item.product.colors.filter(Boolean);
    }

    if (
      item.product?.variants?.colors &&
      Array.isArray(item.product.variants.colors)
    ) {
      return item.product.variants.colors.filter(Boolean);
    }

    return [];
  };

  // Get sizes
  const getSizes = (item) => {
    if (!item) return [];

    if (Array.isArray(item.sizes)) {
      return item.sizes.filter(Boolean);
    }

    if (
      item.variants?.sizes &&
      Array.isArray(item.variants.sizes)
    ) {
      return item.variants.sizes.filter(Boolean);
    }

    if (
      item.product?.sizes &&
      Array.isArray(item.product.sizes)
    ) {
      return item.product.sizes.filter(Boolean);
    }

    if (
      item.product?.variants?.sizes &&
      Array.isArray(item.product.variants.sizes)
    ) {
      return item.product.variants.sizes.filter(Boolean);
    }

    return [];
  };

  const colors = getColorOptions(product);
  const sizes = getSizes(product);

  // Get title
  const getProductTitle = (item) => {
    if (!item) return "";

    return (
      item.product?.title ||
      item.title ||
      item.name ||
      item.productName ||
      ""
    );
  };

  // Get seller
  const getSellerName = (item) => {
    if (!item) return "";

    return (
      item.sellerName ||
      item.seller?.name ||
      item.seller ||
      "Tanlia Studio"
    );
  };

  // Get price
  const getPrice = (item) => {
    if (!item) return "";

    if (item.pricing) {
      if (item.pricing.fullSet) {
        return item.pricing.fullSet;
      }

      if (item.pricing.price) {
        return `${item.pricing.currency || "BDT"} ${
          item.pricing.price
        }`;
      }

      if (item.pricing.kameez && item.pricing.pant) {
        return `${item.pricing.kameez} / ${item.pricing.pant}`;
      }
    }

    return item.price || "";
  };

  // Get original price
  const getOriginalPrice = (item) => {
    if (!item) return "";

    return (
      item.originalPrice ||
      item.pricing?.originalPrice ||
      ""
    );
  };

  // Get description
  const getDescription = (item) => {
    if (!item) {
      return {
        intro: "",
        details: [],
      };
    }

    if (typeof item.description === "string") {
      return {
        intro: item.description,
        details: [],
      };
    }

    if (
      item.description &&
      typeof item.description === "object"
    ) {
      return {
        intro: item.description.intro || "",
        details: Array.isArray(item.description.details)
          ? item.description.details
          : [],
      };
    }

    if (
      item.product?.description &&
      typeof item.product.description === "string"
    ) {
      return {
        intro: item.product.description,
        details: [],
      };
    }

    if (
      item.product?.description &&
      typeof item.product.description === "object"
    ) {
      return {
        intro: item.product.description.intro || "",
        details: Array.isArray(
          item.product.description.details
        )
          ? item.product.description.details
          : [],
      };
    }

    return {
      intro: "",
      details: [],
    };
  };

  const description = getDescription(product);

  // Get color name
  const getColorName = (color) => {
    if (typeof color === "string") {
      return color;
    }

    return color?.name || "";
  };

  // Get color image
  const getColorImage = (color) => {
    if (typeof color === "string") {
      return "";
    }

    return color?.image || "";
  };

  // Get size name
  const getSizeName = (size) => {
    if (typeof size === "string") {
      return size;
    }

    return (
      size?.name ||
      size?.size ||
      size?.title ||
      ""
    );
  };

  // Color click
  const handleColorClick = (color) => {
    const colorName = getColorName(color);
    const colorImage = getColorImage(color);

    setSelectedColor(colorName);

    if (colorImage) {
      setSelectedImage(colorImage);
    }
  };

  // Quantity
  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Wishlist
  const handleWishlist = () => {
    setIsWishlisted((prev) => !prev);
  };

  // Add to cart
  const handleAddToCart = () => {
    if (!product) return;

    const cart = JSON.parse(
      localStorage.getItem("tanliaCart") || "[]"
    );

    const cartItem = {
      ...product,
      selectedColor,
      selectedSize,
      selectedImage:
        selectedImage || images[0] || "",
      quantity,
    };

    cart.push(cartItem);

    localStorage.setItem(
      "tanliaCart",
      JSON.stringify(cart)
    );

    window.dispatchEvent(new Event("cartUpdated"));

    // Show cart notification
    setShowCartNotification(true);

    setTimeout(() => {
      setShowCartNotification(false);
    }, 2000);
  };

  // Escape key for quick view
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowQuickView(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Loading product...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <h2 className="text-2xl font-semibold mb-4">
          Product not found
        </h2>

        <Link
          to="/products"
          className="flex items-center gap-2 text-sm underline"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen">

      {/* Cart Notification */}
      {showCartNotification && (
        <div className="fixed top-24 right-6 z-[100] bg-black text-white px-5 py-3 text-sm shadow-lg">
          Product added to cart
        </div>
      )}

      {/* Main Product Section */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition"
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Images */}

          <div>

            <div className="aspect-[4/5] bg-gray-100 overflow-hidden">

              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={getProductTitle(product)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}

            </div>

            {images.length > 0 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">

                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setSelectedImage(image)
                    }
                    className={`w-20 h-24 shrink-0 overflow-hidden border ${
                      selectedImage === image
                        ? "border-black"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${getProductTitle(
                        product
                      )} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}

              </div>
            )}

          </div>

          {/* Product Info */}

          <div className="flex flex-col">

            <p className="text-sm text-gray-500 mb-2">
              {getSellerName(product)}
            </p>

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              {getProductTitle(product)}
            </h1>

            <div className="flex items-center gap-3 mb-6">

              <span className="text-xl font-medium">
                {getPrice(product)}
              </span>

              {getOriginalPrice(product) && (
                <span className="text-gray-400 line-through">
                  {getOriginalPrice(product)}
                </span>
              )}

            </div>

            {/* Description */}

            {description.intro && (
              <p className="text-gray-600 leading-7 mb-5">
                {description.intro}
              </p>
            )}

            {description.details.length > 0 && (
              <div className="mb-7">

                <ul className="space-y-3">

                  {description.details.map(
                    (detail, index) => (
                      <li
                        key={`${detail}-${index}`}
                        className="flex items-start gap-3 text-gray-600"
                      >
                        <Check
                          size={18}
                          className="mt-1 shrink-0"
                        />

                        <span>{detail}</span>
                      </li>
                    )
                  )}

                </ul>

              </div>
            )}

            {/* Colors */}

            {colors.length > 0 && (
              <div className="mb-7">

                <div className="flex items-center justify-between mb-3">

                  <h3 className="font-medium">
                    Color
                  </h3>

                  {selectedColor && (
                    <span className="text-sm text-gray-500">
                      {selectedColor}
                    </span>
                  )}

                </div>

                <div className="flex flex-wrap gap-3">

                  {colors.map((color, index) => {

                    const colorName =
                      getColorName(color);

                    return (
                      <button
                        key={`${colorName}-${index}`}
                        type="button"
                        onClick={() =>
                          handleColorClick(color)
                        }
                        className={`px-4 py-3 border text-sm transition ${
                          selectedColor === colorName
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-gray-300 hover:border-black"
                        }`}
                      >
                        {colorName}
                      </button>
                    );
                  })}

                </div>

              </div>
            )}

            {/* Sizes */}

            {sizes.length > 0 && (
              <div className="mb-8">

                <h3 className="font-medium mb-3">
                  Size
                </h3>

                <div className="flex flex-wrap gap-3">

                  {sizes.map((size, index) => {

                    const sizeName =
                      getSizeName(size);

                    return (
                      <button
                        key={`${sizeName}-${index}`}
                        type="button"
                        onClick={() =>
                          setSelectedSize(sizeName)
                        }
                        className={`min-w-14 px-4 py-3 border text-sm transition ${
                          selectedSize === sizeName
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-gray-300 hover:border-black"
                        }`}
                      >
                        {sizeName}
                      </button>
                    );
                  })}

                </div>

              </div>
            )}

            {/* Quantity + Add to Cart + Wishlist */}

            <div className="flex items-center gap-3">

              {/* Quantity */}

              <div className="flex items-center border border-gray-300 bg-white h-14">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="w-12 h-full flex items-center justify-center hover:bg-gray-100 transition"
                >
                  <Minus size={17} />
                </button>

                <span className="w-10 text-center text-sm font-medium">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  className="w-12 h-full flex items-center justify-center hover:bg-gray-100 transition"
                >
                  <Plus size={17} />
                </button>

              </div>

              {/* Add to Cart */}

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white h-14 px-5 flex items-center justify-center gap-3 text-sm font-medium hover:bg-gray-800 transition"
              >
                <ShoppingBag size={19} />
                Add to Cart
              </button>

              {/* Wishlist */}

              <button
                type="button"
                onClick={handleWishlist}
                className={`h-14 w-14 border flex items-center justify-center transition ${
                  isWishlisted
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:border-black"
                }`}
                aria-label="Wishlist"
              >
                <Heart
                  size={20}
                  fill={
                    isWishlisted
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>

            </div>

            {/* Features */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 border-t border-gray-200 mt-8 pt-8">

              <div className="flex items-start gap-3">

                <Truck
                  size={20}
                  className="shrink-0"
                />

                <div>
                  <p className="text-sm font-medium">
                    Fast Delivery
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    2–3 working days
                  </p>
                </div>

              </div>

              <div className="flex items-start gap-3">

                <ShieldCheck
                  size={20}
                  className="shrink-0"
                />

                <div>
                  <p className="text-sm font-medium">
                    Secure Shopping
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Safe & reliable
                  </p>
                </div>

              </div>

              <div className="flex items-start gap-3">

                <ShoppingBag
                  size={20}
                  className="shrink-0"
                />

                <div>
                  <p className="text-sm font-medium">
                    Trusted Sellers
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Shop from verified sellers
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* You May Also Like */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-2xl md:text-3xl font-semibold">
            You May Also Like
          </h2>

          <Link
            to="/products"
            className="text-sm underline underline-offset-4"
          >
            View All
          </Link>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">

          {products
            .filter(
              (item) =>
                String(item.id) !==
                String(product.id)
            )
            .slice(0, 4)
            .map((item) => {

              const relatedImages =
                getProductImages(item);

              const relatedImage =
                relatedImages[0];

              return (
                <div
                  key={item.id}
                  className="group"
                >

                  {/* Product Image */}

                  <div
                    className="relative aspect-[4/5] bg-gray-100 overflow-hidden cursor-pointer"
                    onClick={() => {
                      window.location.href =
                        `/products/${item.id}`;
                    }}
                  >

                    {relatedImage ? (
                      <img
                        src={relatedImage}
                        alt={getProductTitle(item)}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}

                    {/* Hover Add to Cart */}

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();

                        const cart = JSON.parse(
                          localStorage.getItem(
                            "tanliaCart"
                          ) || "[]"
                        );

                        const cartItem = {
                          ...item,
                          selectedColor: "",
                          selectedSize: "",
                          selectedImage:
                            relatedImage || "",
                          quantity: 1,
                        };

                        cart.push(cartItem);

                        localStorage.setItem(
                          "tanliaCart",
                          JSON.stringify(cart)
                        );

                        window.dispatchEvent(
                          new Event("cartUpdated")
                        );

                        // Show cart notification
                        setShowCartNotification(true);

                        setTimeout(() => {
                          setShowCartNotification(false);
                        }, 2000);
                      }}
                      className="absolute left-4 right-4 bottom-6 z-20 bg-black text-white py-4 px-4 text-sm font-medium flex items-center justify-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <ShoppingBag size={18} />
                      Add to Cart
                    </button>

                  </div>

                  {/* Product Info */}

                  <div className="pt-4">

                    <p className="text-xs text-gray-500 mb-1">
                      {getSellerName(item)}
                    </p>

                    <h3 className="text-sm font-medium mb-2 line-clamp-2">
                      {getProductTitle(item)}
                    </h3>

                    <p className="text-sm">
                      {getPrice(item)}
                    </p>

                  </div>

                </div>
              );
            })}

        </div>

      </section>

      {/* Quick View Modal */}

      {showQuickView && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() =>
            setShowQuickView(false)
          }
        >

          <div
            className="bg-[#FDFBF7] max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              onClick={() =>
                setShowQuickView(false)
              }
              className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">

              <div className="aspect-[4/5] bg-gray-100">

                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={getProductTitle(product)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}

              </div>

              <div className="p-6 md:p-8">

                <p className="text-sm text-gray-500 mb-2">
                  {getSellerName(product)}
                </p>

                <h2 className="text-2xl font-semibold mb-4">
                  {getProductTitle(product)}
                </h2>

                <p className="text-lg mb-6">
                  {getPrice(product)}
                </p>

                {description.intro && (
                  <p className="text-gray-600 leading-7 mb-5">
                    {description.intro}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-black text-white py-4 flex items-center justify-center gap-3"
                >
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default ProductDetails;