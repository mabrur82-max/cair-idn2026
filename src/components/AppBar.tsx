"use client";

import React from "react";

type StoryblokLink = { url?: string; cached_url?: string; story?: { slug: string } } | string;
type NavItem = { _uid: string; label?: string; href?: StoryblokLink; component?: string };

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
  if ((link as any).cached_url) return normalizeCachedUrl((link as any).cached_url);
  if ((link as any).url) return (link as any).url;
  if ((link as any).story?.slug) return `/${(link as any).story.slug}`;
  return "#";
}

// NOTE: make config optional so callers that don't pass it (e.g. ErrorPage) won't break the build
export default function AppBar({ config = null }: { config?: NavigationBlock | null }) {
  // Fallback UI when no config provided (prevents TypeScript errors and shows a minimal header)
  if (!config) {
    return (
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16 }}>
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
          <img src={config.brand_icon.filename} alt={config.brand_name ?? "brand"} style={{ height: 48 }} />
        )}
        <span style={{ fontWeight: 600 }}>{config.brand_name}</span>
      </div>

      <nav>
        <ul style={{ display: "flex", gap: 20, listStyle: "none", margin: 0, padding: 0 }}>
          {config.nav_items?.map((item) => {
            // In your JSON nav items use field "href"
            const href = getLinkUrl((item as any).href ?? (item as any).link);
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
