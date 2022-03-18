import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import {User, Good, Receipt} from '../../../models'

export default class InitialDatabaseSeed implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
       const users = await factory(User)().createMany(12);
       const receipt = await factory(Receipt)().createMany(22);
       const goods = await factory(Good)().createMany(22);

    }
}