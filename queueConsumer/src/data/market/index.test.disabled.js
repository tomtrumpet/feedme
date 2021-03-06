import test from 'ava';
import helper from '../test.helper';
import marketAdaptor from './';
import inMemory from '../mongo.inmemory.helper';

inMemory.configure();

test.serial('create market success (integration test)', async (t) => {
    // arrange
    const market = {
        msgId: 2142,
        operation: 'create',
        type: 'market',
        timestamp: 1500568077109,
        eventId: 'f3bdb437-3fbe-488c-b962-28fcac066efe', 
        marketId: 'f4ac93ff-8412-4a0b-8eb2-7ddb852f914e', 
        name: 'Both Teams To Score', 
        displayed: false, 
        suspended: true
    };
    await helper.createTestFixture(market.eventId);
    // act
    await marketAdaptor.create(market);
    // assert
    await t.context.db.models.Fixture.findOne({ 'eventId': market.eventId }, (err, model) => {
        if (err) t.fail(err.message);
        t.is(model.markets.length, 1, 'incorrect number of markets in mongo');
        t.is(model.markets[0].marketId, market.marketId);     
    });
});

test.serial('update market success (integration test)', async (t) => {
    // arrange
    const market = {
        msgId: 2142,
        operation: 'update',
        type: 'market',
        timestamp: 1500568077109,
        eventId: 'f3bdb437-3fbe-488c-b962-28fcac066efe', 
        marketId: 'f4ac93ff-8412-4a0b-8eb2-7ddb852f914e', 
        name: 'Both Teams To Score', 
        displayed: false, 
        suspended: true
    };
    await helper.createTestFixture(market.eventId);
    await marketAdaptor.create(market);
    // act
    market.displayed = true;
    await marketAdaptor.update(market);
    // assert
    await t.context.db.models.Fixture.findOne({ 'eventId': market.eventId }, (err, model) => {
        if (err) t.fail(err.message);
        t.is(model.markets.length, 1, 'incorrect number of markets in mongo');
        t.is(model.markets[0].displayed, true, 'model has not been updated');     
    });
});

test.serial('update market doesn\'t update other markets (integration test)', async (t) => {
    // arrange
    const market = {
        msgId: 2142,
        operation: 'update',
        type: 'market',
        timestamp: 1500568077109,
        eventId: 'f3bdb437-3fbe-488c-b962-28fcac066efe', 
        marketId: 'f4ac93ff-8412-4a0b-8eb2-7ddb852f914e', 
        name: 'Both Teams To Score', 
        displayed: false, 
        suspended: true
    };
    await helper.createTestFixture(market.eventId);
    await marketAdaptor.create(market);
    market.marketId = 'f4ac93ff-8412-4a0b-8eb2-7ddb852f914f';
    await marketAdaptor.create(market);
    // act
    market.displayed = true;
    await marketAdaptor.update(market);
    // assert
    await t.context.db.models.Fixture.findOne({ 'eventId': market.eventId }, (err, model) => {
        if (err) t.fail(err.message);
        t.is(model.markets.length, 2, 'incorrect number of markets in mongo');
        t.is(model.markets[0].marketId, 'f4ac93ff-8412-4a0b-8eb2-7ddb852f914e', 'markets in the wrong order');     
        t.is(model.markets[0].displayed, false, 'incorrect market updated');     
        t.is(model.markets[1].marketId, 'f4ac93ff-8412-4a0b-8eb2-7ddb852f914f', 'markets in the wrong order');     
        t.is(model.markets[1].displayed, true, 'market has not been updated');     
    });
});