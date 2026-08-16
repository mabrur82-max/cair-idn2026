// src/app/layout.tsx
import React from "react";
import AppBar from "@/components/AppBar"; // pastikan path sesuai
import "./globals.css";

export const metadata = {
  title: "Your Site",
  description: "Description",
};

async function fetchConfigStory() {
  const token = process.env.STORYBLOK_DELIVERY_TOKEN; // DELIVERY token for published
  const version = process.env.NODE_ENV === "production" ? "published" : "draft";
  const url = `https://api.storyblok.com/v1/cdn/stories/config?token=${token}&version=${version}`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    console.error("Failed to fetch Storyblok config:", res.status, await res.text());
    return null;
  }
  const json = await res.json();
  // response in your example had story at root: json.story
  const content = json?.story?.content ?? json?.data?.story?.content ?? null;
  if (!content) return null;
  const body = content.body ?? [];
  const navigationBlock = body.find((b: any) => b.component === "navigation") ?? null;
  return navigationBlock;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const navigationBlock = await fetchConfigStory();

  return (
    <html lang="en">
      <body>
        {/* Pass navigationBlock to AppBar */}
        <AppBar config={navigationBlock} />
        <main>{children}</main>
      </body>
    </html>
  );
}
