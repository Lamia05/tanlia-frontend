import React from "react";
import { Link, useParams } from "react-router-dom";

const products = [
  {
    id: 1,
    title: "Handcrafted Dhakai Jamdani",
    tag: "HERITAGE",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop",
    description:
      "A beautifully crafted collection inspired by traditional Bangladeshi heritage and timeless craftsmanship.",
  },
  {
    id: 2,
    title: "Rajshahi Silk Anarkali Set",
    tag: "TRENDING",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop",
    description:
      "Elegant silk-inspired fashion designed for a graceful and sophisticated look.",
  },
  {
    id: 3,
    title: "Minimalist Muslin Tunic",
    tag: "NEW ARRIVAL",
    image:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1600&auto=format&fit=crop",
    description:
      "A clean and minimal piece made for effortless everyday elegance.",
  },
];

const ProductDetails = () => {
  const { id } = useParams();

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl">Product not found</h2>
      </div>
    );
  }

  const otherProducts = products.filter(
    (item) => item.id !== Number(id)
  );

  return (
    <div className="bg-[#F4F1EA] text-gray-900">

      {/* Main Hero Image */}
      <div className="w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Information */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">
          {product.tag}
        </p>

        <h1 className="text-4xl md:text-6xl font-serif font-light mb-6">
          {product.title}
        </h1>

        <div className="max-w-2xl space-y-3 text-gray-600">
  {product.features?.map((feature, index) => (
    <div key={index} className="flex items-center gap-3">
      <Check size={17} strokeWidth={1.5} />
      <span>{feature}</span>
    </div>
  ))}
</div>
        <button className="mt-8 bg-gray-900 text-white px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-gray-700 transition">
          Explore Product
        </button>
      </section>

      {/* Other Products */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="border-t border-gray-300 pt-10 mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
            You May Also Like
          </p>

          <h2 className="text-3xl md:text-4xl font-serif mt-2">
            More From The Collection
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {otherProducts.map((item) => (
            <Link
              key={item.id}
              to={`/products/${item.id}`}
              className="group block overflow-hidden"
            >
              <div className="aspect-[4/5] overflow-hidden bg-gray-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
              </div>

              <div className="pt-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  {item.tag}
                </p>

                <h3 className="text-xl font-serif mt-1">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};

export default ProductDetails;