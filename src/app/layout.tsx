import React from "react";
import AppBar from "@/components/AppBar";
import "./globals.css";

export const metadata = {
  title: "Your Site",
  description: "Description",
};

type StoryblokLink = { url?: string; cached_url?: string; story?: { slug: string } } | string;
type NavItem = { _uid: string; label?: string; href?: StoryblokLink; link?: StoryblokLink; component?: string };
type NavigationBlock = {
  component?: string;
  _uid?: string;
  cta_label?: string;
  cta_link?: StoryblokLink;
  brand_name?: string;
  brand_icon?: { filename?: string } | null;
  nav_items?: NavItem[];
};

type StoryResponse = {
  story?: {
    content?: {
      body?: Array<Record<string, unknown>>;
    };
  };
};

async function fetchConfigStory(): Promise<NavigationBlock | null> {
  const token = process.env.STORYBLOK_DELIVERY_TOKEN;
  if (!token) {
    console.error("Missing STORYBLOK_DELIVERY_TOKEN");
    return null;
  }
  const version = process.env.NODE_ENV === "production" ? "published" : "draft";
  const url = `https://api.storyblok.com/v1/cdn/stories/config?token=${token}&version=${version}`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    console.error("Failed to fetch Storyblok config:", res.status, await res.text());
    return null;
  }

  const json = (await res.json()) as unknown as StoryResponse;
  const body = json?.story?.content?.body ?? [];
  // find navigation block with a type-safe check
  const found = body.find((b) => {
    // b is Record<string, unknown> — check component property
    if (typeof b === "object" && b !== null) {
      const component = (b as Record<string, unknown>)["component"];
      return component === "navigation";
    }
    return false;
  });

  if (!found || typeof found !== "object" || found === null) return null;
  return found as unknown as NavigationBlock;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const navigationBlock = await fetchConfigStory();

  return (
    <html lang="en">
      <body>
        <AppBar config={navigationBlock} />
        <main>{children}</main>
      </body>
    </html>
  );
}
