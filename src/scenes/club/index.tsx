import { Route, Routes } from "react-router-dom";
import View from "./View";
import Edit from "./Edit";

export default function Club() {
  return (
    <Routes>
      <Route path="/" element={<View />} />
      <Route path="edit" element={<Edit />} />
    </Routes>
  );
}
