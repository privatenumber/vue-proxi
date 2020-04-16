const { hasOwnProperty } = Object.prototype;
const hasOwn = (obj, prop) => hasOwnProperty.call(obj, prop);

// From: https://github.com/vuejs/vue/blob/6fe07ebf5ab3fea1860c59fe7cdd2ec1b760f9b0/src/shared/util.js#L165
const camelizeRE = /-(\w)/g;
const camelize = (str) => str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '');


// From: https://github.com/vuejs/vue/blob/33e669b22f69a1f9c9147528360fe0bba85534f0/src/core/instance/state.js#L38
const sharedPropertyDefinition = {
	enumerable: true,
	configurable: true,
};

function proxyProp(target, sourceKey, key) {
	sharedPropertyDefinition.get = function  () {
		return this[sourceKey][key]
	};
	sharedPropertyDefinition.set = function (val) {
		this[sourceKey][key] = val;
	};
	const newKey = camelize(key);
	if (!hasOwn(target, newKey)) {
		Object.defineProperty(target, newKey, sharedPropertyDefinition);
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

export function extractProps(Ctor, attrs) {
	const props = {};
	const { props: propDecl } = Ctor;

	if (propDecl) {
		const isArray = Array.isArray(propDecl);

		// Because we only have camelize, we iterate over kebab attrs instead of props
		for (let attr in attrs) {
			if (hasOwn(attrs, attr)) {
				if (
					(isArray && (propDecl.includes(attr) || propDecl.includes(camelize(attr))))
					|| (hasOwn(propDecl, attr) || hasOwn(propDecl, camelize(attr)))
				) {
					props[camelize(attr)] = attrs[attr];
					delete attrs[attr];
				}
			}
		}
	}
	return props;
}

export function proxyProps($$, props) {
	for (let prop in props) {
		if (hasOwn(props, prop)) {
			proxyProp($$, 'props', prop);
		}
	}
}