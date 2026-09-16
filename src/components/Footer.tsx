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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data?.navigation_links?.map(
            (section: any, index: number) => (
              <div key={index}>
                <h3 className="font-semibold mb-3">
                  {section?.title}
                </h3>

                <ul className="space-y-2">
                  {section?.link?.map(
                    (item: any, linkIndex: number) => (
                      <li key={linkIndex}>
                        <a
                          href={
                            item?.url?.href ||
                            item?.url ||
                            "/"
                          }
                          className="hover:underline"
                        >
                          {item?.label || item?.title}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
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