"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const UserController_1 = require("./controller/UserController");
const OrdersController_1 = require("./controller/OrdersController");
exports.Routes = [
    {
        method: "get",
        route: "/users",
        controller: UserController_1.UserController,
        action: "all"
    },
    {
        method: "get",
        route: "/users/:id",
        controller: UserController_1.UserController,
        action: "one"
    },
    {
        method: "post",
        route: "/users",
        controller: UserController_1.UserController,
        action: "save"
    },
    {
        method: "delete",
        route: "/users/:id",
        controller: UserController_1.UserController,
        action: "remove"
    },
    {
        method: "post",
        route: "/users/auth",
        controller: UserController_1.UserController,
        action: "auth"
    },
    {
        method: "get",
        route: "/orders",
        controller: OrdersController_1.OrdersController,
        action: "orders"
    },
    {
        method: "post",
        route: "/orders/save",
        controller: OrdersController_1.OrdersController,
        action: "save"
    },
    {
        method: "get",
        route: "/orders/delivery",
        controller: OrdersController_1.OrdersController,
        action: "ordersToDelivery"
    },
];
