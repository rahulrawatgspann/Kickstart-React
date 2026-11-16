import AccordionBlock from "./components/AccordionBlock";
import Alternating from "./components/Alternating/Alternating";
import CTA from "./components/CTA";
import Hero from "./components/Hero";
import HeroCarousel from "./components/HeroCarousel/HeroCarousel";
import RegistrationForm from "./components/RegistrationForm";
import SearchableFAQ from "./components/SearchableFAQ";
import TableBlock from "./components/TableBlock";
import RichTextBlock from "./RichTextBlock/RichTextBlock";

interface PageBlocksProps {
  page: any;
}

const PageBlocks = ({ page }: PageBlocksProps) => {
  return (
    <>
      {page?.blocks?.map((item: any, index: number) => {

        // Identify the Modular Block key
        const blockType = Object.keys(item).find(
          (key) => key !== "$"
        );
        console.debug('🚀 ~ App.tsx:76 ~ renderBlocks ~ blockType:', blockType);

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

        // Accordion Block
        if (blockType === "accordion_block") {
          return (
            <div
              key={blockData?._metadata?.uid || index}
              {...(page?.$ && page.$[`blocks__${index}`])}
            >
              <AccordionBlock
                {...(blockData.accordion_block || blockData)}
              />
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

        if (blockType === "registration_form") {
          return (
            <div
              key={blockData?._metadata?.uid || index}
              {...(page?.$ && page.$[`blocks__${index}`])}
            >
              <RegistrationForm
                {...(blockData.registration_form || blockData)}
              />
            </div>
          );
        }

        if (blockType === "searchable_faq") {
          return (
            <div
              key={blockData?._metadata?.uid || index}
              {...(page?.$ && page.$[`blocks__${index}`])}
            >
              <SearchableFAQ
                {...(blockData.searchable_faq || blockData)}
              />
            </div>
          );
        }

        if (blockType === "alternating") {
          return (
            <div
              key={blockData?._metadata?.uid || index}
              {...(page?.$ && page.$[`blocks__${index}`])}
            >
              <Alternating
                {...(blockData.alternating || blockData)}
              />
            </div>
          );
        }

        if (blockType === "rich_text_block") {
          return (
            <div
              key={blockData?._metadata?.uid || index}
              {...(page?.$ && page.$[`blocks__${index}`])}
            >
              <RichTextBlock
                {...(blockData.rich_text_block || blockData)}
              />
            </div>
          );
        }

        if (blockType === "hero_carousel") {
          return (
            <div
              key={blockData?._metadata?.uid || index}
              {...(page?.$ && page.$[`blocks__${index}`])}
            >
              <HeroCarousel
                {...(blockData.hero_carousel || blockData)}
              />
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

        // Table Block
        if (blockType === "table_block") {
          return (
            <div
              key={blockData?._metadata?.uid || index}
              {...(page?.$ && page.$[`blocks__${index}`])}
            >
              <TableBlock
                {...(blockData.table_block || blockData)}
              />
            </div>
          );
        }

        console.warn("Unsupported block:", blockType);
        return null;
      })}
    </>
  );
};

export default PageBlocks;