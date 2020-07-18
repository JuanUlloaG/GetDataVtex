"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const UserController_1 = require("./controller/UserController");
const OrdersController_1 = require("./controller/OrdersController");
const CompanyController_1 = require("./controller/CompanyController");
const ShopController_1 = require("./controller/ShopController");
const HomeController_1 = require("./controller/HomeController");
const OrderBagsController_1 = require("./controller/OrderBagsController");
exports.Routes = [
    {
        method: "get",
        route: "/",
        controller: HomeController_1.HomeController,
        action: "index"
    },
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
        method: "post",
        route: "/users/updateState",
        controller: UserController_1.UserController,
        action: "active"
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
        method: "post",
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
        method: "post",
        route: "/orders/take",
        controller: OrdersController_1.OrdersController,
        action: "picked"
    },
    {
        method: "post",
        route: "/orders/leave",
        controller: OrdersController_1.OrdersController,
        action: "leave"
    },
    {
        method: "get",
        route: "/orders/delivery",
        controller: OrdersController_1.OrdersController,
        action: "ordersToDelivery"
    },
    {
        method: "post",
        route: "/company",
        controller: CompanyController_1.CompanyControllers,
        action: "save"
    },
    {
        method: "post",
        route: "/shop/save",
        controller: ShopController_1.ShopController,
        action: "save"
    },
    {
        method: "post",
        route: "/shop/user",
        controller: ShopController_1.ShopController,
        action: "localByUser"
    },
    {
        method: "post",
        route: "/orderBags/save",
        controller: OrderBagsController_1.OrderBagsController,
        action: "save"
    },
    {
        method: "post",
        route: "/orderBags/list",
        controller: OrderBagsController_1.OrderBagsController,
        action: "listBags"
    },
    {
        method: "post",
        route: "/orderBags/listTake",
        controller: OrderBagsController_1.OrderBagsController,
        action: "listBagsforTake"
    },
    {
        method: "post",
        route: "/orderBags/update",
        controller: OrderBagsController_1.OrderBagsController,
        action: "updateBag"
    },
    {
        method: "post",
        route: "/orderBags/update/received",
        controller: OrderBagsController_1.OrderBagsController,
        action: "updateBagReceived"
    },
    {
        method: "post",
        route: "/bagNumber",
        controller: OrderBagsController_1.OrderBagsController,
        action: "getNumber"
    },
];
