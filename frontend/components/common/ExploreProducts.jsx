"use client";
import React, { useState, useEffect } from 'react';
import ProductCard1 from '@/components/productCards/ProductCard1';
import Link from 'next/link';

const ExploreProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`);
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products.slice(0, 6);

  return (
    <section className="explore-products py-5 bg-white">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="heading">Explore Our Products</h2>
          <p className="subheading text-secondary">Discover our curated collection of premium products</p>
        </div>

        <div className="row g-4">
          {featuredProducts.map((product, index) => (
            <div key={index} className="col-12 col-sm-6 col-lg-4">
              <ProductCard1
                product={product}
                parentClass="card-product"
                imageWidth={400}
                imageHeight={500}
                imageFit="cover"
              />
            </div>
          ))}
        </div>

        <div className="sec-btn text-center container">
          <Link href={`/shop-default-grid`} className="btn-line">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExploreProducts;
