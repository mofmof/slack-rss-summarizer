// index.js

// ハンドラ関数の定義
exports.handler = async (event, context) => {
  console.log("==================================")
  console.log(JSON.stringify(event))
  console.log("==================================")

  // SlackのURL検証リクエストの場合
  if (event.type === 'url_verification') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        challenge: event.challenge
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from Lambda!',
    }),
  };
};
