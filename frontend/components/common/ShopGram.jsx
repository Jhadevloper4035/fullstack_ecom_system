"use client";
import { products2 } from "@/data/products";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Pagination } from "swiper/modules";
export default function ShopGram({ parentClass = "" }) {
  const [igMedia, setIgMedia] = useState([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/instagram?limit=10", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const items = Array.isArray(data?.data) ? data.data : [];
        const normalized = items
          .map((m) => ({
            id: m.id,
            href: m.permalink,
            img: m.thumbnail_url || m.media_url,
            type: m.media_type,
          }))
          .filter((m) => !!m.img && !!m.href);
        if (isMounted) setIgMedia(normalized);
      } catch (_) {}
    })();
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <section className={parentClass}>
      <div className="container">
        <div className="heading-section text-center">
          <h3 className="heading wow fadeInUp">Shop Instagram</h3>
          <p className="subheading text-secondary wow fadeInUp">
            Elevate your wardrobe with fresh finds today!
          </p>
        </div>
        <Swiper
          dir="ltr"
          className="swiper tf-sw-shop-gallery"
          spaceBetween={10}
          breakpoints={{
            1200: { slidesPerView: 5 },
            768: { slidesPerView: 3 },
            0: { slidesPerView: 2 },
          }}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spb222",
          }}
        >
          {(igMedia.length ? igMedia.slice(0, 10) : products2.slice(0, 5)).map(
            (item, i) => (
              <SwiperSlide key={item.id ?? i}>
                <div
                  className="gallery-item hover-overlay hover-img wow fadeInUp"
                  data-wow-delay={`${(i % 6) * 0.1}s`}
                >
                  <div className="img-style">
                    <Image
                      className="lazyload img-hover"
                      data-src={igMedia.length ? item.img : item.imgSrc}
                      alt="image-gallery"
                      src={igMedia.length ? item.img : item.imgSrc}
                      width={640}
                      height={640}
                    />
                  </div>
                  {igMedia.length ? (
                    <Link
                      href={item.href}
                      className="box-icon hover-tooltip"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="icon icon-eye" />
                      <span className="tooltip">View on Instagram</span>
                    </Link>
                  ) : (
                    <Link
                      href={`/product-detail/${item.id}`}
                      className="box-icon hover-tooltip"
                    >
                      <span className="icon icon-eye" />
                      <span className="tooltip">View Product</span>
                    </Link>
                  )}
                </div>
              </SwiperSlide>
            )
          )}
          <div className="sw-pagination-gallery sw-dots type-circle justify-content-center spb222"></div>
        </Swiper>
      </div>
    </section>
  );
}
