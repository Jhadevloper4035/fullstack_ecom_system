import React from "react";
import Link from "next/link";
export default function Banner({ parentClass = "" }) {
  return (
    <section
      className={`flat-banner-parallax-v2 ${parentClass}`}
      style={{ backgroundImage: 'url("/images/banner/banner-cosmetic.jpeg")' }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="fl-content">
              <div className="title-top">
                <span
                  className="subtitle text-btn-uppercase text-secondary-2 wow fadeInUp"
                  data-wow-delay="0s"
                >

                </span>
                {/* <h3 className="text-white" data-wow-delay="0.1s">
                  Make Space To Celebrate
                </h3>
                <p className="body-text-1 wow fadeInUp" data-wow-delay="0.2s">

                </p>*/}
              </div>
              <div className="wow fadeInUp" data-wow-delay="0.3s">
                <Link href={`/shop-default-grid`} className="tf-btn btn-fill">
                  <span className="text">Shop Now</span>
                  <i className="icon icon-arrowUpRight" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
