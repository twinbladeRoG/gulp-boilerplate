import $ from 'jquery';
import { bro, invoker } from './bro';

const message = 'Hello World';

const load = () => {
	console.log(`${message}`);
};
load();

bro();
invoker(0, 1);

$('button').click((event) => {
	event.preventDefault();
	console.log('Clicked');
});
