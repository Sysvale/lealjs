import exampleMiddleware from './exampleMiddleware';

export default async () => Promise.all([
	exampleMiddleware(),
]);
