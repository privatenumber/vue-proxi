import Vue from 'vue';

const { hasOwnProperty } = Object.prototype;
export const hasOwn = (obj, prop) => hasOwnProperty.call(obj, prop);

// From: https://github.com/vuejs/vue/blob/6fe07ebf5ab3fea1860c59fe7cdd2ec1b760f9b0/src/shared/util.js#L165
const camelizeRE = /-(\w)/g;
export const camelize = (str) => str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));

export function initProvide(parent, key, obj) {
	/**
	 * New behavior introduced in 2.7.0 to always use the parent provide
	 * if not specified by the component.
	 * https://github.com/vuejs/vue/blob/v2.7.0/src/v3/apiInject.ts#L26
	 */
	if (parent._provided) {
		const provides = parent._provided;
		const parentProvides = parent.$parent && parent.$parent._provided;
		if (provides === parentProvides) {
			parent._provided = Object.create(parentProvides);
		}
	} else {
		parent._provided = {};
	}

	const providedEntry = parent._provided[key];
	if (providedEntry) {
		for (const prop in obj) {
			if (hasOwn(obj, prop)) {
				Vue.set(providedEntry, prop, obj[prop]);
			}
		}
	} else {
		parent._provided[key] = Vue.observable(obj);
	}
}

export function computeProps(propsDecl, attrs) {
	const props = {};
	for (const attr in attrs) {
		if (hasOwn(attrs, attr)) {
			const camelized = camelize(attr);
			const value = attrs[attr];
			if (propsDecl.includes(camelized)) {
				props[camelized] = value;
				delete attrs[attr];
			}
		}
	}
	return { attrs, props };
}
