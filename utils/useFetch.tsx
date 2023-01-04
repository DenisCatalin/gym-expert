export default async function useFetch(endpoint: string, options?: Object) {
  const res = await fetch(endpoint, options);
  const data = await res.json();
  return data;
}
