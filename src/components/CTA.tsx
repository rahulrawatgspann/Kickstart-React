
import { Button, Heading } from "@contentstack/venus-components";

interface CTAProps {
  data?: {
    title?: string;
    description?: string;
    button_text?: string;
    button_url?: {
      href?: string;
      url?: string;
      title?: string;
    } | string;
    button_style?: string;
  };
}

const CTA = ({ data }: CTAProps) => {
  console.debug('🚀 ~ CTA.tsx:19 ~ CTA ~ data:', data);
  if (!data) return null;

  const {
    title,
    description,
    button_text,
    button_url,
    button_style,
  } = data;

  const href =
    typeof button_url === "string"
      ? button_url
      : button_url?.href || button_url?.url;

  const buttonType =
    button_style?.toLowerCase() === "secondary"
      ? "secondary"
      : "primary";

  const handleClick = () => {
    if (href) {
      window.location.assign(href);
    }
  };

  return (
    <section className="max-w-4xl mx-auto my-10 p-8 bg-slate-100 rounded-lg">

      {title && (
        <Heading
          tagName="h2"
          text={title}
        />
      )}

      {description && (
        <p className="my-4 text-gray-600">
          {description}
        </p>
      )}

      {button_text && href && (
        <Button
          buttonType={buttonType}
          onClick={handleClick}
        >
          {button_text}
        </Button>
      )}

    </section>
  );
};

export default CTA;
