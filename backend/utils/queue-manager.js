import redis from "redis";

var isConnected = false;
var publisher = redis.createClient({
    url: process.env.REDIS_URL,
});
var subscriber = publisher.duplicate();

// Handle connection errors
publisher.on('error', (err) => console.error('Redis Publisher Error:', err));
subscriber.on('error', (err) => console.error('Redis Subscriber Error:', err));

await Promise.all([publisher.connect(), subscriber.connect()]);
isConnected = true;
console.log("Connected to Redis Pub/Sub");

const sendQueueMessage = (topic, message) => {
    if (!isConnected) {
        console.log("Couldn't connect to Redis Pub/Sub");
        return;
    }
    publisher.publish(topic, message);
};

const onQueueMessage = (topic, callback) => {
    subscriber.subscribe(topic, callback);
};

export { sendQueueMessage, onQueueMessage };
