import chromecli from "chrome-debugging-client";

const { createSession } = chromecli;

const session = await new Promise((res, rej) => createSession(res));
await session.spawnBrowser({ browserType: "system" })
