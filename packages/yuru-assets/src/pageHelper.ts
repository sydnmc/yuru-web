const ports: Record<string, number> = {
    yurukyan: 1414,
    lilac: 1415,
    may: 1416,
    syd: 1417
};

export function getPageRoot(name: string) {
    if (import.meta.env.DEV) { //if we're in dev rather than prod
        return `http://localhost:${ports[name]}/`;
    } else {
        return `https://${name}.yuru.ca/`;
    }
}

export async function fetchFromApi(endpoint: string) {
    let response;
    if (import.meta.env.DEV) {
        response = await fetch(`http://localhost:3333/${endpoint}`);
    } else {
        response = await fetch(`https://api.yuru.ca/${endpoint}`);
    }
    return await response.json();
}