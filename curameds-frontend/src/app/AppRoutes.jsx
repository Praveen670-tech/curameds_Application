import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CuramedsLandingPage from '../features/landing/CuramedsLandingPage';
import LoginPage from '../features/authentication/LoginPage';
import RegisterPage from '../features/authentication/RegisterPage';
import MedicineDirectoryPage from '../features/medicines/MedicineDirectoryPage';
import DiscountOffersPage from '../features/discounts/DiscountOffersPage';
import PatientDashboard from '../features/dashboard/PatientDashboard';
import DonationManagementPage from '../features/donations/DonationManagementPage';
import ExchangeManagementPage from '../features/exchanges/ExchangeManagementPage';
import MedicalShopInventoryPage from '../features/inventory/MedicalShopInventoryPage';
import FamilyCarePage from '../features/family-care/FamilyCarePage';
import SafeDisposalPage from '../features/safe-disposal/SafeDisposalPage';
import TransactionHistoryPage from '../features/history/TransactionHistoryPage';
import AdminOverviewPage from '../features/administration/AdminOverviewPage';
import ProtectedRoute from '../components/common/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<CuramedsLandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/medicines" element={<MedicineDirectoryPage />} />
      <Route path="/discounts" element={<DiscountOffersPage />} />

      {/* Authenticated Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/donations"
        element={
          <ProtectedRoute>
            <DonationManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/exchanges"
        element={
          <ProtectedRoute>
            <ExchangeManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/inventory"
        element={
          <ProtectedRoute>
            <MedicalShopInventoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/family"
        element={
          <ProtectedRoute>
            <FamilyCarePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/disposal"
        element={
          <ProtectedRoute>
            <SafeDisposalPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/discounts"
        element={
          <ProtectedRoute>
            <DiscountOffersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/history"
        element={
          <ProtectedRoute>
            <TransactionHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute requiredRoles={['ADMIN']}>
            <AdminOverviewPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
