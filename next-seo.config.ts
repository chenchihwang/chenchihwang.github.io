import type { NextSeoProps } from "next-seo";

export default {
  titleTemplate: "%s // Alex Carpenter",
  title: "Alex Carpenter",
  description: "Design Engineer",
  openGraph: {
    locale: "en_US",
    type: "website",
    url: "https://alexcarpenter.me",
    site_name: "Alex Carpenter",
    images: [{ url: "https://alexcarpenter.me/apple-touch-icon.png" }],
  },
  twitter: {
    handle: "@hybrid_alex",
    cardType: "summary",
  },
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.svg",
    },
    {
      rel: "apple-touch-icon",
      href: "https://alexcarpenter.me/apple-touch-icon.png",
      sizes: "180x180",
    },
  ],
} as NextSeoProps;
