export default async function fetchData(endpoint: string, options?: Object) {
  const res = await fetch(endpoint, options);
  const data = await res.json();
  if (process.env.NODE_ENV !== "production") {
    console.log("S-a facut request");
  }
  return data;
}
