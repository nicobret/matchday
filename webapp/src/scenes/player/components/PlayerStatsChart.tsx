import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

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
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
        <Bar dataKey="goals" fill="var(--chart-1)">
          <LabelList dataKey="goals" position="top" />
        </Bar>
        <Bar dataKey="assists" fill="var(--chart-2)">
          <LabelList dataKey="assists" position="top" />
        </Bar>
        <Bar dataKey="saves" fill="var(--chart-3)">
          <LabelList dataKey="saves" position="top" />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
