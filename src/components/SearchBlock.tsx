
import { TextInput } from "@contentstack/venus-components";

interface SearchBlockProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const SearchBlock = ({
  value,
  placeholder = "Search FAQs...",
  onChange,
}: SearchBlockProps) => {
  return (
    <div className="w-full">
      <TextInput
        value={value}
        placeholder={placeholder}
        onChange={(value: any) =>
          onChange(
            typeof value === "string"
              ? value
              : value?.target?.value ?? ""
          )
        }
      />
    </div>
  );
};

export default SearchBlock;
