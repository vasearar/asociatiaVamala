import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import NewsPage from "./pages/NewsPage";
import NewsDetail from "./pages/NewsDetail";
import Documents from "./pages/Documents.tsx";
import Members from "./pages/Members";
import Contact from "./pages/Contact";
import ForumWorkshop from "./pages/ForumWorkshop";

function ForumWorkshopRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={`/forum&workshop${search}${hash}`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/members" element={<Members />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forum&workshop" element={<ForumWorkshop />} />
        <Route path="/forum-workshop" element={<ForumWorkshopRedirect />} />
        <Route path="/forum-workshop/index.html" element={<ForumWorkshopRedirect />} />
        <Route path="*" element={<div className="p-10">404 Not Found</div>} />
      </Route>
    </Routes>
  );
}
