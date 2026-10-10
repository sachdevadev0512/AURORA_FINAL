"use client";

import React from "react";
import ParticleSphereAnimation from "./orbiting-circles-02-utils/particalsphear";
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Truck,
  Megaphone,
  Bot,
  Plug,
} from "lucide-react";

const BLUE_COLOR = "#133b6b";

const featureIcons = [
  { Icon: LayoutDashboard, label: "Dashboard", color: BLUE_COLOR },
  { Icon: Package, label: "Inventory", color: BLUE_COLOR },
  { Icon: DollarSign, label: "Repricer", color: BLUE_COLOR },
  { Icon: Truck, label: "Orders", color: BLUE_COLOR },
  { Icon: Megaphone, label: "Advertising", color: BLUE_COLOR },
  { Icon: Bot, label: "AI Assistant", color: BLUE_COLOR },
  { Icon: Plug, label: "Integration", color: BLUE_COLOR },
];

const orbits = [
  {
    size: "w-[170px] h-[170px] sm:w-[210px] sm:h-[210px] md:w-[260px] md:h-[260px]",
    duration: 14,
    icons: [
      { featureIdx: 0, angle: -60 },
      { featureIdx: 1, angle: 60 },
      { featureIdx: 2, angle: 180 },
    ],
  },
  {
    size: "w-[240px] h-[240px] sm:w-[290px] sm:h-[290px] md:w-[360px] md:h-[360px]",
    duration: 19,
    icons: [
      { featureIdx: 3, angle: 0 },
      { featureIdx: 4, angle: 180 },
    ],
  },
  {
    size: "w-[310px] h-[310px] sm:w-[370px] sm:h-[370px] md:w-[450px] md:h-[450px]",
    duration: 24,
    icons: [
      { featureIdx: 5, angle: -45 },
      { featureIdx: 6, angle: 135 },
    ],
  },
];

export default function OrbitingCirclesGlobeDemo() {
  return (
    <div className="relative w-full h-[190px] sm:h-[225px] md:h-[275px] overflow-visible flex justify-center pt-6">
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(var(--start-angle)); }
          to { transform: rotate(calc(var(--start-angle) + 360deg)); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(var(--start-angle)); }
          to { transform: rotate(calc(var(--start-angle) - 360deg)); }
        }
        @keyframes counter-cw {
          from { transform: rotate(var(--counter-offset, 0deg)); }
          to { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)); }
        }
        @keyframes counter-ccw {
          from { transform: rotate(var(--counter-offset, 0deg)); }
          to { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)); }
        }
      `}</style>

      {/* Center particle globe */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 aspect-square pointer-events-none w-[180px] sm:w-[230px] md:w-[290px] z-10">
        <ParticleSphereAnimation />
      </div>

      {/* Orbiting rings */}
      {orbits.map((orbit, index) => {
        const isCW = index % 2 === 0;
        const orbitAnim = isCW ? "orbit-cw" : "orbit-ccw";
        const counterAnim = isCW ? "counter-cw" : "counter-ccw";

        return (
          <div
            key={index}
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border border-slate-200/80 ${orbit.size}`}
          >
            {orbit.icons.map((iconData, iconIndex) => {
              const feature = featureIcons[iconData.featureIdx];
              const IconComponent = feature.Icon;
              return (
                <div
                  key={iconIndex}
                  className="absolute top-0 left-1/2 h-1/2 -ml-6 md:-ml-7 origin-bottom flex flex-col justify-start items-center will-change-transform"
                  style={
                    {
                      "--start-angle": `${iconData.angle}deg`,
                      animation: `${orbitAnim} ${orbit.duration}s linear infinite`,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="p-2.5 md:p-3 border border-[#b5cbe8] rounded-full bg-white shadow-xs shadow-blue-900/5 -mt-6 md:-mt-7 relative z-10 transition-transform duration-300 hover:scale-110 hover:border-[#133b6b]"
                    style={
                      {
                        "--counter-offset": `${-iconData.angle}deg`,
                        animation: `${counterAnim} ${orbit.duration}s linear infinite`,
                      } as React.CSSProperties
                    }
                  >
                    <IconComponent
                      className="w-4 h-4 md:w-5 md:h-5 text-[#133b6b]"
                      strokeWidth={1.9}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
