import axios from "axios";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
// index.js

// ハンドラ関数の定義
export async function handler(event, context) {
  // console.log("==================================")
  // console.log(JSON.stringify(event))
  // console.log("==================================")

  // SlackのURL検証リクエストの場合
  if (event.type === "url_verification") {
    return {
      statusCode: 200,
      body: JSON.stringify({
        challenge: event.challenge,
      }),
    };
  }

  const urlPattern = /https?:\/\/[^\s\/$.?#].[^\s]*?(?=\||\s|$)/g; // URLは<>で囲まれていると仮定
  const urlMatch = event.event.text.match(urlPattern);
  const url = urlMatch ? urlMatch[0] : null;

  const loader = new CheerioWebBaseLoader(url);
  const docs = await loader.load();
  console.log(docs);

  const response = await axios.post(
    "https://api.notion.com/v1/pages",
    {
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        Url: {
          title: [
            {
              text: {
                content: url,
              },
            },
          ],
        },
        Summary: {
          rich_text: [
            {
              text: {
                content: "テスト",
              },
            },
          ],
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
    }
  );
  console.log({ response: response.status });
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from Lambda!",
    }),
  };
}
