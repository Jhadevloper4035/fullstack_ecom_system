"use client";

import LayoutHandler from "./LayoutHandler";
import Sorting from "./Sorting";
import Listview from "./Listview";
import GridView from "./GridView";
import React, { useEffect, useReducer, useState } from "react";
import FilterModal from "./FilterModal";
import { initialState, reducer } from "@/reducer/filterReducer";
import FilterMeta from "./FilterMeta";
import FilterSidebar from "./FilterSidebar";

export default function Products11({ categorySlug, subCategorySlug, category }) {
  const [activeLayout, setActiveLayout] = useState(4);
  const [state, dispatch] = useReducer(reducer, initialState);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // allow both `categorySlug` and legacy `category` prop
  const effectiveCategorySlug = categorySlug || category;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        let url = `${process.env.NEXT_PUBLIC_API_URL}/product`;

        const params = [];

        if (effectiveCategorySlug) params.push(`categorySlug=${effectiveCategorySlug}`);
        if (subCategorySlug) params.push(`subCategorySlug=${subCategorySlug}`);

        if (params.length > 0) {
          url += `?${params.join("&")}`;
        }

        console.log("Fetching from URL:", url);

        const response = await fetch(url);
        const data = await response.json();

        console.log("API Response:", data);

        if (data.success) {
          // Normalize products to the shape our UI expects
          const mappedProducts = (data.products || []).map((product) => ({
            ...product,
            id: product.id || product._id,
            // normalize nested fields
            filterColor: product.colors?.map((c) => c.name) || [],
            filterSizes: product.filterSizes || [],
            category: product.category?.name || product.category,
            categorySlug: product.category?.slug || product.categorySlug,
            subCategory: product.subCategory?.name || product.subCategory,
            subCategorySlug: product.subCategory?.slug || product.subCategorySlug,
            price: product.price,
            oldPrice: product.oldPrice,
            inStock: product.inStock,
          }));

          // Fallback client-side filtering by category/subcategory if backend ignores query params
          const slugify = (str) =>
            (str || "")
              .toString()
              .trim()
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "")
              .replace(/-+/g, "-")
              .replace(/^-|-$/g, "");

          let finalProducts = mappedProducts;

          const makeVariants = (slug) => {
            const base = (slug || "").toString().trim().toLowerCase();
            const singular = base.replace(/(es|s)$/i, (m) => (m.toLowerCase() === "es" ? "" : ""));
            const pluralS = base.endsWith("s") ? base : `${base}s`;
            const pluralES = base.endsWith("es") ? base : `${base}es`;
            return new Set([base, singular, pluralS, pluralES]);
          };

          if (effectiveCategorySlug) {
            const catVariants = makeVariants(effectiveCategorySlug);
            finalProducts = finalProducts.filter((p) => {
              const pCatSlug = (p.categorySlug || slugify(p.category));
              return catVariants.has(pCatSlug);
            });
            // Fallback: includes-based if strict match empty
            if (!finalProducts.length) {
              const catArray = Array.from(catVariants);
              finalProducts = mappedProducts.filter((p) => {
                const pCatSlug = (p.categorySlug || slugify(p.category));
                return catArray.some(v => pCatSlug.includes(v) || v.includes(pCatSlug));
              });
            }
          }
          if (subCategorySlug) {
            const subVariants = makeVariants(subCategorySlug);
            finalProducts = finalProducts.filter((p) => {
              const pSubSlug = (p.subCategorySlug || slugify(p.subCategory));
              return subVariants.has(pSubSlug);
            });
            if (!finalProducts.length) {
              const subArray = Array.from(subVariants);
              finalProducts = mappedProducts.filter((p) => {
                const pSubSlug = (p.subCategorySlug || slugify(p.subCategory));
                return subArray.some(v => pSubSlug.includes(v) || v.includes(pSubSlug));
              });
            }
          }

          console.log(
            "Setting products:",
            finalProducts.length,
            "products"
          );
          setProducts(finalProducts);

          // Ensure price filter doesn't exclude everything on first load
          const prices = mappedProducts
            .map((p) => p.price)
            .filter((v) => typeof v === "number" && !Number.isNaN(v));
          if (prices.length) {
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            dispatch({ type: "SET_PRICE", payload: [min, max] });
          }
        }

      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [effectiveCategorySlug, subCategorySlug]);

  const {
    price,
    availability,
    color,
    size,
    filtered,
    sortingOption,
    sorted,
    activeFilterOnSale,
  } = state;


  const filteredProducts = React.useMemo(() => {
    return products;
  }, [products]);

  const allProps = {
    ...state,
    setPrice: (value) => dispatch({ type: "SET_PRICE", payload: value }),

    setColor: (value) =>
      dispatch({
        type: "SET_COLOR",
        payload: value === color ? "All" : value,
      }),

    setSize: (value) =>
      dispatch({
        type: "SET_SIZE",
        payload: value === size ? "All" : value,
      }),

    setAvailability: (value) =>
      dispatch({
        type: "SET_AVAILABILITY",
        payload: value === availability ? "All" : value,
      }),

    setSortingOption: (value) =>
      dispatch({ type: "SET_SORTING_OPTION", payload: value }),

    toggleFilterWithOnSale: () =>
      dispatch({ type: "TOGGLE_FILTER_ON_SALE" }),

    setCurrentPage: (value) =>
      dispatch({ type: "SET_CURRENT_PAGE", payload: value }),

    setItemPerPage: (value) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      dispatch({ type: "SET_ITEM_PER_PAGE", payload: value });
    },

    clearFilter: () => dispatch({ type: "CLEAR_FILTER" }),
  };


  useEffect(() => {
    let filteredArrays = [];

    if (availability !== "All") {
      filteredArrays.push(
        products.filter((p) => p.inStock === availability.value)
      );
    }

    if (color !== "All") {
      filteredArrays.push(
        products.filter((p) => p.filterColor?.includes(color.name))
      );
    }

    if (size !== "All" && size !== "Free Size") {
      filteredArrays.push(
        products.filter((p) => p.filterSizes.includes(size))
      );
    }

    if (size === "Free Size") {
      filteredArrays.push(products.filter((p) => p.filterSizes.length === 0));
    }

    if (activeFilterOnSale) {
      filteredArrays.push(products.filter((p) => p.isOnSale === true));
    }

    filteredArrays.push(
      products.filter((p) => p.price >= price[0] && p.price <= price[1])
    );

    if (filteredArrays.length) {
      const intersected = filteredArrays.reduce((acc, arr) =>
        acc.filter((item) => arr.some((a) => a._id === item._id))
      );

      dispatch({ type: "SET_FILTERED", payload: intersected });
    } else {
      dispatch({ type: "SET_FILTERED", payload: products });
    }
  }, [price, availability, color, size, activeFilterOnSale, products]);


  useEffect(() => {
    let sortedResult = [...filtered];

    switch (sortingOption) {
      case "Price Ascending":
        sortedResult.sort((a, b) => a.price - b.price);
        break;
      case "Price Descending":
        sortedResult.sort((a, b) => b.price - a.price);
        break;
      case "Title Ascending":
        sortedResult.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Title Descending":
        sortedResult.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    dispatch({ type: "SET_SORTED", payload: sortedResult });
    dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
  }, [filtered, sortingOption]);

  return (
    <>
      <section className="flat-spacing">
        <div className="container">
          <div className="tf-shop-control">
            <div className="tf-control-filter">
              <button className="filterShop tf-btn-filter hidden-mx-1200">
                <span className="icon icon-filter" />
                <span className="text">Filters</span>
              </button>

              <a
                href="#filterShop"
                data-bs-toggle="offcanvas"
                className="tf-btn-filter show-mx-1200"
              >
                <span className="icon icon-filter" />
                <span className="text">Filters</span>
              </a>

              <div
                onClick={allProps.toggleFilterWithOnSale}
                className={`d-none d-lg-flex shop-sale-text ${activeFilterOnSale ? "active" : ""
                  }`}
              >
                <i className="icon icon-checkCircle" />
                <p className="text-caption-1">Shop sale items only</p>
              </div>
            </div>

            <ul className="tf-control-layout">
              <LayoutHandler
                setActiveLayout={setActiveLayout}
                activeLayout={activeLayout}
                hasSidebar
              />
            </ul>

            <div className="tf-control-sorting">
              <p className="d-none d-lg-block text-caption-1">Sort by:</p>
              <Sorting allProps={allProps} />
            </div>
          </div>

          <div className="wrapper-control-shop">
            <FilterMeta productLength={sorted.length} allProps={allProps} />

            <div className="row">
              <div className="col-xl-3">
                <FilterSidebar allProps={allProps} />
              </div>

              <div className="col-xl-9">
                {activeLayout == 1 ? (
                  <div className="tf-list-layout wrapper-shop" id="listLayout">
                    <Listview products={sorted} />
                  </div>
                ) : (
                  <div
                    className={`tf-grid-layout wrapper-shop tf-col-${activeLayout}`}
                    id="gridLayout"
                  >
                    <GridView products={sorted} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FilterModal allProps={allProps} />
    </>
  );
}
