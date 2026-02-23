const defaultSiteUrl = "http://127.0.0.1:3443";

export const SITE_NAME = "Tell Their Stories";
export const SITE_DESCRIPTION =
  "A family history AI toolset to research deeply, document evidence, generate contextualized dossiers, and turn sources into meaningful stories your family can trust.";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl).replace(/\/+$/, "");
