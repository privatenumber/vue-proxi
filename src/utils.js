const { hasOwnProperty } = Object.prototype;
export const hasOwn = (obj, prop) => hasOwnProperty.call(obj, prop);

// From: https://github.com/vuejs/vue/blob/6fe07ebf5ab3fea1860c59fe7cdd2ec1b760f9b0/src/shared/util.js#L165
const camelizeRE = /-(\w)/g;
export const camelize = (str) => str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));

const hyphenateRE = /\B([A-Z])/g;
export const hyphenate = (str) => str.replace(hyphenateRE, '-$1').toLowerCase();

// From: https://github.com/vuejs/vue/blob/33e669b22f69a1f9c9147528360fe0bba85534f0/src/core/instance/state.js#L38
const sharedPropertyDefinition = {
	enumerable: true,
	configurable: true,
};

export function proxyProp(target, targetKey, source, sourceKey = targetKey) {
	sharedPropertyDefinition.get = () => source[sourceKey][targetKey];
	if (!hasOwn(target, targetKey)) {
		Object.defineProperty(target, targetKey, sharedPropertyDefinition);
	}
}

export function initVodoo(parent, key) {
	if (!parent._provided) {
		parent._provided = {};
	}

	if (!parent._provided[key]) {
		parent._provided[key] = new WeakMap();
	}

	return parent._provided[key];
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