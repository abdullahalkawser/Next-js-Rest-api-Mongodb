"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const UserList = () => {
    const [users, setUsers] = useState([]);
    console.log(users)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/users");
                const data = await response.json();

                if (!response.ok) throw new Error(data.message || "Failed to fetch users");

                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <p className="text-center mt-4">Loading users...</p>;
    if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-center mb-4">User List</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Title</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Number</th>
                        <th className="border p-2">Username</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className="text-center">
                            <td className="border p-2">{user.title}</td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2">{user.number}</td>
                            <td className="border p-2">{user.username}</td>
                            <td className="border p-2">
                                <Link href={`/${user._id}`}>
                                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                        Update
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
