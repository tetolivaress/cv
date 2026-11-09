import { sectionRoute } from "@/lib/route-factories";

const route = sectionRoute("es");
export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
