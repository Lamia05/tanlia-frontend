
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Heart,
  Minus,
  Plus,
  ChevronRight,
} from "lucide-react";

const API_URL = "https://tanlia-backend.onrender.com/api/products";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showCartNotification, setShowCartNotification] =
    useState(false);

  // =========================
  // GET PRODUCT IMAGES
  // =========================
  const getProductImages = (item) => {
    if (!item) return [];

    const images = [];

    if (item.media) {
      if (typeof item.media.cover === "string") {
        const cover = item.media.cover.trim();

        if (cover) {
          images.push(cover);
        }
      }

      if (Array.isArray(item.media.images)) {
        item.media.images.forEach((image) => {
          if (typeof image === "string" && image.trim()) {
            images.push(image.trim());
          }
        });
      }
    }

    if (Array.isArray(item.image)) {
      item.image.forEach((image) => {
        if (typeof image === "string" && image.trim()) {
          images.push(image.trim());
        }
      });
    } else if (
      typeof item.image === "string" &&
      item.image.trim()
    ) {
      images.push(item.image.trim());
    }

    return [...new Set(images.filter(Boolean))];
  };

  // =========================
  // GET TITLE
  // =========================
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

  // =========================
  // GET SELLER
  // =========================
  const getSellerName = (item) => {
    if (!item) return "";

    return (
      item.sellerName ||
      item.seller?.name ||
      item.seller ||
      "Tanlia Studio"
    );
  };

  // =========================
  // GET PRICE
  // =========================
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

  // =========================
  // ORIGINAL PRICE
  // =========================
  const getOriginalPrice = (item) => {
    if (!item) return "";

    return (
      item.originalPrice ||
      item.pricing?.originalPrice ||
      ""
    );
  };

  // =========================
  // DESCRIPTION
  // =========================
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

  // =========================
  // GET COLORS
  // =========================
  const getColorOptions = (item) => {
    if (!item) return [];

    if (Array.isArray(item.colors)) {
      return item.colors.filter((color) => {
        if (typeof color === "string") {
          return color.trim() !== "";
        }

        return color && typeof color === "object";
      });
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

  // =========================
  // GET SIZES
  // =========================
  const getSizes = (item) => {
    if (!item) return [];

    if (Array.isArray(item.sizes)) {
      return item.sizes.filter((size) => {
        if (typeof size === "string") {
          return size.trim() !== "";
        }

        return size && typeof size === "object";
      });
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

  // =========================
  // COLOR HELPERS
  // =========================
  const getColorName = (color) => {
    if (typeof color === "string") {
      return color.trim();
    }

    return color?.name || "";
  };

  const getColorImage = (color) => {
    if (!color || typeof color === "string") {
      return "";
    }

    const image = color?.image;

    if (typeof image === "string" && image.trim()) {
      return image.trim();
    }

    return "";
  };

  // =========================
  // SIZE HELPER
  // =========================
  const getSizeName = (size) => {
    if (typeof size === "string") {
      return size.trim();
    }

    return (
      size?.name ||
      size?.size ||
      size?.title ||
      ""
    );
  };

  // =========================
  // FETCH SINGLE PRODUCT
  // =========================
  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setProduct(null);

      try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();

        if (!cancelled) {
          setProduct(data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Error fetching product:",
            error
          );
          setProduct(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // =========================
  // FETCH RELATED PRODUCTS
  // Runs separately
  // =========================
  useEffect(() => {
    let cancelled = false;

    const fetchRelatedProducts = async () => {
      setRelatedLoading(true);

      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            "Failed to fetch related products"
          );
        }

        const data = await response.json();

        if (!cancelled && Array.isArray(data)) {
          const filtered = data
            .filter(
              (item) =>
                String(item.id) !== String(id)
            )
            .slice(0, 4);

          setRelatedProducts(filtered);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Error fetching related products:",
            error
          );

          setRelatedProducts([]);
        }
      } finally {
        if (!cancelled) {
          setRelatedLoading(false);
        }
      }
    };

    fetchRelatedProducts();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // =========================
  // DEFAULT IMAGE
  // =========================
  useEffect(() => {
    if (!product) return;

    const productImages = getProductImages(product);

    setSelectedImage(
      productImages.length > 0
        ? productImages[0]
        : ""
    );

    setSelectedColor("");
    setSelectedSize("");
    setQuantity(1);
  }, [product]);

  // =========================
  // ADD TO CART
  // =========================
  const addItemToCart = (
    item,
    itemImage,
    itemQuantity = 1
  ) => {
    const cart = JSON.parse(
      localStorage.getItem("tanliaCart") || "[]"
    );

    const isCurrentProduct =
      String(item?.id) === String(product?.id);

    const cartItem = {
      ...item,

      selectedColor: isCurrentProduct
        ? selectedColor
        : "",

      selectedSize: isCurrentProduct
        ? selectedSize
        : "",

      selectedImage: itemImage || "",

      quantity: itemQuantity,
    };

    cart.push(cartItem);

    localStorage.setItem(
      "tanliaCart",
      JSON.stringify(cart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    setShowCartNotification(true);

    setTimeout(() => {
      setShowCartNotification(false);
    }, 2200);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const images = getProductImages(product);

    addItemToCart(
      product,
      selectedImage || images[0] || "",
      quantity
    );
  };

  // =========================
  // COLOR CLICK
  // =========================
  const handleColorClick = (color) => {
    const colorName = getColorName(color);
    const colorImage = getColorImage(color);

    setSelectedColor(colorName);

    if (colorImage) {
      setSelectedImage(colorImage);
    }
  };

  // =========================
  // QUANTITY
  // =========================
  const decreaseQuantity = () => {
    setQuantity((prev) =>
      Math.max(1, prev - 1)
    );
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // =========================
  // WISHLIST
  // =========================
  const handleWishlist = () => {
    setIsWishlisted((prev) => !prev);
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black/15 border-t-black rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-gray-500 tracking-wide">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // NOT FOUND
  // =========================
  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">
          Tanlia Studio
        </p>

        <h2 className="text-3xl font-medium mb-5">
          Product not found
        </h2>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm border-b border-black pb-1"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>
      </div>
    );
  }

  const images = getProductImages(product);
  const colors = getColorOptions(product);
  const sizes = getSizes(product);
  const description = getDescription(product);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#171717]">

      {/* =========================
          CART NOTIFICATION
      ========================= */}
      {showCartNotification && (
        <div className="fixed top-24 right-4 sm:right-6 z-[100] bg-black text-white px-5 py-4 shadow-xl flex items-center gap-3">
          <div className="w-7 h-7 border border-white/30 rounded-full flex items-center justify-center">
            <Check size={15} />
          </div>

          <div>
            <p className="text-sm font-medium">
              Added to cart
            </p>

            <p className="text-xs text-white/60 mt-0.5">
              Your item is ready for checkout
            </p>
          </div>
        </div>
      )}

      {/* =========================
          MAIN
      ========================= */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-7 sm:mb-10">
          <Link
            to="/products"
            className="hover:text-black transition"
          >
            Products
          </Link>

          <ChevronRight size={14} />

          <span className="text-gray-900 truncate max-w-[220px]">
            {getProductTitle(product)}
          </span>
        </div>

        {/* =========================
            PRODUCT AREA
        ========================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-16 xl:gap-24">

          {/* =========================
              PRODUCT IMAGES
          ========================= */}
          <div>

            <div className="relative aspect-[4/5] bg-[#F0EEEA] overflow-hidden">

              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={getProductTitle(product)}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}

              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 text-xs">
                  {Math.max(
                    1,
                    images.indexOf(selectedImage) + 1
                  )}{" "}
                  / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2 sm:gap-3 mt-3">

                {images.slice(0, 5).map(
                  (image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() =>
                        setSelectedImage(image)
                      }
                      className={`aspect-[4/5] overflow-hidden border transition ${
                        selectedImage === image
                          ? "border-black"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${getProductTitle(
                          product
                        )} ${index + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    </button>
                  )
                )}

              </div>
            )}

          </div>

          {/* =========================
              PRODUCT INFO
          ========================= */}
          <div className="lg:pt-2">

            {/* Seller + Wishlist */}
            <div className="flex items-center justify-between gap-4 mb-4">

              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                {getSellerName(product)}
              </p>

              <button
                type="button"
                onClick={handleWishlist}
                className={`w-11 h-11 border flex items-center justify-center transition ${
                  isWishlisted
                    ? "bg-black text-white border-black"
                    : "bg-white border-gray-200 hover:border-black"
                }`}
                aria-label="Wishlist"
              >
                <Heart
                  size={19}
                  strokeWidth={1.6}
                  fill={
                    isWishlisted
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>

            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl xl:text-[44px] leading-[1.08] font-medium tracking-[-0.02em] mb-5">
              {getProductTitle(product)}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4 pb-6 border-b border-black/10">

              <span className="text-xl sm:text-2xl font-medium">
                {getPrice(product)}
              </span>

              {getOriginalPrice(product) && (
                <span className="text-sm sm:text-base text-gray-400 line-through">
                  {getOriginalPrice(product)}
                </span>
              )}

            </div>

            {/* Description */}
            {description.intro && (
              <div className="py-6 border-b border-black/10">
                <p className="text-sm sm:text-[15px] leading-7 text-gray-600">
                  {description.intro}
                </p>
              </div>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="py-6 border-b border-black/10">

                <div className="flex items-center justify-between mb-4">

                  <p className="text-sm font-medium">
                    Color
                  </p>

                  {selectedColor && (
                    <span className="text-xs text-gray-500">
                      {selectedColor}
                    </span>
                  )}

                </div>

                <div className="flex flex-wrap gap-2.5">

                  {colors.map((color, index) => {
                    const colorName =
                      getColorName(color);

                    if (!colorName) return null;

                    return (
                      <button
                        key={`${colorName}-${index}`}
                        type="button"
                        onClick={() =>
                          handleColorClick(color)
                        }
                        className={`px-4 py-2.5 text-xs sm:text-sm border transition ${
                          selectedColor === colorName
                            ? "bg-black text-white border-black"
                            : "bg-white border-gray-200 hover:border-black"
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
              <div className="py-6 border-b border-black/10">

                <div className="flex items-center justify-between mb-4">

                  <p className="text-sm font-medium">
                    Size
                  </p>

                  <span className="text-xs text-gray-400">
                    Select your size
                  </span>

                </div>

                <div className="flex flex-wrap gap-2.5">

                  {sizes.map((size, index) => {
                    const sizeName =
                      getSizeName(size);

                    if (!sizeName) return null;

                    return (
                      <button
                        key={`${sizeName}-${index}`}
                        type="button"
                        onClick={() =>
                          setSelectedSize(sizeName)
                        }
                        className={`min-w-[58px] px-4 py-3 border text-sm transition ${
                          selectedSize === sizeName
                            ? "bg-black text-white border-black"
                            : "bg-white border-gray-200 hover:border-black"
                        }`}
                      >
                        {sizeName}
                      </button>
                    );
                  })}

                </div>

              </div>
            )}

            {/* Quantity + Cart */}
            <div className="pt-7">

              <div className="flex gap-2.5">

                <div className="h-14 flex items-center border border-gray-200 bg-white">

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    className="w-11 h-full flex items-center justify-center hover:bg-gray-50 transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="w-9 text-center text-sm font-medium">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    className="w-11 h-full flex items-center justify-center hover:bg-gray-50 transition"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>

                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 h-14 bg-black text-white flex items-center justify-center gap-3 text-sm font-medium tracking-wide hover:bg-[#B85028] transition duration-300"
                >
                  <ShoppingBag
                    size={18}
                    strokeWidth={1.7}
                  />
                  Add to Cart
                </button>

              </div>

            </div>

            {/* Service Information */}
            <div className="mt-8 border-t border-black/10">

              <div className="py-5 flex items-start gap-4 border-b border-black/10">

                <Truck
                  size={20}
                  strokeWidth={1.5}
                  className="shrink-0 mt-0.5"
                />

                <div>
                  <p className="text-sm font-medium">
                    Delivery
                  </p>

                  <p className="text-xs text-gray-500 mt-1 leading-5">
                    Delivery is handled by the seller.
                  </p>
                </div>

              </div>

              <div className="py-5 flex items-start gap-4 border-b border-black/10">

                <ShieldCheck
                  size={20}
                  strokeWidth={1.5}
                  className="shrink-0 mt-0.5"
                />

                <div>
                  <p className="text-sm font-medium">
                    Secure Shopping
                  </p>

                  <p className="text-xs text-gray-500 mt-1 leading-5">
                    Shop confidently from our selected sellers.
                  </p>
                </div>

              </div>

              <div className="py-5 flex items-start gap-4">

                <ShoppingBag
                  size={20}
                  strokeWidth={1.5}
                  className="shrink-0 mt-0.5"
                />

                <div>
                  <p className="text-sm font-medium">
                    Seller
                  </p>

                  <p className="text-xs text-gray-500 mt-1 leading-5">
                    {getSellerName(product)}
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* =========================
            PRODUCT DETAILS
        ========================= */}
        {(description.details.length > 0 ||
          description.intro) && (
          <section className="mt-16 sm:mt-24 border-t border-black/10 pt-10 sm:pt-14">

            <div className="grid grid-cols-1 lg:grid-cols-[0.35fr_0.65fr] gap-8 lg:gap-20">

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">
                  Product Information
                </p>

                <h2 className="text-2xl sm:text-3xl font-medium">
                  Details
                </h2>
              </div>

              <div>

                {description.intro && (
                  <p className="text-sm sm:text-[15px] text-gray-600 leading-7 mb-6">
                    {description.intro}
                  </p>
                )}

                {description.details.length > 0 && (
                  <ul className="space-y-4">

                    {description.details.map(
                      (detail, index) => (
                        <li
                          key={`${detail}-${index}`}
                          className="flex items-start gap-3 text-sm text-gray-600"
                        >
                          <Check
                            size={17}
                            strokeWidth={1.7}
                            className="mt-0.5 shrink-0 text-black"
                          />

                          <span>{detail}</span>
                        </li>
                      )
                    )}

                  </ul>
                )}

              </div>

            </div>

          </section>
        )}

      </main>

      {/* =========================
          RELATED PRODUCTS
      ========================= */}
      <section className="border-t border-black/10 bg-white/40">

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20">

          <div className="flex items-end justify-between gap-5 mb-8 sm:mb-10">

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
                Discover More
              </p>

              <h2 className="text-2xl sm:text-3xl font-medium">
                You May Also Like
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden sm:flex items-center gap-2 text-sm border-b border-black pb-1 hover:opacity-60 transition"
            >
              View All
              <ArrowLeft
                size={14}
                className="rotate-180"
              />
            </Link>

          </div>

          {relatedLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">

              {[1, 2, 3, 4].map((item) => (
                <div key={item}>

                  <div className="aspect-[4/5] bg-gray-100 animate-pulse" />

                  <div className="pt-4 space-y-2">
                    <div className="h-2.5 w-20 bg-gray-200 animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 animate-pulse" />
                    <div className="h-3 w-16 bg-gray-200 animate-pulse" />
                  </div>

                </div>
              ))}

            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10">

              {relatedProducts.map((item) => {

                const relatedImages =
                  getProductImages(item);

                const relatedImage =
                  relatedImages.length > 0
                    ? relatedImages[0]
                    : "";

                return (
                  <div
                    key={item.id}
                    className="group"
                  >

                    {/* Image */}
                    <div className="relative aspect-[4/5] bg-[#F0EEEA] overflow-hidden">

                      <Link
                        to={`/products/${item.id}`}
                        className="block w-full h-full"
                      >
                        {relatedImage ? (
                          <img
                            src={relatedImage}
                            alt={getProductTitle(item)}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                      </Link>

                      {/* Add to Cart */}
                      <button
                        type="button"
                        onClick={() =>
                          addItemToCart(
                            item,
                            relatedImage,
                            1
                          )
                        }
                        className="absolute left-2 right-2 sm:left-4 sm:right-4 bottom-3 sm:bottom-5 bg-black text-white py-3 sm:py-3.5 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                      >
                        <ShoppingBag size={16} />
                        Add to Cart
                      </button>

                    </div>

                    {/* Info */}
                    <div className="pt-4">

                      <p className="text-[10px] sm:text-xs uppercase tracking-[0.12em] text-gray-400 mb-1.5">
                        {getSellerName(item)}
                      </p>

                      <Link
                        to={`/products/${item.id}`}
                        className="block"
                      >
                        <h3 className="text-sm sm:text-[15px] font-medium leading-5 line-clamp-2 hover:opacity-60 transition">
                          {getProductTitle(item)}
                        </h3>
                      </Link>

                      <p className="text-sm mt-2">
                        {getPrice(item)}
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No related products available.
            </p>
          )}

          {/* Mobile View All */}
          <div className="sm:hidden mt-9">

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm border-b border-black pb-1"
            >
              View All Products

              <ArrowLeft
                size={14}
                className="rotate-180"
              />
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
};

export default ProductDetails;
