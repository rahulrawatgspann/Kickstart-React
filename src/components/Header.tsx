type HeaderProps = {
  data: any;
};

function Header({ data }: HeaderProps) {
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

        <nav>
          <ul className="flex gap-6">
            {data?.navigation?.map((item: any, index: number) => (
              <li key={index}>
                <a href={item?.url?.href  || item?.url || "/"}>
                  {item?.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;