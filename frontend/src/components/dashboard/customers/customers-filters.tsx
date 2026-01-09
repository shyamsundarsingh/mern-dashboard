"use client";

import React from "react";

interface CustomersFiltersProps {
  search: string;
  onSearch: (value: string) => void;
}

export function CustomersFilters({ search, onSearch }: CustomersFiltersProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: 8,
          border: "1px solid #ccc",
          fontSize: "15px",
        }}
      />
    </div>
  );
}
