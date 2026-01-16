"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import ProductCard1 from "../productCards/ProductCard1";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/categories`);
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesRes.json();

        const subcategoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subCategory/`);
        if (!subcategoriesRes.ok) throw new Error('Failed to fetch subcategories');
        const subcategoriesData = await subcategoriesRes.json();

        const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`);
        if (!productsRes.ok) throw new Error('Failed to fetch products');
        const productsData = await productsRes.json();

        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }

        if (subcategoriesData.success) {
          setSubcategories(subcategoriesData.data);
        }

        if (productsData.success) {
          setFeaturedProducts(productsData.products.slice(0, 9));
        }
      } catch (error) {
        console.error('Error fetching nav data:', error);
        setCategories([]);
        setSubcategories([]);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('nav-ready'));
        }
      }
    };

    fetchNavData();
  }, []);

  const checkActive = (slug) => pathname.includes(slug);

  const getSubcategoriesForCategory = (categoryId) => {
    return subcategories.filter(sub => sub.category?._id === categoryId || sub.category === categoryId);
  };

  const renderMegaMenu = (category) => {
    if (!category) return null;

    const categorySubcategories = getSubcategoriesForCategory(category._id);
    const categoryProducts = featuredProducts.filter(p =>
      p.category?.slug === category.slug || p.category?._id === category._id
    ).slice(0, 3);

    return (
      <div className="westelm-mega-menu">
        <div className="westelm-mega-container">
          <div className="westelm-mega-content">
            {/* Subcategories Column */}
            <div className="westelm-mega-column">
              <h3 className="westelm-mega-heading">{category.name}</h3>
              <ul className="westelm-mega-list">
                {categorySubcategories.map((subcat, index) => (
                  <li key={index} className="westelm-mega-list-item">
                    <Link
                      href={`/shop/${(category.slug || category.name?.toLowerCase())}/${(subcat.slug || subcat.name?.toLowerCase())}`}
                      className={`westelm-mega-link ${pathname.includes(subcat.slug) ? "active" : ""}`}
                    >
                      {subcat.name}
                    </Link>
                  </li>
                ))}
                <li className="westelm-mega-list-item westelm-view-all">
                  <Link
                    href={`/shop/${(category.slug || category.name?.toLowerCase())}`}
                    className="westelm-mega-link-bold"
                  >
                    View All {category.name} →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Featured Products Column */}
            {categoryProducts.length > 0 && (
              <div className="westelm-mega-products">
                <h3 className="westelm-mega-heading">Featured</h3>
                <div className="westelm-products-grid">
                  {categoryProducts.map((product, i) => (
                    <div key={i} className="westelm-product-item">
                      {/* <ProductCard1 product={{ ...product, colors: null }} /> */}
                      product name
                    </div>
                  ))}
                </div>
              </div>
            )}
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

        .westelm-product-item {
          min-width: 0;
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

        {categories.map((category, index) => {
          const hasSubcategories = getSubcategoriesForCategory(category._id).length > 0;
          const isActive = checkActive(category.slug);

          return (
            <li
              key={category._id || index}
              className={`westelm-nav-item ${isActive ? "active" : ""}`}
            >
              <Link
                href={`/shop/${(category.slug || category.name?.toLowerCase())}`}
                className="westelm-nav-link"
              >
                {category.name}
              </Link>
              {hasSubcategories && renderMegaMenu(category)}
            </li>
          );
        })}
      </ul>
    </>
  );
}