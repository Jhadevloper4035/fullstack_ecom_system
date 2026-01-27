import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Topbar6 from "@/components/headers/Topbar6";
import Grievances from "@/components/otherPages/Grievances";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Grievance Redressal || Curve & Comfy - Customer Support",
  description: "Lodge a grievance or complaint regarding our products or services. We are committed to resolving your concerns in a fair and timely manner.",
};

export default function GrievancesPage() {
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
              <h3 className="heading text-center">Grievance Redressal</h3>
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
                    Support
                  </a>
                </li>
                <li>
                  <i className="icon-arrRight" />
                </li>
                <li>Grievance Redressal</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Grievances />
      <Footer1 />
    </>
  );
}
