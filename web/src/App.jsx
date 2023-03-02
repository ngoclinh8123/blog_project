import { Fragment, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { publicRoutes } from "./routes";
import { DefaultLayout } from "./components/layouts";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.page;
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Suspense fallback={<div>Loading...</div>}>
                      <Page />
                    </Suspense>
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
