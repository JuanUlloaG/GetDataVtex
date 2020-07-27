import { UserController } from "./controller/UserController";
import { OrdersController } from "./controller/OrdersController";
import { CompanyControllers } from "./controller/CompanyController";
import { ShopController } from "./controller/ShopController";
import { HomeController } from "./controller/HomeController";
import { OrderBagsController } from "./controller/OrderBagsController";
import { StateControllers } from "./controller/StateController";
import { ServiceControllers } from "./controller/ServicesController";

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
        method: "post",
        route: "/users/updateState",
        controller: UserController,
        action: "active"
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
        route: "/orders/list",
        controller: OrdersController,
        action: "ordersForOms"
    },
    {
        method: "post",
        route: "/orders/detail",
        controller: OrdersController,
        action: "getOrderDetailById"
    },
    {
        method: "post",
        route: "/orders/save",
        controller: OrdersController,
        action: "save"
    },
    {
        method: "post",
        route: "/orders/take",
        controller: OrdersController,
        action: "picked"
    },
    {
        method: "post",
        route: "/orders/leave",
        controller: OrdersController,
        action: "leave"
    },
    {
        method: "post",
        route: "/order/update/state",
        controller: OrdersController,
        action: "updateState"
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
        route: "/orderBags/list/all",
        controller: OrderBagsController,
        action: "listAllBags"
    },
    {
        method: "post",
        route: "/orderBags/listTake",
        controller: OrderBagsController,
        action: "listBagsforTake"
    },
    {
        method: "post",
        route: "/orderBags/update",
        controller: OrderBagsController,
        action: "updateBag"
    },
    {
        method: "post",
        route: "/orderBags/update/received",
        controller: OrderBagsController,
        action: "updateBagReceived"
    },
    {
        method: "post",
        route: "/bagNumber",
        controller: OrderBagsController,
        action: "getNumber"
    },
    {
        method: "post",
        route: "/state/save",
        controller: StateControllers,
        action: "save"
    },
    {
        method: "post",
        route: "/services/save",
        controller: ServiceControllers,
        action: "save"
    },
];