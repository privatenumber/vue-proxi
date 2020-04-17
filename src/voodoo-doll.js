import { initProvide } from './utils';

export default {
	functional: true,
	props: {
		secret: {
			type: [Symbol, String],
			required: true,
		},
	},
	render: (h, ctx) => {
		const { secret } = ctx.props;

		if (secret) {
			const { data, parent } = ctx;
			initProvide(parent, secret, { data });
		}

		return ctx.slots().default;
	},
};
