import { PUBLIC_API } from '$env/static/public';

export async function load({ fetch }) {
    const response = await fetch(`${PUBLIC_API}/sets`);
    const setInfo = await response?.json();
    return { setInfo }
}