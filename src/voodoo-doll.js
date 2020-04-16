import Vue from 'vue';
import key from './key';
import { initVodoo } from './utils';

export default {
	functional: true,
	props: {
		target: {
			type: Object,
			required: true,
		},
	},
	inject: {
		[key]: {
			from: key,
			default: undefined,
		},
	},
	render: (h, ctx) => {
		const { target } = ctx.props;

		if (target) {
			const { data, parent } = ctx;
			const { $set } = parent;

			let voodoo = ctx.injections[key];
			if (!voodoo) {
				voodoo = initVodoo(parent, key);
			}

			const { target } = ctx.props;
			let $$ = voodoo.get(target);
			if (!$$) {
				$$ = Vue.observable({});
				voodoo.set(target, $$);
			}

			$set($$, 'class', [data.staticClass, data.class]);
			$set($$, 'attrs', data.attrs);
			$set($$, 'listeners', data.on);
		}

		return ctx.slots().default;
	},
};
