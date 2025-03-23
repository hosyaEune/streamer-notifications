import type { RequestHandler } from "@sveltejs/kit";

import { json } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  const { widgetToken } = await request.json();

  const response = await fetch(
    `https://widget.donatepay.ru/alert-box/all-settings/${widgetToken}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const data = await response.json();

  return json(data);
};
