"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker = require('@faker-js/faker');
const typeorm_seeding_1 = require("typeorm-seeding");
const models_1 = require("../../../models");
(0, typeorm_seeding_1.define)(models_1.User, () => {
    const user = new models_1.User();
    user.id = Math.random();
    user.name = (Math.random() + 1).toString(36).substring(7);
    user.phone = "+79188322127";
    user.createdAt = faker.date.past(2021);
    user.updatedAt = faker.date.past(2021);
    return user;
});
