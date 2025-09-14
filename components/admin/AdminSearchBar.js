// components/admin/AdminSearchBar.jsx
import React, { useState, useEffect } from "react";

export default function AdminSearchBar({ onSearch = () => {}, initialValue = "" }) {
  const [q, setQ] = useState(initialValue || "");

  // Keep input in sync if parent changes initialValue
  useEffect(() => {
    setQ(initialValue || "");
  }, [initialValue]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onSearch(q.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        type="text"
        placeholder="Search orders (id, customer, phone...)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="flex-1 border px-3 py-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Search
      </button>
      <button
        type="button"
        onClick={() => {
          setQ("");
          onSearch("");
        }}
        className="bg-gray-200 px-3 py-2 rounded"
      >
        Reset
      </button>
    </form>
  );
}
