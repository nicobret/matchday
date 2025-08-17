import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export default function PlayerStatsChart({
  data,
}: {
  data: {
    season: string;
    goals: number;
    assists: number;
    saves: number;
  }[];
}) {
  const config = {
    goals: { label: "Buts", color: "var(--chart-1)" },
    assists: { label: "Passes dé", color: "var(--chart-2)" },
    saves: { label: "Arrêts", color: "var(--chart-3)" },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={config}>
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="season"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
        <Bar dataKey="goals" fill="var(--chart-1)" />
        <Bar dataKey="assists" fill="var(--chart-2)" />
        <Bar dataKey="saves" fill="var(--chart-3)" />
      </BarChart>
    </ChartContainer>
  );
}
