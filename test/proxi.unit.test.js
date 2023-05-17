import {
	describe,
	test,
	expect,
	vi,
} from 'vitest';
import Vue from 'vue';
import { mount } from '@vue/test-utils';
import Proxi, { ProxiInject } from '../src/index.js';

describe('Error handling - Proxi', () => {
	test('No key - empty', () => {
		const warnHandler = vi.fn();
		Vue.config.warnHandler = warnHandler;

		const usage = {
			template: `
				<div>
					<proxi />
				</div>
			`,
			components: {
				Proxi,
			},
		};

		const wrapper = mount(usage);
		expect(warnHandler).toBeCalled();
		expect(wrapper.element.children.length).toBe(0);
	});

	test('No key - content', () => {
		const warnHandler = vi.fn();
		Vue.config.warnHandler = warnHandler;

		const usage = {
			template: `
				<div>
					<proxi>
						Hello World!
						<div>
							Goodbye <span>World</span>!
						</div>
					</proxi>
				</div>
			`,
			components: {
				Proxi,
			},
		};

		const wrapper = mount(usage);
		expect(warnHandler).toBeCalled();
		expect(wrapper.text()).toMatch(/^Hello World!\s+Goodbye World!$/);
	});
});

describe('Error handling - ProxiInject', () => {
	test('No Proxi injection - fail silently', () => {
		const warnHandler = vi.fn();
		Vue.config.warnHandler = warnHandler;

		const usage = {
			mixins: [
				ProxiInject(),
			],
			template: `
				<div>Content</div>
			`,
		};

		const wrapper = mount(usage);
		expect(warnHandler).not.toBeCalled();
		expect(wrapper.text()).toBe('Content');
	});

	test('No key - should warn', () => {
		const warnHandler = vi.fn();
		Vue.config.warnHandler = warnHandler;

		const ChildComp = {
			mixins: [ProxiInject()],
			template: '<div>ChildComp</div>',
		};

		const usage = {
			template: `
				<proxi
					class="static-class"
					:class="'computed-class'"
				>
					<child-comp
						ref="child"
						class="child-static-class"
					/>
				</proxi>
			`,
			components: {
				Proxi,
				ChildComp,
			},
			data() {
				return {
					ChildComp,
				};
			},
		};

		mount(usage);
		expect(warnHandler.mock.calls.length).toBe(1);
	});

	test('Colliding props - should warn', () => {
		const warnHandler = vi.fn();
		Vue.config.warnHandler = warnHandler;

		const key = Symbol('key');
		const ChildComp = {
			mixins: [ProxiInject({
				from: key,
				props: ['disabled'],
			})],
			props: ['disabled'],
			template: '<div>ChildComp</div>',
		};

		const usage = {
			template: `
				<proxi
					:proxi-key="key"
					disabled
				>
					<child-comp
						ref="child"
						class="child-static-class"
					/>
				</proxi>
			`,
			components: {
				Proxi,
				ChildComp,
			},
			data() {
				return {
					key,
					ChildComp,
				};
			},
		};

		mount(usage);
		expect(warnHandler.mock.calls.length).toBe(1);
	});
});

describe('Proxi', () => {
	test('Apply classes', () => {
		const key = Symbol('key');

		const ChildComp = {
			mixins: [ProxiInject({
				from: key,
			})],
			template: '<div :class="$$.class">ChildComp</div>',
		};

		const usage = {
			template: `
				<proxi
					:proxi-key="key"
					class="static-class"
					:class="'computed-class'"
				>
					<child-comp
						ref="child"
						class="child-static-class"
					/>
				</proxi>
			`,
			components: {
				Proxi,
				ChildComp,
			},
			data() {
				return {
					key,
				};
			},
		};

		const wrapper = mount(usage);
		const child = wrapper.findComponent({ ref: 'child' });
		expect(child.attributes('class')).toBe('child-static-class static-class computed-class');
	});

	test('Apply attributes', () => {
		const key = Symbol('key');
		const mounted = vi.fn();

		const ChildComp = {
			mixins: [ProxiInject({
				from: key,
			})],
			template: '<div>ChildComp</div>',
			mounted() {
				mounted(this.$$);
			},
		};

		const usage = {
			template: `
				<proxi
					:proxi-key="key"
					a="1"
					b="2"
					c="3"
				>
					<child-comp
						a="3"
						b="1"
						c="2"
					/>
				</proxi>
			`,
			components: {
				Proxi,
				ChildComp,
			},
			data() {
				return {
					key,
				};
			},
		};

		mount(usage);
		expect(mounted).toBeCalled();
		const [$$] = mounted.mock.calls[0];
		expect($$.attrs.a).toBe('1');
		expect($$.attrs.b).toBe('2');
		expect($$.attrs.c).toBe('3');
	});

	test('Apply props', () => {
		const key = Symbol('key');
		const mounted = vi.fn();

		const ChildComp = {
			mixins: [
				ProxiInject({
					from: key,
					props: ['b'],
				}),
			],
			template: '<div>ChildComp</div>',
			mounted() {
				mounted(this.$$);
			},
		};

		const usage = {
			template: `
				<proxi
					:proxi-key="key"
					a="1"
					:b="2"
					c="3"
				>
					<child-comp
						a="3"
						b="1"
						c="2"
					/>
				</proxi>
			`,
			components: {
				Proxi,
				ChildComp,
			},
			data() {
				return {
					key,
				};
			},
		};

		mount(usage);
		expect(mounted).toBeCalled();
		const [$$] = mounted.mock.calls[0];
		expect($$.attrs.a).toBe('1');
		expect($$.attrs.b).toBe(undefined);
		expect($$.attrs.c).toBe('3');
		expect($$.props.b).toBe(2);
	});

	test('Proxy props to vm', () => {
		const key = Symbol('key');
		const mounted = vi.fn();

		const ChildComp = {
			mixins: [
				ProxiInject({
					from: key,
					props: ['b'],
				}),
			],
			template: '<div>ChildComp</div>',
			mounted() {
				mounted(this);
			},
		};

		const usage = {
			template: `
				<proxi
					:proxi-key="key"
					a="1"
					:b="2"
					c="3"
				>
					<child-comp
						a="3"
						b="1"
						c="2"
					/>
				</proxi>
			`,
			components: {
				Proxi,
				ChildComp,
			},
			data() {
				return {
					key,
				};
			},
		};

		mount(usage);
		expect(mounted).toBeCalled();
		const [vm] = mounted.mock.calls[0];
		expect(vm.b).toBe(2);
	});

	test('Reactive props', async () => {
		const key = Symbol('key');
		const ChildComp = {
			mixins: [
				ProxiInject({
					from: key,
					props: ['count'],
				}),
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
				<proxi
					:proxi-key="key"
					:count="count"
					:disabled="disabled"
				>
					<child-comp />
				</proxi>
			`,
			components: {
				Proxi,
				ChildComp,
			},
			data() {
				return {
					key,
					count: 0,
					disabled: false,
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
		const key = Symbol('key');
		const eventHandler = vi.fn();

		const ChildComp = {
			mixins: [
				ProxiInject({
					from: key,
					props: ['b'],
				}),
			],
			template: '<div>ChildComp</div>',
			mounted() {
				this.$emit('some-event');
			},
		};

		const usage = {
			template: `
				<proxi
					:proxi-key="key"
					@some-event="eventHandler"
				>
					<child-comp />
				</proxi>
			`,
			components: {
				Proxi,
				ChildComp,
			},
			data() {
				return {
					key,
				};
			},
			methods: {
				eventHandler,
			},
		};

		mount(usage);
		expect(eventHandler).toBeCalled();
	});

	test('Pass down event-handlers to vm', () => {
		const key = Symbol('key');
		const eventHandler = vi.fn();

		const ChildComp = {
			mixins: [
				ProxiInject({
					from: key,
				}),
			],
			template: '<div v-on="$$.listeners">ChildComp</div>',
		};

		const usage = {
			template: `
				<proxi
					:proxi-key="key"
					@click="eventHandler"
				>
					<child-comp ref="child" />
				</proxi>
			`,
			components: {
				Proxi,
				ChildComp,
			},
			data() {
				return {
					key,
				};
			},
			methods: {
				eventHandler,
			},
		};

		const wrapper = mount(usage);
		wrapper.findComponent({ ref: 'child' }).vm.$el.click();
		expect(eventHandler).toBeCalled();
	});

	test('Crossing proxis', () => {
		const key1 = Symbol('key');

		const Child1 = {
			mixins: [
				ProxiInject({
					from: key1,
				}),
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
				<proxi
					:proxi-key="key1"
					some-attr="123"
				>
					<slot />
				</proxi>
			</div>
			`,
			components: {
				Proxi,
			},
			data() {
				return { key1 };
			},
		};

		const key2 = Symbol('key');

		const Child2 = {
			mixins: [
				ProxiInject({
					from: key2,
					props: ['someProp'],
				}),
			],
			template: '<div v-bind="$$.attrs">Child {{ someProp }}</div>',
		};

		const Parent2 = {
			template: `
			<div>
				<proxi
					:proxi-key="key2"
					some-attr="321"
					:some-prop="100"
				>
					<slot />
				</proxi>
			</div>
			`,
			components: {
				Proxi,
			},
			data() {
				return { key2 };
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

		const child1 = wrapper.findComponent({ ref: 'child-1' });
		expect(child1.attributes('some-attr')).toBe('123');

		const child2 = wrapper.findComponent({ ref: 'child-2' });
		expect(child2.attributes('some-attr')).toBe('321');
		expect(child2.text()).toBe('Child 100');
	});

	test('Shared parent Vue 2.7 bug', async () => {
		const key = Symbol('key');

		const Child = {
			mixins: [
				ProxiInject({
					from: key,
				}),
			],
			template: '<div v-bind="$$.attrs"></div>',
		};

		const Parent = {
			template: `
			<proxi
				:proxi-key="key"
				v-bind="$attrs"
			>
				<slot />
			</proxi>
			`,
			components: {
				Proxi,
			},
			data() {
				return { key };
			},
		};

		const usage = {
			template: `
				<div>
					<parent data="123">
						<child />
					</parent>
					<parent data="321">
						<child />
					</parent>
				</div>
			`,
			components: {
				Parent,
				Child,
			},
		};

		const wrapper = mount(usage);

		await Vue.nextTick();

		const html = wrapper.html().replaceAll(/\n|\s{2,}/g, '');
		expect(html).toBe('<div><div data="123"></div><div data="321"></div></div>');
	});
});
