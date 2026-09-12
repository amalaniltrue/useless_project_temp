import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ExtensionErrorShield } from "@/components/ExtensionErrorShield";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "CatPad Pro 🐾 — The Animal Tablet & OS",
  description: "The world's first animal tablet operating system and social ecosystem. PawScript language, PetGram social media, PawChat messaging, and PawMatch matrimony.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CatPad Pro",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Proactive Early Shield against third-party extension injection bugs and hydration mismatches */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;

                // 1. Intercept extension DOM attribute mutations (e.g. bis_skin_checked, bis_register) that break React hydration
                try {
                  var origSetAttr = Element.prototype.setAttribute;
                  var origGetAttr = Element.prototype.getAttribute;
                  var origHasAttr = Element.prototype.hasAttribute;
                  var origRemoveAttr = Element.prototype.removeAttribute;

                  function isExtensionAttr(name) {
                    if (typeof name !== 'string') return false;
                    return (
                      name === 'bis_skin_checked' ||
                      name === 'bis_register' ||
                      name.indexOf('bis_') === 0 ||
                      name.indexOf('bis-') === 0
                    );
                  }

                  // Drop extension attribute writes completely so they never touch real DOM nodes
                  Element.prototype.setAttribute = function(name, val) {
                    if (isExtensionAttr(name)) {
                      this['__' + name] = val;
                      return;
                    }
                    return origSetAttr.call(this, name, val);
                  };

                  // React checks if attribute exists; return false so React never sees unexpected attributes
                  Element.prototype.hasAttribute = function(name) {
                    if (isExtensionAttr(name)) {
                      return false;
                    }
                    return origHasAttr.call(this, name);
                  };

                  // Return internal value if extension queries it, but never set real DOM attribute
                  Element.prototype.getAttribute = function(name) {
                    if (isExtensionAttr(name)) {
                      return this['__' + name] || null;
                    }
                    return origGetAttr.call(this, name);
                  };

                  // Filter getAttributeNames so React 19's attribute diff check never encounters bis_* attributes
                  if (Element.prototype.getAttributeNames) {
                    var origGetAttrNames = Element.prototype.getAttributeNames;
                    Element.prototype.getAttributeNames = function() {
                      var names = origGetAttrNames.call(this);
                      var res = [];
                      for (var i = 0; i < names.length; i++) {
                        if (!isExtensionAttr(names[i])) {
                          res.push(names[i]);
                        }
                      }
                      return res;
                    };
                  }

                  if (Element.prototype.setAttributeNode) {
                    var origSetAttrNode = Element.prototype.setAttributeNode;
                    Element.prototype.setAttributeNode = function(attr) {
                      if (attr && isExtensionAttr(attr.name)) {
                        return null;
                      }
                      return origSetAttrNode.call(this, attr);
                    };
                  }

                  // Active observer to scrub any extension-injected attributes immediately
                  if (typeof MutationObserver !== 'undefined') {
                    var obs = new MutationObserver(function(mutations) {
                      for (var i = 0; i < mutations.length; i++) {
                        var m = mutations[i];
                        if (m.type === 'attributes' && isExtensionAttr(m.attributeName)) {
                          try {
                            origRemoveAttr.call(m.target, m.attributeName);
                          } catch(e) {}
                        }
                      }
                    });
                    obs.observe(document.documentElement, {
                      attributes: true,
                      subtree: true,
                      attributeFilter: ['bis_skin_checked', 'bis_register']
                    });
                  }

                  // Scrub any attributes that were in raw HTML
                  function scrub(root) {
                    try {
                      var els = (root || document).querySelectorAll('[bis_skin_checked], [bis_register]');
                      for (var i = 0; i < els.length; i++) {
                        origRemoveAttr.call(els[i], 'bis_skin_checked');
                        origRemoveAttr.call(els[i], 'bis_register');
                      }
                    } catch(e) {}
                  }
                  scrub(document);
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', function() { scrub(document); });
                  }
                } catch(e) {}

                // 2. Filter console.error hydration noise caused by extensions
                try {
                  var origConsoleError = console.error;
                  console.error = function() {
                    var args = Array.prototype.slice.call(arguments);
                    var text = args.map(function(a) { return (a && a.stack) || String(a || ''); }).join(' ');
                    if (
                      text.indexOf('bis_skin_checked') !== -1 ||
                      text.indexOf('bis_register') !== -1 ||
                      text.indexOf('pphgdbgldlmicfdkhondlafkiomnelnk') !== -1 ||
                      text.indexOf('M_ID') !== -1
                    ) {
                      return;
                    }
                    return origConsoleError.apply(console, arguments);
                  };
                } catch(e) {}

                // 3. Proactive shield against extension crashes (e.g. 1ClickVPN M_ID unhandledRejection)
                function isExt(e) {
                  try {
                    var m = (e && (e.message || (e.reason && e.reason.message))) || String(e || '');
                    var s = (e && (e.stack || (e.reason && e.reason.stack))) || '';
                    return (
                      m.indexOf('M_ID') !== -1 ||
                      m.indexOf('bis_skin_checked') !== -1 ||
                      s.indexOf('chrome-extension://') !== -1 ||
                      s.indexOf('pphgdbgldlmicfdkhondlafkiomnelnk') !== -1
                    );
                  } catch(x) { return false; }
                }
                window.addEventListener('unhandledrejection', function(evt) {
                  if (isExt(evt.reason)) {
                    evt.preventDefault();
                    evt.stopImmediatePropagation();
                  }
                }, true);
                window.addEventListener('error', function(evt) {
                  if (isExt(evt.error) || (evt.filename && evt.filename.indexOf('chrome-extension://') !== -1)) {
                    evt.preventDefault();
                    evt.stopImmediatePropagation();
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-neutral-950 text-white selection:bg-amber-500 selection:text-white"
      >
        <ExtensionErrorShield />
        <main className="flex-1 min-h-screen flex flex-col">{children}</main>
      </body>
    </html>
  );
}
