export default function AdminSearchBar({ search, setSearch, onSearch }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <input
        type="text"
        placeholder="Search by Order ID or User ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-1/3"
      />
      <button
        onClick={onSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Search
      </button>
    </div>
  );
}
