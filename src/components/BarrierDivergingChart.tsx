import { useEffect, useRef } from "react";
import * as d3 from "d3";

type RawRow = {
    category: string;
    vote_rate: number;
    n: number;
    overall_rate: number;
};

type Row = RawRow & {
    difference: number;
};

export default function BarrierDivergingChart() {
    const ref = useRef<SVGSVGElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        d3.csv(`${import.meta.env.BASE_URL}data/barrier_effect.csv`).then((data) => {
            const parsedRaw: RawRow[] = data
                .map((d) => ({
                    category: d.category ?? "",
                    vote_rate: Number(d.vote_rate),
                    n: Number(d.n),
                    overall_rate: Number(d.overall_rate),
                }))
                .filter(
                    (d) =>
                        d.category &&
                        !Number.isNaN(d.vote_rate) &&
                        !Number.isNaN(d.n) &&
                        !Number.isNaN(d.overall_rate)
                );

            const baseline = parsedRaw[0]?.overall_rate ?? 0;

            const parsed: Row[] = parsedRaw
                .map((d) => ({
                    ...d,
                    difference: d.vote_rate - baseline,
                }))
                .sort((a, b) => a.difference - b.difference);

            const width = 900;
            const height = 520;
            const margin = { top: 70, right: 120, bottom: 70, left: 260 };

            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;

            const svg = d3.select(ref.current);
            svg.selectAll("*").remove();
            svg.attr("width", width).attr("height", height);

            const chart = svg
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const maxAbs = d3.max(parsed, (d) => Math.abs(d.difference)) ?? 0.5;

            const x = d3
                .scaleLinear()
                .domain([-maxAbs, maxAbs])
                .nice()
                .range([0, innerWidth]);

            const y = d3
                .scaleBand()
                .domain(parsed.map((d) => d.category))
                .range([0, innerHeight])
                .padding(0.28);

            chart
                .append("line")
                .attr("x1", x(0))
                .attr("x2", x(0))
                .attr("y1", -10)
                .attr("y2", innerHeight)
                .attr("stroke", "#1f1f1f")
                .attr("stroke-width", 1.5);

            chart
                .append("text")
                .attr("x", x(0))
                .attr("y", -36)
                .attr("text-anchor", "middle")
                .attr("font-size", 12)
                .attr("font-weight", 800)
                .attr("fill", "#1f1f1f")
                .text(`Overall vote rate (Yes vs No): ${d3.format(".0%")(baseline)}`);

            chart
                .append("g")
                .attr("class", "axis")
                .call(d3.axisLeft(y).tickSize(0))
                .select(".domain")
                .remove();

            chart
                .append("g")
                .attr("class", "axis")
                .attr("transform", `translate(0,${innerHeight})`)
                .call(
                    d3
                        .axisBottom(x)
                        .ticks(5)
                        .tickFormat((d) => {
                            const value = Number(d);
                            return `${value > 0 ? "+" : ""}${d3.format(".0%")(value)}`;
                        })
                );

            chart
                .selectAll("rect")
                .data(parsed)
                .enter()
                .append("rect")
                .attr("x", (d) => x(Math.min(0, d.difference)))
                .attr("y", (d) => y(d.category) ?? 0)
                .attr("width", (d) => Math.abs(x(d.difference) - x(0)))
                .attr("height", y.bandwidth())
                .attr("fill", (d) => (d.difference < 0 ? "#f4c7b9" : "#d91023"))
                .style("cursor", "pointer")
                .on("mouseenter", function (event, d) {
                    d3.select(this).attr("opacity", 0.75);

                    d3.select(tooltipRef.current)
                        .style("opacity", "1")
                        .html(`
              <div class="tooltip-title">${d.category}</div>
              <div>${d3.format(".1%")(d.vote_rate)} voted</div>
              <div>${d.n} respondents</div>
              <div>${d.difference >= 0 ? "+" : ""}${d3.format(".1%")(
                            d.difference
                        )} vs. overall</div>
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
                .selectAll(".difference-label")
                .data(parsed)
                .enter()
                .append("text")
                .attr("class", "difference-label")
                .attr("x", (d) =>
                    d.difference >= 0 ? x(d.difference) + 8 : x(d.difference) - 8
                )
                .attr("y", (d) => (y(d.category) ?? 0) + y.bandwidth() / 2 + 5)
                .attr("text-anchor", (d) => (d.difference >= 0 ? "start" : "end"))
                .attr("font-size", 13)
                .attr("font-weight", 800)
                .attr("fill", "#1f1f1f")
                .text((d) => {
                    const formatted = d3.format(".0%")(d.difference);
                    return d.difference > 0 ? `+${formatted}` : formatted;
                });

            chart
                .append("text")
                .attr("x", x(-maxAbs / 2))
                .attr("y", -16)
                .attr("text-anchor", "middle")
                .attr("font-size", 13)
                .attr("font-weight", 800)
                .attr("fill", "#6b625c")
                .text("Lower than overall");

            chart
                .append("text")
                .attr("x", x(maxAbs / 2))
                .attr("y", -16)
                .attr("text-anchor", "middle")
                .attr("font-size", 13)
                .attr("font-weight", 800)
                .attr("fill", "#6b625c")
                .text("Higher than overall");

            chart
                .append("text")
                .attr("x", innerWidth / 2)
                .attr("y", innerHeight + 55)
                .attr("text-anchor", "middle")
                .attr("font-size", 16)
                .attr("font-weight", 800)
                .attr("fill", "#1f1f1f")
                .text("Difference from overall voting rate");
        });
    }, []);

    return (
        <div ref={containerRef} className="chart-container">
            <svg ref={ref}></svg>
            <div ref={tooltipRef} className="chart-tooltip" />
        </div>
    );
}