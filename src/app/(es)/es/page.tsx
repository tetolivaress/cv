import { homeRoute } from "@/lib/route-factories";

const route = homeRoute("es");
export const metadata = route.metadata;
export default route.Page;
