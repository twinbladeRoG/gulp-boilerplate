const bro = () => {
	console.log('Supp bro!');
};

const invoker = (quas, wex, exort) => {
	if (quas) {
		console.log('Quas Trionis');
	} else if (wex) {
		console.log('Wex Trionis');
	} else if (exort) {
		console.log('Exort Trionis');
	}
};

module.exports = { bro, invoker };
