import { initProvide } from './utils.js';

export const Proxi = {
	functional: true,
	props: {
		proxiKey: {
			type: [Symbol, String],
			required: true,
		},
	},
	render: (h, context) => {
		const { proxiKey } = context.props;

		if (proxiKey) {
			const { data, parent } = context;
			initProvide(parent, proxiKey, { data });
		}

		return context.slots().default;
	},
};
