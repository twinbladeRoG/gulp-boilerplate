import $ from 'jquery';
import 'popper.js';
import 'bootstrap';
import { invoker } from './invoker';

let invokerQueue = [];

$(document).ready(() => {

	$('#quas').click(event => {
		event.preventDefault();

		if (invokerQueue.length >= 3)
			invokerQueue.pop();
		invokerQueue.unshift('quas');
		$('#combination').text(combination(invokerQueue));
	});

	$('#wex').click(event => {
		event.preventDefault();

		if (invokerQueue.length >= 3)
			invokerQueue.pop();
		invokerQueue.unshift('wex');
		$('#combination').text(combination(invokerQueue));
	});

	$('#exort').click(event => {
		event.preventDefault();

		if (invokerQueue.length >= 3)
			invokerQueue.pop();
		invokerQueue.unshift('exort');
		$('#combination').text(combination(invokerQueue));
	});

	$('#invoke').click((event) => {
		event.preventDefault();

		let count = {
			quas: 0, wex: 0, exort: 0
		};

		invokerQueue.forEach(ability => {
			if (ability === 'quas')
				count.quas++;
			else if (ability === 'wex')
				count.wex++;
			else if (ability === 'exort')
				count.exort++;
		});

		let spell = invoker(count.quas, count.wex, count.exort);
		$('#spell').text(spell);
	});
});

const combination = (arr) => {
	let message = '';
	for (let i = 0; i < arr.length; i++) {
		if (i !== arr.length - 1)
			message = message + arr[i] + ', ';
		else
			message = message + arr[i];
	}

	return message;
};