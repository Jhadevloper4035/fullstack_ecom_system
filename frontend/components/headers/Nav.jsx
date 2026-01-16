"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const checkActive = (slug) => pathname.includes(slug);

  // Hardcoded navigation data
  const navigationData = [
    {
      name: "Furniture",
      slug: "furniture",
      subcategories: [
        { name: "Sofas & Sectionals", slug: "sofas-sectionals" },
        { name: "Beds & Headboards", slug: "beds-headboards" },
        { name: "Dining Tables", slug: "dining-tables" },
        { name: "Chairs & Seating", slug: "chairs-seating" },
        { name: "Storage & Organization", slug: "storage-organization" },
        { name: "Desks & Office", slug: "desks-office" },
      ]
    },
    {
      name: "Lighting",
      slug: "lighting",
      subcategories: [
        { name: "Ceiling Lights", slug: "ceiling-lights" },
        { name: "Table Lamps", slug: "table-lamps" },
        { name: "Floor Lamps", slug: "floor-lamps" },
        { name: "Wall Sconces", slug: "wall-sconces" },
        { name: "Pendant Lights", slug: "pendant-lights" },
      ]
    },
    {
      name: "Decor",
      slug: "decor",
      subcategories: [
        { name: "Wall Art", slug: "wall-art" },
        { name: "Mirrors", slug: "mirrors" },
        { name: "Vases & Planters", slug: "vases-planters" },
        { name: "Decorative Objects", slug: "decorative-objects" },
        { name: "Candles & Diffusers", slug: "candles-diffusers" },
      ]
    },
    {
      name: "Bedding",
      slug: "bedding",
      subcategories: [
        { name: "Duvet Covers", slug: "duvet-covers" },
        { name: "Sheet Sets", slug: "sheet-sets" },
        { name: "Pillows", slug: "pillows" },
        { name: "Blankets & Throws", slug: "blankets-throws" },
        { name: "Quilts & Coverlets", slug: "quilts-coverlets" },
      ]
    },
    {
      name: "Bath",
      slug: "bath",
      subcategories: [
        { name: "Towels", slug: "towels" },
        { name: "Bath Rugs", slug: "bath-rugs" },
        { name: "Shower Curtains", slug: "shower-curtains" },
        { name: "Bath Accessories", slug: "bath-accessories" },
      ]
    },
    {
      name: "Rugs",
      slug: "rugs",
      subcategories: [
        { name: "Area Rugs", slug: "area-rugs" },
        { name: "Runner Rugs", slug: "runner-rugs" },
        { name: "Outdoor Rugs", slug: "outdoor-rugs" },
        { name: "Rug Pads", slug: "rug-pads" },
      ]
    },
  ];

  const renderMegaMenu = (category) => {
    return (
      <div className="westelm-mega-menu">
        <div className="westelm-mega-container">
          <div className="westelm-mega-content">
            {/* Subcategories Column */}
            <div className="westelm-mega-column">
              <h3 className="westelm-mega-heading">{category.name}</h3>
              <ul className="westelm-mega-list">
                {category.subcategories.map((subcat, index) => (
                  <li key={index} className="westelm-mega-list-item">
                    <Link
                      href={`/shop/${category.slug}/${subcat.slug}`}
                      className={`westelm-mega-link ${pathname.includes(subcat.slug) ? "active" : ""}`}
                    >
                      {subcat.name}
                    </Link>
                  </li>
                ))}
                <li className="westelm-mega-list-item westelm-view-all">
                  <Link
                    href={`/shop/${category.slug}`}
                    className="westelm-mega-link-bold"
                  >
                    View All {category.name} →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Featured Products Column - Placeholder */}
            <div className="westelm-mega-products">
              <h3 className="westelm-mega-heading">Featured</h3>
              <div className="westelm-products-grid">
                <div className="westelm-product-placeholder">
                  <div className="placeholder-image"></div>
                  <p className="placeholder-text">Featured Product 1</p>
                </div>
                <div className="westelm-product-placeholder">
                  <div className="placeholder-image"></div>
                  <p className="placeholder-text">Featured Product 2</p>
                </div>
                <div className="westelm-product-placeholder">
                  <div className="placeholder-image"></div>
                  <p className="placeholder-text">Featured Product 3</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style jsx global>{`
        /* West Elm Style Navigation */
        .westelm-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          background: #ffffff;
          padding: 0;
          margin: 0;
          list-style: none;
          border-top: 1px solid #e5e5e5;
          border-bottom: 1px solid #e5e5e5;
        }

        .westelm-nav-item {
          position: relative;
          margin: 0;
          padding: 0;
        }

        .westelm-nav-link {
          display: block;
          padding: 16px 20px;
          color: #2c2c2c;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          transition: color 0.2s ease;
          white-space: nowrap;
        }

        .westelm-nav-link:hover {
          color: #000000;
          background-color: #f8f8f8;
        }

        .westelm-nav-item.active .westelm-nav-link {
          color: #000000;
          font-weight: 600;
          border-bottom: 2px solid #000000;
        }

        /* Mega Menu Styles */
        .westelm-mega-menu {
          position: fixed;
          top: auto;
          left: 0;
          right: 0;
          width: 100vw;
          background: #ffffff;
          border-top: 1px solid #e5e5e5;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          z-index: 1000;
          max-height: 0;
          overflow: hidden;
        }

        .westelm-nav-item:hover .westelm-mega-menu {
          opacity: 1;
          visibility: visible;
          max-height: 600px;
        }

        .westelm-mega-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 60px;
        }

        .westelm-mega-content {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 60px;
        }

        .westelm-mega-column {
          min-width: 0;
        }

        .westelm-mega-heading {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #2c2c2c;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e5e5e5;
        }

        .westelm-mega-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .westelm-mega-list-item {
          margin-bottom: 12px;
        }

        .westelm-mega-link {
          color: #666666;
          text-decoration: none;
          font-size: 14px;
          line-height: 1.6;
          transition: color 0.2s ease;
          display: block;
        }

        .westelm-mega-link:hover {
          color: #000000;
        }

        .westelm-mega-link.active {
          color: #000000;
          font-weight: 600;
        }

        .westelm-mega-link-bold {
          color: #2c2c2c;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: color 0.2s ease;
          display: inline-block;
        }

        .westelm-mega-link-bold:hover {
          color: #000000;
        }

        .westelm-view-all {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #e5e5e5;
        }

        .westelm-mega-products {
          min-width: 0;
        }

        .westelm-products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .westelm-product-placeholder {
          text-align: center;
        }

        .placeholder-image {
          width: 100%;
          aspect-ratio: 3/4;
          background: #f5f5f5;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .placeholder-text {
          font-size: 13px;
          color: #666;
          margin: 0;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .westelm-mega-content {
            grid-template-columns: 240px 1fr;
            gap: 40px;
          }

          .westelm-products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }

          .westelm-mega-container {
            padding: 30px 40px;
          }
        }

        @media (max-width: 768px) {
          .westelm-nav {
            overflow-x: auto;
            justify-content: flex-start;
            -webkit-overflow-scrolling: touch;
          }

          .westelm-nav-link {
            padding: 14px 16px;
            font-size: 13px;
          }

          .westelm-mega-content {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .westelm-products-grid {
            grid-template-columns: 1fr;
          }

          .westelm-mega-container {
            padding: 20px;
          }
        }
      `}</style>

      <ul className="westelm-nav">
        <li className={`westelm-nav-item ${pathname === "/" ? "active" : ""}`}>
          <Link href="/" className="westelm-nav-link">
            Home
          </Link>
        </li>

        {navigationData.map((category, index) => {
          const isActive = checkActive(category.slug);

          return (
            <li
              key={index}
              className={`westelm-nav-item ${isActive ? "active" : ""}`}
            >
              <Link
                href={`/shop/${category.slug}`}
                className="westelm-nav-link"
              >
                {category.name}
              </Link>
              {renderMegaMenu(category)}
            </li>
          );
        })}

        <li className={`westelm-nav-item ${pathname === "/sale" ? "active" : ""}`}>
          <Link href="/sale" className="westelm-nav-link">
            Sale
          </Link>
        </li>
      </ul>
    </>
  );
}