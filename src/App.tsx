
import {
  getHeader,
  getFooter,
  getPage,
  getLocaleFromPath,
  initLivePreview,
} from "./lib/contentstack";

import { useEffect, useState } from "react";
import { Page } from "./lib/types";

import ContentstackLivePreview, {
  VB_EmptyBlockParentClass,
} from "@contentstack/live-preview-utils";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PageBlocks from "./PageBlocks";
import DynamicPage from "./pages/DynamicPage";

function App() {
  const [page, setPage] = useState<Page>();
  const [header, setHeader] = useState<any>();
  const [footer, setFooter] = useState<any>();

  const getContent = async () => {
    const pathname = window.location.pathname;
    const locale = getLocaleFromPath(pathname);

    const pageUrl =
      pathname.replace(/^\/(en|fr|de|es)/, "") || "/";

    const pageData = await getPage(pageUrl, locale);

    if (pageData && "setPageContext" in ContentstackLivePreview) {
      ContentstackLivePreview.setPageContext({
        entryUid: pageData.uid,
        contentTypeUid: "page",
      });
    }

    const headerData = await getHeader(locale);
    const footerData = await getFooter(locale);

    setPage(pageData);
    setHeader(headerData);
    setFooter(footerData);
  };

  useEffect(() => {
    initLivePreview();
    queueMicrotask(() => {
      void getContent();
    });
    ContentstackLivePreview.onEntryChange(getContent);
  }, []);

  return (
    <>
      <Header data={header} />
      <main className="max-w-(--breakpoint-md) mx-auto">
        <section className="p-4">
          {page?.title && (
            <h1
              className="text-4xl font-bold mb-4"
              {...(page?.$ && page.$.title)}
            >
              {page.title}
            </h1>
          )}

          {page?.description && (
            <p
              className="mb-4"
              {...(page?.$ && page.$.description)}
            >
              {page.description}
            </p>
          )}

          {page?.image && (
            <img
              className="mb-4"
              width={768}
              height={414}
              src={page.image.url}
              alt={page.image.title}
              {...(page?.image?.$ && page.image.$.url)}
            />
          )}

          {page?.rich_text && (
            <div
              {...(page?.$ && page.$.rich_text)}
              dangerouslySetInnerHTML={{
                __html: page.rich_text,
              }}
            />
          )}

          {/* Dynamic Page Content */}
          <div
            className={`space-y-8 max-w-full mt-4 ${!page?.blocks?.length ? VB_EmptyBlockParentClass : ""
              }`}
            {...(page?.$ && page.$.blocks)}
          >
            {page?.url === "/dynamic-page" ? (
              <DynamicPage page={page} />
            ) : (
              <PageBlocks page={page} />
            )}
          </div>
        </section>
      </main>
      {/* Footer */}
      <Footer data={footer} />
    </>
  );
}

export default App;