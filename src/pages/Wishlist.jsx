import React, { useEffect, useState } from "react";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadWishlist = () => {
      const savedWishlist = JSON.parse(
        localStorage.getItem("tanliaWishlist") || "[]"
      );

      setWishlist(
        Array.isArray(savedWishlist) ? savedWishlist.map(String) : []
      );
    };

    loadWishlist();

    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
  }, []);

  useEffect(() => {
    fetch("https://tanlia-backend.onrender.com/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load products");
        }

        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Wishlist product loading error:", error);
        setProducts([]);
        setLoading(false);
      });
  }, []);

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

      return images.filter(Boolean);
    }

    if (Array.isArray(product.image)) {
      return product.image.filter(Boolean);
    }

    if (product.image) {
      return [product.image];
    }

    return [];
  };

  const getProductTitle = (product) => {
    return product?.product?.title || product?.title || "Product";
  };

  const getSellerName = (product) => {
    return (
      product?.sellerName ||
      product?.seller?.name ||
      product?.seller ||
      "Tanlia Studio"
    );
  };

  const getPrice = (product) => {
    if (!product) return "";

    if (product.pricing) {
      if (product.pricing.fullSet) {
        return product.pricing.fullSet;
      }

      if (product.pricing.price) {
        return `${product.pricing.currency || "BDT"} ${
          product.pricing.price
        }`;
      }

      if (product.pricing.kameez && product.pricing.pant) {
        return `${product.pricing.kameez} / ${product.pricing.pant}`;
      }
    }

    if (product.price) {
      return product.price;
    }

    return "";
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(
      (id) => id !== String(productId)
    );

    localStorage.setItem(
      "tanliaWishlist",
      JSON.stringify(updatedWishlist)
    );

    setWishlist(updatedWishlist);
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const addToCart = (product) => {
    const cart = JSON.parse(
      localStorage.getItem("tanliaCart") || "[]"
    );

    const images = getProductImages(product);

    const cartItem = {
      ...product,
      selectedColor: "",
      selectedSize: "",
      selectedImage: images[0] || "",
      quantity: 1,
    };

    cart.push(cartItem);

    localStorage.setItem("tanliaCart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const wishlistedProducts = products.filter((product) =>
    wishlist.includes(String(product.id))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <p className="text-sm text-gray-500">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
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
                const images = getProductImages(product);
                const title = getProductTitle(product);
                const seller = getSellerName(product);
                const price = getPrice(product);

                return (
                  <div key={product.id} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      {images[0] ? (
                        <img
                          src={images[0]}
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-xs text-gray-400">
                            No Image
                          </span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => removeFromWishlist(product.id)}
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

                    <div className="pt-4">
                      <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                        {seller}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/products/${product.id}`)
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
                        onClick={() => addToCart(product)}
                        className="mt-4 w-full bg-gray-900 text-white py-3 text-xs flex items-center justify-center gap-2 hover:bg-[#B85028] transition"
                      >
                        <ShoppingBag size={15} />
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
