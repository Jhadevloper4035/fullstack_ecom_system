"use client";
import { allProducts } from "@/data/products";
import { openCartModal } from "@/utlis/openCartModal";
import { openWistlistModal } from "@/utlis/openWishlist";
import { api } from "@/utlis/api";

import React, { useEffect } from "react";
import { useContext, useState } from "react";
const dataContext = React.createContext();
export const useContextElement = () => {
  return useContext(dataContext);
};

export default function Context({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([1, 2, 3]);
  const [compareItem, setCompareItem] = useState([1, 2, 3]);
  const [quickViewItem, setQuickViewItem] = useState(allProducts[0]);
  const [quickAddItem, setQuickAddItem] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCart = async () => {
    try {
      const cart = await api.get("/cart");
      if (cart && cart.items) {
        const mappedItems = cart.items.map((item) => ({
          ...item.product,
          id: item.product._id || item.product.id,
          quantity: item.quantity,
          imgSrc: item.product.imgSrc?.url || item.product.imgSrc,
        }));
        setCartProducts(mappedItems);
      }
    } catch (err) {
      console.log("Failed to fetch cart", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const subtotal = cartProducts.reduce((accumulator, product) => {
      return accumulator + product.quantity * product.price;
    }, 0);
    setTotalPrice(subtotal);
  }, [cartProducts]);

  const isAddedToCartProducts = (id) => {
    if (cartProducts.filter((elm) => elm.id == id)[0]) {
      return true;
    }
    return false;
  };

  const addProductToCart = async (id, qty, isModal = true) => {
    try {
      await api.post("/cart/add", { productId: id, quantity: qty || 1 });
      await fetchCart();
      if (isModal) {
        openCartModal();
      }
    } catch (err) {
      console.log("Failed to add to cart", err);
    }
  };

  const updateQuantity = async (id, qty) => {
    try {
      await api.put("/cart/update", { productId: id, quantity: qty });
      await fetchCart();
    } catch (err) {
      console.log("Failed to update quantity", err);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await api.delete(`/cart/remove/${id}`);
      await fetchCart();
    } catch (err) {
      console.log("Failed to remove from cart", err);
    }
  };

  const addToWishlist = (id) => {
    if (!wishList.includes(id)) {
      setWishList((pre) => [...pre, id]);
      openWistlistModal();
    }
  };

  const removeFromWishlist = (id) => {
    if (wishList.includes(id)) {
      setWishList((pre) => [...pre.filter((elm) => elm != id)]);
    }
  };
  const addToCompareItem = (id) => {
    if (!compareItem.includes(id)) {
      setCompareItem((pre) => [...pre, id]);
    }
  };
  const removeFromCompareItem = (id) => {
    if (compareItem.includes(id)) {
      setCompareItem((pre) => [...pre.filter((elm) => elm != id)]);
    }
  };
  const isAddedtoWishlist = (id) => {
    if (wishList.includes(id)) {
      return true;
    }
    return false;
  };
  const isAddedtoCompareItem = (id) => {
    if (compareItem.includes(id)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("wishlist"));
    if (items?.length) {
      setWishList(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  const contextElement = {
    cartProducts,
    setCartProducts,
    totalPrice,
    addProductToCart,
    isAddedToCartProducts,
    removeFromWishlist,
    addToWishlist,
    isAddedtoWishlist,
    quickViewItem,
    wishList,
    setQuickViewItem,
    quickAddItem,
    setQuickAddItem,
    addToCompareItem,
    isAddedtoCompareItem,
    removeFromCompareItem,
    compareItem,
    setCompareItem,
    updateQuantity,
    removeFromCart,
  };
  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
