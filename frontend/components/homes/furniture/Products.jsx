"use client";
import ProductCard1 from "@/components/productCards/ProductCard1";
import { products12 } from "@/data/products";
import React, { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";

const tabItems = ["New Arrivals", "Best Seller", "On Sale"];
export default function Products() {
  const [activeItem, setActiveItem] = useState(tabItems[0]); 
  const [selectedItems, setSelectedItems] = useState([]);
  
  useEffect(() => {
    document.getElementById("newArrivals").classList.remove("filtered");
    setTimeout(() => {
      setSelectedItems(
        products12.filter((elm) => elm.tabFilterOptions.includes(activeItem))
      );
      document.getElementById("newArrivals").classList.add("filtered");
    }, 300);
  }, [activeItem]);

  return (
    <section className="flat-spacing pt-30">
      <div className="flat-animate-tab">
       
        {/* Tab Headers: Perfectly centered by 'justify-content-sm-center' */}
        <div className="container">
          <ul
            className="tab-product justify-content-sm-center wow fadeInUp"
            data-wow-delay="0s"
          >
            {tabItems.map((item) => (
              <li key={item} className="nav-tab-item" role="presentation">
                {/* ... tab links ... */}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="tab-content">
          <div
            className="tab-pane active show tabFilter filtered margin-30"
            id="newArrivals"
            role="tabpanel"
          >
            {/* The outer container handles the overall alignment and margin. */}
            <div className="container"> 
              
              {/* === KEY CHANGE: Add justify-content-center to center the grid items. === 
                   This requires the 'tf-grid-layout' to be a Flexbox or CSS Grid container.
                   We also remove the unused/non-standard 'tf-row-3' classes.
              */}
              <div className="tf-grid-layout tf-col-3 lg-col-3 xl-col-3 justify-content-center">
                {selectedItems.slice(0, 9).map((product, i) => (
                  <ProductCard1
                    key={i}
                    product={product}
                    imageWidth={476}
                    imageHeight={317}
                    isNotImageRatio={true}
                  />
                ))}
              </div>
            </div>
            
            {/* Button: Centered by 'text-center' */}
            <div className="sec-btn text-center container">
              <Link href={`/shop-default-grid`} className="btn-line">
                View All Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}