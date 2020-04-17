# :ghost: Voodoo Doll
<a href="https://npm.im/vue-voodoo-doll"><img src="https://badgen.net/npm/v/vue-voodoo-doll"></a>
<a href="https://npm.im/vue-voodoo-doll"><img src="https://badgen.net/npm/dm/vue-voodoo-doll"></a>
<a href="https://packagephobia.now.sh/result?p=vue-voodoo-doll"><img src="https://packagephobia.now.sh/badge?p=vue-voodoo-doll"></a>

> Add props / event-handlers on `<voodoo-doll>` to proxy them to a distant child component

## :raising_hand: Why?
Vue offers [provide/inject](https://vuejs.org/v2/api/#provide-inject) to communicate with a child component that's passed into a slot. This non-reactive, imperative API might suffice for simple cases, but when data needs to flow bi-directionally or be reactive, you start reinventing new ways for components to communicate. This could get messy and pollute your SFC with irrelevant noise.

_Voodoo Doll solves this by offering a template API to directly interface with a component outside your SFC! :ghost:_


## :rocket: Install
```sh
npm i vue-voodoo-doll
```


## :beginner: Use case [![JSFiddle Demo](https://flat.badgen.net/badge/JSFiddle/Open%20Demo/blue)](https://jsfiddle.net/hirokiosame/p5Lz419s/)
The following demo shows a parent-demo communicating with each other using Voodoo Doll. Note how the two components only come together at usage.

### Parent
_RadioGroup.vue_
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

### Child
_Radio.vue_
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

### Usage
_App.vue (Usage)_
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

## Related
- [vue-subslot](https://github.com/privatenumber/vue-subslot) - 💍 Pick 'n choose what you want from a slot passed into your Vue component
- [vue-pseudo-window](https://github.com/privatenumber/vue-pseudo-window) - 🖼 Declaratively interface window/document in your Vue template
- [vue-vnode-syringe](https://github.com/privatenumber/vue-vnode-syringe) - 🧬Mutate your vNodes with vNode Syringe 💉
