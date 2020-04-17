import { hasOwn, computeProps } from './utils';

const injection = '__voodooInjection';

const emptyObj = Object.freeze({});
const baseVoodoo = {
	class: undefined,
	listeners: emptyObj,
	attrs: emptyObj,
	props: emptyObj,
};

export default ({ from, props = [] } = {}) => ({
	inject: {
		[injection]: {
			from,
			default: undefined,
		},
	},
	created() {
		const { data } = this[injection] || {};
		if (data) {
			for (const ev in data.on) {
				if (hasOwn(data.on, ev)) {
					this.$on(ev, data.on[ev]);
				}
			}
		}
	},

	computed: props.reduce(
		(obj, prop) => {
			obj[prop] = function () {
				return this.$$.props[prop];
			};
			return obj;
		}, {
			$$() {
				const { data } = this[injection] || {};
				const voodoo = Object.create(baseVoodoo);
				return !data ? voodoo : Object.assign(
					voodoo,
					{
						class: (data.staticClass || data.class) ? [data.staticClass, data.class] : undefined,
						listeners: data.on,
					},
					computeProps(props, Object.assign({}, data.attrs))
				);
			},
		},
	),
});
