import { useEffect, useRef } from "react";
import * as d3 from "d3";

type Row = {
    category: string;
    vote_rate: number;
    n: number;
};

const BARRIERS = [
    "ID / eligibility",
    "Distance / polling location",
    "Time / scheduling",
    "Lack of clear information on voting",
    "Lack of clear information about candidates"
];

const EXPERIENCES = [
    "Easy / smooth process",
    "Lines / waiting",
];

export default function BarrierGroupedChart() {
    const ref = useRef<SVGSVGElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        d3.csv(`${import.meta.env.BASE_URL}data/barrier_effect.csv`).then((data) => {
            const parsed: Row[] = data.map((d) => ({
                category: d.category ?? "",
                vote_rate: Number(d.vote_rate),
                n: Number(d.n),
            }));

            const barriers = parsed
                .filter((d) => BARRIERS.includes(d.category))
                .sort((a, b) => a.vote_rate - b.vote_rate);

            const experiences = parsed
                .filter((d) => EXPERIENCES.includes(d.category))
                .sort((a, b) => a.vote_rate - b.vote_rate);

            const rows = [
                { type: "header", label: "Barriers that may prevent voting" },
                ...barriers.map((d) => ({ type: "bar", ...d })),
                { type: "spacer", label: "" },
                { type: "header", label: "Experiences reported by people who voted" },
                ...experiences.map((d) => ({ type: "bar", ...d })),
            ];

            const width = 900;
            const height = 500;
            const margin = { top: 40, right: 80, bottom: 60, left: 280 };

            const innerWidth = width - margin.left - margin.right;

            const svg = d3.select(ref.current);
            svg.selectAll("*").remove();
            svg.attr("width", width).attr("height", height);

            const chart = svg
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            let yPosition = 0;

            rows.forEach((row: any) => {
                if (row.type === "header") {
                    chart
                        .append("text")
                        .attr("x", -margin.left + 20)
                        .attr("y", yPosition + 8)
                        .attr("font-size", 15)
                        .attr("font-weight", 800)
                        .attr("fill", "#d91023")
                        .text(row.label);

                    yPosition += 34;
                } else if (row.type === "spacer") {
                    yPosition += 24;
                } else {
                    const x = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);

                    chart
                        .append("text")
                        .attr("x", -12)
                        .attr("y", yPosition + 18)
                        .attr("text-anchor", "end")
                        .attr("font-size", 13)
                        .attr("fill", "#5c524b")
                        .text(row.category);

                    chart
                        .append("rect")
                        .attr("x", 0)
                        .attr("y", yPosition)
                        .attr("width", x(row.vote_rate))
                        .attr("height", 24)
                        .attr("fill", row.vote_rate < 0.25 ? "#f4c7b9" : "#d91023")
                        .style("cursor", "pointer")
                        .on("mouseenter", function () {
                            d3.select(this).attr("opacity", 0.75);

                            d3.select(tooltipRef.current)
                                .style("opacity", "1")
                                .html(`
                  <div class="tooltip-title">${row.category}</div>
                  <div>${d3.format(".1%")(row.vote_rate)} voted</div>
                  <div>${row.n} respondents</div>
                `);
                        })
                        .on("mousemove", function (event) {
                            const container = containerRef.current;
                            if (!container) return;

                            const bounds = container.getBoundingClientRect();

                            d3.select(tooltipRef.current)
                                .style("left", `${event.clientX - bounds.left + 12}px`)
                                .style("top", `${event.clientY - bounds.top - 40}px`);
                        })
                        .on("mouseleave", function () {
                            d3.select(this).attr("opacity", 1);
                            d3.select(tooltipRef.current).style("opacity", "0");
                        });

                    chart
                        .append("text")
                        .attr("x", x(row.vote_rate) + 8)
                        .attr("y", yPosition + 17)
                        .attr("font-size", 13)
                        .attr("font-weight", 800)
                        .attr("fill", "#1f1f1f")
                        .text(d3.format(".0%")(row.vote_rate));

                    yPosition += 36;
                }
            });

            chart
                .append("g")
                .attr("class", "axis")
                .attr("transform", `translate(0, ${yPosition + 10})`)
                .call(
                    d3.axisBottom(
                        d3.scaleLinear().domain([0, 1]).range([0, innerWidth])
                    ).tickFormat(d3.format(".0%"))
                );

            chart
                .append("text")
                .attr("x", innerWidth / 2)
                .attr("y", yPosition + 50)
                .attr("text-anchor", "middle")
                .attr("font-size", 15)
                .attr("font-weight", 800)
                .attr("fill", "#1f1f1f")
                .text("Percent who voted within each response category");
        });
    }, []);

    return (
        <div ref={containerRef} className="chart-container">
            <svg ref={ref}></svg>
            <div ref={tooltipRef} className="chart-tooltip" />
        </div>
    );
}