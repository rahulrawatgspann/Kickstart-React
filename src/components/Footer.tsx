type FooterProps = {
  data: any;
};

function Footer({ data }: FooterProps) {
  return (
    <footer className="border-t bg-gray-100">
      <div className="max-w-(--breakpoint-md) mx-auto p-8">

        {/* Logo */}
        {data?.logo?.url ? (
          <img
            src={data.logo.url}
            alt={data.logo.title || "Logo"}
            className="h-10 w-auto mb-6"
          />
        ) : null}

        {/* Navigation Links */}
        <div className="flex flex-wrap gap-6">
          {data?.navigation_links?.map(
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
        </div>

        {/* Copyright */}
        {data?.copyright_info ? (
          <div
            className="mt-8 pt-4 border-t text-sm"
            dangerouslySetInnerHTML={{
              __html: data.copyright_info,
            }}
          />
        ) : null}

      </div>
    </footer>
  );
}

export default Footer;