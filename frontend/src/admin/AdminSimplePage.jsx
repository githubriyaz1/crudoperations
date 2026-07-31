import { AdminHeader } from "./AdminOverview";

function AdminSimplePage({ title }) {
  return (
    <div>
      <AdminHeader title={title} subtitle={`${title} tools are scaffolded for the upcoming backend phase.`} />
      <div className="admin-card">
        <h2 className="admin-title">{title} Center</h2>
        <p className="mt-3 max-w-2xl text-[#cfc1a5]">
          This screen keeps the dashboard navigation complete while product, category,
          order, customer, authentication, and checkout workflows are fully usable on the frontend.
        </p>
      </div>
    </div>
  );
}

export default AdminSimplePage;
