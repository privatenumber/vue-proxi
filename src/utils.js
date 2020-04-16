const { hasOwnProperty } = Object.prototype;
export const hasOwn = (obj, prop) => hasOwnProperty.call(obj, prop);

// From: https://github.com/vuejs/vue/blob/6fe07ebf5ab3fea1860c59fe7cdd2ec1b760f9b0/src/shared/util.js#L165
const camelizeRE = /-(\w)/g;
export const camelize = (str) => str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '');

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
