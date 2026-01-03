import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './stores/useAuthStore';
import './index.css';

// Pages (will create these)
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import MyTripsPage from './pages/MyTripsPage';
import CreateTripPage from './pages/CreateTripPage';
import ItineraryBuilderPage from './pages/ItineraryBuilderPage';
import BudgetPage from './pages/BudgetPage';
import CalendarViewPage from './pages/CalendarViewPage';
import PublicTripPage from './pages/PublicTripPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLayout from './layouts/AdminLayout';
import AdminCitiesPage from './pages/admin/AdminCitiesPage';
import AdminActivitiesPage from './pages/admin/AdminActivitiesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

function App() {
    const { isAuthenticated, initAuth } = useAuthStore();

    useEffect(() => {
        initAuth();
    }, [initAuth]);

    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
                <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/dashboard" />} />
                <Route path="/public/trips/:token" element={<PublicTripPage />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
                <Route path="/trips" element={isAuthenticated ? <MyTripsPage /> : <Navigate to="/login" />} />
                <Route path="/trips/create" element={isAuthenticated ? <CreateTripPage /> : <Navigate to="/login" />} />
                <Route path="/trips/:id/itinerary" element={isAuthenticated ? <ItineraryBuilderPage /> : <Navigate to="/login" />} />
                <Route path="/trips/:id/budget" element={isAuthenticated ? <BudgetPage /> : <Navigate to="/login" />} />
                <Route path="/trips/:id/calendar" element={isAuthenticated ? <CalendarViewPage /> : <Navigate to="/login" />} />
                <Route path="/admin" element={isAuthenticated ? <AdminLayout /> : <Navigate to="/login" />}>
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="cities" element={<AdminCitiesPage />} />
                    <Route path="activities" element={<AdminActivitiesPage />} />
                    <Route path="users" element={<AdminUsersPage />} />
                </Route>

                {/* Default redirect */}
                <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
