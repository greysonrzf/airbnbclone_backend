"use strict";

const Property = use("App/Models/Property");

class PropertyController {
  async index({ request, response }) {
    const { latitude, longitude } = request.all();

    const properties = await Property.query()
      .with("images")
      .nearBy(latitude, longitude, 10)
      .fetch();

    return properties;
  }

  async store({ request, response, auth }) {
    const data = request.only([
      "title",
      "address",
      "longitude",
      "latitude",
      "price"
    ]);

    const property = await Property.create({ ...data, user_id: auth.user.id });

    return property;
  }

  async show({ params, request, response, view }) {
    const property = await Property.findOrFail(params.id);

    await property.load("images");

    return property;
  }

  async update({ params, request, response }) {
    const property = await Property.findOrFail(params.id);

    const data = request.only([
      "title",
      "address",
      "longitude",
      "latitude",
      "price"
    ]);

    property.merge(data);

    await property.save();

    return property;
  }

  async destroy({ params, request, response, auth }) {
    const property = await Property.findOrFail(params.id);

    if (property.user_id !== auth.user.id) {
      return response.status(401).send({ error: "Not authorized" });
    }

    await property.delete();
  }
}

module.exports = PropertyController;
