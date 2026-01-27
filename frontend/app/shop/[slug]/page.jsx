"use client";
import React from "react";
import ShopLeftSidebarPage from "@/app/(products)/shop-left-sidebar/page";
import { useParams } from "next/navigation";

export default function DynamicCategoryPage() {
    const params = useParams();
    const { slug } = params;

    return (
        <ShopLeftSidebarPage category={slug} />
    );
}
