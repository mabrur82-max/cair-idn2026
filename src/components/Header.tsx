import React from "react";

type StoryblokLink = { url?: string; cached_url?: string; story?: { id:number; slug:string } } | string;

type NavItem = {
  _uid: string;
  label?: string;
  href?: StoryblokLink; // di JSON Anda field nav_items[*].href
  component?: string;
};

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
  // contoh raw: "pages/about" atau "/pages/about" atau "https://..." 
  if (raw.startsWith("http")) return raw;
  // hilangkan prefix "pages/" jika ada, lalu prefix dengan "/"
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

export default function Header({ config }: { config: NavigationBlock | null }) {
  if (!config) return null;

  return (
    <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:16}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        {config.brand_icon?.filename && (
          <img src={config.brand_icon.filename} alt={config.brand_name ?? "brand"} style={{height:48}} />
        )}
        <span style={{fontWeight:600}}>{config.brand_name}</span>
      </div>

      <nav>
        <ul style={{display:'flex',gap:20,listStyle:'none',margin:0,padding:0}}>
          {config.nav_items?.map(item => {
            const href = getLinkUrl((item as any).href ?? (item as any).link);
            return (
              <li key={item._uid}>
                <a href={href} style={{textDecoration:'none',color:'#111'}}>{item.label}</a>
              </li>
            );
          })}
          {config.cta_label && config.cta_link && (
            <li>
              <a href={getLinkUrl(config.cta_link)} style={{padding:'8px 12px',background:'#0070f3',color:'#fff',borderRadius:6,textDecoration:'none'}}>
                {config.cta_label}
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
