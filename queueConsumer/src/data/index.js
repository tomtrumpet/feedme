import mongoose from 'mongoose';

import fixture from './fixture';
import market from './market';
import outcome from './outcome';
import failure from './failure';

const DataAdaptor = class {
    constructor() {
        this.fixture = fixture;
        this.market = market;
        this.outcome = outcome;
        this.failure = failure;
    }
    async connect (connectionString) {
        mongoose.Promise = require('bluebird');
        mongoose.connection.on('error',function (err) {  
            console.log('Mongoose default connection error: ' + err); // eslint-disable-line no-console
        });
        await mongoose.connect(connectionString, {useMongoClient: true});
    }
};

export default DataAdaptor;