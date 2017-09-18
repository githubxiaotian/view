import { nodeF, view } from './v'
import { h, t } from './v-dom'
import './index.css'

const Main = h.div({})

const Header = h.div({ class: 'header' })

const HeaderTitle = h.div({ class: 'headerTitle' })

const HeaderInput = (p: {
    value: string
    onInput: (value: string) => void
    onAdd: (value: string) => void
}) => h.input({
    class: 'textInput',
    placeholder: 'Title...',
    value: p.value,
    oninput: (e, el) => p.onInput(el.value),
    onkeydown: (e, el) => {
        if (e.keyCode == 13) p.onAdd(el.value)
    }
})

const List = h.div({ class: 'list' })

const ListItem = (p: {
    content: string
    checked: boolean
    onToggle: () => void
    onClose: () => void
}) => h.div({
    class: p.checked ? 'item checked' : 'item',
    onclick: p.onToggle
})([
    t(p.content),
    h.div({
        class: 'close',
        onclick: e => {
            e.stopPropagation()
            p.onClose()
        }
    })(t`×`)
])

const App = nodeF<null>(v => {

    let newTodo = ''
    let arr = [{
        content: '111',
        checked: false
    }]

    const refresh = view()

    const onInput = (content: string) => newTodo = content

    const addItem = (content: string) => {
        if (content != '') {
            newTodo = ''
            arr.push({ content, checked: false })
            v.nodeRefresh()
        }
    }

    const toggleItem = (n: number) => () => {
        arr[n].checked = !arr[n].checked
        v.nodeRefresh()
    }

    const removeItem = (n: number) => () => {
        arr.splice(n, 1)
        v.nodeRefresh()
    }

    v.nodeRefresh = () => refresh(
        Main([
            Header([
                HeaderTitle(t`todo list`),
                HeaderInput({
                    value: newTodo,
                    onInput: onInput,
                    onAdd: addItem
                })
            ]),
            List(arr.map((v, i) => ListItem({
                checked: v.checked,
                content: v.content,
                onToggle: toggleItem(i),
                onClose: removeItem(i)
            })))
        ])
    )


})

const node = view()(App(null))
if (node) document.body.appendChild(node)