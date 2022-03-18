import { define } from "typeorm-seeding";
import {User} from "../../../models";

define(User, () => {

    const user = new User();
    user.id = Math.random()
    user.name= (Math.random() + 1).toString(36).substring(7)
    user.phone = "+79188322127";
    user.createdAt = new Date(124)
    user.updatedAt = new Date(456)
    return user
})
