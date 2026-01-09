"use client";

import { useEffect, useState } from "react";
import { CustomersFilters } from "@/components/dashboard/customers/customers-filters";
import { CustomersTable } from "@/components/dashboard/customers/customers-table";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0); // pagination current page
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch("/api/customers", { cache: "no-store" });
        let data = await res.json();

        // Search Filter (frontend)
        if (search.trim() !== "") {
          data = data.filter((u: any) =>
            `${u.firstName} ${u.lastName}`
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
          );
        }

        setCustomers(data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    }
    loadCustomers();
  }, [search]);

  // Pagination Logic
  const paginatedRows = customers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Customer List</h2>

      <CustomersFilters search={search} onSearch={setSearch} />

      <CustomersTable
        rows={paginatedRows.map((u: any) => ({
          id: u._id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          createdAt: u.createdAt,
        }))}
        count={customers.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(event: any, newPage: number) => setPage(newPage)}
        onRowsPerPageChange={(event: any) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </div>
  );
}
