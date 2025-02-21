import { Router } from "express";

import productRouter from "../modules/product/product.route";
import orderRoute from "../modules/order/order.route";
import userRoute from "../modules/user/user.route";
import authRoute from "../modules/auth/auth.route";

const router = Router();

const routes = [
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/products",
    route: productRouter,
  },
  {
    path: "/orders",
    route: orderRoute,
  },

  // {
  //   path: "/admins",
  //   route: adminRoute,
  // },

  {
    path: "/auth",
    route: authRoute,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
