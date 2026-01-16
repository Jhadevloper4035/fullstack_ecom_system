"use client";
import { collectionItems2 } from "@/data/collections";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
export default function Collections({ parentClass = "" }) {
  return (
    <section className={` ${parentClass}`}>
      <div className="container-full">
        <div
          className="heading-section-2 wow fadeInUp text-center" style={{ visibility: "visible", animationName: "fadeInUp", justifyContent: "center", width: "100%" }}>
          <h3>Top Collections</h3>
          {/* <a className="btn-line" href="/">
            View All Collections</a> */}
        </div>

        <Swiper
          dir="ltr"
          // UPDATED: slidesPerView changed to 4
          slidesPerView={4}
          spaceBetween={30}
          breakpoints={{
            // UPDATED: Added 1200px breakpoint for 4 slides
            1200: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            576: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            0: {
              slidesPerView: 1,
              spaceBetween: 12,
            }
          }}
          className="swiper tf-sw-collection"
        >
          {collectionItems2.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="collection-position style-lg hover-img">
                <a className="" style={{ position: 'relative', display: "block", }}>
                  <Image
                    className="lazyload"
                    data-src={item.imgSrc}
                    alt={item.alt}
                    src={item.imgSrc}
                    width={900}
                    height={900}
                  />
                </a>
                <div className="content" style={{ marginTop: "15px", position: "relative", transform: "none", top: "auto", left: "auto", right: "auto", textAlign: "left" }}>
                  <h3 className="title wow fadeInUp">
                    <Link href={`/`} className="link text-main" style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "10px", fontSize: "14px" }}>
                      {item.title}
                      <i className="icon icon-arrow-right" style={{ fontSize: "14px" }} />
                    </Link>
                  </h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
