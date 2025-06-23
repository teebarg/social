import { createFileRoute } from "@tanstack/react-router";

import useAuth from "@/hooks/useAuth";
export const Route = createFileRoute("/_layout/store/")({
    component: Dashboard,
});

function Dashboard() {
    const { user } = useAuth();

    if (!user) {
        return <div>Please log in to access the dashboard.</div>;
    }

    return (
        <div>
            <h1>Welcome to the E-commerce CRM Dashboard</h1>
            <p className="text-2xl">Hi, {user?.first_name || user?.email} 👋🏼</p>
            {/* Add more dashboard components and features here */}
        </div>
    );
}
