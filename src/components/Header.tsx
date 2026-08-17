"use client";

import React from "react";
import Image from "next/image";

type StoryblokLink = { url?: string; cached_url?: string; story?: { slug: string } } | string;
type NavItem = { _uid: string; label?: string; href?: StoryblokLink; link?: StoryblokLink; component?: string };
type NavigationBlock = {
  _uid?: string;
  cta_label?: string;
  cta_link?: StoryblokLink;
  brand_name?: string;
  brand_icon?: { filename?: string } | null;
  nav_items?: NavItem[];
};

function normalizeCachedUrl(raw?: string) {
  if (!raw) return "#";
  if (raw.startsWith("http")) return raw;
  const cleaned = raw.replace(/^\/?pages\//, "").replace(/^\/+/, "");
  return "/" + cleaned;
}

function getLinkUrl(link?: StoryblokLink) {
  if (!link) return "#";
  if (typeof link === "string") return link;
  if (typeof link === "object" && link !== null) {
    if ("cached_url" in link && typeof link.cached_url === "string") return normalizeCachedUrl(link.cached_url);
    if ("url" in link && typeof link.url === "string") return link.url;
    if ("story" in link && link.story && typeof link.story.slug === "string") return `/${link.story.slug}`;
  }
  return "#";
}

export default function Header({ config = null }: { config?: NavigationBlock | null }) {
  if (!config) {
    return (
      <header className="header-fallback" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, fontWeight: 700 }}>
            S
          </div>
          <span style={{ fontWeight: 600 }}>BrightStart</span>
        </div>
      </header>
    );
  }

  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {config.brand_icon?.filename && (
          // gunakan next/image untuk menghindari warning dan optimasi
          <div style={{ position: "relative", width: 160, height: 48 }}>
            <Image
              src={config.brand_icon.filename}
              alt={config.brand_name ?? "brand"}
              fill={false}
              width={160}
              height={48}
              style={{ objectFit: "contain" }}
            />
          </div>
        )}
        <span style={{ fontWeight: 600 }}>{config.brand_name}</span>
      </div>

      <nav>
        <ul style={{ display: "flex", gap: 20, listStyle: "none", margin: 0, padding: 0 }}>
          {config.nav_items?.map((item: NavItem) => {
            const hrefSource = item.href ?? item.link;
            const href = getLinkUrl(hrefSource);
            return (
              <li key={item._uid}>
                <a href={href} style={{ textDecoration: "none", color: "#111" }}>
                  {item.label}
                </a>
              </li>
            );
          })}

          {config.cta_label && config.cta_link && (
            <li>
              <a
                href={getLinkUrl(config.cta_link)}
                style={{ padding: "8px 12px", background: "#0070f3", color: "#fff", borderRadius: 6, textDecoration: "none" }}
              >
                {config.cta_label}
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
