
import { Table } from "@contentstack/venus-components";
import "@contentstack/venus-components/build/main.css";

interface TableColumn {
  column_name: string;
  column_key: string;
}

interface TableCell {
  cell_type?: "Text" | "Image" | null;
  cell_value?: string;
  image?: {
    url: string;
    title?: string;
    filename?: string;
  } | null;
}

interface TableRow {
  row_data: TableCell[];
}

interface TableRow {
  row_data: TableCell[];
}

interface TableBlockProps {
  table_title?: string;
  table_description?: string;
  columns?: TableColumn[];
  rows?: TableRow[];
}

const TableBlock = ({
  table_title,
  table_description,
  columns = [],
  rows = [],
}: TableBlockProps) => {
  if (!columns.length) return null;

  const venusColumns = columns.map((column) => ({
    Header: column.column_name,
    accessor: column.column_key,

    Cell: ({ value }: { value: TableCell | null }) => {
      if (!value) return "-";

      if (value.cell_type === "Image") {
        return value.image?.url ? (
          <img
            src={value.image.url}
            alt={value.image.title || "Table image"}
            className="h-20 w-20 rounded object-contain"
          />
        ) : (
          "-"
        );
      }

      return value.cell_value || "-";
    },
  }));

  const tableData = rows.map((row, rowIndex) => {
    const record: Record<string, any> = {
      id: rowIndex,
    };

    columns.forEach((column, columnIndex) => {
      record[column.column_key] =
        row.row_data?.[columnIndex] || null;
    });

    return record;
  });

  return (
    <section className="my-8 rounded-lg border border-gray-200 p-6">
      {table_title && (
        <h2 className="mb-2 text-2xl font-bold">
          {table_title}
        </h2>
      )}

      {table_description && (
        <p className="mb-4 text-gray-600">
          {table_description}
        </p>
      )}

      <div className="overflow-x-auto">
        <Table
          columns={venusColumns}
          data={tableData}
          canPaginate={false}
          uniqueKey="id"
          totalCounts={tableData.length}
          columnSelector={false}
          dataType={{
            singular: "record",
            plural: "records",
          }}
        />
      </div>
    </section>
  );
};

export default TableBlock;
