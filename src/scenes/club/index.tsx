import { Route, Routes } from "react-router-dom";
import View from "./View";
import Edit from "./Edit";

export default function Club() {
  return (
    <Routes>
      <Route path=":id/" element={<View />} />
      <Route path=":id/edit" element={<Edit />} />
    </Routes>
  );
}
