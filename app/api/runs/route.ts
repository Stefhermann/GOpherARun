import { NextResponse } from "next/server";

let runs = [
    { id: 1, name: "Alice", location: "Central Park", destination: "Times Square", date: "2024-04-01", time: "10:00", numRunners: 5 },
    { id: 2, name: "Bob", location: "Golden Gate Park", destination: "Fisherman’s Wharf", date: "2024-04-02", time: "08:30", numRunners: 10 },
];

export async function GET() {
    return NextResponse.json(runs, { status: 200 });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newRun = { id: runs.length + 1, ...body }; // Assign an ID
        runs.push(newRun);
        return NextResponse.json(newRun, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }
}
