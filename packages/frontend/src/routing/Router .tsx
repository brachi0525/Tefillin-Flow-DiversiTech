import { createBrowserRouter } from "react-router";
import AppLayout from "../layouts/AppLayout";
import HomePage from "../pages/HomePage";
import LocationOverview from "../pages/managerDashboard/locationOverview";
//import Login from "../components/loginByGoogle/Login";
import NotFoundPage from "../pages/notFoundPage/NotFoundPage";
import UserSettings from "../components/userSettings/UserSettingsPage";
import ManagerDashboard from "../pages/managerDashboard/SoldiersOverveiw";
import InventoryDashboard from "../pages/managerDashboard/TefillinOverveiw";
import TefillinDashboard from "../components/tefillinDashboard/tefillinDashboard";
import I18nEditor from "../pages/i18n-editor";
import SoldiersStatus from "../pages/rabbiDashbord/SoldierStatus";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../components/ProtectedRoute";
import NoAccessPage from "../components/no-access/NoAccessPage";
import GoogleAuthCallback from "../pages/GoogleAuthCallback";
import TefillinDetails from "../components/tefillinDetails/TefillinDetails";



const router = createBrowserRouter([

  { path: "/tefillin/:id", element: <TefillinDetails /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/google-auth-callback", element: <GoogleAuthCallback /> }, 
  {
    element: <AppLayout />,
    children: [

      {
        path: "/", element:
          <ProtectedRoute allowedRoles={['system_admin', 'manager', 'loaction_rabbi']}>
            <HomePage />
          </ProtectedRoute>
      },
      {
        path: "/locations",

        element:
          <ProtectedRoute allowedRoles={['system_admin', 'manager', 'loaction_rabbi']}>
            <LocationOverview />
          </ProtectedRoute>
      },
      {
        path: "/managerDashboard", element:
          <ProtectedRoute allowedRoles={['manager', 'system_admin']}>   <ManagerDashboard /></ProtectedRoute>
      },
      {
        path: "/settings", element:
          <ProtectedRoute allowedRoles={['system_admin', 'manager', 'location_rabbi']}> <UserSettings /></ProtectedRoute>
      },
      {
        path: "/tefillinDashboard", element:
          <ProtectedRoute allowedRoles={['system_admin', 'manager', 'location_rabbi']}> <InventoryDashboard /></ProtectedRoute>
      },
      {
        path: "/text-editor", element:
          <ProtectedRoute allowedRoles={['system_admin', 'manager', 'location_rabbi']}> < I18nEditor /></ProtectedRoute>
      },
      { path: "*", element: <NotFoundPage /> },
      { path: "/no-access", element: <NoAccessPage /> }






    ]
  }])

export default router;