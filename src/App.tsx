
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
import CTA from "./components/CTA";
import Hero from "./components/Hero";

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

  // Dynamic Modular Blocks Renderer

  const renderBlocks = () => {
    return page?.blocks?.map((item: any, index: number) => {

      // Identify the Modular Block key
      const blockType = Object.keys(item).find(
        (key) => key !== "$"
      );

      const blockData = blockType ? item[blockType] : null;

      if (!blockData) return null;

      // CTA Block
      if (blockType === "cta_block") {
        return (
          <div
            key={blockData?._metadata?.uid || index}
            {...(page?.$ && page.$[`blocks__${index}`])}
          >
            <CTA data={blockData.cta || blockData} />
          </div>
        );
      }

      // Hero Banner
      if (blockType === "hero_banner") {
        return (
          <div
            key={blockData?._metadata?.uid || index}
            {...(item?.$ && item.$.hero_banner)}
          >
            <Hero data={blockData} />
          </div>
        );
      }

      // Existing Image & Text Block
      if (blockType === "block") {
        const isImageLeft = blockData.layout === "image_left";

        return (
          <div
            key={blockData?._metadata?.uid || index}
            {...(page?.$ && page.$[`blocks__${index}`])}
            className={`flex flex-col items-center space-y-4 md:space-y-0 bg-slate-100 ${isImageLeft
              ? "md:flex-row"
              : "md:flex-row-reverse"
              }`}
          >
            <div className="w-full md:w-1/2">
              {blockData.image && (
                <img
                  src={blockData.image.url}
                  alt={blockData.image.title}
                  className="w-full"
                  {...(blockData?.$ && blockData.$.image)}
                />
              )}
            </div>

            <div className="w-full md:w-1/2 p-4">
              {blockData.title && (
                <h2
                  className="text-2xl font-bold"
                  {...(blockData?.$ && blockData.$.title)}
                >
                  {blockData.title}
                </h2>
              )}

              {blockData.copy && (
                <div
                  {...(blockData?.$ && blockData.$.copy)}
                  dangerouslySetInnerHTML={{
                    __html: blockData.copy,
                  }}
                  className="prose"
                />
              )}
            </div>
          </div>
        );
      }

      console.warn("Unsupported block:", blockType);
      return null;
    });
  };


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

          {/* Dynamic Modular Blocks */}
          <div
            className={`space-y-8 max-w-full mt-4 ${!page?.blocks?.length
              ? VB_EmptyBlockParentClass
              : ""
              }`}
            {...(page?.$ && page.$.blocks)}
          >
            {renderBlocks()}
          </div>
        </section>
      </main>
      {/* Footer */}
      <Footer data={footer} />
    </>
  );
}

export default App;