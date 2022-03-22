import { MongoConnectionOptions } from "typeorm/driver/mongodb/MongoConnectionOptions";

const configOrm: MongoConnectionOptions = {
    type: 'mongodb',
    url: 'mongodb+srv://nest:nest123@cluster0.auzvh.mongodb.net/nest_bot?retryWrites=true&w=majority',
    synchronize: true,
    entities: ['dist/src/entities/*.entity.js']
}

export default configOrm