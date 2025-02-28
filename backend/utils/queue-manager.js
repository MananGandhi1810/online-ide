import redis from "redis";

var isConnected = false;

var publisher = null;
var subscriber = null;

try {
    publisher = redis.createClient({
        url: process.env.REDIS_URL,
    });
    subscriber = publisher.duplicate();
    await Promise.all([publisher.connect(), subscriber.connect()]);

    isConnected = true;
    console.log("Connected to Redis Pub/Sub");
} catch (e) {
    console.log("Couldn't connect to Redis Pub/Sub");
    console.log(e);
}

const sendQueueMessage = async (topic, message) => {
    if (!isConnected) {
        console.log("Couldn't connect to Redis Pub/Sub");
        return;
    }
    try {
        publisher.publish(topic, message);
    } catch (e) {
        console.log("Couldn't send message to Redis Pub/Sub");
        console.log(e);
    }
};

const onQueueMessage = async (topic, callback) => {
    subscriber.subscribe(topic, callback);
};

export { sendQueueMessage, onQueueMessage };
