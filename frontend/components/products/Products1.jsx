"use client";

import { useEffect, useReducer, useState } from "react";

import LayoutHandler from "./LayoutHandler";
import Sorting from "./Sorting";
import Listview from "./Listview";
import GridView from "./GridView";
import FilterModal from "./FilterModal";
import FilterMeta from "./FilterMeta";

import { initialState, reducer } from "@/reducer/filterReducer";

// ✅ LOCAL STATIC DATA
import {
  allProducts as PRODUCTS,
  categories as CATEGORY_DATA,
  colors as COLOR_DATA,
  fabrics as FABRIC_DATA,
} from "@/data/productsdata";

export default function Products1({ parentClass = "flat-spacing" }) {
  const [activeLayout, setActiveLayout] = useState(4);
  const [allProducts, setAllProducts] = useState([]);

  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    price,
    availability,
    color,
    size,
    fabrics,

    filtered,
    sortingOption,
    sorted,

    activeFilterOnSale,
    currentPage,
    itemPerPage,
  } = state;

  // ✅ INIT PRODUCTS ONCE
  useEffect(() => {
    setAllProducts(PRODUCTS);
    dispatch({ type: "SET_FILTERED", payload: PRODUCTS });
    dispatch({ type: "SET_SORTED", payload: PRODUCTS });
  }, []);

  // ✅ FILTER LOGIC (UNCHANGED, STATIC DATA)
  useEffect(() => {
    let filteredArrays = [];

    if (fabrics.length) {
      filteredArrays.push(
        allProducts.filter((p) =>
          fabrics.every((f) => p.filterFabrics.includes(f))
        )
      );
    }

    if (availability !== "All") {
      filteredArrays.push(
        allProducts.filter((p) => p.inStock === availability.value)
      );
    }

    if (color !== "All") {
      filteredArrays.push(
        allProducts.filter((p) => p.filterColor.includes(color.name))
      );
    }

    if (size !== "All" && size !== "Free Size") {
      filteredArrays.push(
        allProducts.filter((p) => p.filterSizes.includes(size))
      );
    }

    if (activeFilterOnSale) {
      filteredArrays.push(allProducts.filter((p) => p.oldPrice));
    }

    filteredArrays.push(
      allProducts.filter(
        (p) => p.price >= price[0] && p.price <= price[1]
      )
    );

    const result =
      filteredArrays.length === 0
        ? allProducts
        : allProducts.filter((item) =>
            filteredArrays.every((arr) => arr.includes(item))
          );

    dispatch({ type: "SET_FILTERED", payload: result });
  }, [
    price,
    availability,
    color,
    size,
    fabrics,
    activeFilterOnSale,
    allProducts,
  ]);

  // ✅ SORTING LOGIC
  useEffect(() => {
    let sortedData = [...filtered];

    if (sortingOption === "Price Ascending") {
      sortedData.sort((a, b) => a.price - b.price);
    } else if (sortingOption === "Price Descending") {
      sortedData.sort((a, b) => b.price - a.price);
    } else if (sortingOption === "Title Ascending") {
      sortedData.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortingOption === "Title Descending") {
      sortedData.sort((a, b) => b.title.localeCompare(a.title));
    }

    dispatch({ type: "SET_SORTED", payload: sortedData });
    dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
  }, [filtered, sortingOption]);

  // ✅ PROPS PASSED TO FILTER / SORT / META
  const allProps = {
    ...state,

    setPrice: (value) =>
      dispatch({ type: "SET_PRICE", payload: value }),

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

    setFabrics: (fabric) => {
      const updated = fabrics.includes(fabric)
        ? fabrics.filter((f) => f !== fabric)
        : [...fabrics, fabric];
      dispatch({ type: "SET_FABRICS", payload: updated });
    },

    removeFabric: (fabric) =>
      dispatch({
        type: "SET_FABRICS",
        payload: fabrics.filter((f) => f !== fabric),
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

    // ✅ STATIC FILTER OPTIONS
    filterCategories: CATEGORY_DATA,
    filterColors: COLOR_DATA,
    filterFabrics: FABRIC_DATA.map((f) => ({ label: f.name })),
    filterSizes: [...new Set(PRODUCTS.flatMap((p) => p.filterSizes))],

    allProducts,
  };

  return (
    <>
      <section className={parentClass}>
        <div className="container">
          <div className="tf-shop-control">
            <div className="tf-control-filter">
              <a
                href="#filterShop"
                data-bs-toggle="offcanvas"
                aria-controls="filterShop"
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
                setActiveLayout={setActiveLayout}
                activeLayout={activeLayout}
              />
            </ul>

            <div className="tf-control-sorting">
              <p className="d-none d-lg-block text-caption-1">Sort by:</p>
              <Sorting allProps={allProps} />
            </div>
          </div>

          <div className="wrapper-control-shop">
            <FilterMeta
              productLength={sorted.length}
              allProps={allProps}
            />

            {activeLayout === 1 ? (
              <div className="tf-list-layout wrapper-shop">
                <Listview products={sorted} />
              </div>
            ) : (
              <div
                className={`tf-grid-layout wrapper-shop tf-col-${activeLayout}`}
              >
                <GridView products={sorted} />
              </div>
            )}
          </div>
        </div>
      </section>

      <FilterModal allProps={allProps} />
    </>
  );
}