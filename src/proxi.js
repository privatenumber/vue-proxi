import { initProvide } from './utils';

export default {
	functional: true,
	props: {
		proxiKey: {
			type: [Symbol, String],
			required: true,
		},
	},
	render: (h, ctx) => {
		const { proxiKey } = ctx.props;

		if (proxiKey) {
			const { data, parent } = ctx;
			initProvide(parent, proxiKey, { data });
		}

		return ctx.slots().default;
	},
};
