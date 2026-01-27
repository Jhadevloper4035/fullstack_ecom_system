import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Topbar6 from "@/components/headers/Topbar6";
import ReturnRefund from "@/components/otherPages/ReturnRefund";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Return & Refund Policy || Curve & Comfy - Hassle-Free Returns",
  description: "Learn about Curve & Comfy's return and refund policy. We offer a 30-day return window for most items, with easy return process and prompt refunds.",
};

export default function ReturnRefundPage() {
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
              <h3 className="heading text-center">Return & Refund Policy</h3>
              <ul className="breadcrumbs d-flex align-items-center justify-content-center">
                <li>
                  <Link className="link" href={`/`}>
                    Homepage
                  </Link>
                </li>
                <li>
                  <i className="icon-arrRight" />
                </li>
                <li>
                  <a className="link" href="#">
                    Pages
                  </a>
                </li>
                <li>
                  <i className="icon-arrRight" />
                </li>
                <li>Return & Refund Policy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <ReturnRefund />
      <Footer1 />
    </>
  );
}
