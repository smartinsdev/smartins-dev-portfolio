function resolveSiteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL;

  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelDomain) return `https://${vercelDomain}`;

  return "http://localhost:3000";
}

export const siteUrl = new URL(resolveSiteUrl());
