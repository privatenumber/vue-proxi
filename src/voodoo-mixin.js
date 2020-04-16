import Vue from 'vue';
import key from './key';
import { hasOwn, camelize, proxyProp } from './utils';

const hyphenateRE = /\B([A-Z])/g;
const hyphenate = (str) => str.replace(hyphenateRE, '-$1').toLowerCase();

export default (propsDecl = []) => ({
	inject: {
		[key]: {
			from: key,
			default: undefined,
		},
	},
	created() {
		const voodoo = this[key];
		if (!voodoo) {
			return;
		}

		const { extendOptions: Ctor } = this.$vnode.componentOptions.Ctor;
		const data = voodoo.get(Ctor);
		this.$$ = Vue.observable({
			data,
			// test
			// get class() {
			// 	return data.class;
			// },
			// get props () {
			// 	return propsDecl.reduce((agg, prop) => {
			// 		agg[prop] = data.attrs[hyphenate(prop)];
			// 		return agg;
			// 	}, {});
			// },
			// get attrs() {
			// 	return Object.fromEntries(Object.entries(data.attrs).filter(([attr]) => !propsDecl.includes(camelize(attr))));
			// }
		});

		this.$watch(
			() => data.class,
			() => this.$set(this.$$, 'class', data.class),
			{ immediate: true },
		);


		this.$watch(
			() => data.attrs,
			() => {
				const attrs = {};
				const props = {};
				for (const attr in data.attrs) {
					if (hasOwn(data.attrs, attr)) {
						const camelized = camelize(attr);
						const value = data.attrs[attr];
						if (propsDecl.includes(camelized)) {
							props[camelized] = value;
						} else {
							attrs[attr] = value;
						}
					}
				}

				this.$set(this.$$, 'attrs', attrs);
				this.$set(this.$$, 'props', props);
			},
			{ immediate: true },
		);

		propsDecl.forEach((propName) => proxyProp(this, propName, this.$$, 'props'));

		for (const ev in data.listeners) {
			if (hasOwn(data.listeners, ev)) {
				this.$on(ev, data.listeners[ev]);
			}
		}
	},
});
