import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { PostFormPage } from "./pages/PostFormPage";
import { PostListPage } from "./pages/PostListPage";
import { PostViewPage } from "./pages/PostViewPage";

const App = () => (
  <AppShell>
    <Routes>
      <Route path="/" element={<PostListPage />} />
      <Route path="/posts/new" element={<PostFormPage />} />
      <Route path="/posts/:id" element={<PostViewPage />} />
      <Route path="/posts/:id/edit" element={<PostFormPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AppShell>
);

export default App;
