
import { useMemo, useState } from "react";

import SearchBlock from "./SearchBlock";
import AccordionBlock from "./AccordionBlock";

interface FAQItem {
  category?: string;
  question?: string;
  answer?: string;
  _metadata?: {
    uid?: string;
  };
}

interface SearchConfiguration {
  search_placeholder?: string;
  no_results_message?: string;
  all_categories_label?: string;
}

interface FAQAccordion {
  accordion_title?: string;
  accordion_description?: string;
  accordion_items?: FAQItem[];
}

interface SearchableFAQProps {
  faq_title?: string;
  faq_description?: string;
  search_configuration?: SearchConfiguration;
  faq_accordion?: FAQAccordion;
}

const SearchableFAQ = ({
  faq_title,
  faq_description,
  search_configuration,
  faq_accordion,
}: SearchableFAQProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const faqItems = faq_accordion?.accordion_items || [];

  // Get unique categories from FAQ items
  const categories = useMemo(() => {
    return [
      ...new Set(
        faqItems
          .map((item) => item.category?.trim())
          .filter((category): category is string => Boolean(category))
      ),
    ];
  }, [faqItems]);

  // Search and category filtering
  const filteredFAQs = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return faqItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        !search ||
        item.question?.toLowerCase().includes(search) ||
        item.answer?.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [faqItems, searchTerm, selectedCategory]);

  return (
    <section className="mx-auto my-12 w-full max-w-4xl px-4 md:px-6">

      {/* FAQ Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          {faq_title}
        </h2>

        {faq_description && (
          <p className="mt-3 text-gray-600">
            {faq_description}
          </p>
        )}
      </div>

      {/* Venus Search Component */}
      <div className="mb-6">
        <SearchBlock
          value={searchTerm}
          placeholder={
            search_configuration?.search_placeholder ||
            "Search FAQs..."
          }
          onChange={setSearchTerm}
        />
      </div>

      {/* Category Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`rounded-full px-4 py-2 text-sm ${
            selectedCategory === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {search_configuration?.all_categories_label || "All"}
        </button>

        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-4 py-2 text-sm ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Result Count */}
      <p className="mb-4 text-sm text-gray-500">
        Showing {filteredFAQs.length} of {faqItems.length} questions
      </p>

      {/* Reuse Existing Accordion Component */}
      {filteredFAQs.length > 0 ? (
        <AccordionBlock
          {...faq_accordion}
          accordion_items={filteredFAQs}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-600">
            {search_configuration?.no_results_message ||
              "No matching questions found."}
          </p>

          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
            className="mt-3 text-sm font-medium text-blue-600"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
};

export default SearchableFAQ;
