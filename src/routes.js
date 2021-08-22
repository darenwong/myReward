import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import StoreView from 'src/views/stores/StoreView';
import CustomerListView from 'src/views/customer/CustomerListView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import LogoutView from 'src/views/auth/LogoutView';
import NotFoundView from 'src/views/errors/NotFoundView';
import ProductListView from 'src/views/product/ProductListView';
import RegisterView from 'src/views/auth/RegisterView';
import SettingsView from 'src/views/settings/SettingsView';
import MainView from 'src/views/main/MainView';
import ForgotPasswordView from 'src/views/auth/ForgotPasswordView';
import { useAuth } from './contexts/AuthContext';

function Routes(){
  const { currentUser } = useAuth();

  const routes = [
    {
      path: 'app',
      element: (currentUser)?<DashboardLayout />:<Navigate to="/login" />,
      children: [
        { path: 'main', element: <MainView /> },
        { path: 'account', element: <AccountView /> },
        { path: 'stores', element: <StoreView /> },
        { path: 'customers', element: <CustomerListView /> },
        { path: 'dashboard', element: <DashboardView /> },
        { path: 'products', element: <ProductListView /> },
        { path: 'settings', element: <SettingsView /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: 'login', element: (!currentUser)?<LoginView />:<Navigate to={"/app/dashboard"+window.location.search} /> },
        { path: 'logout', element: <LogoutView /> },
        { path: 'register', element: (!currentUser)?<RegisterView />:<Navigate to="/app/dashboard" /> },
        { path: 'forgot-password', element: (!currentUser)?<ForgotPasswordView />:<Navigate to="/app/dashboard" /> },
        { path: '404', element: <NotFoundView /> },
        { path: '/', element: <Navigate to="/app/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    }
  ];
  
  return useRoutes(routes);
}

export default Routes;
