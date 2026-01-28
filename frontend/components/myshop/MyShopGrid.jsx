'use client';

import { useEffect, useState } from 'react';
import productData from '@/data/product_data.json'; 

export default function MyShopGrid() {

    const productList = productData.products;
    

    if (!productList || !productList.length) {
        return <div>No products found</div>;
    }

    return (
        <div className="product-grid">
            <div
                className="grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '1.5rem',
                    padding: '1rem',
                }}
            >
                {productList.map((product) => (
                    <div
                        key={product.id}
                        className="product-card"
                        style={{
                            border: '1px solid #e5e5e5',
                            padding: '1rem',
                            borderRadius: '8px',
                            backgroundColor: '#fff',
                            transition: 'transform 0.2s',
                        }}
                    >
                        <div style={{ position: 'relative', overflow: 'hidden' }}>
                            <img
                                src={"https://rantechnology.in/curve-&-comfort/products/"+product.imgSrc}
                                alt={product.title}
                                style={{ 
                                    width: '100%', 
                                    height: '300px',
                                    objectFit: 'cover',
                                    borderRadius: '4px'
                                }}
                                onError={(e) => {
                                    e.target.src = 'https://rantechnology.in/curve-&-comfort/products/bed_A.jpg';
                                }}
                            />
                            
                            {product.salePercentage && (
                                <div style={{ 
                                    position: 'absolute',
                                    top: '10px',
                                    left: '10px',
                                    background: '#ff0000', 
                                    color: '#fff', 
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold'
                                }}>
                                    {product.salePercentage} OFF
                                </div>
                            )}

                            {!product.inStock && (
                                <div style={{ 
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: '#999', 
                                    color: '#fff', 
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.85rem'
                                }}>
                                    Out of Stock
                                </div>
                            )}
                        </div>

                        <h3 style={{ 
                            marginTop: '0.75rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            color: '#333'
                        }}>
                            {product.title}
                        </h3>

                        <div style={{ 
                            margin: '0.5rem 0', 
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            color: '#000'
                        }}>
                            ${product.price.toFixed(2)}
                            {product.oldPrice && (
                                <span
                                    style={{
                                        marginLeft: '0.5rem',
                                        textDecoration: 'line-through',
                                        color: '#999',
                                        fontWeight: 400,
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    ${product.oldPrice.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {product.filterColor && product.filterColor.length > 0 && (
                            <div style={{ 
                                marginBottom: '0.75rem',
                                fontSize: '0.85rem',
                                color: '#666'
                            }}>
                                Colors: {product.filterColor.slice(0, 3).join(', ')}
                                {product.filterColor.length > 3 && '...'}
                            </div>
                        )}

                        <button
                            style={{
                                width: '100%',
                                padding: '0.6rem',
                                background: product.inStock ? '#000' : '#ccc',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: product.inStock ? 'pointer' : 'not-allowed',
                                fontWeight: '500',
                                transition: 'background 0.2s'
                            }}
                            disabled={!product.inStock}
                            onMouseEnter={(e) => {
                                if (product.inStock) e.target.style.background = '#333';
                            }}
                            onMouseLeave={(e) => {
                                if (product.inStock) e.target.style.background = '#000';
                            }}
                        >
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}