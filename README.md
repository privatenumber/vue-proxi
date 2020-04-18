<h1>
	:ghost: Voodoo Doll
	<a href="https://npm.im/vue-voodoo-doll"><img src="https://badgen.net/npm/v/vue-voodoo-doll"></a>
	<a href="https://npm.im/vue-voodoo-doll"><img src="https://badgen.net/npm/dm/vue-voodoo-doll"></a>
	<a href="https://packagephobia.now.sh/result?p=vue-voodoo-doll"><img src="https://packagephobia.now.sh/badge?p=vue-voodoo-doll"></a>
</h1>

> `<voodoo-doll>` is a proxy component.
> 
> Whatever you add to it, it gets proxied to a target component. Just like a Voodoo Doll.

## :raising_hand: Why?
Vue offers [provide/inject](https://vuejs.org/v2/api/#provide-inject) to communicate with a child component that's passed into a slot. This non-reactive, imperative API might suffice for simple cases, but when data needs to flow bi-directionally or be reactive, you might start to reinvent new ways for components to communicate. This could get messy and pollute your SFC with irrelevant noise.

_Voodoo Doll solves this by offering a template API to directly interface with a component outside your SFC! :ghost:_

## :rocket: Install
```sh
npm i vue-voodoo-doll
```


## :beginner: Usage [![JSFiddle Demo](https://flat.badgen.net/badge/JSFiddle/Open%20Demo/blue)](https://jsfiddle.net/hirokiosame/0szwc2uh/)
The following demo shows you how to set up a parent-child pair to communicate using Voodoo Doll.
Note:
- The parent uses the `<voodoo-doll>` component with a secret key to wrap `<slot>`
  - > The Voodoo magic only applies to its children!
- The child uses the `VoodooMixin` mixin with the same key to bind to the parent's Voodoo Doll
  - Declare the `props` array to bind given attributes to the view model context
- The child can the Voodo via `this.$$` (`attrs`, `props`, `class`, `listeners`)
- The two components only come together at usage


### Usage
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

### Parent: _RadioGroup.vue_
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

### Child: _Radio.vue_
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


## :family: Related
- [vue-subslot](https://github.com/privatenumber/vue-subslot) - 💍 Pick 'n choose what you want from a slot passed into your Vue component
- [vue-pseudo-window](https://github.com/privatenumber/vue-pseudo-window) - 🖼 Declaratively interface window/document in your Vue template
- [vue-vnode-syringe](https://github.com/privatenumber/vue-vnode-syringe) - 🧬Mutate your vNodes with vNode Syringe 💉
