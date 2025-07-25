type DynamicRoutes = {
	
};

type Layouts = {
	"/": undefined;
	"/gds": undefined;
	"/whoami": undefined
};

export type RouteId = "/" | "/gds" | "/whoami";

export type RouteParams<T extends RouteId> = T extends keyof DynamicRoutes ? DynamicRoutes[T] : Record<string, never>;

export type LayoutParams<T extends RouteId> = Layouts[T] | Record<string, never>;

export type Pathname = "/" | "/gds" | "/whoami";

export type ResolvedPathname = `${"" | `/${string}`}${Pathname}`;

export type Asset = "/bg.jpg" | "/computers.jpg" | "/non.png";