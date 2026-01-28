"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { products } from "@/data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard1 from "../productCards/ProductCard1";
import {
  blogLinks,
  demoItems,
  otherPageLinks,
  otherShopMenus,
  productFeatures,
  productLinks,
  productStyles,
  shopFeatures,
  shopLayout,
  swatchLinks,
} from "@/data/menu";
import { usePathname } from "next/navigation";
export default function Nav() {
  const pathname = usePathname();
  return (
    <>
      {" "}
   
      <li className="menu-item">
        <a href="/" className="item-link">
          Home
        </a>
      </li>
      <li className="menu-item">
        <a href="/myshop" className="item-link">
          Sofa
        </a>
      </li>
      <li className="menu-item">
        <a href="/myshop" className="item-link">
          Coffee Table 
        </a>
      </li>
      <li className="menu-item">
        <a href="/myshop" className="item-link">
          Console Table
        </a>
      </li>
      <li className="menu-item">
        <a href="/myshop" className="item-link">
          Nester Table
        </a>
      </li>
      <li className="menu-item">
        <a href="/myshop" className="item-link">
          Ottoman
        </a>
      </li>
      <li className="menu-item">
        <a href="/myshop" className="item-link">
          Wall Decore
        </a>
      </li>
    </>
  );
}
