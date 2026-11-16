import { useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import "./HeroCarousel.css";

interface ContentstackAsset {
  url?: string;
  title?: string;
  filename?: string;
}

interface HeroSlide {
  slide_title?: string;
  slide_description?: string;
  slide_image?: ContentstackAsset;
  image_alt_text?: string;
  _metadata?: {
    uid?: string;
  };
  $?: Record<string, any>;
}

interface HeroCarouselProps {
  slides?: HeroSlide[];
}

const HeroCarousel = ({
  slides = [],
}: HeroCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const validSlides = useMemo(
    () => slides.filter((slide) => slide.slide_image?.url),
    [slides]
  );

  // Infinite autoplay
  useEffect(() => {
    if (validSlides.length < 2 || isPaused) return;

    const interval = window.setInterval(() => {
      setActiveIndex((previous) =>
        (previous + 1) % validSlides.length
      );
    }, 5000);

    return () => window.clearInterval(interval);
  }, [validSlides.length, isPaused]);

  if (!validSlides.length) return null;

  const activeSlide = validSlides[activeIndex];

  const showPrevious = () => {
    setActiveIndex((previous) =>
      previous === 0 ? validSlides.length - 1 : previous - 1
    );
  };

  const showNext = () => {
    setActiveIndex((previous) =>
      previous === validSlides.length - 1 ? 0 : previous + 1
    );
  };

  const selectSlide = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="hero-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}>
      {/* Main Hero */}
      <div
        className="hero-carousel__main"
        style={{
          backgroundImage: `url("${activeSlide.slide_image?.url}")`,
        }}
      >
        <div className="hero-carousel__main-overlay" />

        <div className="hero-carousel__main-content">
          {activeSlide.slide_title && (
            <h2>{activeSlide.slide_title}</h2>
          )}

          {activeSlide.slide_description && (
            <div
              className="hero-carousel__description"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(activeSlide.slide_description || ""),
              }}
            />
          )}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="hero-carousel__navigation">

        <button
          type="button"
          className="hero-carousel__arrow"
          onClick={showPrevious}
          aria-label="Previous slide"
          disabled={validSlides.length < 2}
        >
          &#10094;
        </button>

        <div className="hero-carousel__cards">
          {validSlides.map((slide, index) => (
            <button
              type="button"
              key={
                slide._metadata?.uid ||
                `${slide.slide_title}-${index}`
              }
              className={`hero-carousel__card ${activeIndex === index
                ? "hero-carousel__card--active"
                : ""
                }`}
              onClick={() => selectSlide(index)}
              aria-label={`Show slide ${index + 1}: ${slide.slide_title || ""}`}
              aria-pressed={activeIndex === index}
            >
              <img
                src={slide.slide_image?.url}
                alt={slide.image_alt_text || slide.slide_title || ""}
              />

              <span className="hero-carousel__card-overlay" />

              <span className="hero-carousel__card-content">
                <strong>{slide.slide_title}</strong>

                {slide.slide_description && (
                  <span
                    className="hero-carousel__card-description"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(slide.slide_description || ""),
                    }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="hero-carousel__arrow"
          onClick={showNext}
          aria-label="Next slide"
          disabled={validSlides.length < 2}
        >
          &#10095;
        </button>

      </div>

    </section>
  );
};

export default HeroCarousel;
