import { UserController } from "./controller/UserController";
import { OrdersController } from "./controller/OrdersController";
import { CompanyControllers } from "./controller/CompanyController";
import { ShopController } from "./controller/ShopController";
import { HomeController } from "./controller/HomeController";
import { OrderBagsController } from "./controller/OrderBagsController";

export const Routes = [
    {
        method: "get",
        route: "/",
        controller: HomeController,
        action: "index"
    },
    {
        method: "get",
        route: "/users",
        controller: UserController,
        action: "all"
    },
    {
        method: "get",
        route: "/users/:id",
        controller: UserController,
        action: "one"
    },
    {
        method: "post",
        route: "/users",
        controller: UserController,
        action: "save"
    },
    {
        method: "delete",
        route: "/users/:id",
        controller: UserController,
        action: "remove"
    },
    {
        method: "post",
        route: "/users/auth",
        controller: UserController,
        action: "auth"
    },
    {
        method: "post",
        route: "/orders",
        controller: OrdersController,
        action: "orders"
    },
    {
        method: "post",
        route: "/orders/save",
        controller: OrdersController,
        action: "save"
    },
    {
        method: "get",
        route: "/orders/delivery",
        controller: OrdersController,
        action: "ordersToDelivery"
    },
    {
        method: "post",
        route: "/company",
        controller: CompanyControllers,
        action: "save"
    },
    {
        method: "post",
        route: "/shop/save",
        controller: ShopController,
        action: "save"
    },
    {
        method: "post",
        route: "/shop/user",
        controller: ShopController,
        action: "localByUser"
    },
    {
        method: "post",
        route: "/orderBags/save",
        controller: OrderBagsController,
        action: "save"
    },
    {
        method: "post",
        route: "/orderBags/list",
        controller: OrderBagsController,
        action: "listBags"
    },
    {
        method: "post",
        route: "/orderBags/update",
        controller: OrderBagsController,
        action: "updateBag"
    },
];