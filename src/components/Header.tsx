type HeaderProps = {
  data: any;
};

const languages = [
  { code: "", label: "English" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
];

function Header({ data }: HeaderProps) {
  const pathname = window.location.pathname;

  const currentLocale = pathname.split("/")[1] || "en";

  const getPagePath = () => {
    const path = pathname.replace(/^\/(en|fr|de|es)/, "");
    return path || "/";
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLocale = event.target.value;
    const pagePath = getPagePath();

    const newPath =
      newLocale === ""
        ? pagePath
        : pagePath === "/"
          ? `/${newLocale}/`
          : `/${newLocale}${pagePath}`;

    window.location.href = newPath;
  };

  return (
    <header className="border-b bg-white">
      <div className="max-w-(--breakpoint-md) mx-auto p-4 flex items-center justify-between">
        {data?.logo?.url ? (
          <img
            src={data.logo.url}
            alt={data.logo.title || "Logo"}
            className="h-10 w-auto"
          />
        ) : null}

        <div className="flex items-center gap-8">
          <nav>
            <ul className="flex gap-6">
              {data?.navigation?.map((item: any, index: number) => (
                <li key={index}>
                  <a href={item?.url?.href || item?.url || "/"}>
                    {item?.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <select
            value={currentLocale}
            onChange={handleLanguageChange}
            className="border rounded px-2 py-1"
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}

export default Header;