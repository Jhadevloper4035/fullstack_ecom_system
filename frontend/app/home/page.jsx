import { Suspense } from "react";
import Loader from "@/components/Loader";
import Nav from "@/components/headers/Nav";
import React from "react";
import Header2 from "@/components/headers/Header2";

export default function Home() {
    return (
        <Suspense fallback={<Loader />}>
            <Header2 />
            <Nav />
            <div>Home Page Content</div>
        </Suspense>
    );
}