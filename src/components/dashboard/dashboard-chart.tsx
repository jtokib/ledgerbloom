
'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { format, subDays } from 'date-fns';

const chartConfig = {
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  },
  purchases: {
    label: 'Purchases',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

type DashboardChartProps = {
  data: {
    date: string;
    sales: number;
    purchases: number;
  }[];
};

export function DashboardChart({ data }: DashboardChartProps) {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 29);

    return (
        <Card>
        <CardHeader>
          <CardTitle>Sales & Purchases Overview</CardTitle>
          <CardDescription>{format(thirtyDaysAgo, 'MMMM d')} - {format(today, 'MMMM d, yyyy')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                    const date = new Date(value);
                    // Add a check to prevent invalid date formatting
                    return date.getTime() ? format(date, "d") : value;
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
              <Bar dataKey="purchases" fill="var(--color-purchases)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="text-muted-foreground">
              Showing total units sold and purchased for the last 30 days.
            </div>
          </div>
        </CardFooter>
      </Card>
    )
}
