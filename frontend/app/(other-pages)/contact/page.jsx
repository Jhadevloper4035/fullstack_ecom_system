import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Topbar6 from "@/components/headers/Topbar6";
import Contact2 from "@/components/otherPages/Contact2";
import React from "react";

export const metadata = {
  title: "Contact || CURVE & COMFY",
  description: "CURVE & COMFY",
};

export default function ContactPage() {
  return (
    <>
      <Topbar6 bgColor="bg-main" />
      <Header2 />
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56124.789062693315!2d76.9908941941086!3d28.45546538268922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1937dafd43af%3A0x8b73e267e5170935!2sDLF%20Building%209B%2C%20Cyber%20City%20Gurugram!5e0!3m2!1sen!2sin!4v1767697471806!5m2!1sen!2sin"
        width={600}
        height={450}
        style={{ border: 0, width: "100%" }}
        allowFullScreen=""
        loading="lazy"
      />
      <Contact2 />
      <Footer1 />
    </>
  );
}
