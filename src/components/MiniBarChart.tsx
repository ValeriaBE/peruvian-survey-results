import { useEffect, useRef } from "react";
import * as d3 from "d3";

type Row = {
    label: string;
    percent: number;
};

type MiniBarChartProps = {
    file: string;
    labelColumn: string;
    maxItems?: number;
    size?: "mini" | "large";
};
function formatMiniLabel(label: string, isMobile: boolean) {
    const replacements: Record<string, string> = {
        "Social media (TikTok / Instagram)": "Social media",
        "News websites or online newspapers": "News websites",
        "Official sources (government / consulate)": "Official sources",
        "Neither easy nor difficult": "Neither",
        "High school or less": "High school",
        "College graduate": "College grad",
    };

    const cleaned = replacements[label] ?? label;
    const limit = isMobile ? 18 : 24;

    return cleaned.length > limit ? `${cleaned.slice(0, limit)}…` : cleaned;
}

export default function MiniBarChart({
    file,
    labelColumn,
    maxItems = 4,
    size = "mini",
}: MiniBarChartProps) {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        d3.csv(`${import.meta.env.BASE_URL}data/${file}`).then((data) => {
            const parsed: Row[] = data
                .map((d) => ({
                    label: d[labelColumn] ?? "",
                    percent: Number(d.percent),
                }))
                .filter((d) => d.label && !Number.isNaN(d.percent))
                .sort((a, b) => b.percent - a.percent)
                .slice(0, maxItems);

            const containerWidth = ref.current?.parentElement?.clientWidth ?? 280;
            const isMobile = window.innerWidth <= 760;

            const width =
                size === "large"
                    ? Math.min(containerWidth, 520)
                    : Math.min(containerWidth, 360);

            const rowHeight =
                size === "large"
                    ? 46
                    : isMobile
                        ? 38
                        : 30;

            const height = parsed.length * rowHeight + (size === "large" ? 20 : 4);

            const margin = {
                top: size === "large" ? 12 : 4,
                right: size === "large" ? 70 : isMobile ? 52 : 40,
                bottom: size === "large" ? 12 : 4,
                left: size === "large" ? 170 : isMobile ? 135 : 145,
            };

            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;

            const svg = d3.select(ref.current);
            svg.selectAll("*").remove();
            svg.attr("width", width).attr("height", height);

            const chart = svg
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const y = d3
                .scaleBand()
                .domain(parsed.map((d) => d.label))
                .range([0, innerHeight])
                .padding(0.35);

            const x = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);

            chart
                .selectAll("rect")
                .data(parsed)
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", (d) => y(d.label) ?? 0)
                .attr("width", (d) => x(d.percent))
                .attr("height", y.bandwidth())
                .attr("fill", "#d91023");

            chart
                .selectAll(".mini-label")
                .data(parsed)
                .enter()
                .append("text")
                .attr("class", "mini-label")
                .attr("x", -8)
                .attr("y", (d) => (y(d.label) ?? 0) + y.bandwidth() / 2 + 4)
                .attr("text-anchor", "end")
                .attr("font-size", 11)
                .attr("fill", "#6b625c")
                .text((d) => formatMiniLabel(d.label, isMobile));

            chart
                .selectAll(".mini-value")
                .data(parsed)
                .enter()
                .append("text")
                .attr("class", "mini-value")
                .attr("x", (d) => x(d.percent) + 6)
                .attr("y", (d) => (y(d.label) ?? 0) + y.bandwidth() / 2 + 4)
                .attr("font-size", 11)
                .attr("font-weight", 700)
                .attr("fill", "#1f1f1f")
                .text((d) => d3.format(".0%")(d.percent));
        });
    }, [file, labelColumn, maxItems]);

    return <svg className="mini-chart" ref={ref}></svg>;
}