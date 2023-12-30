import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { People } from "./pages/People/People";
import { Login } from "./pages/Login/Login";
import { Account } from "./pages/Account/Account";

const App = () => {
  const people = <People />;
  const account = <Account />;
  const login = <Login />;
  return (
    <Layout>
      <Routes>
        <Route index={true} path={"/"} element={login} />
        <Route path={"/people"} element={people} />
        <Route path={"/people/:page"} element={people} />
        <Route path={"/account"} element={account} />
        <Route
          path={"/*"}
          element={
            <div>
              Ошибка 404
              <br />
              Данная страница не существует.
            </div>
          }
        />
      </Routes>
    </Layout>
  );
};

export default App;
