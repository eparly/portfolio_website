import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

type Record = {
    percentage: number,
    correct: number,
    total: number,
    units: number,
    bankroll?: number
};

type ChartProps = {
    data: {
        evPicks: Array<{ date: string, today: Record, allTime: Record }>
    }
};

const BankrollChart: React.FC<ChartProps> = ({ data }) => {
    console.log("BankrollChart received data:", data);
    if (!data || !Array.isArray(data.evPicks)) {
        console.error("Invalid data structure passed to BankrollChart", data);
        return <div>Error: Invalid data structure</div>;
    }
    if (data.evPicks.length === 0) {
        return <div>No data available</div>;
    }

    const sortedEvPicks = [...data.evPicks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    console.log("Sorted EV Picks:", sortedEvPicks);
    const chartData = sortedEvPicks.map((pick) => ({
        date: pick.date,
        bankroll: pick.allTime.bankroll ? parseFloat(pick.allTime.bankroll.toFixed(2)) : 0,
    }));
    console.log("Bankroll Chart Data:", chartData);

    const allBankrolls = chartData.map(d => d.bankroll);
    const minY = Math.floor(Math.min(...allBankrolls) - 5);
    const maxY = Math.ceil(Math.max(...allBankrolls) + 5);
    const domain = [minY, maxY];

    return (
        <div style={{ width: "100%", height: 500, marginTop: '30px' }}>
            <h2 style={{ textAlign: "center" }}>Bankroll Over Time</h2>
            <ResponsiveContainer width="95%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        label={{
                            value: "Date",
                            position: "insideBottom",
                            offset: -5
                        }}
                    />
                    <YAxis
                        domain={domain}
                        label={{
                            value: "Bankroll",
                            angle: -90,
                            position: "insideLeft"
                        }}
                    />
                    <Tooltip />
                    <Legend verticalAlign="top" />
                    <Line
                        type="monotone"
                        dataKey="bankroll"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BankrollChart;