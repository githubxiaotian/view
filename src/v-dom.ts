
import { node, nodeF, NodeLifeCycleFunc, NodeData, NodeLifeCycle, viewList } from './v'

const textFunc: NodeLifeCycleFunc<string> = v => {
    const node = document.createTextNode('')
    v.nodeRefresh = () => {
        node.textContent = v.props
        return node
    }
}

const emptyArray: any[] = []

export const t: {
    (v: string): NodeData
    (v: number): NodeData
    (v: TemplateStringsArray, ...c: any[]): NodeData
} = (v: any, ...c: any[]) => {
    let props = ''
    if (typeof v == 'string') props = v
    if (typeof v == 'number') props = String(v)
    if (typeof v == 'object') props = String.raw(v, ...c)
    return {
        props,
        children: emptyArray,
        func: textFunc
    }
}

export const createNodeOpCmd = (node: Node) => ({
    add: (n: Node, index?: number) => {
        if (index == null || index == node.childNodes.length) {
            node.appendChild(n)
        } else {
            node.insertBefore(n, node.childNodes[index + 1])
        }
    },
    remove: (n: Node) => {
        node.removeChild(n)
    }
})

export type Style = Partial<CSSStyleDeclaration> | null

export const elSetStyle = (el: HTMLElement | SVGElement, newStyle: Style) => {
    el.removeAttribute('style')
    if (newStyle != null) {
        for (const k in newStyle) {
            if (newStyle[k] != null) {
                el.style[k] = newStyle[k]
            }
        }
    }
}

export const diffDataSet = (el: HTMLElement | SVGElement, oldDataset: { [name: string]: string } | null, newDataset: { [name: string]: string } | null) => {

}

const diffNodeProps = (node: HTMLElement | SVGElement, oldProps: any, newProps: any) => {
    for (let key in newProps) {

        const value = newProps[key]

        if (key == 'class') key = 'className'
        if (key == 'for') key = 'htmlFor'

        if (key.slice(0, 2) == 'on') {
            //diff event
            node[key] = (e: any) => value(e, node)
        } else if (key == 'style') {
            elSetStyle(node, value)
        } else if (key == 'dataset') {
            diffDataSet(node, null, value)
        } else {
            //diff attributes
            node[key] = value
        }
    }
}

const __ = (nodeFunc: () => HTMLElement | SVGElement) => (v: NodeLifeCycle<any>) => {
    const node = nodeFunc()

    const vl = viewList(createNodeOpCmd(node))

    v.nodeRefresh = () => {
        diffNodeProps(node, {}, v.props)//<--------------
        return node
    }

    v.childrenRefresh = () => vl(v.children)
    v.childrenDestroy = vl
}

export const h: {
    //
    br: (p: { style?: Style, class?: string }) => NodeData
    hr: (p: { style?: Style, class?: string }) => NodeData
    input: (p: { onkeydown: (e: KeyboardEvent, el: HTMLInputElement) => void, oninput?: (e: Event, el: HTMLInputElement) => void, value?: string, placeholder?: string, style?: Style, class?: string }) => NodeData
    //
    body: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    div: (p: { onclick?: (e: MouseEvent, el: HTMLDivElement) => void, innerHTML?: string, style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    canvas: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    iframe: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    label: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    section: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    header: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    h1: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    h2: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    h3: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    h4: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    h5: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    h6: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    footer: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    span: (p: { onclick?: (e: MouseEvent, el: HTMLSpanElement) => void, innerHTML?: string, style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    ul: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    li: (p: { onclick?: (e: MouseEvent, el: HTMLLIElement) => void, style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    button: (p: { onclick?: () => void, style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    a: (p: { href?: string, style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    p: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    strong: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    select: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    option: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
} = {} as any

export const s: {
    svg: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
    polygon: (p: { style?: Style, class?: string }) => (c?: NodeData | NodeData[]) => NodeData
} = {} as any

'br|input|img|hr'
    .split('|')
    .forEach(v =>
        h[v] = nodeF(__(() => document.createElement(v)))
    )

'body|div|canvas|iframe|label|section|header|h1|h2|h3|h4|h5|h6|footer|span|ul|li|button|a|p|strong|select|option'
    .split('|')
    .forEach(v =>
        h[v] = node(__(() => document.createElement(v)))
    )

'svg|polygon'
    .split('|')
    .forEach(v =>
        s[v] = node(__(() => document.createElementNS('http://www.w3.org/2000/svg', v)))
    )