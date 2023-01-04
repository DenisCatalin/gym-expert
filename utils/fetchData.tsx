export default async function fetchData(endpoint: string, options?: Object) {
  console.log("Endpoint: " + endpoint + " Options: ", options);
  const res = await fetch(endpoint, options);
  const data = await res.json();
  return data;
}
