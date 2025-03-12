"use client";

import { useState } from "react";

interface FormData {
    name: string,
    location: string,
    destination: string,
    date: string,
    time: string,
    numRunners: number,
}

export default function Create() {
    const [formData, setFormData] = useState<FormData>({ name: "", location: "", destination: "", date: "", time: "", numRunners: 0})


    const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const response = await fetch("/api/runs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
    
        if (response.ok) {
            console.log("Run created successfully!");
        } else {
            console.error("Error creating run");
        }

        setFormData({
            name: "",
            location: "",
            destination: "",
            date: "",
            time: "",
            numRunners: 0
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
      };

    return (
        <div>
            <h1>Create a Run!</h1>
            <form onSubmit={handleSubmit}>
                Name: <input type="text" name="name" placeholder="Enter your name here..." value={formData.name} onChange={handleChange} required />
                <br/>
                Starting location: <input type="text" name="location" placeholder="Where will we start?" value={formData.location} onChange={handleChange} required /> 
                <br/>
                Ending destination: <input type="text" name="destination" placeholder="Where will we end?" value={formData.destination} onChange={handleChange} required />
                <br />
                Date: <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                <br />
                Time: <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                <br />
                Run Size: <input type="number" name="numRunners" min="0" max="20" step="1" value={formData.numRunners} onChange={handleChange} required />
                <br />
                <button type="submit">Run!</button>
            </form>
        </div>
    );
  }