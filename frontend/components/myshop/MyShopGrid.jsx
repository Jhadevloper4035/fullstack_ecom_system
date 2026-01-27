'use client';

import { useEffect, useState } from 'react';

export default function MyShopGrid() {



    const products = [
        {
            id: 1,
            title: 'Elegant Sofa',
            description: 'A comfortable and stylish sofa for your living room.',
            price: 12000,
            comparePrice: 15000,
            imgSrc: 'https://rantechnology.in/curve-&-comfort/images/products/sofa1.jpg',
        },
        {
            id: 2,
            title: 'Modern Chair',
            description: 'A sleek chair that complements any modern decor.',
            price: 8000,
            comparePrice: 10000,
            imgSrc: 'https://rantechnology.in/curve-&-comfort/images/products/chair1.jpg',
        }
    ]

    if (!products.length) {
        return <div>No products found</div>;
    }
    else {
        console.log("Rendering products:", products);
    }

    return (
        <div className="product-grid">
            <div
                className="grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '1.5rem',
                }}
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="product-card"
                        style={{
                            border: '1px solid #e5e5e5',
                            padding: '1rem',
                            borderRadius: '8px',
                        }}
                    >
                        <img
                            src={"https://rantechnology.in/curve-&-comfort/products/bed_A.jpg"}
                            alt={product.title}
                        />

                        <h3 style={{ marginTop: '0.75rem' }}>
                            {product.title}
                        </h3>

                        <p style={{ fontSize: '0.9rem', color: '#555' }}>
                            {product.description}
                        </p>

                        <div style={{ margin: '0.5rem 0', fontWeight: 600 }}>
                            ₹{product.price.toLocaleString()}
                            {product.comparePrice && (
                                <span
                                    style={{
                                        marginLeft: '0.5rem',
                                        textDecoration: 'line-through',
                                        color: '#999',
                                        fontWeight: 400,
                                    }}
                                >
                                    ₹{product.comparePrice.toLocaleString()}
                                </span>
                            )}
                        </div>

                        <button
                            style={{
                                width: '100%',
                                padding: '0.6rem',
                                background: '#000',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}