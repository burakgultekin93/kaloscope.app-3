import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Onboarding from '@/pages/Onboarding';
import Dashboard from '@/pages/Dashboard';
import Scan from '@/pages/Scan';
import ScanResult from '@/pages/ScanResult';
import Diary from '@/pages/Diary';
import Stats from '@/pages/Stats';
import Profile from '@/pages/Profile';
import Paywall from '@/pages/Paywall';
import VerifyEmail from '@/pages/VerifyEmail';
import AuthCallback from '@/pages/AuthCallback';
import GoalsSettings from '@/pages/GoalsSettings';
import DietList from '@/pages/DietList';
import DietPlans from '@/pages/DietPlans';
import DietDetail from '@/pages/DietDetail';
import Achievements from '@/pages/Achievements';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Landing />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/verify-email',
        element: <VerifyEmail />,
    },
    {
        path: '/auth/callback',
        element: <AuthCallback />,
    },
    {
        path: '/privacy',
        element: <PrivacyPolicy />,
    },
    {
        path: '/terms',
        element: <TermsOfService />,
    },
    {
        path: '/onboarding',
        element: <Onboarding />,
    },
    {
        path: '/app',
        element: (
            <ProtectedRoute>
                <AppShell />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: 'scan',
                element: <Scan />,
            },
            {
                path: 'scan-result',
                element: <ScanResult />,
            },
            {
                path: 'diary',
                element: <Diary />,
            },
            {
                path: 'stats',
                element: <Stats />,
            },
            {
                path: 'profile',
                element: <Profile />,
            },
            {
                path: 'paywall',
                element: <Paywall />,
            },
            {
                path: 'profile/goals',
                element: <GoalsSettings />,
            },
            {
                path: 'diet-list',
                element: <DietList />,
            },
            {
                path: 'diet-plans',
                element: <DietPlans />,
            },
            {
                path: 'diet-plans/:slug',
                element: <DietDetail />,
            },
            {
                path: 'achievements',
                element: <Achievements />,
            },
        ],
    },
]);
