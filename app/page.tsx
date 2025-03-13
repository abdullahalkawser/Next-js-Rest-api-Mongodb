// "use client";
// import { useState } from "react";

// export default function CreateUser() {
//     const [formData, setFormData] = useState({ title: "", email: "", number: "" });
//     const [message, setMessage] = useState("");

//     const handleChange = (e: { target: { name: any; value: any; }; }) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e: { preventDefault: () => void; }) => {
//         e.preventDefault();

//         const res = await fetch("/api/users", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(formData),
//         });

//         const data = await res.json();
//         setMessage(data.message);

//         if (res.ok) {
//             setFormData({ title: "", email: "", number: "" });
//         }
//     };

//     return (
//         <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-4">Create User</h2>
//             <form onSubmit={handleSubmit} className="space-y-3">
//                 <input
//                     type="text"
//                     name="title"
//                     placeholder="Enter Title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     className="w-full p-2 border rounded"
//                     required
//                 />
//                 <input
//                     type="email"
//                     name="email"
//                     placeholder="Enter Email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full p-2 border rounded"
//                     required
//                 />
//                 <input
//                     type="text"
//                     name="number"
//                     placeholder="Enter Number"
//                     value={formData.number}
//                     onChange={handleChange}
//                     className="w-full p-2 border rounded"
//                     required
//                 />
//                 <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
//                     Submit
//                 </button>
//             </form>
//             {message && <p className="mt-3 text-green-600">{message}</p>}
//         </div>
//     );
// }
