"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import ScrollTop from "@/components/common/ScrollTop";
import Context from "@/context/Context";
import CartModal from "@/components/modals/CartModal";
import QuickView from "@/components/modals/QuickView";
import QuickAdd from "@/components/modals/QuickAdd";
import Compare from "@/components/modals/Compare";
import MobileMenu from "@/components/modals/MobileMenu";
import NewsLetterModal from "@/components/modals/NewsLetterModal";
import SearchModal from "@/components/modals/SearchModal";
import SizeGuide from "@/components/modals/SizeGuide";
import Wishlist from "@/components/modals/Wishlist";
import DemoModal from "@/components/modals/DemoModal";
import Categories from "@/components/modals/Categories";
import AccountSidebar from "@/components/modals/AccountSidebar";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Loader from "@/components/Loader";

export default function ClientRoot({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [domReady, setDomReady] = useState(false);
  const [navReady, setNavReady] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    const handleReady = () => {
      setTimeout(() => setDomReady(true), 400);
    };

    if (document.readyState === "complete") {
      handleReady();
    } else {
      window.addEventListener("load", handleReady);
    }
    return () => window.removeEventListener("load", handleReady);
  }, []);

  useEffect(() => {
    const onNavReady = () => setNavReady(true);
    window.addEventListener("nav-ready", onNavReady, { once: true });
    const t = setTimeout(() => setNavReady(true), 3000);
    return () => {
      window.removeEventListener("nav-ready", onNavReady);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const onContentReady = () => setContentReady(true);
    window.addEventListener("content-ready", onContentReady, { once: true });
    const t = setTimeout(() => setContentReady(true), 2000);
    return () => {
      window.removeEventListener("content-ready", onContentReady);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (domReady && navReady && contentReady) setLoading(false);
  }, [domReady, navReady, contentReady]);

  // Bootstrap bundle (includes Popper)
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle");
  }, []);

  // HEADER SCROLL BG EFFECT
  useEffect(() => {
    const handler = () => {
      const header = document.querySelector("header");
      if (!header) return;
      header.classList.toggle("header-bg", window.scrollY > 100);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // HEADER HIDE/SHOW ON SCROLL
  const [scrollDirection, setScrollDirection] = useState("down");
  useEffect(() => {
    const lastScrollY = { current: window.scrollY };
    const handler = () => {
      const y = window.scrollY;
      if (y > 250) {
        setScrollDirection(y > lastScrollY.current ? "down" : "up");
      } else {
        setScrollDirection("down");
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [pathname]);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.top = scrollDirection === "up" ? "0px" : "-185px";
  }, [scrollDirection]);

  // CLOSE OPEN MODALS & OFFCANVAS ON ROUTE CHANGE
  useEffect(() => {
    const bootstrap = require("bootstrap");
    document.querySelectorAll(".modal.show").forEach((modal) => {
      const inst = bootstrap.Modal.getInstance(modal);
      inst?.hide();
    });
    document.querySelectorAll(".offcanvas.show").forEach((c) => {
      const inst = bootstrap.Offcanvas.getInstance(c);
      inst?.hide();
    });
  }, [pathname]);

  // WOW ANIMATIONS ON ROUTE CHANGE
  useEffect(() => {
    const WOW = require("@/utlis/wow");
    new WOW.default({ mobile: false, live: true }).init();
  }, [pathname]);

  return (
    <AuthProvider>
      <Context>
        <div id="wrapper">
          {loading && (
            <div className="app-loader-overlay">
              <Loader />
            </div>
          )}
          {children}
        </div>
        <CartModal />
        <QuickView />
        <QuickAdd />
        <Compare />
        <MobileMenu />
        <NewsLetterModal />
        <SearchModal />
        <SizeGuide />
        <Wishlist />
        <DemoModal />
        <Categories />
        <AccountSidebar />
        <ScrollTop />
        <ToastContainer position="bottom-right" />
      </Context>
    </AuthProvider>
  );
}
