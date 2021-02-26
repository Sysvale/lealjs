export default function argument(i) {
	let index = i;
	const hash = window.location.hash.replace('#', '').split('/');

	if (hash.length > 1 && !hash[0].length) {
		index += 1;
	}

	return (typeof hash[index] === 'undefined' ? null : hash[index]);
}
