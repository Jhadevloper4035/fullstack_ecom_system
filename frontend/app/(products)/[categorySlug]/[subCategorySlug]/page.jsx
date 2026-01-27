import Products11 from "@/components/products/Products11";

export default function SubCategoryPage({ params }) {
    return (
        <Products11
            categorySlug={params.categorySlug}
            subCategorySlug={params.subCategorySlug}
        />
    );
}
