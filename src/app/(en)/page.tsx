import { homeRoute } from "@/lib/route-factories";

const route = homeRoute("en");
export const metadata = route.metadata;
export default route.Page;
