<h1>
	:ghost: Voodoo Doll
	<a href="https://npm.im/vue-voodoo-doll"><img src="https://badgen.net/npm/v/vue-voodoo-doll"></a>
	<a href="https://npm.im/vue-voodoo-doll"><img src="https://badgen.net/npm/dm/vue-voodoo-doll"></a>
	<a href="https://packagephobia.now.sh/result?p=vue-voodoo-doll"><img src="https://packagephobia.now.sh/badge?p=vue-voodoo-doll"></a>
</h1>

`<voodoo-doll>` is a proxy component.
Whatever you add to it, it gets proxied to a target component. *Just like a Voodoo Doll.*

## :raising_hand: Why?
- :recycle: **Uses Vue's Template API:** Doesn't re-invent component communication!
- :sparkling_heart: **Minimal setup:** Checkout the [3-step setup](#vertical_traffic_light-3-step-setup)
- :sparkles: **Like Provide/Inject:** Familiar concepts → shorter learning cuve!
- :hatched_chick: **Tiny:** 766 B Gzipped!

## :rocket: Install
```sh
npm i vue-voodoo-doll
```

## :vertical_traffic_light: 3-step Setup
#### 1. :woman: Parent component
   - Import and register `import VoodooDoll from 'vue-voodoo-doll'`
   - Insert anywhere in your template:
      - `<voodoo-doll :secret="key" [props and @event-handlers]>`
      - _`key` is used to communicate with the child. Use the same string value or a `Symbol`_
#### 2. :baby: Child component
   - Import the VoodooMixin: `import { VoodooMixin } from 'vue-voodoo-doll'`
   - Register the mixin:
     ```js
     mixins: [
     	VoodooMixin({
     		from: key,
     		props: ['propName', ...] // Makes attributes available via `this.propName`
     	})
     ]
     ```
#### 3. :white_check_mark: Done!
   - The injected data is all available in `this.$$`
     - `this.$$.class`: Class
     - `this.$$.props`: Props _(Automatically bound to VM)_
     - `this.$$.attrs`: Attributes
       - _eg. `v-bind="$$.attrs"` or `v-bind="{ ...$attrs, ...$$.attrs }"`_
     - `this.$$.listeners`: Event listeners _(Automatically bound to VM)_
       - _eg. `v-on="$$.listeners"` or `v-on="{ ...$listeners, ...$$.listeners }"`_

## :beginner: Demo
This demo shows how a parent-child pair, RadioGroup and Radio, communicate using Voodoo Doll. Note how the two components only come together at usage.

[![JSFiddle Demo](https://flat.badgen.net/badge/JSFiddle/Open%20Demo/blue)](https://jsfiddle.net/hirokiosame/omqtfwpL/)

<details>
	<summary>Usage</summary>

```vue
<template>
	<div>
		<radio-group v-model="selected">
			<radio label="Apples" value="apples" />
			<radio label="Oranges" value="oranges" />
			<radio label="Bananas" value="bananas" />
		</radio-group>
		<div>
			Selected: {{ selected }}
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			selected: [],
		};
	},
};
</script>
```
</details>

<details>
	<summary>Parent: <i>RadioGroup.vue</i></summary>

```vue
<template>
	<div>
		<voodoo-doll
			:secret="key"
			:checkedItems="value"
			@update="$emit('input', $event)"
		>
			<slot />
		</voodoo-doll>
	</div>
</template>

<script>
import VoodooDoll from 'vue-voodoo-doll';

export default {
	components: {
		VoodooDoll,
	},

	props: ['value'],

	data() {
		return {
			// Same idea as provide/inject
			// Use a Symbol for security
			key: 'radios',
		};
	},
}
</script>
```
</details>


<details>
	<summary>Child: <i>Radio.vue</i></summary>


```vue
<template>
	<label>
		<input
			type="checkbox"
			@click="onClick"
			:checked="isChecked"
		>
		{{ label }}
	</label>
</template>

<script>
import { VoodooMixin } from 'vue-voodoo-doll';

export default {
	mixins: [
		VoodooMixin({
			// Same key as parent
			from: 'radios',

			// Declare props that can be voodoo'd in
			// Only array supported for now
			props: ['checkedItems'],
		})
	],

	props: {
		label: String,
		value: null
	},

	computed: {
		isChecked() {
			return this.checkedItems.includes(this.value);
		}
	},

	methods: {
		onClick() {
			if (this.isChecked) {
				this.$emit('update', this.checkedItems.filter(i => i !== this.value));
			} else {
				this.$emit('update', [...this.checkedItems, this.value]);
			}
		}
	}
};
</script>
```
</details>


## :family: Related
- [vue-subslot](https://github.com/privatenumber/vue-subslot) - 💍 Pick 'n choose what you want from a slot passed into your Vue component
- [vue-pseudo-window](https://github.com/privatenumber/vue-pseudo-window) - 🖼 Declaratively interface window/document in your Vue template
- [vue-vnode-syringe](https://github.com/privatenumber/vue-vnode-syringe) - 🧬Mutate your vNodes with vNode Syringe 💉
