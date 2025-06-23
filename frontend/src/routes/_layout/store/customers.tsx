import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/store/customers")({
    component: () => <div>Hello /_layout/store/customers!</div>,
});
