type DynamicRoutes = {
	
};

type Layouts = {
	"/": undefined;
	"/gds": undefined;
	"/music": undefined
};

export type RouteId = "/" | "/gds" | "/music";

export type RouteParams<T extends RouteId> = T extends keyof DynamicRoutes ? DynamicRoutes[T] : Record<string, never>;

export type LayoutParams<T extends RouteId> = Layouts[T] | Record<string, never>;

export type Pathname = "/" | "/gds" | "/music";

export type ResolvedPathname = `${"" | `/${string}`}${Pathname}`;

export type Asset = "/doremy.jpg" | "/music preview.jpg" | "/shiranaieki.jpg" | "/sugar particle.jpg";