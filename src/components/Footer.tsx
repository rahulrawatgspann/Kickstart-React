type FooterProps = {
  data: any;
};

function Footer({ data }: FooterProps) {
  const footerData = data ?? {};

  return (
    <footer className="border-t bg-gray-100">
      <div className="mx-auto max-w-(--breakpoint-md) p-8">
        <div className="flex items-start justify-between gap-8">
          <div className="flex-1">
            {/* Logo */}
            {footerData?.logo?.url ? (
              <img
                src={footerData.logo.url}
                alt={footerData.logo.title || "Logo"}
                className="mb-6 h-10 w-auto"
              />
            ) : null}

            {/* Copyright */}
            {footerData?.copyright_info ? (
              <div
                className="mt-8 border-t pt-4 text-sm"
                dangerouslySetInnerHTML={{
                  __html: footerData.copyright_info,
                }}
              />
            ) : null}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-end gap-6 text-right">
            {footerData?.navigation_links?.map(
              (item: any, index: number) => (
                <a
                  key={index}
                  href={item?.url?.href || item?.url || "/"}
                  className="hover:underline"
                >
                  {item?.label || item?.url?.title}
                </a>
              )
            )}
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;