"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const UpdateUserForm = () => {
    const { userId } = useParams(); // ✅ Get userId from Next.js Router
    console.log(userId)
    const router = useRouter();

    const [user, setUser] = useState({
        title: "",
        email: "",
        number: "",
        username: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!userId) {
            setError("User ID is missing!");
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/users/${userId}`);
                if (!response.ok) throw new Error("User not found");

                const data = await response.json();
                setUser(data.user);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUser();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const result = await response.json();

            if (response.ok) {
                alert("User updated successfully!");
                router.push("/users"); // ✅ Redirect after update
            } else {
                setError(result.message || "Something went wrong");
            }
        } catch (error) {
            setError("Failed to update user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-center mb-4">Update User</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="title" value={user.title} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Title" required />
                <input type="email" name="email" value={user.email} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Email" required />
                <input type="text" name="number" value={user.number} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Phone Number" required />
                <input type="text" name="username" value={user.username} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Username" required />
                <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    {loading ? "Updating..." : "Update User"}
                </button>
            </form>
        </div>
    );
};

export default UpdateUserForm;
