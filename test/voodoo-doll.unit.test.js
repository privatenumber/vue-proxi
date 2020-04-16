import Vue from 'vue';
import { mount } from '@vue/test-utils';
import VoodooDoll, { VoodooMixin } from 'vue-voodoo-doll';

describe('Error handling - VoodooDoll', () => {
	test('No target - empty', () => {
		const warnHandler = jest.fn();
		Vue.config.warnHandler = warnHandler;

		const usage = {
			template: `
				<div>
					<voodoo-doll />
				</div>
			`,
			components: {
				VoodooDoll,
			},
		};

		const wrapper = mount(usage);
		expect(warnHandler).toBeCalled();
		expect(wrapper.isEmpty()).toBe(true);
	});

	test('No target - content', () => {
		const warnHandler = jest.fn();
		Vue.config.warnHandler = warnHandler;

		const usage = {
			template: `
				<div>
					<voodoo-doll>
						Hello World!
						<div>
							Goodbye <span>World</span>!
						</div>
					</voodoo-doll>
				</div>
			`,
			components: {
				VoodooDoll,
			},
		};

		const wrapper = mount(usage);
		expect(warnHandler).toBeCalled();
		expect(wrapper.text()).toMatch(/^Hello World!\s+Goodbye World!$/);
	});
});

describe('Error handling - VoodooMixin', () => {
	test('No voodoo injection - fail silently', () => {
		const warnHandler = jest.fn();
		Vue.config.warnHandler = warnHandler;

		const usage = {
			mixins: [
				VoodooMixin(),
			],
			template: `
				<div>Content</div>
			`,
		};

		const wrapper = mount(usage);
		expect(warnHandler).not.toBeCalled();
		expect(wrapper.text()).toBe('Content');
	});
});

describe('VoodooDoll', () => {
	test('Apply classes', () => {
		const ChildComp = {
			mixins: [VoodooMixin()],
			template: '<div :class="$$.class">ChildComp</div>',
		};

		const usage = {
			template: `
				<voodoo-doll
					:target="ChildComp"
					class="static-class"
					:class="'computed-class'"
				>
					<child-comp
						ref="child"
						class="child-static-class"
					/>
				</voodoo-doll>
			`,
			components: {
				VoodooDoll,
				ChildComp,
			},
			data() {
				return {
					ChildComp,
				};
			},
		};

		const wrapper = mount(usage);
		const child = wrapper.find({ ref: 'child' });
		expect(child.attributes('class')).toBe('child-static-class static-class computed-class');
	});

	test('Apply attributes', () => {
		const mounted = jest.fn();

		const ChildComp = {
			mixins: [VoodooMixin()],
			template: '<div>ChildComp</div>',
			mounted() {
				mounted(this.$$);
			},
		};

		const usage = {
			template: `
				<voodoo-doll
					:target="ChildComp"
					a="1"
					b="2"
					c="3"
				>
					<child-comp
						a="3"
						b="1"
						c="2"
					/>
				</voodoo-doll>
			`,
			components: {
				VoodooDoll,
				ChildComp,
			},
			data() {
				return {
					ChildComp,
				};
			},
		};

		const wrapper = mount(usage);
		expect(mounted).toBeCalled();
		const [$$] = mounted.mock.calls[0];
		expect($$.attrs.a).toBe('1');
		expect($$.attrs.b).toBe('2');
		expect($$.attrs.c).toBe('3');
	});

	test('Apply props', () => {
		const mounted = jest.fn();

		const ChildComp = {
			mixins: [
				VoodooMixin(['b'])
			],
			template: '<div>ChildComp</div>',
			mounted() {
				mounted(this.$$);
			},
		};

		const usage = {
			template: `
				<voodoo-doll
					:target="ChildComp"
					a="1"
					:b="2"
					c="3"
				>
					<child-comp
						a="3"
						b="1"
						c="2"
					/>
				</voodoo-doll>
			`,
			components: {
				VoodooDoll,
				ChildComp,
			},
			data() {
				return {
					ChildComp,
				};
			},
		};

		const wrapper = mount(usage);
		expect(mounted).toBeCalled();
		const [$$] = mounted.mock.calls[0];
		expect($$.attrs.a).toBe('1');
		expect($$.attrs.b).toBe(undefined);
		expect($$.attrs.c).toBe('3');
		expect($$.props.b).toBe(2);
	});

	test('Proxy props to vm', () => {
		const mounted = jest.fn();

		const ChildComp = {
			mixins: [
				VoodooMixin(['b'])
			],
			template: '<div>ChildComp</div>',
			mounted() {
				mounted(this);
			},
		};

		const usage = {
			template: `
				<voodoo-doll
					:target="ChildComp"
					a="1"
					:b="2"
					c="3"
				>
					<child-comp
						a="3"
						b="1"
						c="2"
					/>
				</voodoo-doll>
			`,
			components: {
				VoodooDoll,
				ChildComp,
			},
			data() {
				return {
					ChildComp,
				};
			},
		};

		const wrapper = mount(usage);
		expect(mounted).toBeCalled();
		const [vm] = mounted.mock.calls[0];
		expect(vm.b).toBe(2);
	});

	test('Reactive props', async () => {
		const mounted = jest.fn();

		const ChildComp = {
			mixins: [
				VoodooMixin(['count'])
			],
			template: `
				<div
					:uid="_uid"
					v-bind="$$.attrs"
				>
					{{ count }}
				</div>
			`,
		};

		const usage = {
			template: `
				<voodoo-doll
					:target="ChildComp"
					:count="count"
					:disabled="disabled"
				>
					<child-comp />
				</voodoo-doll>
			`,
			components: {
				VoodooDoll,
				ChildComp,
			},
			data() {
				return {
					count: 0,
					disabled: false,
					ChildComp,
				};
			},
		};

		const wrapper = mount(usage);
		const uid = wrapper.attributes('uid');
		expect(wrapper.attributes('disabled')).toBe(undefined);
		expect(wrapper.text()).toBe('0');
		wrapper.setData({ count: 100, disabled: true });

		await wrapper.vm.$nextTick();

		expect(wrapper.attributes('uid')).toBe(uid);
		expect(wrapper.attributes('disabled')).toBe('disabled');
		expect(wrapper.text()).toBe('100');
	});

	test('Bind event-handlers to vm', () => {
		const eventHandler = jest.fn();

		const ChildComp = {
			mixins: [
				VoodooMixin(['b'])
			],
			template: '<div>ChildComp</div>',
			mounted() {
				this.$emit('some-event');
			},
		};

		const usage = {
			template: `
				<voodoo-doll
					:target="ChildComp"
					@some-event="eventHandler"
				>
					<child-comp />
				</voodoo-doll>
			`,
			components: {
				VoodooDoll,
				ChildComp,
			},
			data() {
				return {
					ChildComp,
				};
			},
			methods: {
				eventHandler,
			},
		};

		const wrapper = mount(usage);
		expect(eventHandler).toBeCalled();
	});

	test('Crossing voodoo-dolls', () => {
		const eventHandler = jest.fn();

		const Child1 = {
			mixins: [
				VoodooMixin()
			],
			template: `
			<div v-bind="$$.attrs">
				Child
				<slot />
			</div>
			`,
		};

		const Parent1 = {
			template: `
			<div>
				<voodoo-doll
					:target="Child1"
					some-attr="123"
				>
					<slot />
				</voodoo-doll>
			</div>
			`,
			components: {
				VoodooDoll,
			},
			data() {
				return { Child1 };
			},
		};

		const Child2 = {
			mixins: [
				VoodooMixin(['someProp'])
			],
			template: '<div v-bind="$$.attrs">Child {{ someProp }}</div>',
		};

		const Parent2 = {
			template: `
			<div>
				<voodoo-doll
					:target="Child2"
					some-attr="321"
					:some-prop="100"
				>
					<slot />
				</voodoo-doll>
			</div>
			`,
			components: {
				VoodooDoll,
			},
			data() {
				return { Child2 };
			},
		};

		const usage = {
			template: `
				<parent-1>
					<parent-2>
						<child-1 ref="child-1" >
							<child-2 ref="child-2" />
						</child-1>
					</parent-2>
				</parent-1>
			`,
			components: {
				Parent1,
				Parent2,
				Child1,
				Child2,
			},
			data() {
				return { Child1 };
			},
		};

		const wrapper = mount(usage);

		const child1 = wrapper.find({ ref: 'child-1' });
		expect(child1.attributes('some-attr')).toBe('123');

		const child2 = wrapper.find({ ref: 'child-2' });
		expect(child2.attributes('some-attr')).toBe('321');
		expect(child2.text()).toBe('Child 100');
	});
});


/*

Test 
- reactivity
*/