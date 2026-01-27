"use client";
import React, { useState, useEffect } from "react";
import FileUpload, { resizeAndUpload } from "@/components/FileUpload";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import categoriesData from "@/data/categories.json";
import subcategoriesData from "@/data/subcategories.json";
import colorsData from "@/data/colors.json";
import fabricsData from "@/data/fabrics.json";

export default function ProductForm() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subCategory: '',
    price: '',
    oldPrice: '',
    description: '',
    isOnSale: false,
    salePercentage: '',
    inStock: true,
    hotSale: false,
    filterSizes: [],
    fabrics: [],
    colors: [],
    images: [],
    colorImages: []
  });
  const [categories, setCategories] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgHover, setImgHover] = useState(null);
  const [colorImageInputs, setColorImageInputs] = useState([{ color: '', image: null }]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState();
  const [error, setError] = useState(null);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCategories(categoriesData);
    setAllSubcategories(subcategoriesData);
    setSubcategories([]);
    setColors(colorsData);
    setFabrics(fabricsData);
  }, []);



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (e) => {
    const categoryName = e.target.value;

    setFormData(prev => ({
      ...prev,
      category: categoryName,
      subCategory: ""
    }));

    if (categoryName) {
      const filtered = allSubcategories.filter(
        sub => sub.category === categoryName || sub.category?._id === categoryName
      );

      setSubcategories(filtered);
    } else {
      setSubcategories([]);
    }
  };

  const handleArrayChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'imgSrc') setImgSrc(file);
    else if (type === 'imgHover') setImgHover(file);
  };

  const addColorImageInput = () => {
    setColorImageInputs([...colorImageInputs, { color: '', image: null }]);
  };

  const handleColorImageChange = (index, field, value) => {
    const newInputs = [...colorImageInputs];
    newInputs[index][field] = value;
    setColorImageInputs(newInputs);
  };

  const handleEditProduct = async (slug) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const { data: product } = await response.json();

      // Update form data with product details
      setFormData({
        title: product.title || '',
        category: product.category?._id || '',
        subCategory: product.subCategory?._id || '',
        price: product.price || '',
        oldPrice: product.oldPrice || '',
        description: product.description || '',
        isOnSale: product.isOnSale || false,
        salePercentage: product.salePercentage || '',
        inStock: product.inStock !== undefined ? product.inStock : true,
        hotSale: product.hotSale || false,
        filterSizes: product.filterSizes || [],
        fabrics: product.fabrics?.map(f => f._id) || [],
        colors: product.colors?.map(c => c._id) || [],
        colorImages: product.colorImages || []
      });

      if (product.imgSrc) {
        // This is a simplified example - in a real app, you'd need to handle the actual file
        setImgSrc(product.imgSrc);
      }
      if (product.imgHover) {
        setImgHover(product.imgHover);
      }

      // Set color images if they exist
      if (product.colorImages?.length > 0) {
        setColorImageInputs(product.colorImages.map(ci => ({
          color: ci.color?._id || '',
          image: ci.image || null
        })));
      }

      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' });

      toast.success('Product loaded for editing');
    } catch (err) {
      console.error('Error fetching product:', err);
      toast.error('Failed to load product for editing');
    }
  };

  const handleDeleteProduct = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Refresh products list
      fetchProducts();
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imgSrcUrl = imgSrc;
      let imgHoverUrl = imgHover;

      // Upload main image if it's a file
      if (imgSrc && typeof imgSrc !== 'string') {
        const data = await resizeAndUpload(imgSrc);
        imgSrcUrl = data.url;
      }

      // Upload hover image if it's a file
      if (imgHover && typeof imgHover !== 'string') {
        const data = await resizeAndUpload(imgHover);
        imgHoverUrl = data.url;
      }

      // Upload color images
      const uploadedColorImages = await Promise.all(
        colorImageInputs.map(async (input) => {
          if (input.color && input.image) {
            let imageUrl = input.image;
            if (typeof input.image !== 'string') {
              const data = await resizeAndUpload(input.image);
              imageUrl = data.url;
            }
            return { color: input.color, imageUrl };
          }
          return null;
        })
      );

      // Map IDs to Names for backend compatibility
      const selectedCategory = categories.find(c => c._id === formData.category);
      const selectedSubCategory = allSubcategories.find(s => s._id === formData.subCategory);

      const selectedFabricNames = formData.fabrics
        .map(id => fabrics.find(f => f._id === id)?.name)
        .filter(Boolean)
        .join(',');

      const selectedColorNames = formData.colors
        .map(id => colors.find(c => c._id === id)?.name)
        .filter(Boolean)
        .join(',');

      // Map colorImages to use colorName
      const colorImagesWithNames = uploadedColorImages
        .filter(Boolean)
        .map(ci => {
          const colorObj = colors.find(c => c._id === ci.color);
          return {
            colorName: colorObj?.name,
            imageUrl: ci.imageUrl
          };
        });

      const payload = {
        ...formData,
        categoryName: selectedCategory?.name,
        subCategoryName: selectedSubCategory?.name,
        fabricNames: selectedFabricNames,
        colorNames: selectedColorNames,
        imgSrc: imgSrcUrl,
        imgHover: imgHoverUrl,
        colorImages: colorImagesWithNames
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      console.log('Product created successfully');
      fetchProducts();
      // Reset form
      setFormData({
        title: '',
        category: '',
        subCategory: '',
        price: '',
        oldPrice: '',
        description: '',
        isOnSale: false,
        salePercentage: '',
        inStock: true,
        hotSale: false,
        filterSizes: [],
        fabrics: [],
        colors: [],
        images: [],
        colorImages: []
      });
      setImgSrc(null);
      setImgHover(null);
      setColorImageInputs([{ color: '', image: null }]);
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-account-content" style={{
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '0 1rem'
    }}>
      <div className="account-details">
        <ToastContainer />
        <form onSubmit={handleSubmit} className="form-account-details">
          <div className="product-info">
            <h2 className="title" style={{
              textAlign: 'center',
              marginBottom: '2rem',
              fontSize: '1.8rem',
              fontWeight: '600'
            }}>Create New Product</h2>
          </div>
          {/* Basic Information Section */}
          <div className="form-section" style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>

            <h3 className="section-title" style={{
              fontSize: '1.2rem',
              marginBottom: '1.5rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #eee'
            }}>Basic Information</h3>

            <div className="form-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div className="form-group">
                <label>Product Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div className="form-group">
                <label>Old Price (₹)</label>
                <input
                  type="number"
                  name="oldPrice"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  step="0.01"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
            </div>
          </div>

          {/* Category & Subcategory Section */}
          <div className="form-section" style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h3 className="section-title" style={{
              fontSize: '1.2rem',
              marginBottom: '1.5rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #eee'
            }}>Category & Subcategory</h3>

            <div className="form-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label>Subcategory *</label>
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    required
                    disabled={!formData.category}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map(sub => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Product Images Section */}

          <div className="form-section" style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h3 className="section-title" style={{
              fontSize: '1.2rem',
              marginBottom: '1.5rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #eee'
            }}>Product Images</h3>

            <div className="form-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div className="form-group">
                <label>Main Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'imgSrc')}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                {imgSrc && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img
                      src={URL.createObjectURL(imgSrc)}
                      alt="Preview"
                      style={{ maxWidth: '100px', maxHeight: '100px' }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Hover Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'imgHover')}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                {imgHover && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img
                      src={URL.createObjectURL(imgHover)}
                      alt="Hover Preview"
                      style={{ maxWidth: '100px', maxHeight: '100px' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Colors & Fabrics Section */}
          <div className="form-section" style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h3 className="section-title" style={{
              fontSize: '1.2rem',
              marginBottom: '1.5rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #eee'
            }}>Colors & Fabrics</h3>

            <div className="form-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div className="form-group">
                <label>Available Colors *</label>
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '0.5rem', borderRadius: '4px' }}>
                  {colors.map(color => (
                    <div key={color._id} style={{ marginBottom: '0.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          value={color._id}
                          checked={formData.colors.includes(color._id)}
                          onChange={(e) => handleArrayChange(e, 'colors')}
                        />
                        <span style={{
                          display: 'inline-block',
                          width: '20px',
                          height: '20px',
                          backgroundColor: color.hexValue,
                          border: '1px solid #ccc'
                        }}></span>
                        {color.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Available Fabrics *</label>
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '0.5rem', borderRadius: '4px' }}>
                  {fabrics.map(fabric => (
                    <div key={fabric._id} style={{ marginBottom: '0.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          value={fabric._id}
                          checked={formData.fabrics.includes(fabric._id)}
                          onChange={(e) => handleArrayChange(e, 'fabrics')}
                        />
                        {fabric.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Color Images */}
            <div className="form-group">
              <label>Color-Specific Images</label>
              {colorImageInputs.map((input, index) => (
                <div key={index} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr auto',
                  gap: '1rem',
                  marginBottom: '1rem',
                  alignItems: 'end'
                }}>
                  <div>
                    <label>Color</label>
                    <select
                      value={input.color}
                      onChange={(e) => handleColorImageChange(index, 'color', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                      <option value="">Select Color</option>
                      {colors.map(color => (
                        <option key={color._id} value={color._id}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleColorImageChange(index, 'image', e.target.files[0])}
                      style={{ width: '100%' }}
                    />
                    {input.image && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <img
                          src={URL.createObjectURL(input.image)}
                          alt={`Color ${input.color} preview`}
                          style={{ maxWidth: '50px', maxHeight: '50px' }}
                        />
                      </div>
                    )}
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => setColorImageInputs(colorImageInputs.filter((_, i) => i !== index))}
                      style={{
                        background: '#ff4444',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addColorImageInput}
                style={{
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  marginTop: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                + Add Color Image
              </button>
            </div>
          </div>

          {/* Additional Options */}
          <div className="form-section" style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h3 className="section-title" style={{
              fontSize: '1.2rem',
              marginBottom: '1.5rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #eee'
            }}>Additional Options</h3>

            <div className="form-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="isOnSale"
                    checked={formData.isOnSale}
                    onChange={handleChange}
                  />
                  On Sale
                </label>
              </div>

              {formData.isOnSale && (
                <div className="form-group">
                  <label>Sale Percentage</label>
                  <input
                    type="number"
                    name="salePercentage"
                    value={formData.salePercentage}
                    onChange={handleChange}
                    min="1"
                    max="100"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
              )}

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                  />
                  In Stock
                </label>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="hotSale"
                    checked={formData.hotSale}
                    onChange={handleChange}
                  />
                  Hot Sale
                </label>
              </div>

              <div className="form-group">
                <label>Filter Sizes (comma-separated)</label>
                <input
                  type="text"
                  name="filterSizes"
                  value={formData.filterSizes.join(',')}
                  onChange={(e) => {
                    const sizes = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setFormData(prev => ({ ...prev, filterSizes: sizes }));
                  }}
                  placeholder="e.g. Small-66, medium-68, large-70, "
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-section" style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h3 className="section-title" style={{
              fontSize: '1.2rem',
              marginBottom: '1.5rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #eee'
            }}>Product Description</h3>

            <div className="form-group">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="8"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  minHeight: '150px'
                }}
                placeholder="Enter detailed product description..."
              ></textarea>
            </div>
          </div>

          {/* Products Table */}
          <div className="products-section" style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
            overflowX: 'auto'
          }}>
            <h3 className="section-title" style={{
              fontSize: '1.2rem',
              marginBottom: '1.5rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #eee'
            }}>Product List</h3>

            {loading ? (
              <div>Loading products...</div>
            ) : error ? (
              <div style={{ color: 'red' }}>Error: {error}</div>
            ) : (
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '1rem'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#f5f5f5',
                    textAlign: 'left',
                    borderBottom: '1px solid #ddd'
                  }}>
                    <th style={{ padding: '0.75rem' }}>Title</th>
                    <th style={{ padding: '0.75rem' }}>Category</th>
                    <th style={{ padding: '0.75rem' }}>Price</th>
                    <th style={{ padding: '0.75rem' }}>In Stock</th>
                    <th style={{ padding: '0.75rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '0.75rem' }}>{product.title}</td>
                        <td style={{ padding: '0.75rem' }}>
                          {product.category?.name || 'N/A'}
                        </td>
                        <td style={{ padding: '0.75rem' }}>₹{product.price?.toFixed(2)}</td>
                        <td style={{ padding: '0.75rem' }}>
                          {product.inStock ? 'Yes' : 'No'}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <button
                            onClick={() => handleEditProduct(product.slug)}
                            style={{
                              background: '#4CAF50',
                              color: 'white',
                              border: 'none',
                              padding: '0.4rem 0.8rem',
                              borderRadius: '4px',
                              marginRight: '0.5rem',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.slug)}
                            style={{
                              background: '#f44336',
                              color: 'white',
                              border: 'none',
                              padding: '0.4rem 0.8rem',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-actions" style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '2rem'
          }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#4a6cf7',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#3a5ce9'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#4a6cf7'}
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}