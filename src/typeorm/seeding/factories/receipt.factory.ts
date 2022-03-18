import { define } from "typeorm-seeding";
import {Receipt} from "../../../models";

define(Receipt, () => {

    const receipt = new Receipt();
    receipt.id = 5;
    receipt.userId = 4563
    receipt.fn = String(3454);
    receipt.fd = String(3343);
    receipt.fpd = String(464);
    receipt.n = 4;
    receipt. boughtAt = new Date(345);
    receipt.s = 45;
    receipt.status = 2;
    receipt.fnsStatus = 4
    return receipt
})
