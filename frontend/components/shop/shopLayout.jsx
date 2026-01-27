
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ShopLeftSidebarPage from "@/app/(products)/shop-left-sidebar/page";

export default function ShopLayout({ children, title }) {
  const pathname = usePathname();
  const formattedTitle = title || pathname.split('/').pop().charAt(0).toUpperCase() + 
                        pathname.split('/').pop().slice(1);

  return (
    <>
      <div className="page-title" style={{backgroundImage: "url(/images/section/page-title.jpg)"}}>
        <div className="container-full"> 
          <div className="row">
            <div className="col-12">
              <h3 className="heading text-center">{formattedTitle}</h3>
              <ul className="breadcrumbs d-flex align-items-center justify-content-center">
                <li>
                  <Link className="link" href="/">
                    Homepage
                  </Link>
                </li>
                <li>
                  <i className="icon-arrRight" />
                </li>
                <li>{formattedTitle}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <ShopLeftSidebarPage category={pathname.split('/').pop()} />
      {children}
    </>
  );
}