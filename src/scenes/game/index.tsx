import { Route, Routes } from "react-router-dom";
import EditClub from "../club/Edit";
import View from "./View";

export default function Game() {
  return (
    <Routes>
      <Route path="/" element={<View />} />
      <Route path="edit" element={<EditClub />} />
    </Routes>
  );
}
