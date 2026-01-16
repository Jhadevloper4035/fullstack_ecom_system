"use client";

import { sliderData3 } from "@/data/heroSlides";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="tf-slideshow slider-default slider-position slider-effect-fade">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={800}
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        modules={[Pagination, Navigation, Autoplay]}
        pagination={{
          clickable: true,
          el: ".spd51",
          dynamicBullets: true,
        }}
        navigation={!isMobile && {
          prevEl: ".snbp11",
          nextEl: ".snbn11",
        }}
        className="swiper tf-sw-slideshow"
      >
        {sliderData3.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="wrap-slider position-relative">
              <div className="slider-image-container">
                <Image
                  alt="furniture-slideshow"
                  src={slide.imgSrc}
                  fill
                  sizes="100vw"
                  className="slider-image"
                  priority={index === 0}
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center center'
                  }}
                />
              </div>
              {/* overlay for better text readability */}
              <div className="slider-overlay" />
              
              <div className="box-content">
                <div className="content-slider container">
                  <div className="box-title-slider text-center text-md-start">
                    <h1 className="fade-item fade-item-1 heading text-white mb-2 mb-md-3">
                      {slide.title}
                    </h1>
                    <p className="fade-item fade-item-2 body-text-1 text-white mb-3 mb-md-4">
                      {slide.description}
                    </p>
                  </div>
                  <div className="fade-item fade-item-3 box-btn-slider text-center text-md-start">
                    <Link
                      href={`/shop-default-grid`}
                      className="tf-btn btn-fill btn-white"
                      style={{
                        minWidth: '200px',
                        padding: '12px 24px',
                        fontSize: '16px',
                        fontWeight: '500'
                      }}
                    >
                      <span className="text">Explore Collection</span>
                      <i className="icon icon-arrowUpRight" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <div className="wrap-pagination">
        <div className="container">
          <div className="sw-dots sw-pagination-slider type-circle white-circle-line justify-content-center spd51" />
        </div>
      </div>
      
      {!isMobile && (
        <>
          <div className="navigation-prev-slider nav-sw nav-sw-left lg snbp11">
            <i className="icon icon-arrLeft" />
          </div>
          <div className="navigation-next-slider nav-sw nav-sw-right lg snbn11">
            <i className="icon icon-arrRight" />
          </div>
        </>
      )}
      
      <style jsx global>{`
        /* Base slider styles */
        .tf-slideshow {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        
        .wrap-slider {
          position: relative;
          width: 100%;
          height: 70vh;
          min-height: 500px;
          max-height: 800px;
        }
        
        .slider-image-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .slider-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom, 
            rgba(0,0,0,0.4) 0%, 
            rgba(0,0,0,0.2) 50%, 
            rgba(0,0,0,0.4) 100%
          );
          z-index: 1;
          pointer-events: none;
        }
        
        .box-content {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          z-index: 2;
          padding: 2rem;
        }
        
        .content-slider {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .box-title-slider h1 {
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .box-title-slider p {
          font-size: 1.25rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 600px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        
        /* Responsive adjustments */
        @media (max-width: 1199.98px) {
          .box-title-slider h1 {
            font-size: 3rem;
          }
          
          .box-title-slider p {
            font-size: 1.1rem;
          }
        }
        
        @media (max-width: 991.98px) {
          .wrap-slider {
            height: 60vh;
            min-height: 450px;
          }
          
          .box-title-slider h1 {
            font-size: 2.5rem;
          }
          
          .content-slider {
            padding: 1.5rem;
          }
        }
        
        @media (max-width: 767.98px) {
          .wrap-slider {
            height: 50vh;
            min-height: 400px;
          }
          
          .box-content {
            padding: 1rem;
            text-align: center;
            justify-content: center;
          }
          
          .content-slider {
            padding: 1rem;
          }
          
          .box-title-slider h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
          
          .box-title-slider p {
            font-size: 1rem;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 1.5rem;
          }
          
          .box-btn-slider {
            display: flex;
            justify-content: center;
          }
        }
        
        @media (max-width: 575.98px) {
          .wrap-slider {
            height: 45vh;
            min-height: 350px;
          }
          
          .box-title-slider h1 {
            font-size: 1.75rem;
          }
          
          .box-title-slider p {
            font-size: 0.95rem;
            margin-bottom: 1.25rem;
          }
          
          .tf-btn {
            padding: 0.5rem 1.25rem;
            font-size: 0.9rem;
          }
        }
        
        /* Animation for slide content */
        .fade-item {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease-out;
        }
        
        .swiper-slide-active .fade-item-1 {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.3s;
        }
        
        .swiper-slide-active .fade-item-2 {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.5s;
        }
        
        .swiper-slide-active .fade-item-3 {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.7s;
        }
      `}</style>
    </div>
  );
}
