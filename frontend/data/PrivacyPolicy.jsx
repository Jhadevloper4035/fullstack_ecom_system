"use client";

import { useEffect, useState } from "react";

const sectionIds = [
  "introduction",
  "information-collection",
  "use-of-information",
  "data-security",
  "cookies",
  "your-rights",
  "changes-to-policy"
];

const sections = [
  { id: 1, text: "Introduction", scroll: "introduction" },
  { id: 2, text: "Information We Collect", scroll: "information-collection" },
  { id: 3, text: "How We Use Your Information", scroll: "use-of-information" },
  { id: 4, text: "Data Security", scroll: "data-security" },
  { id: 5, text: "Cookies", scroll: "cookies" },
  { id: 6, text: "Your Rights", scroll: "your-rights" },
  { id: 7, text: "Changes to This Policy", scroll: "changes-to-policy" },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-50% 0px",
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  const handleClick = (id) => {
    document
      .getElementById(id)
      .scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="terms-of-use-wrap">
          <div className="left sticky-top">
            {sections.map(({ id, text, scroll }) => (
              <h6
                key={id}
                onClick={() => handleClick(scroll)}
                className={`btn-scroll-target ${
                  activeSection === scroll ? "active" : ""
                }`}
              >
                {id}. {text}
              </h6>
            ))}
          </div>
          <div className="right">
            <h4 className="heading">Privacy Policy</h4>
            
            <div className="terms-of-use-item item-scroll-target" id="introduction">
              <h5 className="terms-of-use-title">1. Introduction</h5>
              <div className="terms-of-use-content">
                <p>
                  Welcome to CURVE & COMFY. We are committed to protecting your personal information and your right to privacy. 
                  This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
                </p>
                <p>
                  If you have any questions or concerns about this privacy policy, please contact us at privacy@CURVE & COMFY.com.
                </p>
              </div>
            </div>

            <div className="terms-of-use-item item-scroll-target" id="information-collection">
              <h5 className="terms-of-use-title">2. Information We Collect</h5>
              <div className="terms-of-use-content">
                <p>We collect personal information that you voluntarily provide to us when you:</p>
                <ul>
                  <li>Register on our website</li>
                  <li>Fill out a contact form</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Make a purchase</li>
                  <li>Contact us directly</li>
                </ul>
                <p>
                  The personal information we may collect includes your name, email address, phone number, 
                  mailing address, payment information, and any other information you choose to provide.
                </p>
              </div>
            </div>

            <div className="terms-of-use-item item-scroll-target" id="use-of-information">
              <h5 className="terms-of-use-title">3. How We Use Your Information</h5>
              <div className="terms-of-use-content">
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Provide, operate, and maintain our services</li>
                  <li>Process your transactions</li>
                  <li>Send you marketing and promotional communications</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Improve our website and user experience</li>
                  <li>Prevent fraudulent transactions and monitor against theft</li>
                </ul>
              </div>
            </div>

            <div className="terms-of-use-item item-scroll-target" id="data-security">
              <h5 className="terms-of-use-title">4. Data Security</h5>
              <div className="terms-of-use-content">
                <p>
                  We implement appropriate technical and organizational measures to protect the security of your personal information. 
                  However, please note that no method of transmission over the internet or method of electronic storage is 100% secure.
                </p>
              </div>
            </div>

            <div className="terms-of-use-item item-scroll-target" id="cookies">
              <h5 className="terms-of-use-title">5. Cookies</h5>
              <div className="terms-of-use-content">
                <p>
                  We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </div>
            </div>

            <div className="terms-of-use-item item-scroll-target" id="your-rights">
              <h5 className="terms-of-use-title">6. Your Rights</h5>
              <div className="terms-of-use-content">
                <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
                <ul>
                  <li>The right to access and receive a copy of your personal information</li>
                  <li>The right to request correction of your personal information</li>
                  <li>The right to request deletion of your personal information</li>
                  <li>The right to object to or restrict processing of your personal information</li>
                  <li>The right to data portability</li>
                </ul>
              </div>
            </div>

            <div className="terms-of-use-item item-scroll-target" id="changes-to-policy">
              <h5 className="terms-of-use-title">7. Changes to This Policy</h5>
              <div className="terms-of-use-content">
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                  Privacy Policy on this page and updating the "Last Updated" date.
                </p>
                <p>Last Updated: December 9, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
