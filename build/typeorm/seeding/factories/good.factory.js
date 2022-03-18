"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_seeding_1 = require("typeorm-seeding");
const models_1 = require("../../../models");
(0, typeorm_seeding_1.define)(models_1.Good, () => {
    const good = new models_1.Good();
    good.price = 12;
    good.name = "Bread";
    good.quantity = 34;
    good.sum = 23;
    good.createdAt = new Date(32);
    good.updatedAt = new Date(345);
    return good;
});
