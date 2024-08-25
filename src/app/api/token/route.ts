process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(request: Request) {
  const headerToSearch = process.env.API_HEADER_KEY;
  const headerValue = process.env.API_HEADER_VALUE;

  if (!headerToSearch || !headerValue) {
    console.error("Missing API_HEADER_KEY or API_HEADER_VALUE");
    return new Response("Failed to renew token", { status: 500 });
  }

  const header = request.headers.get(headerToSearch);
  if (header !== headerValue) {
    return new Response("Unauthorized", { status: 401 });
  }

  const credentials = process.env.API_KEY;
  const url = process.env.API_URL;

  if (!credentials || !url) {
    console.error("Missing API_KEY or API_URL");
    return new Response("Failed to renew token", { status: 500 });
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    console.error("Request to fetch token failed");
    return new Response("Failed to renew token", { status: 500 });
  }

  const data = await res.json();

  return Response.json(data);
}
