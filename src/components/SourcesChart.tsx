import { useEffect, useRef } from "react";
import * as d3 from "d3";

type SourceRow = {
    info_sources: string;
    n: number;
};

export default function SourcesChart() {
    const ref = useRef<SVGSVGElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        d3.csv(`${import.meta.env.BASE_URL}data/sources_summary.csv`).then((data) => {
            const parsed: SourceRow[] = data.map((d) => ({
                info_sources: d.info_sources ?? "",
                n: Number(d.n),
            }));

            const width = 850;
            const height = 460;
            const margin = { top: 30, right: 40, bottom: 50, left: 260 };

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
                .domain(parsed.map((d) => d.info_sources))
                .range([0, innerHeight])
                .padding(0.25);

            const x = d3
                .scaleLinear()
                .domain([0, d3.max(parsed, (d) => d.n) ?? 0])
                .nice()
                .range([0, innerWidth]);

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
                .call(d3.axisBottom(x).ticks(5));

            chart
                .selectAll("rect")
                .data(parsed)
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", (d) => y(d.info_sources) ?? 0)
                .attr("width", (d) => x(d.n))
                .attr("height", y.bandwidth())
                .attr("fill", "#d91023")
                .style("cursor", "pointer")
                .on("mouseenter", function (event, d) {
                    console.log(event);
                    d3.select(this).attr("opacity", 0.75);

                    d3.select(tooltipRef.current)
                        .style("opacity", "1")
                        .html(`
              <div class="tooltip-title">${d.info_sources}</div>
              <div>${d.n} mentions</div>
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
                .selectAll(".bar-label")
                .data(parsed)
                .enter()
                .append("text")
                .attr("class", "bar-label")
                .attr("x", (d) => x(d.n) + 8)
                .attr("y", (d) => (y(d.info_sources) ?? 0) + y.bandwidth() / 2 + 5)
                .attr("fill", "#1f1f1f")
                .attr("font-weight", 700)
                .text((d) => d.n);

            chart
                .append("text")
                .attr("x", innerWidth / 2)
                .attr("y", innerHeight + 42)
                .attr("text-anchor", "middle")
                .attr("font-size", 16)
                .attr("font-weight", 700)
                .attr("fill", "#1f1f1f")
                .text("Number of mentions");
        });
    }, []);

    return (
        <div ref={containerRef} className="chart-container">
            <svg ref={ref}></svg>
            <div ref={tooltipRef} className="chart-tooltip" />
        </div>
    );
}