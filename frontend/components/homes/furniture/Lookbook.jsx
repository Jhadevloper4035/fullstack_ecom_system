"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import LookbookProduct from "@/components/common/LookbookProduct";
import { lookbookProducts } from "@/data/products";
export default function Lookbook() {
  useEffect(() => {
    const customDropdown = () => {
      const updateDropdownClass = () => {
        const dropdowns = document.querySelectorAll(".dropdown-custom");

        dropdowns.forEach((dropdown) => {
          if (window.innerWidth <= 991) {
            dropdown.classList.add("dropup");
            dropdown.classList.remove("dropend");
          } else {
            dropdown.classList.add("dropend");
            dropdown.classList.remove("dropup");
          }
        });
      };

      updateDropdownClass();
      window.addEventListener("resize", updateDropdownClass);

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener("resize", updateDropdownClass);
      };
    };

    customDropdown();
  }, []);
  return (
    <section className="banner-lookbook" style={{ position: 'relative' }}> {/* KEY CHANGE: Parent for absolute positioning */}
      <Image
        className="lazyload"
        data-src="/images/banner/banner-lb-furniture2.png"
        alt="banner"
        src="/images/banner/banner-lb-furniture2.png"
        width={1920}
        height={600}
        style={{ width: '100%', height: 'auto', display: 'block' }} // Added for better image display
      />

      {/* Lookbook Item 1: Example - Top-Left */}
      <div className="lookbook-item" style={{ position: 'absolute'   }}>
        <div className="dropdown dropup-center dropdown-custom">
          <div
            role="dialog"
            className="tf-pin-btn"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span />
          </div>
          <div className="dropdown-menu">
            <LookbookProduct product={lookbookProducts[7]} />
          </div>
        </div>
      </div>

      {/* Lookbook Item 2: Example - Mid-Right */}
      <div className="lookbook-item" style={{ position: 'absolute' ,left:'15%' ,transform:'translateX(-50%)'}}>
        <div className="dropdown dropup-center dropdown-custom">
          <div
            role="dialog"
            className="tf-pin-btn"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span />
          </div>
          <div className="dropdown-menu">
            <LookbookProduct product={lookbookProducts[8]} />
          </div>
        </div>
      </div>

      
      <div className="lookbook-item" style={{ position: 'absolute',top:'56%', left: '50%', transform: 'translateX(-50%)' }}>
        <div className="dropdown dropup-center dropdown-custom">
          <div
            role="dialog"
            className="tf-pin-btn"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span />
          </div>
          <div className="dropdown-menu">
            <LookbookProduct product={lookbookProducts[9]} />
          </div>
        </div>
      </div>
      <div className="lookbook-item" style={{ position: 'absolute',left:'15%',top:'25%' }}>
        <div className="dropdown dropup-center dropdown-custom">
          <div
            role="dialog"
            className="tf-pin-btn"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span />
          </div>
          <div className="dropdown-menu">
            <LookbookProduct product={lookbookProducts[10]} />
          </div>
        </div>
      </div>
      {/* You can add more lookbook-item divs here with unique positions */}

    </section>
  );
}