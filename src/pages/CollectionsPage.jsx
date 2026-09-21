import React from "react";
import { useParams, Link } from "react-router-dom";

const collections = [
  {
    id: 1,
    title: "The latest pieces fresh from our boutique sellers",
    tag: "New Arrival",
    image:
      "https://i.ibb.co.com/VYmdS3K1/IMG-20260906-WA0006-1.jpg",
    description:
      "Discover the latest pieces fresh from our boutique sellers, carefully selected to bring timeless style and effortless elegance to your wardrobe.",
    products: [
      {
        id: 1,
        name: "Digital Printed Three Piece",
        price: "৳ 900",
        seller: "Trendy Touch",
        image:
          "https://i.ibb.co.com/wntggf5/IMG-20260906-WA0008-1.jpg",
        description:
          "A classic boutique dress designed for an elegant and effortless everyday look.",
      },
      
    ],
  },

  {
    id: 2,
    title: "What everyone is loving this season",
    tag: "Trending Now",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
    description:
      "Explore the styles everyone is loving this season, featuring unique and beautiful pieces from our curated boutique sellers.",
    products: [
      {
        id: 5,
        name: "Seasonal Statement Dress",
        price: "৳2,100",
        seller: "Urban Belle",
        image:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=700&auto=format&fit=crop",
        description:
          "A statement dress inspired by this season's most-loved boutique fashion trends.",
      },
      {
        id: 6,
        name: "Modern Boutique Wear",
        price: "৳2,350",
        seller: "Lumi Fashion",
        image:
          "https://images.unsplash.com/photo-1506629905607-d9b1e5f5b8f8?q=80&w=700&auto=format&fit=crop",
        description:
          "Modern boutique wear designed to bring a polished and contemporary feel to your wardrobe.",
      },
      {
        id: 7,
        name: "Classic Seasonal Look",
        price: "৳1,800",
        seller: "Belle Studio",
        image:
          "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=700&auto=format&fit=crop",
        description:
          "A classic seasonal piece that blends timeless style with a fresh boutique aesthetic.",
      },
      {
        id: 8,
        name: "Elegant Weekend Wear",
        price: "৳2,000",
        seller: "Maison Boutique",
        image:
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=700&auto=format&fit=crop",
        description:
          "Elegant and relaxed weekend wear created for a stylish and comfortable look.",
      },
    ],
  },

  {
    id: 3,
    title: "Elegant modest wear with contemporary design",
    tag: "Modest Fashion",
    image:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1200&auto=format&fit=crop",
    description:
      "Elegant modest fashion combined with contemporary design, bringing together refined pieces for a sophisticated everyday look.",
    products: [
      {
        id: 9,
        name: "Elegant Modest Dress",
        price: "৳2,400",
        seller: "Modest Muse",
        image:
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=700&auto=format&fit=crop",
        description:
          "An elegant modest dress combining refined styling with a sophisticated contemporary feel.",
      },
      {
        id: 10,
        name: "Minimal Modest Wear",
        price: "৳2,150",
        seller: "Tanlia Boutique",
        image:
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=700&auto=format&fit=crop",
        description:
          "Minimal modest wear with a clean and refined design, perfect for an effortless everyday style.",
      },
      {
        id: 11,
        name: "Contemporary Abaya Style",
        price: "৳2,600",
        seller: "Maison Boutique",
        image:
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=700&auto=format&fit=crop",
        description:
          "A contemporary abaya-inspired style combining modest fashion with modern design details.",
      },
      {
        id: 12,
        name: "Refined Everyday Modest Look",
        price: "৳1,950",
        seller: "Belle Studio",
        image:
          "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=700&auto=format&fit=crop",
        description:
          "A refined modest look designed for comfortable, elegant and versatile everyday styling.",
      },
    ],
  },
];

const getCollectionSlug = (tag) => {
  return tag.toLowerCase().replace(/\s+/g, "-");
};

const CollectionsPage = () => {
  const { collectionName } = useParams();
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  if (!collectionName) {
    return (
      <section className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[3px] text-gray-500 mb-3">
              Tanlia Studio
            </p>

            <h1 className="text-4xl md:text-5xl font-serif">
              Our Collections
            </h1>

            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Explore our thoughtfully curated collections from independent
              boutique sellers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${getCollectionSlug(collection.tag)}`}
                className="group"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">

                  <div className="h-80 overflow-hidden bg-gray-100">
                    <img
                      src={collection.image}
                      alt={collection.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[2px] text-gray-500 mb-2">
                      {collection.tag}
                    </p>

                    <h2 className="text-2xl font-serif">
                      {collection.title}
                    </h2>

                    <p className="text-gray-500 text-sm mt-2">
                      {collection.description}
                    </p>

                    <p className="mt-4 text-sm underline underline-offset-4">
                      Explore Collection
                    </p>
                  </div>

                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>
    );
  }

  const collection = collections.find(
    (item) => getCollectionSlug(item.tag) === collectionName
  );

  if (!collection) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">

          <h1 className="text-4xl font-serif mb-4">
            Collection Not Found
          </h1>

          <p className="text-gray-500 mb-6">
            Sorry, the collection you are looking for does not exist.
          </p>

          <Link
            to="/collections"
            className="inline-block bg-black text-white px-6 py-3 rounded"
          >
            Back to Collections
          </Link>

        </div>
      </section>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">

          <div className="mb-10">

            <Link
              to="/collections"
              className="text-sm text-gray-500 hover:text-black transition"
            >
              ← Back to Collections
            </Link>

            <p className="text-sm uppercase tracking-[3px] text-gray-500 mt-8 mb-3">
              Tanlia Studio
            </p>

            <h1 className="text-4xl md:text-5xl font-serif">
              {collection.tag}
            </h1>

            <p className="text-gray-500 mt-3 max-w-xl">
              {collection.description}
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

            {collection.products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
              >

                {/* Image + Hover Button */}
                <div
                  className="relative h-80 overflow-hidden bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 flex items-end justify-center pb-5">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`${product.name} added to cart!`);
                      }}
                      className="opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 bg-white text-black px-6 py-3 rounded-md text-sm font-semibold shadow-lg"
                    >
                      Add to Cart
                    </button>

                  </div>
                </div>

                {/* Product Info - BELOW IMAGE */}
                <div className="p-4">

                  <p className="text-xs text-gray-500 mb-1">
                    {product.seller}
                  </p>

                  <h3 className="font-medium text-gray-800 line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-3">
                    <span className="font-semibold">
                      {product.price}
                    </span>
                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* Product Description Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white max-w-md w-full rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="relative h-72">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />

              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-white rounded-full w-9 h-9 shadow flex items-center justify-center text-gray-700 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="p-6">

              <p className="text-xs uppercase tracking-[2px] text-gray-500">
                {selectedProduct.seller}
              </p>

              <h2 className="text-2xl font-serif mt-2">
                {selectedProduct.name}
              </h2>

              <p className="font-semibold text-lg mt-3">
                {selectedProduct.price}
              </p>

              <p className="text-gray-600 text-sm leading-6 mt-4">
                {selectedProduct.description}
              </p>

              <button
                onClick={() => {
                  alert(`${selectedProduct.name} added to cart!`);
                  setSelectedProduct(null);
                }}
                className="w-full mt-6 bg-black text-white py-3 rounded-md text-sm font-semibold hover:bg-gray-800 transition"
              >
                Add to Cart
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default CollectionsPage;