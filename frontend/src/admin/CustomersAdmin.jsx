import { useEffect, useState } from "react";
import { AdminHeader } from "./AdminOverview";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { UserService } from "../services/user.service";

function CustomersAdmin() {
  const { users: contextUsers } = useAuth();
  const { orders } = useOrders();
  const [query, setQuery] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await UserService.getUsers({ search: query });
        if (active) {
          setUsersList(response.data || []);
        }
      } catch {
        if (active) {
          const normalized = query.trim().toLowerCase();
          setUsersList(
            contextUsers.filter(
              (user) =>
                !normalized ||
                user.name.toLowerCase().includes(normalized) ||
                user.email.toLowerCase().includes(normalized) ||
                (user.phone && user.phone.includes(normalized))
            )
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    const timer = setTimeout(fetchUsers, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, contextUsers]);

  return (
    <div>
      <AdminHeader title="Customers" subtitle="Search, filter, and review registered customers." />
      <div className="admin-card mb-5">
        <input
          className="input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search customers by name, email, or phone"
        />
      </div>
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#cfc1a5]">
                    Loading customers...
                  </td>
                </tr>
              ) : usersList.length > 0 ? (
                usersList.map((user) => (
                  <tr key={user.id || user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || "-"}</td>
                    <td>{orders.filter((order) => order.email === user.email).length}</td>
                    <td>
                      {user.joinedAt
                        ? new Date(user.joinedAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#cfc1a5]">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-[#cfc1a5]">
          Showing {usersList.length} customers from backend repository.
        </p>
      </div>
    </div>
  );
}

export default CustomersAdmin;
