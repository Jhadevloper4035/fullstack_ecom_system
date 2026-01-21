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

      if (response.success && response.data) {
        // 1️⃣ Close form immediately
        setShowCreateForm(false);

        // 2️⃣ Optimistic UI update
        setAddresses((prev) => [
          {
            ...response.data,
            isEditing: false,
          },
          ...prev,
        ]);

        // 3️⃣ Reset form
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

        // 4️⃣ Sync with backend silently
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

    // Optimistic UI
    setAddresses((prev) => prev.filter((a) => a.id !== id));

    try {
      await addressApi.delete(id);
    } catch {
      setError("Failed to delete address");
      fetchAddresses(); // rollback if needed
    }
  };


  const toggleEdit = (id) => {
    setAddresses((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, isEditing: !a.isEditing } : a
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

              <div className="cols mb_20">
                <fieldset className="">
                  <input
                    className=""
                    type="text"
                    placeholder="Full Name*"
                    value={form.fullName}
                    onChange={handleChange}
                    name="fullName"
                    tabIndex={2}
                    defaultValue=""
                    aria-required="true"
                    required
                  />
                </fieldset>
                <fieldset className="">
                  <input
                    className=""
                    type="text"
                    placeholder="Phone Number*"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    name="phoneNumber"
                    maxLength={10}
                    aria-required="true"
                    required
                  />
                </fieldset>
              </div>



              <div className="cols mb_20">
                <fieldset className="">
                  <input
                    className=""
                    type="text"
                    placeholder="State*"
                    value={form.state}
                    onChange={handleChange}
                    name="state"
                    tabIndex={2}
                    defaultValue=""
                    aria-required="true"
                    required
                  />
                </fieldset>
                <fieldset className="">
                  <input
                    name="postalCode"
                    className=""
                    type="text"
                    placeholder="Postal Code*"
                    value={form.postalCode}
                    onChange={handleChange}
                    maxLength={6}
                    aria-required="true"
                    required
                  />
                </fieldset>
              </div>

              <fieldset className="">
                <input
                  className="mb_20"
                  type="text"
                  placeholder="Address Line 1*"
                  value={form.addressLine1}
                  onChange={handleChange}
                  name="addressLine1"
                  tabIndex={2}
                  defaultValue=""
                  aria-required="true"
                  required
                />
              </fieldset>

              <div className="cols mb_20">
                <fieldset className="">
                  <input
                    name="city"
                    className=""
                    type="text"
                    placeholder="City*"
                    value={form.city}
                    onChange={handleChange}
                    aria-required="true"
                    required
                  />
                </fieldset>
                <fieldset className="">
                  <input
                    className=""
                    type="text"
                    placeholder="country*"
                    value={form.country}
                    onChange={handleChange}
                    name="country"
                    tabIndex={2}
                    defaultValue=""
                    aria-required="true"
                    required
                  />
                </fieldset>

              </div>


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

                {!address.isEditing ? (
                  <>
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
                  </>
                ) : (
                  <form className="edit-form-address wd-form-address d-block">
                    <div className="title">Edit address</div>

                    <fieldset className="mb_20">
                      <input
                        value={address.fullName}
                        onChange={(e) =>
                          setAddresses((prev) =>
                            prev.map((a) =>
                              a.id === address.id
                                ? { ...a, fullName: e.target.value }
                                : a
                            )
                          )
                        }
                        required
                      />
                    </fieldset>

                    <fieldset className="mb_20">
                      <input
                        value={address.phoneNumber}
                        onChange={(e) =>
                          setAddresses((prev) =>
                            prev.map((a) =>
                              a.id === address.id
                                ? { ...a, phoneNumber: e.target.value }
                                : a
                            )
                          )
                        }
                        required
                      />
                    </fieldset>

                    <fieldset className="mb_20">
                      <input
                        value={address.addressLine1 || ""}
                        onChange={(e) =>
                          setAddresses((prev) =>
                            prev.map((a) =>
                              a.id === address.id
                                ? { ...a, addressLine1: e.target.value }
                                : a
                            )
                          )
                        }
                        required
                      />
                    </fieldset>

                    <div className="d-flex gap-10 justify-content-center">
                      <button
                        type="button"
                        className="tf-btn btn-fill radius-4"
                        onClick={() => toggleEdit(address.id)}
                      >
                        <span className="text">Save</span>
                      </button>

                      <span
                        className="tf-btn btn-fill radius-4"
                        onClick={() => toggleEdit(address.id)}
                      >
                        <span className="text">Cancel</span>
                      </span>
                    </div>
                  </form>
                )}
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}
