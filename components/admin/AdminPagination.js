export default function AdminPagination({ page, pages, setPage }) {
  return (
    <div className="flex justify-center mt-6 gap-2">
      <button
        onClick={() => setPage((p) => p - 1)}
        disabled={page === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span className="px-4 py-1">
        Page {page} of {pages}
      </span>
      <button
        onClick={() => setPage((p) => p + 1)}
        disabled={page === pages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
