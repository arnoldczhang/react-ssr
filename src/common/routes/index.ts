import Home from "../../client/components/Home";
import About from "../../client/components/About";
import Contact from "../../client/components/Contact";
import Secret from "../../client/components/Secret";
import { CO } from "../types";

const routes: Array<CO> = [
  {
    path: "/",
    component: Home,
    exact: true,
  },
  {
    path: "/about",
    component: About,
    exact: true,
  },
  {
    path: "/contact",
    component: Contact,
    exact: true,
  },
  {
    path: "/secret",
    component: Secret,
    exact: true,
  },
];

export default routes;
