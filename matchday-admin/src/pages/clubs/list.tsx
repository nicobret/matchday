import { useList, useTable } from "@refinedev/core";

export default function List() {
  const {data, isLoading, isError} = useList({ resource: "clubs" });
  const {tableQuery} = useTable({
    resource: "clubs",
  })
  console.log("🚀 ~ List ~ tableQuery:", tableQuery)
  console.log("🚀 ~ List ~ data:", data)
  return (
    <div>
      <h1>Club List</h1>
      {/* Add your club list implementation here */}
    </div>
  );
}
