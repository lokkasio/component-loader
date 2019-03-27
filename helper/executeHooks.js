export default function executeHooks (element, component, hooks) {
  hooks.forEach(hook => {
    if (typeof hook === 'function') {
      hook(element, component)
    } else if (typeof component[hook] === 'function') {
      component[hook]()
    }
  })
}
