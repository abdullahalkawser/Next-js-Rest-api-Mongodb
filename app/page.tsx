"use client";
import { useState } from "react";

export default function CreateUser() {
    const [formData, setFormData] = useState({ title: "", email: "", number: "", username: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.title || !formData.email || !formData.number || !formData.username) {
            setMessage("⚠️ All fields are required!");
            return;
        }

        setLoading(true); // Start loading

        const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        setMessage(data.message);
        setLoading(false); // Stop loading

        if (res.ok) {
            setFormData({ title: "", email: "", number: "", username: "" });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-lg bg-white">
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Create a New User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Enter Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="text"
                    name="number"
                    placeholder="Enter Number"
                    value={formData.number}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button
                    type="submit"
                    className={`w-full text-white p-3 rounded-lg transition ${
                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
            {message && (
                <p className={`mt-4 text-center ${message.includes("⚠️") ? "text-red-500" : "text-green-600"}`}>
                    {message}
                </p>
            )}
        </div>
    );
}
