import { define } from "typeorm-seeding";
import {Good} from "../../../models";

define(Good, () => {

    const good = new Good();
    good.price = 45
    good.name = "Bread";
    good.quantity = 34;
    good.sum = 23;
    good.createdAt = new Date(32)
    good.updatedAt = new Date(345)
    return good
})
