
import { useMemo, useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

interface DateFilterOption {
    label: string;
    value: string;
}

interface KPICard {
    card_title: string;
    card_value: string;
    card_icon?: string;
    change_percentage?: string;
    change_type?: "increase" | "decrease" | "neutral";
    card_description?: string;
}

interface ChartData {
    period: string;
    value: number;
}

interface ChartConfig {
    chart_title?: string;
    chart_type?: "line" | "bar";
    x_axis_label?: string;
    y_axis_label?: string;
    chart_data?: ChartData[];
}

interface AnalyticsDashboardProps {
    dashboard_title?: string;
    dashboard_description?: string;
    date_filter_enabled?: boolean;
    date_filter_options?: DateFilterOption[];
    kpi_cards?: KPICard[];
    chart_config?: ChartConfig;
}

const AnalyticsDashboard = ({
    dashboard_title,
    dashboard_description,
    date_filter_enabled,
    date_filter_options = [],
    kpi_cards = [],
    chart_config,
}: AnalyticsDashboardProps) => {
    const [selectedDate, setSelectedDate] = useState(
        date_filter_options[0]?.value || ""
    );

    console.log("Analytics Dashboard Data:", {
        date_filter_options: date_filter_options,
        kpi_cards: kpi_cards,
        chart_config: chart_config,
        chart_data: chart_config?.chart_data,
    });

    // Sample implementation: filters chart points by their position.
    // Replace with date-aware filtering when your CMS data includes dates.
    const chartData = useMemo(() => {
        const data = chart_config?.chart_data || [];
        const days = Number(selectedDate);

        if (!days || !Number.isFinite(days)) return data;

        return data.slice(-days);
    }, [chart_config?.chart_data, selectedDate]);

    const isLineChart = chart_config?.chart_type === "line";

    return (
        <section className="mx-auto my-10 w-full max-w-7xl px-4 md:px-6">

            {/* Dashboard Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                        {dashboard_title}
                    </h2>

                    {dashboard_description && (
                        <p className="mt-2 text-gray-500">
                            {dashboard_description}
                        </p>
                    )}
                </div>

                {/* Date Filter */}
                {date_filter_enabled && date_filter_options.length > 0 && (
                    <select
                        value={selectedDate}
                        onChange={(event) => setSelectedDate(event.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                    >
                        {date_filter_options.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* KPI Cards */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {kpi_cards.map((card, index) => {
                    const changeColor =
                        card.change_type === "increase"
                            ? "text-green-600"
                            : card.change_type === "decrease"
                                ? "text-red-600"
                                : "text-gray-500";

                    const arrow =
                        card.change_type === "increase"
                            ? "↑"
                            : card.change_type === "decrease"
                                ? "↓"
                                : "−";

                    return (
                        <div
                            key={index}
                            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-500">
                                    {card.card_title}
                                </p>

                                {card.card_icon && (
                                    <span className="text-2xl">
                                        {card.card_icon}
                                    </span>
                                )}
                            </div>

                            <h3 className="mt-3 text-2xl font-bold text-gray-900">
                                {card.card_value}
                            </h3>

                            {card.change_percentage && (
                                <p className={`mt-2 text-sm font-medium ${changeColor}`}>
                                    {arrow} {card.change_percentage}
                                </p>
                            )}

                            {card.card_description && (
                                <p className="mt-2 text-xs text-gray-500">
                                    {card.card_description}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Analytics Chart */}
            {chart_config && (
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {chart_config.chart_title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            {chart_config.y_axis_label} by {chart_config.x_axis_label}
                        </p>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {isLineChart ? (
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="period"
                                        label={{
                                            value: chart_config.x_axis_label,
                                            position: "insideBottom",
                                            offset: -5,
                                        }}
                                    />
                                    <YAxis
                                        label={{
                                            value: chart_config.y_axis_label,
                                            angle: -90,
                                            position: "insideLeft",
                                        }}
                                    />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                    />
                                </LineChart>
                            ) : (
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="period" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey="value"
                                        fill="#2563eb"
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AnalyticsDashboard;
