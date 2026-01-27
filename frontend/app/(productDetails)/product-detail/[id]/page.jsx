import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Topbar6 from "@/components/headers/Topbar6";
import Breadcumb from "@/components/productDetails/Breadcumb";
import Descriptions1 from "@/components/productDetails/descriptions/Descriptions1";
import Details1 from "@/components/productDetails/details/Details1";
import RelatedProducts from "@/components/productDetails/RelatedProducts";
import { allProducts } from "@/data/products";
import React from "react";
export const metadata = {
  title:
    "Product Detail || CURVE & COMFY",
  description: "CURVE & COMFY",
};

export default async function ProductDetailPage({ params }) {
  const { id } = await params;

  let product = allProducts.filter((p) => p.id == id)[0];

  if (!product) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${id}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          product = data.product;
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }

  if (!product) {
    return (
      <>
        <Topbar6 bgColor="bg-main" />
        <Header2 />
        <div className="container mt-5 mb-5 text-center">
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist.</p>
        </div>
        <Footer1 hasPaddingBottom />
      </>
    );
  }

  return (
    <>
      <Topbar6 bgColor="bg-main" />
      <Header2 />
      <Breadcumb product={product} />
      <Details1 product={product} />
      <Descriptions1 />
      <RelatedProducts product={product} />
      <Footer1 hasPaddingBottom />
    </>
  );
}
