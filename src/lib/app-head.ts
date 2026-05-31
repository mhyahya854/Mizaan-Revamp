export interface AppHeadLink {
  rel: string;
  href: string;
}

const LOCAL_FAVICON =
  "data:image/svg+xml,%3Csvg viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%231c1917'/%3E%3Ctext x='32' y='42' text-anchor='middle' font-family='Arial' font-size='34' fill='%23fafaf9'%3EM%3C/text%3E%3C/svg%3E";

export function getAppHeadLinks(appCssHref: string): AppHeadLink[] {
  return [
    { rel: "stylesheet", href: appCssHref },
    { rel: "icon", href: LOCAL_FAVICON },
  ];
}
