import NotFound, { metadata as englishMetadata } from "@/app/(en)/not-found";
import { localizePageMetadata } from "@/lib/seo/localized-metadata";

export const metadata = localizePageMetadata(englishMetadata, "zh");

export default NotFound;
