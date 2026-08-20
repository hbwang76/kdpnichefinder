// This script runs AFTER opennextjs-cloudflare build to fix top-level-await + .then() bug
const fs = require('fs')
const path = require('path')

const openNextDir = path.join(__dirname, '.open-next')

// Fix server-functions/default/handler.mjs - wrap top-level await in try-catch
const sfHandler = path.join(openNextDir, 'server-functions/default/handler.mjs')
if (fs.existsSync(sfHandler)) {
  let content = fs.readFileSync(sfHandler, 'utf8')
  if (content.includes('var handler2=await createMainHandler()') && !content.includes('handler2_promise2')) {
    content = content.replace(
      'var handler2=await createMainHandler()',
      `var handler2_promise2=createMainHandler().catch(e=>{console.error('[fix-build] createMainHandler failed:',e.message,e.stack);return async()=>new Response(JSON.stringify({error:"Server init failed",message:e.message,stack:e.stack}),{status:500,headers:{"content-type":"application/json"}})})

`
    )
    content = content.replace(
      'export{handler2 as handler}',
      `var handler2=await handler2_promise2;export{handler2 as handler}`
    )
    fs.writeFileSync(sfHandler, content)
    console.log('[fix-build] Fixed server-functions/default/handler.mjs')
  }
}

// Fix worker.js - add promise wait before calling handler
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
