<h1>
	Proxi
	<a href="https://npm.im/vue-proxi"><img src="https://badgen.net/npm/v/vue-proxi"></a>
	<a href="https://npm.im/vue-proxi"><img src="https://badgen.net/npm/dm/vue-proxi"></a>
	<a href="https://packagephobia.now.sh/result?p=vue-proxi"><img src="https://packagephobia.now.sh/badge?p=vue-proxi"></a>
	<a href="https://bundlephobia.com/result?p=vue-proxi
"><img src="https://badgen.net/bundlephobia/minzip/vue-proxi"></a>
</h1>

`<proxi>` is a tiny proxy component for [Vue.js](https://github.com/vuejs/vue). Whatever you add to it, it gets proxied to a target component!

## :raising_hand: Why?
- :recycle: **Uses Vue's Template API** Doesn't re-invent component communication!
- :muscle: **Provide/Inject on Steroids!** Familiar concepts, but super powered!
- :boom: **Reactive** All injected data is reactive (unlike provide/inject)!
- :hatched_chick: **Tiny** 766 B Gzipped!

## :rocket: Install
```sh
npm i vue-proxi
```

## :vertical_traffic_light: 3-step Setup
#### 1. :woman: Parent component
   - Import and register `import Proxi from 'vue-proxi'`
   - Insert anywhere in your template:
      - `<proxi :proxi-key="key" [... attr / :prop / @listener]>`
      - _`key` is used to communicate with the Child. Use a unique string value or a `Symbol`_
#### 2. :baby: Child component
   - Import the Proxi Inject mixin: `import { ProxiInject } from 'vue-proxi'`
   - Register the mixin:
     ```js
     mixins: [
     	ProxiInject({
     		from: key, // from Step 1
     		props: ['propName', ...] // Becomes available on VM eg. `this.propName`
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

## :man_teacher: Demos

<details>
	<summary><strong>Inheriting props</strong></summary>
	<br>
	<table>
		<tr><th>:woman: Parent</th><th>:baby: Child</th></tr>
		<tr>
			<td valign="top"><pre lang="html">
&lt;proxi
    :key="key"
    :child-disabled="isDisabled"
    :child-label="label"
/&gt;
	</pre></td>
			<td><pre lang="html">
&lt;label&gt;
    {{ label }}
    &lt;input
        type="checkbox"
        :disabled="childDisabled"
    &gt;
&lt;/label&gt;
	</pre><hr><pre lang="js">
export default {
  mixins: [
    ProxiInject({
      from: key,
      props: [
        'childDisabled',
        'childLabel'
      ]
    })
  ],
  computed: {
    label() {
      return this.childLabel + ':';
    }
  }
};
	</pre></td>
		</tr>
	</table>
</details>

<details>
	<summary><strong>Inheriting class</strong></summary>
	<br>
	<table>
		<tr><th>:woman: Parent</th><th>:baby: Child</th></tr>
		<tr>
			<td valign="top"><pre lang="html">
&lt;proxi
    :key="key"
    :class="['child-class', {
        disabled: isDisabled
    }]"
/&gt;
	</pre></td>
			<td><pre lang="html">
&lt;div :class="$$.class"&gt;
    Child
&lt;/div&gt;
</pre><hr><pre lang="js">
export default {
    mixins: [
        ProxiInject({ from: key })
    ],
};
	</pre></td>
		</tr>
	</table>
</details>

<details>
	<summary><strong>Inheriting attrs</strong></summary>
	<br>
	<table>
		<tr><th>:woman: Parent</th><th>:baby: Child</th></tr>
		<tr>
			<td valign="top"><pre lang="html">
&lt;proxi
    :key="key"
    :disabled="true"
/&gt;
	</pre></td>
			<td><pre lang="html">
&lt;div
    :disabled="$$.attrs.disabled"

    v-bind="$$.attrs"
&gt;
    Child
&lt;/div&gt;
</pre><hr><pre lang="js">
export default {
    mixins: [
        ProxiInject({ from: key })
    ],
};
	</pre></td>
		</tr>
	</table>
</details>

<details>
	<summary><strong>Inheriting listeners</strong></summary>
	<br>
	<table>
		<tr><th>:woman: Parent</th><th>:baby: Child</th></tr>
		<tr>
			<td valign="top"><pre lang="html">
&lt;proxi
    :key="key"
    @click="handleClick"
    @custom-event="handleCustomEvent"
/&gt;
	</pre></td>
			<td><pre lang="html">
&lt;button v-on="$$.listeners"&gt;
    Child
&lt;/button&gt;
</pre><hr><pre lang="js">
export default {
    mixins: [
        ProxiInject({ from: key })
    ],
    mounted() {
        // Listeners are automatically bound to VM
        this.$emit('custom-event', 'Mounted!');
    }
};
	</pre></td>
		</tr>
	</table>
</details>


### Advanced
This demo shows how a parent-child pair, RadioGroup and Radio, communicate using Proxi. Note how the two components only come together at usage.

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
		<proxi
			:proxi-key="key"
			:checkedItems="value"
			@update="$emit('input', $event)"
		>
			<slot />
		</proxi>
	</div>
</template>

<script>
import Proxi from 'vue-proxi';

export default {
	components: {
		Proxi,
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
import { ProxiInject } from 'vue-proxi';

export default {
	mixins: [
		ProxiInject({
			// Same key as parent
			from: 'radios',

			// Declare props that can be injected in
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
