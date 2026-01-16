"use client";
import React, { useEffect, useState } from "react";

export default function Preloader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleLoad = () => {
            setLoading(false);
        };

        if (document.readyState === "complete") {
            setLoading(false);
        } else {
            window.addEventListener("load", handleLoad);
        }

        return () => {
            window.removeEventListener("load", handleLoad);
        };
    }, []);

    if (!loading) return null;

    return (
        <div className="app-loader-overlay">
            <div className="loader" />
        </div>
    );
}
