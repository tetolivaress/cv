import { sectionRoute } from "@/lib/route-factories";

const route = sectionRoute("en");
export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
