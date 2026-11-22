"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface ChartDatum {
    label: string;
    value: number;
}

interface DashboardChartProps {
    title: string;
    description?: string;
    data: ChartDatum[];
    type?: "bar" | "pie";
    isLoading?: boolean;
    colors?: string[];
}

const DEFAULT_COLORS = ["#e53935", "#e87932", "#22c55e", "#6b7280", "#3b82f6"];

export function DashboardChart({
    title,
    description,
    data,
    type = "bar",
    isLoading = false,
    colors = DEFAULT_COLORS,
}: DashboardChartProps) {
    return (
        <Card className="border-border/70">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">{title}</CardTitle>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </CardHeader>

            <CardContent className="h-56 pl-0 pr-2 sm:h-64 sm:pr-3">
                {isLoading ? (
                    <Skeleton className="ml-6 h-full w-[calc(100%-2rem)] rounded-xl" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        {type === "bar" ? (
                            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: "rgba(229,57,53,0.06)" }} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {data.map((item, index) => (
                                        <Cell
                                            key={item.label}
                                            fill={colors[index % colors.length]}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        ) : (
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="label"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={78}
                                    paddingAngle={3}
                                >
                                    {data.map((item, index) => (
                                        <Cell
                                            key={item.label}
                                            fill={colors[index % colors.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        )}
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
