import Vue from 'vue';
import { hasOwn, computeProps } from './utils';

const injection = '__voodooInjection';

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
				return !data ? {} : Object.assign({
					class: (data.staticClass || data.class) ? [data.staticClass, data.class] : undefined,
					listeners: data.on,
				}, computeProps(props, Object.assign({}, data.attrs)));
			},
		},
	),
});
