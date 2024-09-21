// @ts-check

import { $ } from "./selector.js";

const output = $("#output", HTMLPreElement);

/**
 * @param {string} msg
 */
export function message(msg) {
	console.log(msg);

	const el = document.createElement("p");
	el.classList.add("output", "message");
	el.textContent = msg;
	output.appendChild(el);
}

/**
 * @param {string} msg
 */
export function log(msg) {
	console.log(msg);

	const el = document.createElement("p");
	el.classList.add("output", "log");
	el.textContent = msg;
	output.appendChild(el);
}

/**
 * @param {Error | string} err
 */
export function error(err) {
	console.error(err);

	const el = document.createElement("p");
	el.classList.add("output", "error");
	el.textContent = err instanceof Error ? err.message : err;
	output.appendChild(el);
}
