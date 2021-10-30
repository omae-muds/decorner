import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';
import copy from 'rollup-plugin-copy';

dotenv.config();
const env = process.env;

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		replace({
            PUSHER_APP_ID: JSON.stringify(env.PUSHER_APP_ID),
            PUSHER_KEY: JSON.stringify(env.PUSHER_KEY),
            PUSHER_SECRET: JSON.stringify(env.PUSHER_SECRET),
            PUSHER_CLUSTER: JSON.stringify(env.PUSHER_CLUSTER),
            PUSHER_CHAT_CHANNEL: JSON.stringify(env.PUSHER_CHAT_CHANNEL),
            PUSHER_MESSAGE_EVENT: JSON.stringify(env.PUSHER_MESSAGE_EVENT)
        }),
		copy({
			targets: [
				{
					src: "node_modules/bootstrap/dist/css/bootstrap.min.css",
					dest: "public/vendor/bootstrap/css",
				},
				{
					src: "node_modules/bootstrap/dist/css/bootstrap.min.css.map",
					dest: "public/vendor/bootstrap/css",
				},
				{
					src: "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
					dest: "public/vendor/bootstrap/js",
				},
				{
					src: "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map",
					dest: "public/vendor/bootstrap/js",
				},
			],
		}),
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
