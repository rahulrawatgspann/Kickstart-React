type FooterProps = {
  data?: any;
};

const getField = (data: any, names: string[]) => {
  const normalizedNames = names.map((name) => name.replace(/[-_\s]/g, "").toLowerCase());
  const key = Object.keys(data || {}).find((item) =>
    normalizedNames.includes(item.replace(/[-_\s]/g, "").toLowerCase())
  );

  return key ? data[key] : undefined;
};

const getUrl = (value: any) => {
  const url =
    value?.icon_url?.url ||
    value?.icon_url?.href ||
    value?.iconUrl?.url ||
    value?.iconUrl?.href ||
    value?.social_url?.url ||
    value?.social_url?.href ||
    value?.external_url?.url ||
    value?.external_url?.href ||
    value?.link?.href ||
    value?.link?.url ||
    value?.url?.href ||
    value?.url?.url ||
    value?.href ||
    (typeof value?.icon_url === "string" ? value.icon_url : undefined) ||
    (typeof value?.iconUrl === "string" ? value.iconUrl : undefined) ||
    (typeof value?.social_url === "string" ? value.social_url : undefined) ||
    (typeof value?.external_url === "string" ? value.external_url : undefined) ||
    (typeof value?.url === "string" ? value.url : undefined) ||
    (typeof value?.link === "string" ? value.link : undefined);

  return typeof url === "string" ? url : "#";
};

const getText = (value: any, fallback: string): string => {
  if (typeof value === "string" || typeof value === "number") return String(value);

  if (value && typeof value === "object") {
    return (
      getText(value.label, "") ||
      getText(value.title, "") ||
      getText(value.name, "") ||
      getText(value.value, "") ||
      fallback
    );
  }

  return fallback;
};

const getImage = (value: any) =>
  value?.image?.url ||
  value?.image2?.url ||
  value?.icon?.url ||
  value?.logo?.url ||
  value?.url?.image?.url ||
  value?.url?.image2?.url;

const getLinkItems = (column: any) => {
  const links = column?.links || column?.navigation_links || column?.items;

  if (Array.isArray(links)) return links;
  if (column?.link || column?.label || column?.url) return [column];

  return [];
};

const getLinkLabel = (link: any) => {
  const label = getText(
    link?.label ||
    link?.link?.title ||
    link?.link?.label ||
    link?.title ||
    link?.name ||
    link?.platform ||
    link?.social_network ||
    link?.icon?.title ||
    link?.image?.title ||
    link?.url?.title ||
    link?.url?.label,
    ""
  );

  if (label) return label;

  try {
    return new URL(getUrl(link)).hostname.replace(/^www\./, "").split(".")[0] || "Link";
  } catch {
    return "Link";
  }
};

const getCta = (data: any) => {
  const cta = getField(data, ["cta_button", "cta", "call_to_action", "connect_with_us"]);
  const button = Array.isArray(cta) ? cta[0] : cta;

  if (button) return button;

  const label = getField(data, ["cta_label", "cta_title", "button_text"]);
  const url = getField(data, ["cta_url", "button_url"]);

  return label || url ? { label, url } : undefined;
};

function Footer({ data }: FooterProps) {
  if (!data) return null;

  const columns = getField(data, ["feature_columns", "footer_columns", "columns"]) ||
    (data.navigation_links ? [{ links: data.navigation_links }] : []);
  const socialLinks = getField(data, ["social_links", "social_media_links", "social_media"]) || [];
  const companyLogos = getField(data, ["company_logos", "company_links", "cards"]) || [];
  const legalLinks = getField(data, ["legal_links", "bottom_links"]) || [];
  const copy = getField(data, ["description", "copy", "footer_copy", "content", "rich_text"]);
  const copyright = getField(data, ["copyright_info", "copyright", "copyright_text", "copyright_notice"]);
  const cta = getCta(data);
  const ctaLabel = getText(cta?.button_text || cta?.label || cta?.title || cta?.text, "Connect With Us");

  return (
    <footer className="bg-[#073451] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr_0.8fr]">
          <div>
            {getImage(data) ? (
              <img src={getImage(data)} alt="Company logo" className="mb-6 h-9 w-auto" />
            ) : null}
            {data.title ? <h2 className="mb-3 text-xl font-normal">{data.title}</h2> : null}
            {typeof copy === "string" && copy ? (
              <div className="max-w-md text-sm leading-6 text-white/80" dangerouslySetInnerHTML={{ __html: copy }} />
            ) : null}
            {cta ? (
              <a href={getUrl(cta)} className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-sky-600 px-6 text-sm font-medium uppercase hover:bg-sky-500">
                {ctaLabel}
              </a>
            ) : null}
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((column: any, index: number) => (
              <div key={column?._metadata?.uid || index}>
                <h3 className="mb-4 text-xs font-semibold uppercase text-[#9da8d0]">{column?.heading || column?.title || column?.name}</h3>
                <ul className="space-y-3 text-sm">
                  {getLinkItems(column).map((link: any, linkIndex: number) => (
                    <li key={link?._metadata?.uid || linkIndex}>
                      <a href={getUrl(link)} className="hover:text-[#9da8d0]">{getLinkLabel(link)}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex items-start justify-start lg:justify-end">
            <div className="flex gap-3">
              {socialLinks.map((link: any, index: number) => (
                <a key={link?._metadata?.uid || index} href={getUrl(link)} aria-label={getLinkLabel(link)}>
                  {getImage(link) ? <img src={getImage(link)} alt="Social icon" className="h-9 w-9 rounded-full p-2" /> : null}
                </a>
              ))}
            </div>
          </div>
        </div>

        {companyLogos.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-[#9da8d0]/40 pt-6 sm:grid-cols-4 lg:grid-cols-8">
            {companyLogos.map((item: any, index: number) => (
              <a key={item?._metadata?.uid || index} href={getUrl(item)} className="flex h-16 items-center justify-center">
                {getImage(item) ? <img src={getImage(item)} alt="Company logo" className="max-h-10 w-auto max-w-full object-contain" /> : null}
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <div className="bg-[#070a15]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-3 text-xs text-white/80 lg:px-8">
          {legalLinks.length > 0 ? (
            <nav className="flex flex-wrap gap-x-2 gap-y-1">
              {legalLinks.map((link: any, index: number) => (
                <span key={link?._metadata?.uid || index} className="flex gap-2">
                  <a href={getUrl(link)} className="hover:text-white">{getLinkLabel(link)}</a>
                  {index < legalLinks.length - 1 ? <span>|</span> : null}
                </span>
              ))}
            </nav>
          ) : null}
          {typeof copyright === "string" && copyright ? (
            <div dangerouslySetInnerHTML={{ __html: copyright }} />
          ) : null}
        </div>
      </div>
    </footer>
  );
}

export default Footer;