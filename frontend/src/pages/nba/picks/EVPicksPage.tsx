import React, { useEffect, useState } from "react";
import { getData } from "../../../services/apiService";
import PickCard from "./PickCard";
import "./PicksPage.css";
import DateNavigator from "../../../components/DateNavigator/DateNavigator";

const EVPicksPage: React.FC = () => {
    const [evPicks, setEVPicks] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = React.useState<Date>(
        new Date(
            new Date().toLocaleDateString("en-US", {
                timeZone: "America/New_York",
            })
        )
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const date = selectedDate.toISOString().split("T")[0];
                const result = await getData(`/picks/ev/${date}`);
                if (result.length === 0) {
                    throw new Error("No EV picks available for today");
                }
                setEVPicks(result);
                setError(null);
            } catch (error: any) {
                setError(error.message || "An unexpected error occurred");
            }
        };
        fetchData();
    }, [selectedDate]);

    return (
        <div className="picks-page">
            <h1>NBA EV Picks</h1>
            <p>
                EV Picks are generated daily around 9:00 AM and are based on expected value
                calculations. These picks include suggested bet sizes to maximize value.
            </p>
            <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />
            {!error && evPicks.length > 0 ? (
                <div className="picks-grid">
                    {evPicks.map((pick) => (
                        <PickCard key={pick.gameId} pickData={pick} />
                    ))}
                </div>
            ) : (
                <div className="error-card">
                    <h2>No EV Picks Available</h2>
                    <p>
                        There are currently no EV picks for today. Picks are generated around
                        9:00 AM each day. Due to the way picks are generated, there may not be
                        any EV picks for the NBA games today.
                    </p>
                </div>
            )}
        </div>
    );
};

export default EVPicksPage;