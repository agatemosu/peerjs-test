// @ts-check

/** @import { DataConnection } from "peerjs" */

import { Peer } from "peerjs";
import { error, log, message } from "./output.js";
import { $ } from "./selector.js";

const $peerId = $("#peerId", HTMLSpanElement);
const $peerInput = $("#peerInput", HTMLInputElement);
const $connectBtn = $("#connectBtn", HTMLButtonElement);
const $sendBtn = $("#sendBtn", HTMLButtonElement);
const $disconnectBtn = $("#disconnectBtn", HTMLButtonElement);

/** @type {DataConnection | undefined} */
let conn;
const peer = new Peer();
main();

function main() {
	peer.on("error", (err) => {
		error(err);
	});

	peer.on("open", (id) => {
		console.log(`My peer ID is: ${id}`);
		$peerId.textContent = id;
	});

	peer.on("connection", (conn) => {
		log(`Connection established with ${conn.peer}`);
		setupConnectionHandlers(conn);
	});

	peer.on("disconnected", () => {
		log("Connection lost. Reconnecting...");
		peer.reconnect();
	});

	$connectBtn.addEventListener("click", connect);
	$sendBtn.addEventListener("click", send);
	$disconnectBtn.addEventListener("click", disconnect);
}

function connect() {
	const peerId = $peerInput.value.trim();
	if (!peerId) {
		error("Please enter a peer ID");
		return;
	}

	if (peerId === peer.id) {
		error("Please enter a different peer ID");
		return;
	}

	conn = peer.connect(peerId);
	setupConnectionHandlers(conn);
}

function send() {
	if (conn?.open) {
		const date = new Date();
		const jsonData = {
			hour: date.getHours(),
			minute: date.getMinutes(),
			second: date.getSeconds(),
		};
		conn.send(jsonData);

		message(`Sent: ${JSON.stringify(jsonData)}`);
	} else {
		error("No active connection to send data to");
	}
}

function disconnect() {
	if (conn?.open) {
		conn.close();
		log(`Disconnected from ${conn.peer}`);
	} else {
		error("No active connection to disconnect");
	}
}

/**
 * @param {DataConnection} connection
 */
function setupConnectionHandlers(connection) {
	connection.on("error", (err) => {
		error(err);
	});

	connection.on("open", () => {
		log(`Connected to ${connection.peer}`);
	});

	connection.on("data", (data) => {
		message(`Received: ${JSON.stringify(data)}`);
	});

	connection.on("close", () => {
		log(`Connection with ${connection.peer} closed`);
	});

	connection.on("iceStateChanged", (state) => {
		console.warn(`ICE state changed: ${state}`);
	});
}
