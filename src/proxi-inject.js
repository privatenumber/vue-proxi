import { hasOwn, computeProps } from './utils.js';

const injection = '_proxi_';

const emptyObject = Object.freeze({});
const baseProxi = {
	class: undefined,
	listeners: emptyObject,
	attrs: emptyObject,
	props: emptyObject,
};

export const ProxiInject = ({ from, props = [] } = {}) => ({
	inject: {
		[injection]: {
			from,
			default: undefined,
		},
	},

	created() {
		const { data } = this[injection] || {};
		if (data) {
			for (const event in data.on) {
				if (hasOwn(data.on, event)) {
					this.$on(event, data.on[event]);
				}
			}
		}
	},

	// eslint-disable-next-line unicorn/no-array-reduce
	computed: props.reduce(
		(object, property) => {
			object[property] = function () {
				return this.$$.props[property];
			};
			return object;
		}, {
			$$() {
				const { data } = this[injection] || {};
				const proxi = Object.create(baseProxi);
				return (
					data
						? Object.assign(
							proxi,
							{
								class: (
									(data.staticClass || data.class)
										? [data.staticClass, data.class]
										: undefined
								),
								listeners: data.on,
							},
							computeProps(
								props,

								// eslint-disable-next-line prefer-object-spread
								Object.assign({}, data.attrs),
							),
						)
						: proxi
				);
			},
		},
	),
});
