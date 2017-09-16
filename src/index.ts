import { nodeF, view } from './v' //框架
import { h, t } from './v-dom' //基本 html svg text 组件

import './index.css'

const div = h.div({})

const item = nodeF<string>(v => {
    const refresh = view()
    let s = 'item itemA'

    v.nodeRefresh = () => refresh(
        h.div({ class: s })([
            h.p({})([t(v.props)])
        ])
    )

    setTimeout(() => {
        s = 'item itemB'
        v.nodeRefresh()
    }, 10)

})

const App = nodeF<null>(v => {
    let n = 0
    const arr = ['0']
    const refresh = view()

    const addItem = () => {
        n++
        arr.push(n.toString(16))
        v.nodeRefresh()
    }

    const removeItem = () => {
        arr.splice(Math.floor(Math.random() * arr.length), 1)
        v.nodeRefresh()
    }

    v.nodeRefresh = () => refresh(
        div([
            h.button({ onclick: addItem })([t`add`]),
            h.button({ onclick: removeItem })([t`remove`]),
            div(arr.map(item))
        ])
    )
})


const node = view()(App(null))
if (node) document.body.appendChild(node)