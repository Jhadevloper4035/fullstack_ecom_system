import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Topbar6 from "@/components/headers/Topbar6";
import PrivacyPolicy from "@/components/otherPages/PrivacyPolicy";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy || CURVE & COMFY - Your Trusted Home Furnishing Partner",
  description: "Learn how CURVE & COMFY collects, uses, and protects your personal information. Your privacy is important to us.",
};

export default function PrivacyPolicyPage() {
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
              <h3 className="heading text-center">Privacy Policy</h3>
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
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <PrivacyPolicy />
      <Footer1 />
    </>
  );
}
