'use client'

import React, { Suspense, useState } from "react";
import Loader from "@/components/Loader";
import Nav from "@/components/headers/Nav";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import LoginBody from '@/components/authCompo/LoginBody'

export default function LoginPage() {
  
  return (
    <Suspense fallback={<Loader />}>
      <Header2 />
      
      <div className="login-page container my-5">
        <LoginBody />
      </div>
      <Footer1 />
    </Suspense>
  )
}
