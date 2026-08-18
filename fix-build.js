// This script runs AFTER opennextjs-cloudflare build to fix top-level-await + .then() bug
const fs = require('fs')
const path = require('path')

const openNextDir = path.join(__dirname, '.open-next')

// Fix middleware/handler.mjs - wrap in proxy
const middlewareHandler = path.join(openNextDir, 'middleware/handler.mjs')
if (fs.existsSync(middlewareHandler)) {
  let content = fs.readFileSync(middlewareHandler, 'utf8')
  if (!content.includes('proxyHandler')) {
    const original = content
    content = `var handler2_promise = (async () => {\n${content}\n})()
var proxyHandler = (...args) => handler2_promise.then(h => h(...args))
module.exports = proxyHandler\n`
    fs.writeFileSync(middlewareHandler, content)
    console.log('[fix-build] Fixed middleware/handler.mjs')
  }
}

// Fix server-functions/default/handler.mjs
const sfHandler = path.join(openNextDir, 'server-functions/default/handler.mjs')
if (fs.existsSync(sfHandler)) {
  let content = fs.readFileSync(sfHandler, 'utf8')
  if (content.includes('var handler2 = await')) {
    content = content.replace('var handler2 = await', 'var handler2_promise2 = (async () => await')
    const lastLine = content.split('\n').pop()
    if (lastLine.trim().startsWith('return handler2')) {
      content += '\n})()\n'
      content += 'var handler2 = await handler2_promise2'
    }
    fs.writeFileSync(sfHandler, content)
    console.log('[fix-build] Fixed server-functions/default/handler.mjs')
  }
}

// Fix worker.js - add 1s poll loop
const workerJs = path.join(openNextDir, 'worker.js')
if (fs.existsSync(workerJs)) {
  let content = fs.readFileSync(workerJs, 'utf8')
  if (!content.includes('poll loop')) {
    const original = content
    content = content.replace(
      'export default { fetch: handler, scheduled }',
      `export default { fetch: async (...args) => {
  if (typeof handler2_promise !== 'undefined') {
    await handler2_promise
  }
  return handler(...args)
}, scheduled }`
    )
    if (content !== original) {
      fs.writeFileSync(workerJs, content)
      console.log('[fix-build] Fixed worker.js')
    }
  }
}

console.log('[fix-build] Done')
