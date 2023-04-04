import { lazy } from "react";
import { Fragment, Suspense, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { publicRoutes } from "/src/route";
import defaultLayout from "/src/component/layout/default_layout";
import { AuthContext } from "/src/util/context/auth_context";

const Error404 = lazy(() => import("/src/page/error_404"));

// animation loading
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

function App() {
  const { loggedIn, user } = useContext(AuthContext);
  function checkLogin(require_login) {
    // if require = true and loggedin
    if (!require_login) {
      return true;
    } else if (require_login) {
      if (loggedIn) {
        return true;
      } else {
        return false;
      }
    }
  }
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.page;
            let Layout = defaultLayout;
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
                  checkLogin(route.require_login) ? (
                    <Layout>
                      <Suspense fallback={<Spin indicator={antIcon} />}>
                        <Page />
                      </Suspense>
                    </Layout>
                  ) : (
                    <Fragment>
                      <Suspense fallback={<Spin indicator={antIcon} />}>
                        <Error404 />
                      </Suspense>
                    </Fragment>
                  )
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
