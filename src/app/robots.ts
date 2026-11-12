import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/portal/admin", "/portal/student", "/api/"],
    },
    sitemap: "https://humnaacademy.com/sitemap.xml",
  };
}
