import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  const path = url.searchParams.get("path");

  const response = await fetch(
    `https://widget.donatepay.ru/uploads/notification/sounds/${path}`,
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
