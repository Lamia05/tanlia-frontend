import { createBrowserRouter } from "react-router-dom";

import Layout from "../component/Layouts";

import Home from "../pages/Home";
import AllProducts from "../pages/AllProducts";
import ProductDetails from "../pages/ProductDetails";
import Sellers from "../pages/Sellers";
import CollectionsPage from "../pages/CollectionsPage";
import OurStory from "../pages/OurStory";
import Contact from "../pages/Contact";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import Checkout from "../pages/Checkout";
import SellerOrders from "../pages/SellerOrders";
import SellerLogin from "../pages/SellerLogin";
import TrackOrder from "../pages/TrackOrder";
import MyOrders from "../pages/MyOrders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,

    children: [
      // Home
      {
        index: true,
        element: <Home />,
      },

      // All Products
      {
        path: "products",
        element: <AllProducts />,
      },

      // Product Details
      {
        path: "products/:id",
        element: <ProductDetails />,
      },

      // Sellers
      {
        path: "sellers",
        element: <Sellers />,
      },
      {
        path: "sellers/:sellerName",
        element: <Sellers />,
      },

      // Seller Login
      {
        path: "seller-login",
        element: <SellerLogin />,
      },

      // Seller Dashboard
      {
        path: "seller-dashboard",
        element: <SellerOrders />,
      },

      // Collections
      {
        path: "collections",
        element: <CollectionsPage />,
      },
      {
        path: "collections/:collectionName",
        element: <CollectionsPage />,
      },

      // About
      {
        path: "about",
        element: <OurStory />,
      },

      // Contact
      {
        path: "contact",
        element: <Contact />,
      },

      // Cart
      {
        path: "cart",
        element: <Cart />,
      },

      // Wishlist
      {
        path: "wishlist",
        element: <Wishlist />,
      },

      // Checkout
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "track-order",
        element: <TrackOrder/>,
      },
      {
        path: "my-orders",
        element: <MyOrders/>,
      },
    ],
  },
]);

export default router;