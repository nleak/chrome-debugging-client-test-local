## Fix by using Chrome 2018

Because later chrome added this test:
https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/inspector_protocol/crdtp/dispatch_test.cc#167

It will return the error of `Message has property other than 'id', 'method', 'sessionId', 'params'`

Download this Chrome version: `https://google-chrome.en.uptodown.com/mac/download/1766474`

Resovle the issue.