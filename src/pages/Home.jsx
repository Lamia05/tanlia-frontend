
import React from 'react';
import FeaturedProducts from '../component/FeaturedProducts';
import FeaturedThisWeek from '../component/FeaturedThisWeek';
import FeaturedSellers from '../component/FeaturedSellers';
import WhyShopWithUs from '../component/ShopWithUs';
import InstagramFeed from '../component/InstagramFeed';
import Hero from '../component/Hero';

const Home = () => {
  return (
    <>
      <Hero></Hero>
      <FeaturedThisWeek></FeaturedThisWeek>
      <FeaturedProducts></FeaturedProducts>
      <FeaturedSellers></FeaturedSellers>
      <WhyShopWithUs></WhyShopWithUs>
      <InstagramFeed></InstagramFeed>
    </>
  );
};

export default Home;
