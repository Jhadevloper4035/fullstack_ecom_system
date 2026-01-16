"use client";
import axios from "axios";
import ProductCard1 from "@/components/productCards/ProductCard1";
import React, { useState, useEffect } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Products4({ parentClass = "", items }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product`);
        if (response.data.success) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error('Error fetching products in Products4:', error);
      }
    };

    if (!items) {
      fetchProducts();
    }
  }, [items]);

  const data = items && items.length ? items : products.slice(0, 4);
  return (
    <section className={parentClass}>
      <div className="container">
        <div className="heading-section text-center wow fadeInUp">
          <h3 className="heading">Today's Top Picks</h3>
          <p className="subheading text-secondary">
            Fresh styles just in! Elevate your look.
          </p>
        </div>
        <Swiper
          className="swiper tf-sw-latest"
          dir="ltr"
          spaceBetween={24}
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 32 },
            1200: { slidesPerView: 3, spaceBetween: 32 },
          }}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spd5",
          }}
        >
          {data.map((product, i) => (
            <SwiperSlide key={i} className="swiper-slide">
              <ProductCard1 product={product} imageFit="cover" aspectRatio="1/1.4" />
            </SwiperSlide>
          ))}

          <div className="sw-pagination-latest spd5 sw-dots type-circle justify-content-center" />
        </Swiper>
      </div>
    </section>
  );
}
