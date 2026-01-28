import React, { Suspense } from "react";
import Loader from "@/components/Loader";
import Nav from "@/components/headers/Nav";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import MyShopGrid from "@/components/myshop/MyShopGrid";
import ContentReadySignal from "@/components/common/ContentReadySignal";
export default function Home() {
    return (
        <Suspense fallback={<Loader />}>
            <Header2 />
            {/* <Nav /> */}
            <MyShopGrid />
            <Footer1 />
            <ContentReadySignal />
        </Suspense>
    );
}