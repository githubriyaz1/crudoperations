"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const API = "https://crudoperations-eh5h.onrender.com/";

  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
  });

  const [editingId, setEditingId] = useState(null);

  // LOAD USERS
  useEffect(() => {
    const loadUsers = async () => {
      const res = await fetch(`${API}/users`);
      const data = await res.json();

      setUsers(data);
    };

    loadUsers();
  }, []);

  // ADD USER
  const addUser = async () => {
    await fetch(`${API}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        age: Number(form.age),
      }),
    });

    setForm({
      name: "",
      email: "",
      age: "",
    });

    window.location.reload();
  };

  // DELETE USER
  const deleteUser = async (id) => {
    await fetch(`${API}/users/${id}`, {
      method: "DELETE",
    });

    window.location.reload();
  };

  // EDIT USER
  const editUser = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      age: user.age,
    });

    setEditingId(user.id);
  };

  // UPDATE USER
  const updateUser = async () => {
    await fetch(`${API}/users/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        age: Number(form.age),
      }),
    });

    setEditingId(null);

    setForm({
      name: "",
      email: "",
      age: "",
    });

    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-10">
        FastAPI + Next.js CRUD
      </h1>

      <div className="flex flex-col gap-4 max-w-md mb-10">
        <input
          className="p-3 rounded bg-zinc-900 border border-zinc-700"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          className="p-3 rounded bg-zinc-900 border border-zinc-700"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          className="p-3 rounded bg-zinc-900 border border-zinc-700"
          placeholder="Age"
          value={form.age}
          onChange={(e) =>
            setForm({
              ...form,
              age: e.target.value,
            })
          }
        />

        {editingId ? (
          <button
            onClick={updateUser}
            className="bg-yellow-500 text-black p-3 rounded font-bold"
          >
            Update User
          </button>
        ) : (
          <button
            onClick={addUser}
            className="bg-white text-black p-3 rounded font-bold"
          >
            Add User
          </button>
        )}
      </div>

      <div className="grid gap-5">
        {users.map((user) => (
          <div
            key={user.id}
            className="border border-zinc-700 p-5 rounded bg-zinc-900"
          >
            <h2 className="text-3xl font-bold">
              {user.name}
            </h2>

            <p>{user.email}</p>

            <p>
              Age: {user.age}
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => editUser(user)}
                className="bg-blue-600 px-4 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteUser(user.id)}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}