"use client";

import {
  availabilityOptions,
} from "@/data/productFilterOptions";

import RangeSlider from "react-range-slider-input";
export default function FilterModal({ allProps }) {
  return (
    <div className="offcanvas offcanvas-start canvas-filter" id="filterShop">
      <div className="canvas-wrapper">
        <div className="canvas-header">
          <h5>Filters</h5>
          <span
            className="icon-close icon-close-popup"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="canvas-body">
          <div className="widget-facet facet-categories">
            <h6 className="facet-title">Product Categories</h6>
            <ul className="facet-content">
              {allProps.filterCategories?.map((category, index) => (
                <li key={index}>
                  <a href="#" className={`categories-item`}>
                    {category.name}{" "}
                    <span className="count-cate">({category.count})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="widget-facet facet-price">
            <h6 className="facet-title">Price</h6>

            <RangeSlider
              min={0}
              max={1000}
              value={allProps.price}
              onInput={(value) => allProps.setPrice(value)}
            />
            <div className="box-price-product mt-3">
              <div className="box-price-item">
                <span className="title-price">Min price</span>
                <div
                  className="price-val"
                  id="price-min-value"
                  data-currency="$"
                >
                  {allProps.price[0]}
                </div>
              </div>
              <div className="box-price-item">
                <span className="title-price">Max price</span>
                <div
                  className="price-val"
                  id="price-max-value"
                  data-currency="$"
                >
                  {allProps.price[1]}
                </div>
              </div>
            </div>
          </div>
          <div className="widget-facet facet-size">
            <h6 className="facet-title">Size</h6>
            <div className="facet-size-box size-box">
              {allProps.filterSizes?.map((size, index) => (
                <span
                  key={index}
                  onClick={() => allProps.setSize(size)}
                  className={`size-item size-check ${allProps.size === size ? "active" : ""
                    }`}
                >
                  {size}
                </span>
              ))}
              <span
                className={`size-item size-check free-size ${allProps.size == "Free Size" ? "active" : ""
                  } `}
                onClick={() => allProps.setSize("Free Size")}
              >
                Free Size
              </span>
            </div>
          </div>
          <div className="widget-facet facet-color">
            <h6 className="facet-title">Colors</h6>
            <div className="facet-color-box">
              {allProps.filterColors?.map((color, index) => (
                <div
                  onClick={() => allProps.setColor(color)}
                  key={index}
                  className={`color-item color-check ${color.name == allProps.color?.name ? "active" : ""
                    }`}
                >
                  <span className={`color ${color.className}`} style={{ backgroundColor: color.name }} />
                  {color.name}
                </div>
              ))}
            </div>
          </div>
          <div className="widget-facet facet-fieldset">
            <h6 className="facet-title">Availability</h6>
            <div className="box-fieldset-item">
              {availabilityOptions.map((option, index) => (
                <fieldset
                  key={index}
                  className="fieldset-item"
                  onClick={() => allProps.setAvailability(option)}
                >
                  <input
                    type="radio"
                    name="availability"
                    className="tf-check"
                    readOnly
                    checked={allProps.availability === option}
                  />
                  <label>
                    {option.label}{" "}
                    <span className="count-stock">
                      (
                      {
                        allProps.allProducts?.filter((el) => el.inStock == option.value)
                          .length
                      }
                      )
                    </span>
                  </label>
                </fieldset>
              ))}
            </div>
          </div>
          <div className="widget-facet facet-fieldset">
            <h6 className="facet-title">Fabrics</h6>
            <div className="box-fieldset-item">
              {allProps.filterFabrics?.map((fabric, index) => (
                <fieldset
                  key={index}
                  className="fieldset-item"
                  onClick={() => allProps.setFabrics(fabric.label)}
                >
                  <input
                    type="checkbox"
                    name="fabric"
                    className="tf-check"
                    readOnly
                    checked={allProps.fabrics.includes(fabric.label)}
                  />
                  <label>
                    {fabric.label}{" "}
                    <span className="count-brand">
                      (
                      {
                        allProps.allProducts?.filter((el) =>
                          el.filterFabrics.includes(fabric.label)
                        ).length
                      }
                      )
                    </span>
                  </label>
                </fieldset>
              ))}
            </div>
          </div>
        </div>
        <div className="canvas-bottom">
          <button
            id="reset-filter"
            onClick={allProps.clearFilter}
            className="tf-btn btn-reset"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
