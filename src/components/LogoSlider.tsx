import { useState } from "react";

const sourceLogos = ["/logos/logo1.png", "/logos/logo2.png"];
// Repeat the available logos enough times that the marquee remains filled on
// wide screens before the duplicated half of the track begins.
const logos = Array.from({ length: 12 }, (_, index) =>
  sourceLogos[index % sourceLogos.length]
);

const LogoSlider = () => {
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <section
      aria-label="Partners"
      className="mt-28 overflow-hidden border-y border-[#BDBFC0] bg-white"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onTouchStart={() => setIsInteracting(true)}
      onTouchEnd={() => setIsInteracting(false)}
      onTouchCancel={() => setIsInteracting(false)}
    >
      <div className="logo-slider-track-wrap">
        <div
          className={`logo-slider-track ${
            isInteracting ? "logo-slider-paused" : ""
          }`}
        >
          {[0, 1].map((groupIndex) => (
            <div className="logo-slider-group" key={groupIndex} aria-hidden={groupIndex === 1}>
              {logos.map((logo, index) => (
                <button
                  type="button"
                  key={`${logo}-${index}`}
                  aria-label={`Partner logo ${(index % sourceLogos.length) + 1}`}
                  className="logo-slider-item"
                  tabIndex={groupIndex === 1 ? -1 : 0}
                  onFocus={() => setIsInteracting(true)}
                  onBlur={() => setIsInteracting(false)}
                  onPointerDown={() => setIsInteracting(true)}
                  onPointerUp={() => setIsInteracting(false)}
                >
                  <img
                    src={logo}
                    alt=""
                    className="logo-slider-image"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoSlider;
