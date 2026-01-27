"use client";

import { useEffect, useReducer, useState } from "react";

import LayoutHandler from "./LayoutHandler";
import Sorting from "./Sorting";
import Listview from "./Listview";
import GridView from "./GridView";
import FilterModal from "./FilterModal";
import FilterMeta from "./FilterMeta";

import { initialState, reducer } from "@/reducer/filterReducer";

export default function ProductsNew({ parentClass = "flat-spacing" }) {
  const [activeLayout, setActiveLayout] = useState(4);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    price,
    availability,
    color,
    size,
    activeFilterOnSale,
    sortingOption,
    filtered,
    sorted,
    currentPage,
    itemPerPage,
  } = state;

  /* ----------------------------- */
  /* Load Products */
  /* ----------------------------- */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/data/product_data.json");
        if (!res.ok) throw new Error("Failed to load products json");

        const data = await res.json();

        setAllProducts(data);
        console.log("Loaded products:", data);
        dispatch({ type: "SET_FILTERED", payload: data });
        dispatch({ type: "SET_SORTED", payload: data });
      } catch (err) {
        console.error("failed to load products", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  /* ----------------------------- */
  /* Filtering + Sorting */
  /* ----------------------------- */
  useEffect(() => {
    let temp = [...allProducts];

    // Price filter
    temp = temp.filter(
      (p) => p.price >= price[0] && p.price <= price[1]
    );

    // Availability
    if (availability !== "All") {
      temp = temp.filter((p) =>
        availability === "In Stock" ? p.inStock : !p.inStock
      );
    }

    // Color
    if (color !== "All") {
      temp = temp.filter((p) => p.filterColors.includes(color));
    }

    // Size
    if (size !== "All") {
      temp = temp.filter((p) => p.filterSizes.includes(size));
    }

    // Sale
    if (activeFilterOnSale) {
      temp = temp.filter((p) => p.isOnSale);
    }

    dispatch({ type: "SET_FILTERED", payload: temp });

    // Sorting
    let sortedProducts = [...temp];

    switch (sortingOption) {
      case "Price: Low to High":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;

      case "Price: High to Low":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;

      default:
        break;
    }

    dispatch({ type: "SET_SORTED", payload: sortedProducts });
  }, [
    allProducts,
    price,
    availability,
    color,
    size,
    activeFilterOnSale,
    sortingOption,
  ]);

  /* ----------------------------- */
  /* Pagination */
  /* ----------------------------- */
  const start = (currentPage - 1) * itemPerPage;
  const paginatedProducts = sorted.slice(start, start + itemPerPage);

  /* ----------------------------- */
  /* Filter Props */
  /* ----------------------------- */
  const allProps = {
    ...state,

    setPrice: (v) => dispatch({ type: "SET_PRICE", payload: v }),
    setColor: (v) =>
      dispatch({ type: "SET_COLOR", payload: v === color ? "All" : v }),
    setSize: (v) =>
      dispatch({ type: "SET_SIZE", payload: v === size ? "All" : v }),
    setAvailability: (v) =>
      dispatch({
        type: "SET_AVAILABILITY",
        payload: v === availability ? "All" : v,
      }),
    toggleFilterWithOnSale: () =>
      dispatch({ type: "TOGGLE_FILTER_ON_SALE" }),
    setSortingOption: (v) =>
      dispatch({ type: "SET_SORTING_OPTION", payload: v }),
    setCurrentPage: (v) =>
      dispatch({ type: "SET_CURRENT_PAGE", payload: v }),
    setItemPerPage: (v) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      dispatch({ type: "SET_ITEM_PER_PAGE", payload: v });
    },
    clearFilter: () => dispatch({ type: "CLEAR_FILTER" }),

    filterSizes: [...new Set(allProducts.flatMap((p) => p.filterSizes))],
    filterColors: [...new Set(allProducts.flatMap((p) => p.filterColors))],
    filterCategories: [...new Set(allProducts.map((p) => p.categories))].map(
      (c) => ({
        name: c,
        count: allProducts.filter((p) => p.categories === c).length,
      })
    ),

    allProducts,
  };

  if (loading) return null;

  /* ----------------------------- */
  /* Render */
  /* ----------------------------- */
  return (
    <>
      <section className={parentClass}>
        <div className="container">
          <div className="tf-shop-control">
            <div className="tf-control-filter">
              <a
                href="#filterShop"
                data-bs-toggle="offcanvas"
                className="tf-btn-filter"
              >
                <span className="icon icon-filter" />
                <span className="text">Filters</span>
              </a>

              <div
                onClick={allProps.toggleFilterWithOnSale}
                className={`d-none d-lg-flex shop-sale-text ${
                  activeFilterOnSale ? "active" : ""
                }`}
              >
                <i className="icon icon-checkCircle" />
                <p className="text-caption-1">Shop sale items only</p>
              </div>
            </div>

            <ul className="tf-control-layout">
              <LayoutHandler
                activeLayout={activeLayout}
                setActiveLayout={setActiveLayout}
              />
            </ul>

            <div className="tf-control-sorting">
              <p className="d-none d-lg-block text-caption-1">Sort by:</p>
              <Sorting allProps={allProps} />
            </div>
          </div>

          <div className="wrapper-control-shop">
            <FilterMeta
              productLength={paginatedProducts.length}
              allProps={allProps}
            />

            {activeLayout === 1 ? (
              <div className="tf-list-layout wrapper-shop">
                <Listview products={paginatedProducts} />
              </div>
            ) : (
              <div
                className={`tf-grid-layout wrapper-shop tf-col-${activeLayout}`}
              >
                <GridView products={paginatedProducts} />
              </div>
            )}
          </div>
        </div>
      </section>

      <FilterModal allProps={allProps} />
    </>
  );
}