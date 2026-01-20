"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { addressApi } from '@/lib/api/addressApi'

export default function Information() {
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [newPasswordType, setNewPasswordType] = useState("password");
  const { user, loading, logout } = useAuth();
  const togglePassword = () => {
    setPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const toggleConfirmPassword = () => {
    setConfirmPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };
  const toggleNewPassword = () => {
    setNewPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  useEffect(() => {
    if (!loading && user) {
      loadDefaultAddress();
    }
  }, [loading, user]);

  const loadDefaultAddress = async () => {
    try {
      const response = await addressApi.getAll();

      const addresses = response.fomatedAdresses || [];
      // const defaultAddress = addresses.find(a => a.isDefault);
      const defaultAddress = addresses[0];
      
      if (defaultAddress) {
        const nameParts = defaultAddress.fullName.trim().split(" ");

        setProfile({
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          phone: defaultAddress.phoneNumber || "",
        });
        console.log("Default address loaded:", defaultAddress);
        console.log("firstname:", nameParts[0]);
        console.log("lastname:", nameParts.slice(1).join(" "));

      }
      else
      {
        console.log("No default address found.", addresses);
      }
    } catch (err) {
      console.error("Failed to load default address", err);
    }
  };

  return (
    <div className="my-account-content">
      <div className="account-details">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="form-account-details form-has-password"
        >
          <div className="account-info">
            <h5 className="title">Information</h5>
            <div className="cols mb_20">
              <fieldset className="">
                <input
                  type="text"
                  placeholder="First Name*"
                  value={profile.firstName}
                  readOnly
                />
              </fieldset>
              <fieldset className="">
                <input
                  type="text"
                  placeholder="Last Name*"
                  value={profile.lastName}
                  readOnly
                />
              </fieldset>
            </div>
            <div className="cols mb_20">
              <fieldset className="">
                <input
                  className=""
                  type="email"
                  placeholder="Username or email address*"
                  name="email"
                  tabIndex={2}
                  defaultValue={user ? user.email : "email@domain.com"}
                  aria-required="true"
                  readOnly
                />
              </fieldset>
              <fieldset className="">
                <input
                  type="text"
                  placeholder="Phone*"
                  value={profile.phone}
                  readOnly
                />
              </fieldset>
            </div>
          </div>
          <div className="button-submit">
            <button className="tf-btn btn-fill" type="submit">
              <span className="text text-button">Update Account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
