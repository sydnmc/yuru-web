type DynamicRoutes = {
	
};

type Layouts = {
	"/": undefined;
	"/sets": undefined
};

export type RouteId = "/" | "/sets";

export type RouteParams<T extends RouteId> = T extends keyof DynamicRoutes ? DynamicRoutes[T] : Record<string, never>;

export type LayoutParams<T extends RouteId> = Layouts[T] | Record<string, never>;

export type Pathname = "/" | "/sets";

export type ResolvedPathname = `${"" | `/${string}`}${Pathname}`;

export type Asset = "/bg.jpg" | "/shima.png";