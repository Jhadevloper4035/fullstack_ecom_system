import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Collections from "@/components/homes/furniture/Collections";
import Collections2 from "@/components/homes/furniture/Collections2";
import Hero from "@/components/homes/furniture/Hero";
import Lookbook from "@/components/homes/furniture/Lookbook";
import Testimonials from "@/components/homes/furniture/Testimonials";
import React from "react";
import Products4 from "@/components/common/Products4";
import ShopGram from "@/components/common/ShopGram";
import ExploreProducts from "@/components/common/ExploreProducts";
import Loader from "@/components/Loader";
import ContentReadySignal from "@/components/common/ContentReadySignal";
import { Suspense } from "react";
import Nav from "@/components/headers/Nav";
import Banner from "@/components/homes/cosmetic/Banner";
export default function Home() {
    return (
        <Suspense fallback={<Loader />}>
            <Header2 />
            <Nav />
            <Hero />
            <Collections parentClass="flat-spacing-3" />
            <Banner />
            <ExploreProducts />
            <Lookbook />
            <Products4 parentClass="flat-spacing-3" />
            <Collections2 />
            <Testimonials />
            <ShopGram parentClass="" />
            <Footer1 />
            <ContentReadySignal />
        </Suspense>
    );
}