import { Route, Routes } from "react-router-dom";
import View from "./View";
import EditGame from "./Edit";
import CreateGame from "./Create";

export default function Game() {
  return (
    <Routes>
      <Route path=":id" element={<View />} />
      <Route path=":id/edit" element={<EditGame />} />
      <Route path="create" element={<CreateGame />} />
    </Routes>
  );
}
