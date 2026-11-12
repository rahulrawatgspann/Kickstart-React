
import React from "react";
import "./Alternating.css";

interface ContentstackAsset {
  url?: string;
  title?: string;
  filename?: string;
}

type AlternatingVariant =
  | "image_left_text_right"
  | "text_background"
  | "text_left_image_right";

interface AlternatingProps {
  layout_variant?: AlternatingVariant;
  heading?: string;
  description?: string;
  image?: ContentstackAsset | null;
  background_image?: ContentstackAsset | null;
  button_label?: string;
  button_url?: string;
  open_in_new_tab?: boolean;
  background_color?: string;
  overlay_opacity?: number;
}

const Alternating: React.FC<AlternatingProps> = ({
  layout_variant = "image_left_text_right",
  heading,
  description,
  image,
  background_image,
  button_label,
  button_url,
  open_in_new_tab = false,
  background_color,
  overlay_opacity = 55,
}) => {
  const imageUrl = image?.url;
  const backgroundImageUrl = background_image?.url;

  const sectionStyle = {
    backgroundColor:
      layout_variant === "image_left_text_right"
        ? background_color || "#000000"
        : undefined,
    backgroundImage:
      layout_variant !== "image_left_text_right" &&
      backgroundImageUrl
        ? `url("${backgroundImageUrl}")`
        : undefined,
    "--overlay-opacity": Math.min(
      100,
      Math.max(0, overlay_opacity)
    ) / 100,
  } as React.CSSProperties;

  const renderButton = () => {
    if (!button_label || !button_url) return null;

    return (
      <a
        href={button_url}
        className="alternating__button"
        target={open_in_new_tab ? "_blank" : undefined}
        rel={open_in_new_tab ? "noopener noreferrer" : undefined}
      >
        {button_label}
      </a>
    );
  };

  // Variant 1: Image Left, Text Right
  if (layout_variant === "image_left_text_right") {
    return (
      <section
        className="alternating alternating--image-left"
        style={sectionStyle}
      >
        <div className="alternating__image">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={image?.title || heading || ""}
            />
          )}
        </div>

        <div className="alternating__content">
          {heading && (
            <h2 className="alternating__heading">
              {heading}
            </h2>
          )}

          {description && (
            <p className="alternating__description">
              {description}
            </p>
          )}

          {renderButton()}
        </div>
      </section>
    );
  }

  // Variant 2: Text Over Background Image
  if (layout_variant === "text_background") {
    return (
      <section
        className="alternating alternating--text-background"
        style={sectionStyle}
      >
        <div className="alternating__overlay" />

        <div className="alternating__content">
          {heading && (
            <h2 className="alternating__heading">
              {heading}
            </h2>
          )}

          {description && (
            <p className="alternating__description">
              {description}
            </p>
          )}

          {renderButton()}
        </div>
      </section>
    );
  }

  // Variant 3: Text Left, Image Right + Background Image
  if (layout_variant === "text_left_image_right") {
    return (
      <section
        className="alternating alternating--text-left"
        style={sectionStyle}
      >
        <div className="alternating__overlay" />

        <div className="alternating__content">
          <div className="alternating__text">
            {heading && (
              <h2 className="alternating__heading">
                {heading}
              </h2>
            )}

            {description && (
              <p className="alternating__description">
                {description}
              </p>
            )}

            {renderButton()}
          </div>

          {imageUrl && (
            <div className="alternating__foreground-image">
              <img
                src={imageUrl}
                alt={image?.title || heading || ""}
              />
            </div>
          )}
        </div>
      </section>
    );
  }

  return null;
};

export default Alternating;
