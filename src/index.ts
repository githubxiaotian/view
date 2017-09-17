import { nodeF, view } from './v'
import { h, t } from './v-dom'
import './index.css'

const App = nodeF<null>(v => {

    let newTodo = ''
    let arr = [{
        content: '111',
        checked: false
    }]

    const refresh = view()

    const addItem = (content: string) => {
        if (content != '') {
            newTodo = ''
            arr.push({ content, checked: false })
            v.nodeRefresh()
        }
    }

    const toggleItem = (n: number) => {
        arr[n].checked = !arr[n].checked
        v.nodeRefresh()
    }

    const removeItem = (n: number) => {
        arr.splice(n, 1)
        v.nodeRefresh()
    }

    v.nodeRefresh = () => refresh(
        h.div({})([
            h.div({ class: 'header' })([
                h.div({ class: 'headerTitle' })(t`todo list`),
                h.input({
                    class: 'textInput',
                    placeholder: 'Title...',
                    value: newTodo,
                    oninput: (e, el) => newTodo = el.value,
                    onkeydown: e => {
                        if (e.keyCode == 13) addItem(newTodo)
                    }
                })
            ]),
            h.div({ class: 'list' })(
                arr.map((v, i) =>
                    h.div({
                        class: v.checked ? 'item checked' : 'item',
                        onclick: () => toggleItem(i)
                    })([
                        t(v.content),
                        h.div({
                            class: 'close',
                            onclick: e => {
                                e.stopPropagation()
                                removeItem(i)
                            }
                        })(t`×`)
                    ]))
            )
        ])
    )

})

const node = view()(App(null))
if (node) document.body.appendChild(node)