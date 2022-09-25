const cli = require("chrome-debugging-client")
const tot = require("chrome-debugging-client/dist/protocol/tot")

const createSession = cli.createSession
const HeapProfiler = tot.HeapProfiler

createSession(async (session) => {
  // spawns a chrome instance with a tmp user data
  // and the debugger open to an ephemeral port
  const process = await session.spawnBrowser({
    executablePath: '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    additionalArguments: ['--headless', '--disable-gpu', '--hide-scrollbars', '--mute-audio'],
    windowSize: { width: 640, height: 320 }
  });

  // open the REST API for tabs
  const client = session.createAPIClient("localhost", process.remoteDebuggingPort);
  console.log("============", client)
  const tabs = await client.listTabs();
  const tab = tabs[0];
  await client.activateTab(tab.id);

  console.log("============ tab", tab)


  // open the debugger protocol
  // https://chromedevtools.github.io/devtools-protocol/
  const debuggerClient = await session.openDebuggingProtocol(tab.webSocketDebuggerUrl);

  // create the HeapProfiler domain with the debugger protocol client
  const heapProfiler = new HeapProfiler(debuggerClient);
  await heapProfiler.enable();

  // The domains are optional, this can also be
  // await debuggerClient.send("HeapProfiler.enable", {})

  let buffer = "";
  heapProfiler.addHeapSnapshotChunk = (evt) => {
    buffer += evt.chunk;
  };
  await heapProfiler.takeHeapSnapshot({ reportProgress: false });
  await heapProfiler.disable();

  return JSON.parse(buffer);
}).then((data) => {
  console.log(data.snapshot.meta);
}).catch((err) => {
  console.error(err);
});