import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  const text = url.searchParams.get("text");
  const widgetToken = url.searchParams.get("widgetToken");
  const widgetId = url.searchParams.get("widget_id");

  const response = await fetch(
    `https://widget.donatepay.ru/donation/notifications/widget/${widgetToken}/voice?text=${text}&rate=medium&widget_id=${widgetId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const data = await response.arrayBuffer();

  return new Response(data, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "audio/mpeg",
    },
  });
};
