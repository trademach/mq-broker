'use strict';

const config = require('config');
const zmq = require('zmq');

const ENGINE_XSUB_URI = config.get('mq.engine-xsub-uri');
const ENGINE_XPUB_URI = config.get('mq.engine-xpub-uri');
const OUTFLOW_XSUB_URI = config.get('mq.outflow-xsub-uri');
const OUTFLOW_XPUB_URI = config.get('mq.outflow-xpub-uri');

const socketEngineXSub = zmq.socket('xsub');
const socketEngineXPub = zmq.socket('xpub');
const socketOutflowXSub = zmq.socket('xsub');
const socketOutflowXPub = zmq.socket('xpub');

socketEngineXSub.bindSync(ENGINE_XSUB_URI);
socketEngineXPub.bindSync(ENGINE_XPUB_URI);
socketOutflowXSub.bindSync(OUTFLOW_XSUB_URI);
socketOutflowXPub.bindSync(OUTFLOW_XPUB_URI);

socketEngineXSub.on('message', (topic, message) => {
  socketEngineXPub.send([ topic, message ]);
});
socketEngineXPub.on('message', (topic, message) => {
  socketEngineXSub.send([ topic, message ]);
});

socketOutflowXSub.on('message', (topic, message) => {
  socketOutflowXPub.send([ topic, message ]);
});
socketOutflowXPub.on('message', (topic, message) => {
  socketOutflowXSub.send([ topic, message ]);
});

console.log('mq-broker - started');
