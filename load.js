import store from './store'
import dashToCamel from './helper/dashToCamel'
import executeHooks from './helper/executeHooks'

export default function load (classes, {
  identifier = 'component',
  mountHooks = [],
  unmountHooks = [],
  root = document.body
}) {
  const camelizedIdentifier = dashToCamel(identifier)

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  function init () {
    document.removeEventListener('DOMContentLoaded', init)

    mount(root.querySelectorAll(`[data-${identifier}]`))

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mount(mutation.addedNodes)
        unmount(mutation.removedNodes)
      })
    })
    observer.observe(root, { childList: true, subtree: true })
  }

  function mount (nodeList) {
    nodeList.forEach(element => {
      if (!element.dataset) return

      const componentClassName = element.dataset[camelizedIdentifier]
      Promise.resolve(classes[componentClassName]).then(ComponentClass => {
        if (ComponentClass) {
          let component = store.get(element)

          if (!component) {
            component = new ComponentClass(element)
            store.set(element, component)
          }

          executeHooks(element, component, mountHooks)
        }
      })
    })
  }

  function unmount (nodeList) {
    nodeList.forEach(element => {
      if (!element.dataset) return

      const component = store.get(element)
      if (component) {
        executeHooks(element, component, unmountHooks)
      }
    })
  }
}
