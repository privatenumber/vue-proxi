import key from './key';

export default {
	inject: [key],
	created() {
		const { extendOptions: Ctor } = this.$vnode.componentOptions.Ctor;
		this.$$ = this[key].get(Ctor);
	},
};
