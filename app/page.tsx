"use client";

import { useEffect, useState } from "react";

interface Run {
  id: number;
  name: string;
  location: string;
  destination: string;
  date: string;
  time: string;
  numRunners: number;
}

export default function Home() {
  const [runs, setRuns] = useState<Run[]>([]);

  useEffect(() => {
    const fetchRuns = async () => {
      const response = await fetch("api/runs");
      const data = await response.json();
      setRuns(data);
    };

    fetchRuns();
  }, []);

  return (
    <div>
      <h2>Home Page</h2>
      <h3>Available Runs:</h3>
      <ul>
        {runs.map((run) => (
          <li key={run.id}>
            {run.name} is running from {run.location} to {run.destination} on {run.date} at {run.time}.
          </li>
        ))}
      </ul>
    </div>
  );
}
