import { useEffect, useRef } from "react";
import * as d3 from "d3";

type Row = {
  gender: string;
  percent: number;
};

const COLORS = ["#d91023", "#f4c7b9", "#b9855b", "#8a7a70"];

export default function GenderPieChart() {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    d3.csv(`${import.meta.env.BASE_URL}data/demo_gender.csv`).then((data) => {
      const parsed: Row[] = data
        .map((d) => ({
          gender: d.gender ?? "",
          percent: Number(d.percent),
        }))
        .filter((d) => d.gender && !Number.isNaN(d.percent));

      const width = 420;
      const height = 240;
      const radius = 90;

      const svg = d3.select(ref.current);
      svg.selectAll("*").remove();

      svg.attr("width", width).attr("height", height);

      const chart = svg
        .append("g")
        .attr("transform", `translate(120, ${height / 2})`);

      const pie = d3
        .pie<Row>()
        .value((d) => d.percent)
        .sort(null);

      const arc = d3
        .arc<d3.PieArcDatum<Row>>()
        .innerRadius(48)
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

      chart
        .append("text")
        .attr("text-anchor", "middle")
        .attr("y", -4)
        .attr("font-size", 24)
        .attr("font-weight", 800)
        .attr("fill", "#1f1f1f")
        .text(d3.format(".0%")(parsed[0]?.percent ?? 0));

      chart
        .append("text")
        .attr("text-anchor", "middle")
        .attr("y", 18)
        .attr("font-size", 12)
        .attr("fill", "#6b625c")
        .text(parsed[0]?.gender ?? "");

      const legend = svg.append("g").attr("transform", `translate(245, 58)`);

      parsed.forEach((d, i) => {
        const row = legend
          .append("g")
          .attr("transform", `translate(0, ${i * 30})`);

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