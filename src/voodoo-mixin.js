import Vue from 'vue';
import key from './key';
import { hasOwn, camelize, proxyProp, computeProps } from './utils';

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
		if (!data) {
			return;
		}

		this.$$ = Vue.observable({
			data,
			get class() {
				return data.class;
			},
			get listeners() {
				return data.listeners;
			},
		});

		this.$watch(
			() => data.attrs,
			() => {
				const separated = computeProps(propsDecl, Object.assign({}, data.attrs));
				this.$set(this.$$, 'attrs', separated.attrs);
				this.$set(this.$$, 'props', separated.props);
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
