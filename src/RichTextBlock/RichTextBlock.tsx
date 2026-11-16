
import React from "react";
import DOMPurify from "dompurify";
import "./RichTextBlock.css";

interface RichTextBlockProps {
  section_heading?: string;
  rich_text_content?: string;
  background_color?: string;
  content_alignment?: "left" | "center" | "right";
  $?: Record<string, any>;
}

const RichTextBlock: React.FC<RichTextBlockProps> = ({
  section_heading,
  rich_text_content,
  background_color,
  content_alignment = "left",
  $,
}) => {
  const sanitizedContent = DOMPurify.sanitize(
    rich_text_content || ""
  );

  return (
    <section
      className="rich-text-block"
      style={{
        backgroundColor: background_color || "transparent",
      }}
    >
      <div className="rich-text-block__container">

        {section_heading && (
          <h2 className="rich-text-block__heading">
            {section_heading}
          </h2>
        )}

        <div
          className="rich-text-block__content"
          style={{ textAlign: content_alignment }}
          {...($?.rich_text_content || {})}
          dangerouslySetInnerHTML={{
            __html: sanitizedContent,
          }}
        />

      </div>
    </section>
  );
};

export default RichTextBlock;
