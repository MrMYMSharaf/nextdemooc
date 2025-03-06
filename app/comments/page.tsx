"use client";

import DataTableComponent from "./DataTable";

export default function CommentsPage() {
  return (
    <div className="p-8 bg-gradient-to-b from-yellow-50 to-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-yellow-900">Comment Management</h1>
          <p className="text-yellow-700 mt-1">Monitor and manage user feedback</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-yellow-100">
        <DataTableComponent />
      </div>
    </div>
  );
}