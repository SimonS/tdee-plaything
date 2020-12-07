exports.handler = function (_, __, callback) {
  callback(null, {
    statusCode: 200,
    body: "playing with netlify lambdas - plain old JS",
  });
};
