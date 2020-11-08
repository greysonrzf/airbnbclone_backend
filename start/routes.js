"use strict";

const Route = use("Route");

Route.post("/users", "UserController.store");
Route.post("/sessions", "SessionController.store");

Route.resource("properties", "PropertyController")
  .apiOnly()
  .middleware("auth");

Route.post("properties/:id/images", "ImageController.store").middleware("auth");

Route.get("images/:path", "ImageController.show");
