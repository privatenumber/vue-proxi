import Vue from 'vue';

const { hasOwnProperty } = Object.prototype;
export const hasOwn = (obj, prop) => hasOwnProperty.call(obj, prop);

// From: https://github.com/vuejs/vue/blob/6fe07ebf5ab3fea1860c59fe7cdd2ec1b760f9b0/src/shared/util.js#L165
const camelizeRE = /-(\w)/g;
export const camelize = (str) => str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));

export function initProvide(parent, key, obj) {
	if (!parent._provided) {
		parent._provided = {};
	}

	if (!parent._provided[key]) {
		parent._provided[key] = Vue.observable(obj);
	} else {
		Object.assign(parent._provided[key], obj);
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
