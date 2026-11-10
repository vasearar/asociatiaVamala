import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ArticleGalleryProps = {
  images: string[];
  title: string;
};

const AUTOPLAY_DELAY = 5000;

const ArticleGallery = ({ images, title }: ArticleGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  useEffect(() => {
    if (!hasMultipleImages) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(intervalId);
  }, [activeIndex, hasMultipleImages, images.length]);

  const showImage = (index: number) => {
    setActiveIndex((index + images.length) % images.length);
  };

  if (images.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl small-shadow bg-[#f1f1f1]">
        <img
          className="h-full w-full object-contain"
          src={images[activeIndex]}
          alt={`${title}${hasMultipleImages ? ` (${activeIndex + 1})` : ""}`}
          loading="eager"
        />

        {hasMultipleImages && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => showImage(activeIndex - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[#3F3F40] shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#5F9CFF]"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => showImage(activeIndex + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[#3F3F40] shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#5F9CFF]"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="mt-4 flex justify-center gap-2" aria-label="Image navigation">
          {images.map((image, index) => (
            <button
              type="button"
              key={`${image}-${index}`}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => showImage(index)}
              className={`h-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#5F9CFF] ${
                index === activeIndex
                  ? "w-7 bg-[#145EEC]"
                  : "w-2.5 bg-[#BDBFC0] hover:bg-[#5F9CFF]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleGallery;
