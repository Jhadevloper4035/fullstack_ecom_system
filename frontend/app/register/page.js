'use client'

import React, { Suspense, useState } from "react";
import Loader from "@/components/Loader";
import Nav from "@/components/headers/Nav";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import RegisterBody from '@/components/authCompo/RegisterBody'

export default function LoginPage() {
  
  return (
    <Suspense fallback={<Loader />}>
      <Header2 />
      
      <div className="login-page container my-5">
        <RegisterBody />
      </div>
      <Footer1 />
    </Suspense>
  )
}
