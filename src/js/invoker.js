const invoker = (quas, wex, exort) => {
	if (quas === 3 && wex === 0 && exort === 0)
		return 'Cold Snap';
	else if (quas === 2 && wex === 1 && exort === 0)
		return 'Ghost Walk';
	else if (quas === 2 && wex === 0 && exort === 1)
		return 'Ice Wall';
	else if (quas === 0 && wex === 3 && exort === 0)
		return 'EMP';
	else if (quas === 1 && wex === 2 && exort === 0)
		return 'Tornado';
	else if (quas === 0 && wex === 2 && exort === 1)
		return 'Alacrity';
	else if (quas === 0 && wex === 0 && exort === 3)
		return 'Sun Strike';
	else if (quas === 1 && wex === 0 && exort === 2)
		return 'Forge Spirit';
	else if (quas === 0 && wex === 1 && exort === 2)
		return 'Chaos Meteor';
	else if (quas === 1 && wex === 1 && exort === 1)
		return 'Deafening Blast';
	else
		return 'I can\'t invoke this spell';
};

module.exports = { invoker };
