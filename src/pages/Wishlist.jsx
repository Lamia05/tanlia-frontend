import React, { useEffect, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* =========================
     PRODUCT ID
  ========================= */

  const getProductId = (product) => {
    return String(product?._id || product?.id || "");
  };

  /* =========================
     NORMALIZE WISHLIST
  ========================= */

  const normalizeWishlist = (savedWishlist) => {
    if (!Array.isArray(savedWishlist)) {
      return [];
    }

    return savedWishlist
      .map((item) => {
        // New format: ID only
        if (
          typeof item === "string" ||
          typeof item === "number"
        ) {
          return String(item);
        }

        // Old format: full product object
        if (item && typeof item === "object") {
          return String(item._id || item.id || "");
        }

        return "";
      })
      .filter(Boolean);
  };

  /* =========================
     LOAD WISHLIST
  ========================= */

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = JSON.parse(
          localStorage.getItem("tanliaWishlist") || "[]"
        );

        const normalizedWishlist =
          normalizeWishlist(savedWishlist);

        setWishlist(normalizedWishlist);

        // Clean old format and keep only IDs
        localStorage.setItem(
          "tanliaWishlist",
          JSON.stringify(normalizedWishlist)
        );
      } catch (error) {
        console.error(
          "Wishlist loading error:",
          error
        );

        setWishlist([]);
      }
    };

    loadWishlist();

    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener(
      "wishlistUpdated",
      handleWishlistUpdate
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        handleWishlistUpdate
      );
    };
  }, []);

  /* =========================
     LOAD PRODUCTS
  ========================= */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(
          "https://tanlia-backend.onrender.com/api/products",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load products"
          );
        }

        const data = await response.json();

        setProducts(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Wishlist product loading error:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  /* =========================
     IMAGES
  ========================= */

  const getProductImages = (product) => {
    if (!product) return [];

    if (product.media) {
      const images = [];

      if (product.media.cover) {
        images.push(product.media.cover);
      }

      if (Array.isArray(product.media.images)) {
        images.push(...product.media.images);
      }

      if (images.length > 0) {
        return [
          ...new Set(
            images.filter(Boolean)
          ),
        ];
      }
    }

    if (Array.isArray(product.image)) {
      return product.image.filter(Boolean);
    }

    if (product.image) {
      return [product.image];
    }

    if (Array.isArray(product.images)) {
      return product.images.filter(Boolean);
    }

    return [];
  };

  /* =========================
     TITLE
  ========================= */

  const getProductTitle = (product) => {
    return (
      product?.product?.title ||
      product?.title ||
      product?.name ||
      "Product"
    );
  };

  /* =========================
     SELLER
  ========================= */

  const getSellerName = (product) => {
    return (
      product?.sellerName ||
      product?.seller?.name ||
      product?.seller ||
      "Tanlia Studio"
    );
  };

  /* =========================
     PRICE
  ========================= */

  const getPrice = (product) => {
    if (!product) return "";

    if (product.pricing) {
      if (product.pricing.fullSet) {
        return `BDT ${product.pricing.fullSet}`;
      }

      if (product.pricing.price) {
        return `BDT ${product.pricing.price}`;
      }

      if (
        product.pricing.kameez &&
        product.pricing.pant
      ) {
        return `BDT ${product.pricing.kameez} / ${product.pricing.pant}`;
      }

      if (product.pricing.kameez) {
        return `BDT ${product.pricing.kameez}`;
      }

      if (product.pricing.pant) {
        return `BDT ${product.pricing.pant}`;
      }
    }

    if (product.price) {
      return String(product.price);
    }

    return "";
  };

  /* =========================
     REMOVE FROM WISHLIST
  ========================= */

  const removeFromWishlist = (productId) => {
    const id = String(productId);

    const updatedWishlist = wishlist.filter(
      (wishlistId) =>
        String(wishlistId) !== id
    );

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "tanliaWishlist",
      JSON.stringify(updatedWishlist)
    );

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  };

  /* =========================
     ADD TO CART
  ========================= */

  const addToCart = (product) => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("tanliaCart") || "[]"
      );

      const cart = Array.isArray(savedCart)
        ? savedCart
        : [];

      const images =
        getProductImages(product);

      const productId =
        getProductId(product);

      const cartItem = {
        ...product,
        id: productId,
        selectedColor: "",
        selectedSize: "",
        selectedImage:
          images[0] || "",
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
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );
    }
  };

  /* =========================
     MATCH PRODUCTS
  ========================= */

  const wishlistedProducts =
    products.filter((product) => {
      const productId =
        getProductId(product);

      return (
        productId &&
        wishlist.some(
          (wishlistId) =>
            String(wishlistId) ===
            String(productId)
        )
      );
    });

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <p className="text-sm text-gray-500">
          Loading wishlist...
        </p>
      </div>
    );
  }

  /* =========================
     PAGE
  ========================= */

  return (
    <div className="min-h-screen bg-[#FDFBF7]">

      {/* HEADER */}

      <section className="px-5 md:px-10 lg:px-16 pt-10 pb-8">
        <div className="max-w-7xl mx-auto">

          <p className="text-xs tracking-[0.25em] text-gray-500 uppercase mb-3">
            Tanlia Studio
          </p>

          <div className="flex items-center justify-between gap-4">

            <div>

              <h1 className="text-3xl md:text-4xl font-serif text-gray-900">
                Wishlist
              </h1>

              <p className="mt-3 text-sm text-gray-500">
                {wishlistedProducts.length > 0
                  ? `${wishlistedProducts.length} ${
                      wishlistedProducts.length === 1
                        ? "item"
                        : "items"
                    } saved`
                  : "Your favorite pieces, all in one place."}
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* PRODUCTS */}

      <section className="px-5 md:px-10 lg:px-16 pb-16">

        <div className="max-w-7xl mx-auto">

          {wishlistedProducts.length === 0 ? (

            <div className="py-20 text-center border border-gray-200 bg-white/40">

              <Heart
                size={34}
                strokeWidth={1.2}
                className="mx-auto text-gray-400"
              />

              <h2 className="mt-5 text-xl font-serif text-gray-900">
                Your wishlist is empty
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Explore our collection and save your favorite pieces.
              </p>

              <Link
                to="/products"
                className="inline-flex mt-6 bg-gray-900 text-white px-6 py-3 text-xs tracking-wide hover:bg-[#B85028] transition"
              >
                Explore Products
              </Link>

            </div>

          ) : (

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">

              {wishlistedProducts.map((product) => {

                const images =
                  getProductImages(product);

                const title =
                  getProductTitle(product);

                const seller =
                  getSellerName(product);

                const price =
                  getPrice(product);

                const productId =
                  getProductId(product);

                return (
                  <div
                    key={productId}
                    className="group"
                  >

                    {/* IMAGE */}

                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">

                      {images[0] ? (

                        <img
                          src={images[0]}
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />

                      ) : (

                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-xs text-gray-400">
                            No Image
                          </span>
                        </div>

                      )}

                      {/* REMOVE */}

                      <button
                        type="button"
                        onClick={() =>
                          removeFromWishlist(
                            productId
                          )
                        }
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition"
                        aria-label="Remove from wishlist"
                      >

                        <Heart
                          size={17}
                          strokeWidth={1.6}
                          fill="currentColor"
                          className="text-[#B85028]"
                        />

                      </button>

                    </div>

                    {/* INFO */}

                    <div className="pt-4">

                      <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                        {seller}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/products/${productId}`
                          )
                        }
                        className="mt-1 text-sm text-gray-900 leading-5 text-left hover:underline"
                      >
                        {title}
                      </button>

                      <p className="mt-2 text-sm font-medium text-gray-900">
                        {price}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          addToCart(product)
                        }
                        className="mt-4 w-full bg-gray-900 text-white py-3 text-xs flex items-center justify-center gap-2 hover:bg-[#B85028] transition"
                      >

                        <ShoppingBag
                          size={15}
                        />

                        Add to Cart

                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </div>

      </section>

    </div>
  );
};

export default Wishlist;