// index.js

// ハンドラ関数の定義
exports.handler = async (event, context) => {
  console.log("Event: ", event);
  // ここに処理ロジックを実装

  // 成功した場合のレスポンス
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from Lambda!" }),
  };
};
