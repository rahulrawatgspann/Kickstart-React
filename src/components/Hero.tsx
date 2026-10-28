
interface HeroProps {
  data: {
    heading?: string;
    description?: string;
    image?: {
      url?: string;
      title?: string;
    };
    cta_text?: string;
    cta_url?: {
      href?: string;
      title?: string;
    };
    $?: any;
  };
}

const Hero = ({ data }: HeroProps) => {
  if (!data) return null;

  return (
    <section className="hero">
      {data.image?.url && (
        <img
          src={data.image.url}
          alt={data.image.title || data.heading || "Hero"}
          {...(data.image?.$ && data.image.$.url)}
        />
      )}

      <div className="hero-content">
        <h1 {...(data.$ && data.$.heading)}>
          {data.heading}
        </h1>

        <p {...(data.$ && data.$.description)}>
          {data.description}
        </p>

        {data.cta_text && (
          <a
            href={data.cta_url?.href || "#"}
            className="hero-button"
            {...(data.$ && data.$.cta_text)}
          >
            {data.cta_text}
          </a>
        )}
      </div>
    </section>
  );
};

export default Hero;
