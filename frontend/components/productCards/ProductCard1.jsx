"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "../common/Countdown";
import { useContextElement } from "@/context/Context";

export default function ProductCard1({
  product,
  gridClass = "",
  parentClass = "card-product wow fadeInUp",
  isNotImageRatio = false,
  radiusClass = "",
}) {
  const [currentImage, setCurrentImage] = useState(product.imgSrc);

  const {
    setQuickAddItem,
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
    setQuickViewItem,
    addProductToCart,
    isAddedToCartProducts,
  } = useContextElement();

  useEffect(() => {
    setCurrentImage(product.imgSrc);
    console.log("Product image source:", product.imgSrc);
  }, [product]);

  return (
    <div
      className={`${parentClass} ${gridClass} ${
        product.isOnSale ? "on-sale" : ""
      } ${product.sizes ? "card-product-size" : ""}`}
    >
      <div
        className={`card-product-wrapper ${
          isNotImageRatio ? "aspect-ratio-0" : ""
        } ${radiusClass}`}
      >
        <Link
          href={`/product-detail/${product.id}`}
          className="product-img"
        >
          <Image
            className="lazyload img-product"
            src={`https://rantechnology.in/curve-&-comfort/products/${product.imgSrc}`}
            alt={product.title}
            width={600}
            height={800}
          />
{/* 
          <Image
            className="lazyload img-hover"
            src={getImageUrl(product.imgHover)}
            alt={product.title}
            width={600}
            height={800}
          /> */}
        </Link>

        {product.hotSale && (
          <div className="marquee-product bg-main">
            <div className="marquee-wrapper">
              <div className="initial-child-container">
                {Array.from({ length: 5 }).map((_, i) => (
                  <React.Fragment key={i}>
                    <div className="marquee-child-item">
                      <p className="font-2 text-btn-uppercase fw-6 text-white">
                        Hot Sale 25% OFF
                      </p>
                    </div>
                    <div className="marquee-child-item">
                      <span className="icon icon-lightning text-critical" />
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* {product.isOnSale && (
          <div className="on-sale-wrap">
            <span className="on-sale-item">
              -{product.salePercentage}
            </span>
          </div>
        )} */}

        {product.sizes && (
          <div className="variant-wrap size-list">
            <ul className="variant-box">
              {product.sizes.map((size) => (
                <li key={size} className="size-item">
                  {size}
                </li>
              ))}
            </ul>
          </div>
        )}

        {product.countdown && (
          <div className="variant-wrap countdown-wrap">
            <div className="variant-box">
              <CountdownTimer />
            </div>
          </div>
        )}

        <div className="list-product-btn">
          <a
            onClick={() => addToWishlist(product.id)}
            className="box-icon wishlist btn-icon-action"
          >
            <span className="icon icon-heart" />
            <span className="tooltip">
              {isAddedtoWishlist(product.id)
                ? "Already Wishlisted"
                : "Wishlist"}
            </span>
          </a>

          <a
            href="#compare"
            data-bs-toggle="offcanvas"
            onClick={() => addToCompareItem(product.id)}
            className="box-icon compare btn-icon-action"
          >
            <span className="icon icon-gitDiff" />
            <span className="tooltip">
              {isAddedtoCompareItem(product.id)
                ? "Already compared"
                : "Compare"}
            </span>
          </a>

          <a
            href="#quickView"
            data-bs-toggle="modal"
            onClick={() => setQuickViewItem(product)}
            className="box-icon quickview"
          >
            <span className="icon icon-eye" />
            <span className="tooltip">Quick View</span>
          </a>
        </div>

        <div className="list-btn-main">
          {product.addToCart === "Quick Add" ? (
            <a
              href="#quickAdd"
              data-bs-toggle="modal"
              className="btn-main-product"
              onClick={() => setQuickAddItem(product.id)}
            >
              Quick Add
            </a>
          ) : (
            <a
              className="btn-main-product"
              onClick={() => addProductToCart(product.id)}
            >
              {isAddedToCartProducts(product.id)
                ? "Already Added"
                : "ADD TO CART"}
            </a>
          )}
        </div>
      </div>

      <div className="card-product-info">
        <Link
          href={`/product-detail/${product.id}`}
          className="title link"
        >
          {product.title}
        </Link>

        <span className="price">
          {product.oldPrice && (
            <span className="old-price">
              ${product.oldPrice.toFixed(2)}
            </span>
          )}{" "}
          ${product.price?.toFixed(2)}
        </span>

        {product.colors && (
          <ul className="list-color-product">
            {product.colors.map((color, index) => (
              <li
                key={index}
                className={`list-color-item color-swatch ${
                  currentImage === color.imgSrc ? "active" : ""
                } ${
                  color.bgColor === "bg-white" ? "line" : ""
                }`}
                onMouseOver={() =>
                  setCurrentImage(color.imgSrc)
                }
              >
                <span
                  className={`swatch-value ${color.bgColor}`}
                />
                <Image
                  className="lazyload"
                  src={"https://rantechnology.in/curve-&-comfort/products/bed_A.jpg"}
                  alt="color variant"
                  width={600}
                  height={800}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}