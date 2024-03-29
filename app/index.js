// index.js

// ハンドラ関数の定義
exports.handler = async (event, context) => {
  // console.log("==================================")
  // console.log(JSON.stringify(event))
  // console.log("==================================")

  // SlackのURL検証リクエストの場合
  if (event.type === 'url_verification') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        challenge: event.challenge
      }),
    };
  }

  const urlPattern = /https?:\/\/[^\s\/$.?#].[^\s]*?(?=\||\s|$)/g; // URLは<>で囲まれていると仮定
  const urlMatch = event.event.text.match(urlPattern);
  const url = urlMatch ? urlMatch[0] : null

  console.log(url)

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from Lambda!',
    }),
  };
};
