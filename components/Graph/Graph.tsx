import css from './graph.module.scss'

export default function Graph(props) {
    let Elem = icons[props.name]
    return (
        <Elem viewBox="0 0  512 512" className={(Elem.noFill? css.noFill:"")+" "+css.ionIcon+" "+(props.className||"")} />
    )
}
