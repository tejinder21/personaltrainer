

import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import { groupBy, sumBy } from "lodash";
import { getTrainings } from "../ptapi";
import type { Training } from "../types";
import type { ActivityStat } from "../types";


function TrainingsStats() {
    const [stats, setStats] = useState<ActivityStat[]>([]);

    useEffect(() => {
        getTrainings()
            .then(data => {
                const trainings: Training[] = data._embedded.trainings;

                // 1) Ryhmitellään treenit activity-kentän mukaan
                const grouped = groupBy(trainings, t => t.activity || "Unknown");

                // 2) Lasketaan jokaiselle activitylle duration-minuutit yhteen
                const result: ActivityStat[] = Object.keys(grouped).map(activity => ({
                    activity,
                    totalMinutes: sumBy(grouped[activity], "duration"),
                }));

                setStats(result);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <Paper sx={{ p: 2, mt: 2, height: "80vh" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Trainings statistics (minutes per activity)
            </Typography>

            {/* ResponsiveContainer venyttää kaavion Paperin sisälle */}
            <ResponsiveContainer width="100%" height="90%">
                <BarChart
                    data={stats}
                    margin={{ top: 10, right: 20, left: 20, bottom: 40 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="activity"
                        // jos activity-nimiä on paljon, vino teksti helpottaa lukemista
                        angle={-20}
                        textAnchor="end"
                        interval={0}
                    />
                    <YAxis
                        label={{
                            value: "Duration (min)",
                            angle: -90,
                            position: "insideLeft",
                        }}
                    />
                    <Tooltip />
                    <Bar dataKey="totalMinutes" fill="#574ef6ff" />
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    );
}

export default TrainingsStats;
