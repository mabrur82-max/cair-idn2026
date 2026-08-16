'use client'
import * as React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { storyblokEditable } from '@storyblok/react'
import { HamburgerIcon, BrandIcon } from './icons'

// ── Tipe data yang datang dari Storyblok ──────────────────────────────
export type NavItemBlok = {
  _uid?: string
  label: string
  href: string
}

export type NavigationBlok = {
  _uid?: string
  component?: string
  brand_name?: string
  brand_icon?: {
    filename: string
    alt?: string
  }
  nav_items?: NavItemBlok[]
  cta_label?: string
  cta_link?: {
    url?: string
    cached_url?: string
  }
}

export type AppbarProps = {
  className?: string
  blok: NavigationBlok
}

// Ambil URL link Storyblok (mendukung internal & eksternal link)
function resolveLink(link?: { url?: string; cached_url?: string }): string {
  if (!link) return '#'
  return link.url || link.cached_url || '#'
}

function AppBarView(props: AppbarProps) {
  const { blok, className } = props
  const [path, setPath] = useState<string | undefined>(() => undefined)
  const [menuOpen, setMenuOpen] = useState<boolean>(() => false)

  useEffect(() => {
    setPath(window.location.pathname)
  }, [])

  // Fallback aman kalau field Storyblok belum diisi
  const brandName = blok?.brand_name || 'BrightStart'
  const navItems = blok?.nav_items?.length
    ? blok.nav_items
    : [
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'About', href: '/about' },
      ]
  const ctaLabel = blok?.cta_label || 'Get in touch'
  const ctaHref = resolveLink(blok?.cta_link) !== '#'
    ? resolveLink(blok?.cta_link)
    : 'mailto:connect@brightstart.com'

  return (
    <div
      {...(blok ? storyblokEditable(blok) : {})}
      className={`flex flex-col sm:flex-row items-stretch self-stretch px-4 sm:px-8 md:px-20 py-4 sm:py-0 h-auto  sm:h-25 border-b border-stone-900 justify-between overflow-hidden ${className ?? ''}`}
    >
      <div className="flex justify-between items-center py-3 sm:py-0">
        <div className="flex items-center gap-1 sm:gap-1.5">
          {blok?.brand_icon?.filename ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={blok.brand_icon.filename}
              alt={blok.brand_icon.alt || brandName}
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
            />
          ) : (
            <BrandIcon />
          )}
          <div className="text-stone-900 text-lg sm:text-xl font-bold leading-6 sm:leading-7">
            {brandName}
          </div>
        </div>
        <div className="sm:hidden flex items-center gap-2">
          <Link
            href={ctaHref}
            className="self-center px-4 py-2 rounded-lg inline-flex flex-col items-end gap-2.5 overflow-hidden text-right justify-center text-white text-sm font-semibold leading-tight bg-stone-900 hover:bg-stone-800"
          >
            {ctaLabel}
          </Link>
          <button
            aria-label="Open menu"
            onClick={(_event) => setMenuOpen(!menuOpen)}
          >
            <HamburgerIcon />
          </button>
        </div>
      </div>
      <div className="hidden sm:flex flex-row items-stretch justify-start gap-6">
        <div className="flex flex-row items-stretch relative justify-start gap-4">
          {navItems.map((tab) => (
            <Link
              key={tab._uid ?? tab.href}
              href={tab.href}
              className={`flex items-center text-stone-900 text-sm font-semibold leading-tight transition-border duration-300 ease-in-out border-y-[3px] ${
                path === tab.href
                  ? 'border-b-stone-900 border-t-transparent'
                  : ' border-transparent'
              }`}
            >
              <span>{tab.label}</span>
            </Link>
          ))}
        </div>
        <Link
          href={ctaHref}
          className="self-center px-4 py-2 rounded-lg inline-flex flex-col items-end gap-2.5 overflow-hidden text-right justify-center text-white text-sm font-semibold leading-tight bg-stone-900 hover:bg-stone-800"
        >
          {ctaLabel}
        </Link>
      </div>
      {menuOpen ? (
        <div className="flex flex-col sm:hidden mt-2 gap-2 z-50 absolute top-[72px] left-0 right-0 bg-white shadow-lg">
          {navItems.map((tab) => (
            <Link
              key={tab._uid ?? tab.href}
              href={tab.href}
              onClick={(_event) => setMenuOpen(false)}
              className={`flex items-center text-stone-900 hover:text-stone-800 text-base font-semibold leading-tight px-2 py-2 rounded transition-colors duration-200 ${
                path === tab.href ? 'bg-stone-100' : ''
              }`}
            >
              <span>{tab.label}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default AppBarView
