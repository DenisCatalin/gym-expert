export default async function fetchData(endpoint: string, options?: Object) {
  const res = await fetch(endpoint, options);
  const data = await res.json();
  console.log("S-a facut request");
  return data;
}
