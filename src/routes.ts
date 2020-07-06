import { UserController } from "./controller/UserController";
import { OrdersController } from "./controller/OrdersController";
import { CompanyControllers } from "./controller/CompanyController";
import { ShopController } from "./controller/ShopController";

export const Routes = [
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
        method: "get",
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
];