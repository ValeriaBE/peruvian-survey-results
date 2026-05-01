import { useEffect, useRef } from "react";
import * as d3 from "d3";

type Row = {
    gender: string;
    percent: number;
};

const COLORS = ["#d91023", "#f4c7b9", "#b9855b", "#8a7a70"];

function shortGenderLabel(label: string) {
    if (label.toLowerCase().includes("woman")) return "Woman";
    if (label.toLowerCase().includes("man")) return "Man";
    if (label.toLowerCase().includes("non")) return "Non-binary";
    return "Other";
}

export default function GenderPieChart() {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        d3.csv(`${import.meta.env.BASE_URL}data/demo_gender.csv`).then((data) => {
            const parsed: Row[] = data
                .map((d) => ({
                    gender: shortGenderLabel(d.gender ?? ""),
                    percent: Number(d.percent),
                }))
                .filter((d) => d.gender && !Number.isNaN(d.percent));

            const containerWidth = ref.current?.parentElement?.clientWidth ?? 360;
            const width = Math.min(containerWidth, 420);
            const isMobile = width < 390;

            const height = isMobile ? 390 : 240;
            const radius = isMobile ? 82 : 90;

            const chartX = isMobile ? width / 2 : 120;
            const chartY = isMobile ? 120 : height / 2;

            const legendX = isMobile ? 30 : 245;
            const legendY = isMobile ? 250 : 58;

            const svg = d3.select(ref.current);
            svg.selectAll("*").remove();

            svg.attr("width", width).attr("height", height);

            const chart = svg
                .append("g")
                .attr("transform", `translate(${chartX}, ${chartY})`);

            const pie = d3
                .pie<Row>()
                .value((d) => d.percent)
                .sort(null);

            const arc = d3
                .arc<d3.PieArcDatum<Row>>()
                .innerRadius(radius * 0.55)
                .outerRadius(radius);

            chart
                .selectAll("path")
                .data(pie(parsed))
                .enter()
                .append("path")
                .attr("d", arc)
                .attr("fill", (_, i) => COLORS[i % COLORS.length])
                .attr("stroke", "#fff7ed")
                .attr("stroke-width", 3);

            const largest = parsed[0];

            chart
                .append("text")
                .attr("text-anchor", "middle")
                .attr("y", -4)
                .attr("font-size", isMobile ? 28 : 24)
                .attr("font-weight", 800)
                .attr("fill", "#1f1f1f")
                .text(d3.format(".0%")(largest?.percent ?? 0));

            chart
                .append("text")
                .attr("text-anchor", "middle")
                .attr("y", 20)
                .attr("font-size", 12)
                .attr("fill", "#6b625c")
                .text(largest?.gender ?? "");

            const legend = svg
                .append("g")
                .attr("transform", `translate(${legendX}, ${legendY})`);

            parsed.forEach((d, i) => {
                const row = legend
                    .append("g")
                    .attr("transform", `translate(0, ${i * 28})`);

                row
                    .append("rect")
                    .attr("width", 12)
                    .attr("height", 12)
                    .attr("rx", 3)
                    .attr("fill", COLORS[i % COLORS.length]);

                row
                    .append("text")
                    .attr("x", 20)
                    .attr("y", 11)
                    .attr("font-size", 13)
                    .attr("fill", "#1f1f1f")
                    .text(`${d.gender} · ${d3.format(".0%")(d.percent)}`);
            });
        });
    }, []);

    return <svg className="gender-donut" ref={ref}></svg>;
}