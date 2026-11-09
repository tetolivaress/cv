import { projectRoute } from "@/lib/route-factories";

const route = projectRoute("en");
export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
