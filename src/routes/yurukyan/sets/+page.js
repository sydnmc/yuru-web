export async function load({ fetch }) {
    const response = await fetch('https://api.yuru.ca/sets');
    const setInfo = await response?.json();
    return { setInfo }
}