"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { allProducts } from "@/data/products";
import { openCartModal } from "@/utlis/openCartModal";
import { openWistlistModal } from "@/utlis/openWishlist";
import { api } from "@/utlis/api";

const DataContext = createContext(null);

export const useContextElement = () => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useContextElement must be used within Context");
  }
  return ctx;
};

export default function Context({ children }) {
  const [user, setUserState] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [compareItem, setCompareItem] = useState([]);
  const [quickViewItem, setQuickViewItem] = useState(allProducts[0]);
  const [quickAddItem, setQuickAddItem] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  /* ---------------- USER (PERSISTED) ---------------- */

  const setUser = (userData) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem("app_user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("app_user");
    }
  };

  // Rehydrate user on page load
  useEffect(() => {
    const storedUser = localStorage.getItem("app_user");
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
  }, []);

  /* ---------------- CART ---------------- */

  const fetchCart = async () => {
    if (!user) return;

    try {
      const { data } = await api.get("/cart");
      if (!data?.items) return;

      const mapped = data.items.map((item) => ({
        ...item.product,
        id: item.product._id || item.product.id,
        quantity: item.quantity,
        imgSrc: item.product.imgSrc?.url || item.product.imgSrc,
      }));

      setCartProducts(mapped);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  useEffect(() => {
    // fetchCart();
    if(!user){
      console.log("No user, clearing cart");
    }
    else {
      console.log("User changed, would fetch cart here", user);
    }
  }, [user]);

  useEffect(() => {
    const subtotal = cartProducts.reduce(
      (sum, p) => sum + p.quantity * p.price,
      0
    );
    setTotalPrice(subtotal);
  }, [cartProducts]);

  /* ---------------- WISHLIST ---------------- */

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishList(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  const addToWishlist = (id) => {
    if (!wishList.includes(id)) {
      setWishList((prev) => [...prev, id]);
      openWistlistModal();
    }
  };

  const removeFromWishlist = (id) => {
    setWishList((prev) => prev.filter((i) => i !== id));
  };

  /* ---------------- CONTEXT VALUE ---------------- */

  const value = {
    user,
    setUser,

    cartProducts,
    totalPrice,

    wishList,
    addToWishlist,
    removeFromWishlist,

    compareItem,
    setCompareItem,

    quickViewItem,
    setQuickViewItem,
    quickAddItem,
    setQuickAddItem,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
