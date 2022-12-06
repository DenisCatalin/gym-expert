export default async function useFetch(url = "") {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}
