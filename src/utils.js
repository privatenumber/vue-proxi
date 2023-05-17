import Vue from 'vue';

const { hasOwnProperty } = Object.prototype;
export const hasOwn = (object, property) => hasOwnProperty.call(object, property);

// From: https://github.com/vuejs/vue/blob/6fe07ebf5ab3fea1860c59fe7cdd2ec1b760f9b0/src/shared/util.js#L165
const camelizeRE = /-(\w)/g;
export const camelize = string => string.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));

export function initProvide(parent, key, object) {
	if (!parent._provided) {
		parent._provided = {};
	}

	if (parent._provided[key]) {
		Object.assign(parent._provided[key], object);
	} else {
		parent._provided[key] = Vue.observable(object);
	}
}

export function computeProps(propsDecl, attributes) {
	const props = {};
	for (const attribute in attributes) {
		if (hasOwn(attributes, attribute)) {
			const camelized = camelize(attribute);
			const value = attributes[attribute];
			if (propsDecl.includes(camelized)) {
				props[camelized] = value;
				delete attributes[attribute];
			}
		}
	}
	return { attrs: attributes, props };
}
