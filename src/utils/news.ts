export type PdfAttachment = {
  path: string;
  name: string;
};

export type NewsItemLang = {
  title: string;
  text: string;
  tag: string;
  data: string;
  image?: string | string[];
  attachments?: PdfAttachment[];
};

export type NewsJson = Record<
  string,
  { ro: NewsItemLang; ru: NewsItemLang; en: NewsItemLang }
>;

/**
 * Supports the legacy comma-separated image value as well as the current
 * array format, while ensuring components never receive blank image paths.
 */
export const normalizeImagePaths = (image?: string | string[]): string[] =>
  (Array.isArray(image) ? image : [image ?? ""])
    .flatMap((path) => path.split(","))
    .map((path) => path.trim())
    .filter(Boolean);
