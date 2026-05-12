"use client";

import { useEffect, useState } from "react";
import { FiEdit2, FiLogIn, FiShieldOff, FiTrash2, FiUserPlus, FiUsers } from "react-icons/fi";

const LOCAL_API = "http://localhost:8000";
const PRODUCTION_API = "https://crudoperations-eh5h.onrender.com";

const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return LOCAL_API;
  }

  return PRODUCTION_API;
};

const fetchUsers = async () => {
  const res = await fetch(`${getApiBase()}/users`);
  return res.json();
};

const fetchStats = async () => {
  const res = await fetch(`${getApiBase()}/dashboard/stats`);
  return res.json();
};

export default function Home() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    signups: 0,
    logins: 0,
    authenticationRequired: false,
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [formMessage, setFormMessage] = useState("");

  const loadUsers = async () => {
    setUsers(await fetchUsers());
  };

  const loadStats = async () => {
    setStats(await fetchStats());
  };

  // LOAD USERS AND DASHBOARD
  useEffect(() => {
    let isActive = true;

    const loadDashboard = async () => {
      const [usersData, statsData] = await Promise.all([
        fetchUsers(),
        fetchStats(),
      ]);

      if (!isActive) {
        return;
      }

      setUsers(usersData);
      setStats(statsData);
    };

    loadDashboard();

    return () => {
      isActive = false;
    };
  }, []);

  // ADD USER
  const addUser = async () => {
    setFormMessage("");

    const res = await fetch(`${getApiBase()}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        age: Number(form.age),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setFormMessage(data.detail || "Unable to add user");
      return;
    }

    setForm({
      name: "",
      email: "",
      age: "",
    });

    await loadUsers();
    await loadStats();
  };

  // DELETE USER
  const deleteUser = async (id) => {
    await fetch(`${getApiBase()}/users/${id}`, {
      method: "DELETE",
    });

    await loadUsers();
    await loadStats();
  };

  // EDIT USER
  const editUser = (user) => {
    setFormMessage("");

    setForm({
      name: user.name,
      email: user.email,
      age: user.age,
    });

    setEditingId(user.id);
  };

  // UPDATE USER
  const updateUser = async () => {
    setFormMessage("");

    const res = await fetch(`${getApiBase()}/users/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        age: Number(form.age),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setFormMessage(data.detail || "Unable to update user");
      return;
    }

    setEditingId(null);

    setForm({
      name: "",
      email: "",
      age: "",
    });

    await loadUsers();
    await loadStats();
  };

  // COUNT LOGIN WITHOUT AUTH
  const countLogin = async () => {
    const res = await fetch(`${getApiBase()}/login`, {
      method: "POST",
    });
    const data = await res.json();

    setStats((currentStats) => ({
      ...currentStats,
      logins: data.logins,
      authenticationRequired: data.authenticationRequired,
    }));
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,#164e63_0,#0a0a0a_34%,#020617_100%)] px-4 py-6 text-white sm:px-8 lg:px-12">
      <section className="mx-auto max-w-7xl">
        <div className="grid w-full overflow-hidden rounded-lg border border-white/15 bg-white/10 shadow-2xl shadow-black/40 backdrop-blur-xl lg:h-[calc(100vh-48px)] lg:grid-cols-[380px_1fr]">
          <aside className="max-h-none overflow-y-auto border-b border-white/10 bg-black/20 p-5 [scrollbar-color:#67e8f9_transparent] [scrollbar-width:thin] lg:max-h-[calc(100vh-48px)] lg:border-b-0 lg:border-r">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-300">
                  Public dashboard
                </p>
                <h1 className="text-3xl font-bold sm:text-4xl">
                  User Activity
                </h1>
              </div>
            </div>

            <form
              className="mb-5 flex flex-col gap-3 rounded-lg border border-emerald-300/30 bg-neutral-950/55 p-4 shadow-lg shadow-emerald-950/20"
              onSubmit={(event) => {
                event.preventDefault();
                editingId ? updateUser() : addUser();
              }}
            >
              <h2 className="text-xl font-bold">
                {editingId ? "Edit Signup" : "Add Signup"}
              </h2>

              {formMessage && (
                <p className="rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-sm font-medium text-rose-200">
                  {formMessage}
                </p>
              )}

              <input
                className="rounded-md border border-white/10 bg-white/10 p-3 outline-none transition focus:border-emerald-300"
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
                className="rounded-md border border-white/10 bg-white/10 p-3 outline-none transition focus:border-emerald-300"
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
                className="rounded-md border border-white/10 bg-white/10 p-3 outline-none transition focus:border-emerald-300"
                placeholder="Age"
                value={form.age}
                onChange={(e) =>
                  setForm({
                    ...form,
                    age: e.target.value,
                  })
                }
              />

              <button
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white p-3 font-bold text-neutral-950 transition hover:bg-neutral-200"
                type="submit"
              >
                <FiUsers aria-hidden="true" />
                {editingId ? "Update User" : "Add User"}
              </button>
            </form>

            <button
              onClick={countLogin}
              className="mb-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-300 px-5 py-3 font-bold text-neutral-950 transition hover:-translate-y-0.5 hover:bg-emerald-200"
            >
              <FiLogIn aria-hidden="true" />
              Count Login
            </button>

            <div className="grid grid-cols-1 gap-3">
              <div className="group flex items-center gap-4 rounded-lg border border-white/10 bg-white/10 p-4 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-white/15">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-cyan-300 text-neutral-950">
                  <FiUserPlus aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-neutral-300">Signup Details</p>
                  <p className="text-3xl font-bold">{stats.signups}</p>
                  <p className="text-xs text-neutral-400">registered users</p>
                </div>
              </div>

              <div className="group flex items-center gap-4 rounded-lg border border-white/10 bg-white/10 p-4 transition duration-200 hover:-translate-y-1 hover:border-amber-200/70 hover:bg-white/15">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-amber-200 text-neutral-950">
                  <FiLogIn aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-neutral-300">Login Details</p>
                  <p className="text-3xl font-bold">{stats.logins}</p>
                  <p className="text-xs text-neutral-400">counted logins</p>
                </div>
              </div>

              <div className="group flex items-center gap-4 rounded-lg border border-white/10 bg-white/10 p-4 transition duration-200 hover:-translate-y-1 hover:border-rose-200/70 hover:bg-white/15">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-rose-200 text-neutral-950">
                  <FiShieldOff aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-neutral-300">Authentication</p>
                  <p className="text-xl font-bold">
                    {stats.authenticationRequired ? "Required" : "Not Required"}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex min-h-[560px] flex-col p-5 lg:min-h-0">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
                  User Details
                </p>
                <h2 className="text-2xl font-bold">All Users</h2>
              </div>
              <span className="w-fit rounded-md border border-white/15 bg-white/10 px-3 py-1 text-sm text-neutral-200">
                {users.length} listed
              </span>
            </div>

            <div className="max-h-[70vh] min-h-0 flex-1 overflow-y-auto rounded-lg border border-white/10 bg-black/20 p-3 [scrollbar-color:#67e8f9_transparent] [scrollbar-width:thin] lg:max-h-none">
              <div className="grid gap-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="group grid gap-4 rounded-lg border border-white/10 bg-white/10 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300/50 hover:bg-white/15 sm:grid-cols-[1.2fr_1.5fr_80px_auto] sm:items-center"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-wide text-neutral-400">
                        Name
                      </p>
                      <h3 className="truncate text-xl font-bold transition group-hover:text-emerald-200">
                        {user.name || "No name"}
                      </h3>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-neutral-400">
                        Email
                      </p>
                      <p className="truncate text-neutral-200">{user.email || "No email"}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-neutral-400">
                        Age
                      </p>
                      <p className="text-lg font-semibold text-neutral-100">{user.age}</p>
                    </div>

                    <div className="flex gap-2 sm:justify-end">
                      <button
                        onClick={() => editUser(user)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-cyan-300 text-neutral-950 transition hover:bg-cyan-200"
                        title="Edit user"
                      >
                        <FiEdit2 aria-hidden="true" />
                      </button>

                      <button
                        onClick={() => deleteUser(user.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-rose-400 text-white transition hover:bg-rose-300"
                        title="Delete user"
                      >
                        <FiTrash2 aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}

                {users.length === 0 && (
                  <div className="rounded-lg border border-dashed border-white/20 p-8 text-center text-neutral-300">
                    No users yet.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
