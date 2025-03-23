import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  const { access_token } = await request.json();

  const response = await fetch("https://donatepay.ru/api/v2/socket/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token }),
  });

  const data = await response.json();
  return json(data);
};
