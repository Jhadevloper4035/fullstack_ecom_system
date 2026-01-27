"use client"
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Topbar6 from "@/components/headers/Topbar6";
import Products11 from "@/components/products/Products11";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function ShopLeftSidebarPage({ children, title, category, subCategory }) {
  const pathname = usePathname();
  const formattedTitle = title || pathname.split('/').pop().charAt(0).toUpperCase() +
    pathname.split('/').pop().slice(1);

  return (
    <>
      <Topbar6 bgColor="bg-main" />
      <Header2 />
      <div
        className="page-title"
        style={{ backgroundImage: "url(/images/section/page-title.jpg)" }}
      >
        <div className="container-full">
          <div className="row">
            <div className="col-12">
              <h3 className="heading text-center">{formattedTitle}</h3>
              <ul className="breadcrumbs d-flex align-items-center justify-content-center">
                <li>
                  <Link className="link" href={`/`}>
                    Homepage
                  </Link>
                </li>
                <li>
                  <i className="icon-arrRight" />
                </li>
                <li>{formattedTitle}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Products11 category={category} subCategorySlug={subCategory} />
      <Footer1 />
      {children}
    </>
  );
}
