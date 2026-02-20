# Testing dinachi cli setup. 

/Users/dc/Codebase/my-nextapp/
├── .gitignore
├─] .next/ (ignored)
├── README.md
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── bun.lock
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── index.ts
│       ├── input.tsx
│       └── slider.tsx
├── components.json
├── eslint.config.mjs
├── lib/
│   ├── utils.ts
│   └── variants.ts
├─] next-env.d.ts (ignored)
├── next.config.ts
├─] node_modules/ (ignored)
├── package.json
├── postcss.config.mjs
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
└── tsconfig.json



{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/./hooks"
  },
  "iconLibrary": "lucide"
}