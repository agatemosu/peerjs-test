// @ts-check

/**
 * @template {HTMLElement} T
 * @param {string} selector
 * @param {new () => T} type
 * @returns {T}
 */
export function $(selector, type) {
	const el = document.querySelector(selector);

	if (!el) throw new Error(`Invalid selector: ${selector}`);
	if (!(el instanceof type)) {
		throw new Error(
			`Invalid type for ${selector}: ${type.name}. ` +
				`Got ${el.constructor.name}`,
		);
	}

	return el;
}
