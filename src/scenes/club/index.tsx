import { Route, Routes } from "react-router-dom";
import Edit from "./Edit";
import View from "./View";

export default function Club() {
  return (
    <Routes>
      <Route path=":id/" element={<View />} />
      <Route path=":id/edit" element={<Edit />} />
    </Routes>
  );
}
