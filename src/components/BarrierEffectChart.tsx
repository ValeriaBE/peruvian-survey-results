import { useEffect, useRef } from "react";
import * as d3 from "d3";

type Row = {
    category: string;
    vote_rate: number;
    n: number;
};

export default function BarrierEffectChart() {
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

            const width = 850;
            const height = 460;
            const margin = { top: 40, right: 40, bottom: 60, left: 260 };

            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;

            const svg = d3.select(ref.current);
            svg.selectAll("*").remove();
            svg.attr("width", width).attr("height", height);

            const chart = svg
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
            parsed.sort((a, b) => a.vote_rate - b.vote_rate);

            const y = d3
                .scaleBand()
                .domain(parsed.map((d) => d.category))
                .range([0, innerHeight])
                .padding(0.25);

            const x = d3
                .scaleLinear()
                .domain([0, 1])
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
                .call(d3.axisBottom(x).tickFormat(d3.format(".0%")));

            chart
                .selectAll("rect")
                .data(parsed)
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", (d) => y(d.category) ?? 0)
                .attr("width", (d) => x(d.vote_rate))
                .attr("height", y.bandwidth())
                .attr("fill", "#d91023")
                .style("cursor", "pointer")
                .on("mouseenter", function (event, d) {
                    console.log(event);
                    d3.select(this).attr("opacity", 0.75);

                    d3.select(tooltipRef.current)
                        .style("opacity", "1")
                        .html(`
              <div class="tooltip-title">${d.category}</div>
              <div>${d3.format(".1%")(d.vote_rate)} voted</div>
              <div>${d.n} respondents</div>
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
                .selectAll(".label")
                .data(parsed)
                .enter()
                .append("text")
                .attr("x", (d) => x(d.vote_rate) + 8)
                .attr("y", (d) => (y(d.category) ?? 0) + y.bandwidth() / 2 + 5)
                .attr("font-size", 13)
                .attr("font-weight", 700)
                .attr("fill", "#1f1f1f")
                .text((d) => d3.format(".0%")(d.vote_rate));

            chart
                .append("text")
                .attr("x", innerWidth / 2)
                .attr("y", innerHeight + 45)
                .attr("text-anchor", "middle")
                .attr("font-size", 16)
                .attr("font-weight", 700)
                .text("Percent who voted");
        });
    }, []);

    return (
        <div ref={containerRef} className="chart-container">
            <svg ref={ref}></svg>
            <div ref={tooltipRef} className="chart-tooltip" />
        </div>
    );
}