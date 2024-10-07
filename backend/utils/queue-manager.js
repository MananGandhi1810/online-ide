import { Kafka } from "kafkajs";

var isConnected = false;

var producer = undefined;
var consumer = undefined;

try {
    const kafka = new Kafka({
        clientId: "backend",
        brokers: [process.env.KAFKA_BROKER ?? "kafka:9093"],
    });

    producer = kafka.producer();
    consumer = kafka.consumer({ groupId: "executor-group" });
    await Promise.all([producer.connect(), consumer.connect()]);

    isConnected = true;
    console.log("Connected to Kafka Broker");
} catch (e) {
    console.log("Couldn't connect to Kafka Broker");
    console.log(e);
}

const sendQueueMessage = async (topic, message) => {
    if (!isConnected) {
        console.log("Couldn't send message to Kafka Broker");
        return;
    }
    try {
        await producer.send({
            topic,
            messages: [{ value: message }],
        });
    } catch (e) {
        console.log("Couldn't send message to Kafka Broker");
        console.log(e);
    }
};

const subscribeToQueue = async (topic) => {
    await consumer.subscribe({ topic: topic, fromBeginning: true });
    console.log(`Subscribed to channel ${topic}`);
};

const onQueueMessage = async (topic, callback) => {
    consumer.run({
        eachMessage: async ({ message }) => {
            callback(message.value.toString());
        },
    });
};

const disconnectFromQueue = async () => {
    if (consumer != undefined || consumer != null) {
        await consumer.disconnect();
    }
    if (producer != undefined || producer != null) {
        await producer.disconnect();
    }
};

export {
    sendQueueMessage,
    subscribeToQueue,
    onQueueMessage,
    disconnectFromQueue,
};
