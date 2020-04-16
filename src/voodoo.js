import Vue from 'vue';
import key from './key';
import { initVodoo, extractProps, proxyProps } from './utils';

export default {
	functional: true,
	props: {
		doll: {
			type: Object,
			required: true,
		},
	},
	inject: {
		'voodoo': {
			from: key,
			default: undefined,
		},
	},
	render: (h, ctx) => {
		const { data, parent } = ctx;
		const { $set } = parent;

		let { voodoo } = ctx.injections;
		if (!voodoo) {
			voodoo = initVodoo(parent, key);
		}

		const { doll } = ctx.props;
		let $$ = voodoo.get(doll);
		if (!$$) {
			$$ = Vue.observable({});
			voodoo.set(doll, $$);
		}

		const props = extractProps(doll, data.attrs);
		$set($$, 'props', props);
		$set($$, 'class', [data.staticClass, data.class]);
		$set($$, 'attrs', data.attrs);
		$set($$, 'listeners', data.on);

		proxyProps($$, props);

		return ctx.slots().default;
	},
};
