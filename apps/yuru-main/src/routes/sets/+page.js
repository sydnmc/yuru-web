import { fetchFromApi } from "@repo/yuru-assets";

export async function load({ fetch }) {
  const setInfo = await fetchFromApi("sets");
  return { setInfo };
}
