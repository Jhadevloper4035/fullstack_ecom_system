"use client";
import React from "react";
import ShopLeftSidebarPage from "@/app/(products)/shop-left-sidebar/page";
import { useParams } from "next/navigation";

export default function DynamicSubCategoryPage() {
    const params = useParams();
    const { slug, subslug } = params;

    return (
        <ShopLeftSidebarPage category={slug} subCategory={subslug} />
    );
}
