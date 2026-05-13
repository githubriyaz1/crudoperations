"use client";

import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiLoader,
  FiLock,
  FiLogIn,
  FiLogOut,
  FiShield,
  FiTrash2,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";

const LOCAL_API = "http://localhost:8000";
const PRODUCTION_API = "https://crudoperations-eh5h.onrender.com";
const DEFAULT_STATS = {
  signups: 0,
  logins: 0,
  authenticationRequired: true,
};

const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return LOCAL_API;
  }

  return PRODUCTION_API;
};

const messageClasses = (type) =>
  type === "success"
    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
    : "border-rose-500/40 bg-rose-500/10 text-rose-200";

const loadingLabels = {
  adding: "Adding user and refreshing the dashboard...",
  updating: "Updating user details...",
  deleting: "Deleting user...",
  "admin-login": "Checking admin access...",
  logout: "Signing out...",
  loading: "Loading dashboard...",
};

const adminFetch = async (path, options = {}) => {
  return fetch(`${getApiBase()}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
};

const fetchUsers = async () => {
  const res = await adminFetch("/users", { headers: {} });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Unable to load users");
  }

  return data;
};

const fetchStats = async () => {
  const res = await adminFetch("/dashboard/stats", { headers: {} });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Unable to load dashboard stats");
  }

  return data;
};

export default function Home() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [adminSession, setAdminSession] = useState({
    checked: false,
    authenticated: false,
    email: "",
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
  });
  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [formMessage, setFormMessage] = useState({
    type: "",
    text: "",
  });
  const [adminMessage, setAdminMessage] = useState({
    type: "",
    text: "",
  });
  const [loadingAction, setLoadingAction] = useState("loading");

  const isBusy = Boolean(loadingAction);
  const isAdmin = adminSession.authenticated;

  const loadProtectedDashboard = async () => {
    const [usersData, statsData] = await Promise.all([fetchUsers(), fetchStats()]);
    setUsers(usersData);
    setStats(statsData);
  };

  useEffect(() => {
    let isActive = true;

    const loadSession = async () => {
      setLoadingAction("loading");

      try {
        const res = await adminFetch("/admin/session", { headers: {} });
        const session = await res.json();

        if (!isActive) {
          return;
        }

        if (session.authenticated) {
          await loadProtectedDashboard();

          if (!isActive) {
            return;
          }
        } else {
          setUsers([]);
          setStats(DEFAULT_STATS);
        }

        setAdminSession({
          checked: true,
          authenticated: session.authenticated,
          email: session.email || "",
        });
      } catch {
        if (!isActive) {
          return;
        }

        setUsers([]);
        setStats(DEFAULT_STATS);
        setAdminSession({
          checked: true,
          authenticated: false,
          email: "",
        });
        setAdminMessage({
          type: "error",
          text: "Admin session could not be loaded right now.",
        });
      } finally {
        if (isActive) {
          setLoadingAction("");
        }
      }
    };

    loadSession();

    return () => {
      isActive = false;
    };
  }, []);

  const addUser = async () => {
    setFormMessage({
      type: "",
      text: "",
    });
    setLoadingAction("adding");

    try {
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
      const data = await res.json();

      if (!res.ok) {
        setFormMessage({
          type: "error",
          text: data.detail || "Unable to add user",
        });
        return;
      }

      setForm({
        name: "",
        email: "",
        age: "",
      });
      setFormMessage({
        type: "success",
        text: "User added successfully.",
      });

      if (isAdmin) {
        await loadProtectedDashboard();
      }
    } catch {
      setFormMessage({
        type: "error",
        text: "Unable to add user right now.",
      });
    } finally {
      setLoadingAction("");
    }
  };

  const deleteUser = async (id) => {
    setLoadingAction("deleting");
    setFormMessage({
      type: "",
      text: "",
    });

    try {
      await adminFetch(`/users/${id}`, {
        method: "DELETE",
        headers: {},
      });
      await loadProtectedDashboard();
    } catch {
      setFormMessage({
        type: "error",
        text: "Unable to delete user right now.",
      });
    } finally {
      setLoadingAction("");
    }
  };

  const editUser = (user) => {
    if (isBusy) {
      return;
    }

    setFormMessage({
      type: "",
      text: "",
    });
    setForm({
      name: user.name,
      email: user.email,
      age: String(user.age),
    });
    setEditingId(user.id);
  };

  const updateUser = async () => {
    setFormMessage({
      type: "",
      text: "",
    });
    setLoadingAction("updating");

    try {
      const res = await adminFetch(`/users/${editingId}`, {
        method: "PUT",
        headers: {},
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFormMessage({
          type: "error",
          text: data.detail || "Unable to update user",
        });
        return;
      }

      setEditingId(null);
      setForm({
        name: "",
        email: "",
        age: "",
      });
      setFormMessage({
        type: "success",
        text: "User updated successfully.",
      });
      await loadProtectedDashboard();
    } catch {
      setFormMessage({
        type: "error",
        text: "Unable to update user right now.",
      });
    } finally {
      setLoadingAction("");
    }
  };

  const loginAsAdmin = async (event) => {
    event.preventDefault();
    setAdminMessage({
      type: "",
      text: "",
    });
    setLoadingAction("admin-login");

    try {
      const res = await adminFetch("/admin/login", {
        method: "POST",
        headers: {},
        body: JSON.stringify(adminForm),
      });
      const data = await res.json();

      if (!res.ok) {
        setAdminMessage({
          type: "error",
          text: data.detail || "Unable to sign in as admin",
        });
        return;
      }

      await loadProtectedDashboard();
      setAdminSession({
        checked: true,
        authenticated: true,
        email: data.email,
      });
      setAdminForm({
        email: "",
        password: "",
      });
      setAdminMessage({
        type: "success",
        text: "Admin access granted.",
      });
    } catch {
      setAdminMessage({
        type: "error",
        text: "Unable to reach admin login right now.",
      });
    } finally {
      setLoadingAction("");
    }
  };

  const logoutAdmin = async () => {
    setLoadingAction("logout");
    setAdminMessage({
      type: "",
      text: "",
    });

    try {
      await adminFetch("/admin/logout", {
        method: "POST",
        headers: {},
      });
    } finally {
      setUsers([]);
      setStats(DEFAULT_STATS);
      setEditingId(null);
      setAdminSession({
        checked: true,
        authenticated: false,
        email: "",
      });
      setAdminMessage({
        type: "success",
        text: "Admin session ended.",
      });
      setLoadingAction("");
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,#164e63_0,#0a0a0a_34%,#020617_100%)] px-4 py-6 text-white sm:px-8 lg:px-12">
      {isBusy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm">
          <div className="rounded-lg border border-white/15 bg-white/10 px-8 py-7 text-center shadow-2xl shadow-black/40">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-300/10">
              <FiLoader className="animate-spin text-2xl text-emerald-200" />
            </div>
            <p className="text-lg font-semibold text-white">
              {loadingLabels[loadingAction] || "Please wait..."}
            </p>
            <p className="mt-2 text-sm text-neutral-300">
              Buttons and form controls are locked until this finishes.
            </p>
          </div>
        </div>
      )}

      <section className="mx-auto max-w-7xl">
        <div className="grid w-full overflow-hidden rounded-lg border border-white/15 bg-white/10 shadow-2xl shadow-black/40 backdrop-blur-xl lg:h-[calc(100vh-48px)] lg:grid-cols-[380px_1fr]">
          <aside className="max-h-none overflow-y-auto border-b border-white/10 bg-black/20 p-5 [scrollbar-color:#67e8f9_transparent] [scrollbar-width:thin] lg:max-h-[calc(100vh-48px)] lg:border-b-0 lg:border-r">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-300">
                  Protected dashboard
                </p>
                <h1 className="text-3xl font-bold sm:text-4xl">
                  User Activity
                </h1>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={logoutAdmin}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiLogOut aria-hidden="true" />
                  Logout
                </button>
              )}
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
              <p className="text-sm text-neutral-300">
                Public visitors can submit this form. Admin-only dashboard details stay hidden until sign-in.
              </p>

              {formMessage.text && (
                <p className={`rounded-md border p-3 text-sm font-medium ${messageClasses(formMessage.type)}`}>
                  {formMessage.text}
                </p>
              )}

              <input
                disabled={isBusy}
                className="rounded-md border border-white/10 bg-white/10 p-3 outline-none transition focus:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
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
                disabled={isBusy}
                className="rounded-md border border-white/10 bg-white/10 p-3 outline-none transition focus:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
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
                disabled={isBusy}
                className="rounded-md border border-white/10 bg-white/10 p-3 outline-none transition focus:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
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
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white p-3 font-bold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                type="submit"
                disabled={isBusy}
              >
                {loadingAction === "adding" || loadingAction === "updating" ? (
                  <FiLoader className="animate-spin" aria-hidden="true" />
                ) : (
                  <FiUsers aria-hidden="true" />
                )}
                {editingId ? "Update User" : "Add User"}
              </button>
            </form>

            {isAdmin ? (
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
                    <p className="text-xs text-neutral-400">admin logins counted</p>
                  </div>
                </div>

                <div className="group flex items-center gap-4 rounded-lg border border-white/10 bg-white/10 p-4 transition duration-200 hover:-translate-y-1 hover:border-rose-200/70 hover:bg-white/15">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-rose-200 text-neutral-950">
                    <FiShield aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-300">Authentication</p>
                    <p className="text-xl font-bold">
                      {stats.authenticationRequired ? "Required" : "Not Required"}
                    </p>
                    <p className="text-xs text-neutral-400">{adminSession.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-white/15 bg-black/20 p-5">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md bg-white/10 text-emerald-200">
                  <FiLock aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold">Admin analytics are hidden</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-300">
                  Public visitors can sign up here, but user lists, login counts, edit controls, and dashboard details stay locked until the admin signs in.
                </p>
              </div>
            )}
          </aside>

          <section className="flex min-h-[560px] flex-col p-5 lg:min-h-0">
            {isAdmin ? (
              <>
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
                            type="button"
                            disabled={isBusy}
                            onClick={() => editUser(user)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-cyan-300 text-neutral-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Edit user"
                          >
                            <FiEdit2 aria-hidden="true" />
                          </button>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => deleteUser(user.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-rose-400 text-white transition hover:bg-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
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
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="w-full max-w-md rounded-lg border border-white/10 bg-black/25 p-6 shadow-xl shadow-black/30 backdrop-blur-md">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-300/10 text-2xl text-emerald-200">
                    <FiShield aria-hidden="true" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Admin Access
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">Unlock dashboard details</h2>
                  <p className="mt-3 text-sm leading-6 text-neutral-300">
                    Sign in as the admin to view user records, login counts, and protected dashboard analytics.
                  </p>

                  <form className="mt-6 space-y-3" onSubmit={loginAsAdmin}>
                    {adminMessage.text && (
                      <p className={`rounded-md border p-3 text-sm font-medium ${messageClasses(adminMessage.type)}`}>
                        {adminMessage.text}
                      </p>
                    )}

                    <input
                      disabled={isBusy}
                      className="w-full rounded-md border border-white/10 bg-white/10 p-3 outline-none transition focus:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Admin email"
                      type="email"
                      value={adminForm.email}
                      onChange={(e) =>
                        setAdminForm({
                          ...adminForm,
                          email: e.target.value,
                        })
                      }
                    />

                    <input
                      disabled={isBusy}
                      className="w-full rounded-md border border-white/10 bg-white/10 p-3 outline-none transition focus:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Admin password"
                      type="password"
                      value={adminForm.password}
                      onChange={(e) =>
                        setAdminForm({
                          ...adminForm,
                          password: e.target.value,
                        })
                      }
                    />

                    <button
                      type="submit"
                      disabled={isBusy}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-300 px-5 py-3 font-bold text-neutral-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loadingAction === "admin-login" ? (
                        <FiLoader className="animate-spin" aria-hidden="true" />
                      ) : (
                        <FiLogIn aria-hidden="true" />
                      )}
                      Sign in as admin
                    </button>
                  </form>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
