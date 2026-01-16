"use client";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// 1. IMPORT ICONS FROM react-icons (Replace these with the actual icons you want)
import { FaLightbulb, FaHome } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";

// 2. CREATE ALIASES for easier use in the steps array
const LightbulbIcon = FaLightbulb;
const MoneyIcon = MdAttachMoney;
const PencilIcon = BsPencilSquare;
const HomeIcon = FaHome;

export default function Features({ parentClass = "flat-spacing" }) {
  // 3. UPDATE THE STEPS ARRAY WITH THE ICON COMPONENTS
  const steps = [
    {
      icon: LightbulbIcon,
      title: "CREATING THE CONCEPT",
      description:
        "We build concepts with influential & futuristic design solutions.",
    },
    {
      icon: MoneyIcon,
      title: "BUDGET PLANNING",
      description:
        "Our budget-friendly plan makes us stand out in the industry.",
    },
    {
      icon: PencilIcon,
      title: "DESIGNING PROCESS",
      description:
        "The adept designers are the creative doctors who create a futuristic approach.",
    },
    {
      icon: HomeIcon,
      title: "BUILDING YOUR DREAM",
      description:
        "Infusing highly refined design sensibilities and inclination towards luxury.",
    },
  ];

  return (
    <section className={parentClass}>
      < div className="container ">
       <div className="heading-section text-center px-0">
          <h3 className="heading wow fadeInUp ">How we do it</h3>
          <p className="subheading text-secondary wow fadeInUp">
            The innovate approach
          </p>
        </div>
        
        <Swiper
          dir="ltr"
          className="swiper tf-sw-iconbox border-t border-l border-gray-300"
          spaceBetween={0}
          breakpoints={{
            1200: { slidesPerView: 4 },
            768: { slidesPerView: 3 },
            576: { slidesPerView: 2 },
            0: { slidesPerView: 1 },
          }}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spd2",
          }}
        >
          {steps.map((step) => (
            <SwiperSlide key={step.title}> 
              <div className="p-6 lg:p-8 bg-[#f5f3ee] h-full flex flex-col text-center border-r border-b border-gray-300">
                
                {/* ICON DISPLAYED HERE */}
                {step.icon && (
                  <div className="flex justify-center mb-4">
                    {/* Render the icon component */}
                    <step.icon className="w-8 h-8 lg:w-10 lg:h-10 text-gray-700" />
                  </div>
                )}
                
                <div className="flex-1 flex flex-col items-center justify-center">
                  <h6 className="text-sm lg:text-lg font-light tracking-[0.15em] text-gray-900 mb-3 leading-relaxed">
                    {step.title}
                  </h6>
                  <div className="w-12 lg:w-16 h-px bg-gray-300 mb-3"></div>
                  <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="sw-pagination-iconbox spd2 sw-dots type-circle justify-content-center" />
        </Swiper>
      </div>
    </section>
  );
}