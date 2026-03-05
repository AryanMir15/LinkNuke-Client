import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { LinksProvider } from '../context/LinksContext';
import Dashboard from '../Dashboard/Dashboard';

export default function DashboardWrapper() {
  return (
    <AuthProvider>
      <LinksProvider>
        <Dashboard />
      </LinksProvider>
    </AuthProvider>
  );
}
