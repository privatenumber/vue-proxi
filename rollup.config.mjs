import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

const isProd = process.env.NODE_ENV === 'production';

export default {
	input: 'src/index.js',
	external: ['vue'],
	plugins: [
		babel(),
		isProd && terser({
			mangle: {
				properties: {
					regex: /^M_/,
				},
			},
		}),
		isProd && filesize(),
	],
	output: [
		{
			format: 'es',
			file: 'dist/proxi.esm.js',
		},
		{
			format: 'cjs',
			file: 'dist/proxi.cjs.js',
			exports: 'named',
		},
		{
			format: 'umd',
			file: 'dist/proxi.js',
			name: 'Proxi',
			exports: 'named',
			globals: {
				vue: 'Vue',
			},
		},
	],
};
