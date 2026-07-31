import { useEffect, useMemo, useState } from "react";
import { FaCheck, FaEyeSlash, FaSearch, FaStar, FaTrash } from "react-icons/fa";
import { AdminHeader } from "./AdminOverview";
import { useProducts } from "../context/ProductContext";
import { ReviewService } from "../services/review.service";

function ReviewsAdmin() {
  const { products, toggleReviewApproval, deleteReview } = useProducts();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [backendReviews, setBackendReviews] = useState(null);

  const fetchReviews = async () => {
    try {
      const data = await ReviewService.getAllReviews();
      if (data) setBackendReviews(data);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    let active = true;
    const loadReviews = async () => {
      try {
        const data = await ReviewService.getAllReviews();
        if (active && data) setBackendReviews(data);
      } catch {
        // Fallback
      }
    };
    loadReviews();
    return () => {
      active = false;
    };
  }, []);

  const reviews = useMemo(() => {
    if (backendReviews !== null) {
      return backendReviews.map((r) => ({
        ...r,
        approved: r.approved !== false,
        productImage: products.find((p) => p.id === r.productId || p.slug === r.productSlug)?.image || "",
      }));
    }
    return products.flatMap((product) =>
      (product.reviews || []).map((review, index) => ({
        ...review,
        id: review.id || `legacy-${product.id}-${index}`,
        approved: review.approved !== false,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
      }))
    );
  }, [backendReviews, products]);

  const displayedReviews = reviews.filter((review) => {
    const text = `${review.name} ${review.productName} ${review.text}`.toLowerCase();
    return (
      (!query.trim() || text.includes(query.trim().toLowerCase())) &&
      (filter === "all" || (filter === "published" ? review.approved : !review.approved))
    );
  });

  const pendingCount = reviews.filter((review) => !review.approved).length;

  const handleToggle = async (productId, reviewId) => {
    try {
      await ReviewService.toggleApproval(reviewId);
      fetchReviews();
    } catch {
      toggleReviewApproval(productId, reviewId);
    }
  };

  const handleDelete = async (productId, reviewId) => {
    try {
      await ReviewService.deleteReview(reviewId);
      fetchReviews();
    } catch {
      deleteReview(productId, reviewId);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Reviews"
        subtitle="Approve genuine feedback before it appears on product pages, or hide and remove anything unsuitable."
        action={
          <div className="rounded-full border border-[#d4af37]/35 bg-[#d4af37]/10 px-4 py-2 text-sm font-bold text-[#f8dfa0]">
            {pendingCount} awaiting review
          </div>
        }
      />

      <section className="admin-card">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]" />
            <input
              className="input pl-10"
              placeholder="Search reviewer, product, or comment"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <select
            className="input w-full sm:w-40"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All reviews</option>
            <option value="pending">Pending</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="grid gap-3 md:hidden">
          {displayedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="admin-table min-w-[860px]">
            <thead>
              <tr>
                <th>Review</th>
                <th>Product</th>
                <th>Rating</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedReviews.map((review) => (
                <tr key={review.id}>
                  <td>
                    <p className="font-bold text-[#f8dfa0]">{review.name}</p>
                    <p className="mt-1 max-w-sm text-sm text-[#cfc1a5]">{review.text}</p>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {review.productImage && (
                        <img src={review.productImage} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      )}
                      <span>{review.productName}</span>
                    </div>
                  </td>
                  <td>
                    <Stars rating={review.rating} />
                  </td>
                  <td>{review.createdAt || "—"}</td>
                  <td>
                    <ReviewStatus review={review} />
                  </td>
                  <td>
                    <ReviewActions review={review} onToggle={handleToggle} onDelete={handleDelete} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {displayedReviews.length === 0 && <EmptyReviews filter={filter} />}
      </section>
    </div>
  );
}

function ReviewStatus({ review }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
        review.approved ? "bg-emerald-400/15 text-emerald-300" : "bg-[#d4af37]/15 text-[#f8dfa0]"
      }`}
    >
      {review.approved ? "Published" : "Pending"}
    </span>
  );
}

function Stars({ rating }) {
  return (
    <span className="flex gap-0.5 text-[#d4af37]" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar key={star} className={star <= Math.round(rating) ? "" : "opacity-25"} />
      ))}
    </span>
  );
}

function ReviewActions({ review, onToggle, onDelete }) {
  return (
    <div className="flex gap-2">
      <button
        className="btn btn-light min-h-9 px-3"
        type="button"
        onClick={() => onToggle(review.productId, review.id)}
        aria-label={review.approved ? "Hide review" : "Publish review"}
      >
        {review.approved ? <FaEyeSlash /> : <FaCheck />}
      </button>
      <button
        className="btn min-h-9 bg-red-700 px-3 text-white"
        type="button"
        onClick={() => {
          if (window.confirm("Delete this review?")) onDelete(review.productId, review.id);
        }}
        aria-label="Delete review"
      >
        <FaTrash />
      </button>
    </div>
  );
}

function ReviewCard({ review, onToggle, onDelete }) {
  return (
    <article className="rounded-lg border border-[#d4af37]/15 bg-white/[0.035] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-[#f8dfa0]">{review.name}</p>
          <p className="mt-1 text-sm text-[#cfc1a5]">{review.productName}</p>
        </div>
        <ReviewStatus review={review} />
      </div>
      <div className="mt-3">
        <Stars rating={review.rating} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[#f8efd9]">{review.text}</p>
      <div className="mt-4">
        <ReviewActions review={review} onToggle={onToggle} onDelete={onDelete} />
      </div>
    </article>
  );
}

function EmptyReviews({ filter }) {
  return (
    <div className="grid min-h-48 place-items-center text-center text-[#cfc1a5]">
      <p>{filter === "pending" ? "No reviews are waiting for approval." : "No reviews match this view yet."}</p>
    </div>
  );
}

export default ReviewsAdmin;
