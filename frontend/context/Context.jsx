"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { allProducts } from "@/data/products";
import { openCartModal } from "@/utlis/openCartModal";
import { openWistlistModal } from "@/utlis/openWishlist";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const DataContext = createContext(null);

export const useContextElement = () => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useContextElement must be used within Context");
  }
  return ctx;
};

export default function Context({ children }) {
  const { user } = useAuth();

  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [compareItem, setCompareItem] = useState([]);
  const [quickViewItem, setQuickViewItem] = useState(allProducts[0]);
  const [quickAddItem, setQuickAddItem] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  /* -------- CART -------- */

  const fetchCart = async () => {
    if (!user) {
      setCartProducts([]);
      return;
    }

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
      console.error("Cart fetch failed", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  useEffect(() => {
    const subtotal = cartProducts.reduce(
      (sum, p) => sum + p.quantity * p.price,
      0
    );
    setTotalPrice(subtotal);
  }, [cartProducts]);

  /* -------- WISHLIST -------- */

  useEffect(() => {
    setWishList(JSON.parse(localStorage.getItem("wishlist") || "[]"));
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  const addToWishlist = (id) => {
    if (!wishList.includes(id)) {
      setWishList((p) => [...p, id]);
      openWistlistModal();
    }
  };

  const removeFromWishlist = (id) => {
    setWishList((p) => p.filter((i) => i !== id));
  };

  return (
    <DataContext.Provider
      value={{
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
