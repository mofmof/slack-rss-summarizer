import axios from "axios";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { OpenAI } from "@langchain/openai";

// ハンドラ関数の定義
export async function handler(event, context) {
  console.log(JSON.stringify(event))

  // SlackのURL検証リクエストの場合
  if (event.type === "url_verification") {
    return {
      statusCode: 200,
      body: JSON.stringify({
        challenge: event.challenge,
      }),
    };
  }

  //// OpenAIのAPIを使って要約をする場合にコメントを外す
  // const urlPattern = /https?:\/\/[^\s\/$.?#].[^\s]*?(?=\||\s|$)/g; // URLは<>で囲まれていると仮定
  // const urlMatch = event.event.text.match(urlPattern);
  // const url = urlMatch ? urlMatch[0] : null;
  // const contents = await getContents(url);
  // const summary = await summelize(contents)
  const summary = 'summary sample'

  // notionのDBに追加
  // const response = await postNotion(url, summary);
  // console.log({ response: response.status });

  return {
    statusCode: 200,
    body: JSON.stringify(event),
  };
}

async function getContents(url) {
  const loader = new CheerioWebBaseLoader(url);
  const docs = await loader.load();
  return docs.reduce((acc, doc) => {
    return acc + doc.pageContent;
  }, '');
}

async function summelize(contents) {
  console.log({ openAIApiKey: process.env.OPENAI_API_KEY })
  const chatModel = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, modelName: "gpt-3.5-turbo", });
  return await chatModel.invoke(`
  あなたは優秀なエンジニアです。
  以下の{#文章}を{#ルール}にしたがって要約してください
  #ルール
  - 日本語で要約すること
  - 要約結果は箇条書きにすること
  - できるだけ詳しくわかりやすく要約すること
  #文章
  ${contents}
  `);
}

async function postNotion(url, summary) {
  await axios.post(
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
                content: summary,
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
}
