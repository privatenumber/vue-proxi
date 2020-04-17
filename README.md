# :ghost: Voodoo Doll
<a href="https://npm.im/vue-voodoo-doll"><img src="https://badgen.net/npm/v/vue-voodoo-doll"></a>
<a href="https://npm.im/vue-voodoo-doll"><img src="https://badgen.net/npm/dm/vue-voodoo-doll"></a>
<a href="https://packagephobia.now.sh/result?p=vue-voodoo-doll"><img src="https://packagephobia.now.sh/badge?p=vue-voodoo-doll"></a>

> Add props & event-handlers on `<voodoo-doll>` to proxy them to another component

## :raised_hand: Why?
Vue offers [provide/inject](https://vuejs.org/v2/api/#provide-inject) to communicate with a child component that's passed into a slot. This non-reactive, imperative approach might suffice for simple cases, but when data needs to flow bi-directionally or be reactive, you start re-inventing new ways for components to communicate. This could get messy and pollute your SFC with irrelevant noise.

:ghost: VoodooDoll solves this by offering a template API to interface directly with a component outside your SFC!

## :rocket: Installation
```sh
npm i vue-voodoo-doll
```

## :beginner: Use case [![JSFiddle Demo](https://flat.badgen.net/badge/JSFiddle/Open%20Demo/blue)](https://jsfiddle.net/hirokiosame/p5Lz419s/)

### Adding event listeners to `window`
```vue
<template>
	<div>
		<div>
			Window width: {{ winWidth }}
		</div>

		<pseudo-window
			@resize.passive="onResize" <!-- Handle window resize with "passive" option -->
		/>
	</div>
</template>

<script>
import VoodooDoll from 'vue-voodoo-doll';

export default {
	components: {
		VoodooDoll
	},
	
	data() {
		return {
			winWidth: 0
		}
	},

	methods: {
		onResize() {
			this.winWidth = window.innerWidth;
		}
	}
}
</script>
```

### Adding event listeners to `document`
```vue
<template>
	<div>
		<pseudo-window
			document
			@click="onClick" <!-- Handle document click -->
		/>
	</div>
</template>

<script>
import VoodooDoll from 'vue-voodoo-doll';

export default {
	components: {
		VoodooDoll
	},

	methods: {
		onClick() {
			console.log('Document click!')
		}
	}
}
</script>
```

### Adding event listeners and classes to `document.body`
```vue
<template>
	<div>
		<pseudo-window
			body

			<!-- Add a class to document.body -->
			:class="$style.lockScroll"

			<!-- Handle document.body click -->
			@click="onClick"
		/>
	</div>
</template>

<script>
import VoodooDoll from 'vue-voodoo-doll';

export default {
	components: {
		VoodooDoll
	},

	methods: {
		onClick() {
			console.log('Body click!')
		}
	}
}
</script>

<style module>
.lockScroll {
	overflow: hidden;
}
</style>
```

### When you only want one root element
The VoodooDoll is a functional component that returns exactly what's passed into it. By using it as the root component, its contents will pass-through.
```vue
<template>
	<pseudo-window
		@blur="pause"
		@focus="resume"
	>
		<video>
			<source
				src="/media/examples/flower.webm"
				type="video/webm"
			>
		</video>
	</div>
</template>

<script>
import PseudoWindow from 'vue-voodoo-doll';

export default {
	components: {
		PseudoWindow
	},

	methods: {
		resume() {
			this.$el.play()
		},
		pause() {
			this.$el.pause()
		}
	}
}
</script>
```

## Related
- [vue-subslot](https://github.com/privatenumber/vue-subslot) - 💍 Pick 'n choose what you want from a slot passed into your Vue component
