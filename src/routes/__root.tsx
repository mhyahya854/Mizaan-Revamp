import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import appCss from "../styles.css?url";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { CommandPalette } from "@/components/CommandPalette";
import { ThemeProvider } from "@/hooks/use-theme";
import { RightPanelProvider } from "@/hooks/use-right-panel";
import { getAppHeadLinks } from "@/lib/app-head";

function NotFoundComponent() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <div className="max-w-md text-center">
        <p className="font-editorial text-5xl text-foreground">Not here.</p>
        <p className="mt-2 text-sm text-faint">
          The page you're looking for doesn't exist in this workspace.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-sm border hairline bg-background px-3 py-1.5 text-[13px] hover:bg-muted"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <div className="max-w-md text-center">
        <p className="font-editorial text-3xl">Something went wrong.</p>
        <p className="mt-2 text-sm text-faint">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-sm border hairline bg-background px-3 py-1.5 text-[13px] hover:bg-muted"
          >
            Try again
          </button>
          <a href="/" className="rounded-sm border hairline px-3 py-1.5 text-[13px] hover:bg-muted">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mizaan — Your personal operating system" },
      {
        name: "description",
        content:
          "Mizaan is a calm, document-first workspace for notes, documents, projects, people, finance and knowledge — a personal second brain.",
      },
      { property: "og:title", content: "Mizaan — Your personal operating system" },
      {
        property: "og:description",
        content: "A calm, document-first second brain for everything you think, keep and do.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: getAppHeadLinks(appCss),
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('mizaan-theme');
                  var theme = stored || 'system';
                  var active = theme;
                  if (theme === 'system') {
                    active = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', active);
                  if (active === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (active === 'night') {
                    document.documentElement.classList.add('night');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RightPanelProvider>
          <AppShell>
            <Outlet />
          </AppShell>
        </RightPanelProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [palette, setPalette] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <AppSidebar
        onOpenPalette={() => setPalette(true)}
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onOpenPalette={() => setPalette(true)} />
        <div className="flex min-h-0 flex-1">
          <main className="min-w-0 flex-1 overflow-y-auto scrollbar-thin">{children}</main>
        </div>
      </div>
      <CommandPalette open={palette} onClose={() => setPalette(false)} />
    </div>
  );
}
