import { bro, invoker } from './bro';

const message = 'Hello World';

const load = () => {
	console.log(`${message}`);
};
load();

bro();
invoker(0, 1);