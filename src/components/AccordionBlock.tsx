
interface AccordionItem {
  question?: string;
  answer?: string;
  $?: Record<string, any>;
}

interface AccordionBlockProps {
  accordion_title?: string;
  accordion_description?: string;
  accordion_items?: AccordionItem[];
}

const AccordionBlock = ({
  accordion_title,
  accordion_description,
  accordion_items = [],
}: AccordionBlockProps) => {
  if (!accordion_items.length) return null;

  return (
    <section className="my-10 mx-auto max-w-4xl px-4">
      {accordion_title && (
        <h2 className="mb-3 text-3xl font-bold">
          {accordion_title}
        </h2>
      )}

      {accordion_description && (
        <p className="mb-6 text-gray-600">
          {accordion_description}
        </p>
      )}

      <div className="space-y-3">
        {accordion_items.map((item, index) => (
          <details
            key={index}
            className="group rounded-lg border border-gray-200 bg-white"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold hover:bg-gray-50">
              <span>{item.question}</span>

              <span className="text-xl transition-transform group-open:rotate-180">
                ↓
              </span>
            </summary>

            {item.answer && (
              <div
                className="border-t border-gray-200 px-5 py-4 text-gray-600 prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: item.answer,
                }}
              />
            )}
          </details>
        ))}
      </div>
    </section>
  );
};

export default AccordionBlock;
