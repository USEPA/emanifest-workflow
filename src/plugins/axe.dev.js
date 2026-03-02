// plugins/axe.dev.js
// Dev-only axe plugin for Vue 3 + Vite
// Requires: npm i -D axe-core dom-accessibility-api

export default {
  install (app, options = {}) {
    if (!import.meta.env.DEV || typeof window === 'undefined') {
      return
    }

    const router = options.router ?? app.config.globalProperties.$router

    let axe = null
    let configured = false
    let initialScheduled = false
    // Serialize runs to avoid "Axe is already running"
    let runChain = Promise.resolve()
    // Lazy-loaded accessible name function
    let accNameFn = null

    const loadAxe = async () => {
      if (!axe) {
        const mod = await import('axe-core')
        axe = mod.default ?? mod
      }
      if (!configured) {
        axe.configure({ reporter: 'v2' })
        configured = true
      }
    }

    // Option A: handle errors inside the helper so callers don't need try/catch
    const getAccessibleName = async el => {
      try {
        if (!accNameFn) {
          const mod = await import('dom-accessibility-api')
          accNameFn = mod.computeAccessibleName || mod.default?.computeAccessibleName
        }
        return typeof accNameFn === 'function' ? accNameFn(el) : ''
      } catch {
        return ''
      }
    }

    const trimHTML = (html, max = 160) =>
      (html || '').replace(/\s+/g, ' ').trim().slice(0, max)
      + ((html || '').length > max ? '…' : '')

    const formatSelectorList = targets => {
      if (!Array.isArray(targets) || targets.length === 0) {
        return '(none)'
      }
      return targets.join(' | ')
    }

    const logResults = async results => {
      if (results.violations.length === 0) {
        console.log('axe: no violations')
        return
      }

      console.groupCollapsed(`axe: ${results.violations.length} violations`)
      for (const v of results.violations) {
        const wcagTags = (v.tags || []).filter(t => t.startsWith('wcag'))
        console.groupCollapsed(`${v.impact ?? 'unknown'}: ${v.id} — ${v.help}`)
        console.log('description:', v.description)
        console.log('help url:', v.helpUrl)
        if (wcagTags.length > 0) {
          console.log('wcag tags:', wcagTags.join(', '))
        }

        for (const node of v.nodes) {
          const selector = formatSelectorList(node.target)
          const el = node.element || (selector ? document.querySelector(selector) : null)
          const rect = el?.getBoundingClientRect()
          const role = el?.getAttribute?.('role') || el?.tagName?.toLowerCase()

          // Element details (expanded by default)
          console.group('element')
          console.log('selector(s):', selector)
          console.log('html:', trimHTML(node.html))
          if (role) {
            console.log('role:', role)
          }
          if (rect) {
            console.log('bounds:', {
              top: Math.round(rect.top),
              left: Math.round(rect.left),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            })
          }
          if (node.impact) {
            console.log('node impact:', node.impact)
          }
          if (node.failureSummary) {
            console.log('failure summary:', node.failureSummary)
          }

          // Accessible name (no try/catch needed; helper already handles errors)
          if (el) {
            const name = await getAccessibleName(el)
            console.log('accessible name:', name || '(none)')
          }

          // Checks (any/all/none) and related nodes
          const checks = [
            ...node.any.map(c => ({ type: 'any', ...c })),
            ...node.all.map(c => ({ type: 'all', ...c })),
            ...node.none.map(c => ({ type: 'none', ...c })),
          ]
          for (const c of checks) {
            console.groupCollapsed(`check (${c.type}): ${c.id}`)
            console.log('message:', c.message)
            if (c.data?.relatedNodes?.length) {
              for (const rn of c.data.relatedNodes) {
                const rnTarget = Array.isArray(rn.target) ? rn.target.join(' | ') : rn.target
                console.log('related node:', {
                  target: rnTarget,
                  html: trimHTML(rn.html),
                  id: rn.id,
                  url: rn.url,
                })
              }
            }
            console.groupEnd()
          }
          console.groupEnd() // element
        }
        console.groupEnd() // violation
      }
      console.groupEnd()
    }

    // Run immediately (awaits completion). You can pass a selector/element to scope.
    const runNow = async (context = '#app', axeOptions = {}) => {
      await loadAxe()
      const results = await axe.run(context, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
        elementRef: true,
        resultTypes: ['violations'],
        // Example excludes for transient Vuetify UI (uncomment if noisy):
        // exclude: [['.v-overlay', '.v-dialog__content', '.v-menu', '.v-tooltip']],
        ...axeOptions,
      })
      await logResults(results)
      return results
    }

    // Schedule a run (serialized; avoids overlapping runs)
    const scheduleRun = (context = '#app', axeOptions = {}) => {
      runChain = runChain
        .then(
          () =>
            new Promise(resolve => {
              const go = async () => {
                try {
                  await runNow(context, axeOptions)
                } catch (error) {
                  console.error('axe run failed', error)
                } finally {
                  resolve()
                }
              }
              if ('requestIdleCallback' in window) {
                window.requestIdleCallback(go, { timeout: 1500 })
              } else {
                requestAnimationFrame(go)
              }
            }),
        )
        .catch(error => {
          console.error('axe queue error', error)
          return
        })
    }

    // Expose manual controls
    app.config.globalProperties.$axeRun = (context, options) => scheduleRun(context, options)
    app.config.globalProperties.$axeRunNow = (context, options) => runNow(context, options)
    app.provide('axeRunner', { scheduleRun, runNow })
    window.__axeRun = (context, options) => scheduleRun(context, options)
    window.__axeRunNow = (context, options) => runNow(context, options)

    // Keyboard shortcut: Ctrl/Cmd + Shift + A
    window.addEventListener('keydown', e => {
      const key = e.key?.toLowerCase()
      if ((e.metaKey || e.ctrlKey) && e.altKey && key === 'a') {
        scheduleRun()
      }
    })

    // Initial run: schedule once when the app first mounts
    app.mixin({
      mounted () {
        if (!initialScheduled) {
          initialScheduled = true
          queueMicrotask(() => scheduleRun())
        }
      },
    })

    // Re-run on route changes
    router?.afterEach(() => {
      scheduleRun()
    })
  },
}
