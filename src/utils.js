import Vue from 'vue';

const { hasOwnProperty } = Object.prototype;
export const hasOwn = (object, property) => hasOwnProperty.call(object, property);

// From: https://github.com/vuejs/vue/blob/6fe07ebf5ab3fea1860c59fe7cdd2ec1b760f9b0/src/shared/util.js#L165
const camelizeRE = /-(\w)/g;
// eslint-disable-next-line unicorn/prefer-string-replace-all
export const camelize = string => string.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));

export const initProvide = (parent, key, object) => {
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
		for (const prop in object) {
			if (hasOwn(object, prop)) {
				Vue.set(providedEntry, prop, object[prop]);
			}
		}
	} else {
		parent._provided[key] = Vue.observable(object);
	}
};

export const computeProps = (propsDecl, attributes) => {
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
};
