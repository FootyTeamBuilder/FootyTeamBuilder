export default function loggerMiddleware(request, respone, next) {
	console.log(`${request.method} ${request.path}`);
	next();
}
