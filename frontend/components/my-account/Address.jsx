"use client";
import React, { useEffect, useState } from "react";
import { addressApi } from "@/lib/api/addressApi";
import { useAuth } from "@/context/AuthContext";
export default function Address() {
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: true,
  });


  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      fetchAddresses()
    }
  }, [loading, user])


  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const response = await addressApi.getAll();

      if (response.fomatedAdresses) {
        setAddresses(
          response.fomatedAdresses.map((a) => ({
            ...a,
            isEditing: false,
          }))
        );
      }
    } catch {
      setError("Failed to load addresses");
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "phoneNumber" || name === "postalCode") {
      if (!/^\d*$/.test(value)) return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const response = await addressApi.create(form);
      if (response.success) {
        setShowCreateForm(false);
        setForm({
          fullName: "",
          phoneNumber: "",
          addressLine1: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          isDefault: true,
        });
        fetchAddresses();
      }
    } catch {
      setError("Failed to add address");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
    try {
      const response = await addressApi.delete(id);
      if (response.success) {
        setAddresses((prev) => prev.filter((a) => a.id !== id)
        );
      }
    } catch {
      setError("Failed to delete address");
    }
  };


  const toggleEdit = (id) => {
    setAddresses((prev) =>
      prev.map((a) =>
        a._id === id ? { ...a, isEditing: !a.isEditing } : a
      )
    );
  };

  return (
    <div className="my-account-content">
      <div className="account-address">
        <div className="text-center widget-inner-address">
          <button
            className="tf-btn btn-fill radius-4 mb_20 btn-address"
            onClick={() => setShowCreateForm((prev) => !prev)}
          >
            <span className="text text-caption-1">Add a new address</span>
          </button>

          {showCreateForm && (
            <form
              className="show-form-address wd-form-address d-block"
              onSubmit={handleAddAddress}
            >
              <div className="title">Add a new address</div>

              <fieldset className="mb_20">
                <input
                  name="fullName"
                  placeholder="Full Name*"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </fieldset>

              <fieldset className="mb_20">
                <input
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  maxLength={10}
                  required
                />
              </fieldset>
              <fieldset className="mb_20">
                <input
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  required
                />

              </fieldset>
              <fieldset className="mb_20">
                <input
                  name="postalCode"
                  placeholder="Postal Code"
                  value={form.postalCode}
                  onChange={handleChange}
                  maxLength={6}
                  required
                />

              </fieldset>
              <fieldset className="mb_20">
                <input
                  name="addressLine1"
                  placeholder="Address*"
                  value={form.addressLine1}
                  onChange={handleChange}
                  required
                />
              </fieldset>

              <fieldset className="mb_20">
                <input
                  name="city"
                  placeholder="City*"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </fieldset>

              <fieldset className="mb_20">
                <input
                  name="country"
                  placeholder="Country*"
                  value={form.country}
                  onChange={handleChange}
                  required
                />
              </fieldset>

              <div className="tf-cart-checkbox mb_20">
                <div className="tf-checkbox-wrapp">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={form.isDefault}
                    onChange={handleChange}
                  />
                  <div>
                    <i className="icon-check" />
                  </div>
                </div>
                <label>Set as default address.</label>
              </div>

              <div className="d-flex gap-20 justify-content-center">
                <button
                  type="submit"
                  className="tf-btn btn-fill radius-4"
                  disabled={submitting}
                >
                  <span className="text">
                    {submitting ? "Saving…" : "Add address"}
                  </span>
                </button>

                <span
                  className="tf-btn btn-fill radius-4"
                  onClick={() => setShowCreateForm(false)}
                >
                  <span className="text">Cancel</span>
                </span>
              </div>
            </form>
          )}

          <div className="list-account-address">
            {loadingAddresses && <p>Loading addresses…</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {addresses.map((address) => (
              <div className="account-address-item" key={address.id}>
                <h6 className="mb_20">
                  {address.isDefault ? "Default" : address.type || "Address"}
                </h6>

                <p>{address.fullName}</p>
                <p>{address.fullAddress}</p>
                <p>{address.country}</p>
                <p className="mb_10">{address.phoneNumber}</p>

                <div className="d-flex gap-10 justify-content-center">
                  <button
                    className="tf-btn radius-4 btn-fill justify-content-center"
                    onClick={() => toggleEdit(address.id)}
                  >
                    <span className="text">Edit</span>
                  </button>

                  <button
                    className="tf-btn radius-4 btn-outline justify-content-center"
                    onClick={() => handleDelete(address.id)}
                  >
                    <span className="text">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
