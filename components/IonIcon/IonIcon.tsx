import css from './IonIcon.module.scss'

// Tried to come up with a clever dynamic webpack way to do this but I think simple might be best here

import return_down_forward from "../../public/ion-icons/return-down-forward.svg"
import logo_github from "../../public/ion-icons/logo-github.svg"
import pie_chart from "../../public/ion-icons/pie-chart.svg"
import stats_chart from "../../public/ion-icons/stats-chart.svg"
import swap_horizontal from "../../public/ion-icons/swap-horizontal.svg"
import notifications from "../../public/ion-icons/notifications.svg"
import settings from "../../public/ion-icons/settings.svg"
import information_circle from "../../public/ion-icons/information-circle.svg"
import mail from "../../public/ion-icons/mail.svg"
import menu from "../../public/ion-icons/menu.svg"
import enter from "../../public/ion-icons/enter.svg"
import arrow_up_outline from "../../public/ion-icons/arrow-up-outline.svg"
import arrow_down_outline from "../../public/ion-icons/arrow-down-outline.svg"
import close_outline from "../../public/ion-icons/close-outline.svg"
import add_outline from "../../public/ion-icons/add-outline.svg"
import chevron_back_outline from "../../public/ion-icons/chevron-back-outline.svg"
import chevron_forward_outline from "../../public/ion-icons/chevron-forward-outline.svg"
import swap_vertical_outline from "../../public/ion-icons/swap-vertical-outline.svg"

const icons = {
    "return-down-forward": return_down_forward,
    "logo-github": logo_github,
    "pie-chart": pie_chart,
    "stats-chart": stats_chart,
    "swap-horizontal": swap_horizontal,
    "notifications": notifications,
    "settings": settings,
    "information-circle": information_circle,
    "mail": mail,
    "menu": menu,
    "enter": enter,
    "arrow-up-outline": arrow_up_outline,
    "arrow-down-outline": arrow_down_outline,
    "close-outline": close_outline,
    "add-outline": add_outline,
    "chevron-back-outline": chevron_back_outline,
    "chevron-forward-outline": chevron_forward_outline,
    "swap-vertical-outline": swap_vertical_outline
}
icons["return-down-forward"].noFill = true
icons["swap-horizontal"].noFill = true
icons["chevron-back-outline"].noFill = true
icons["chevron-forward-outline"].noFill = true

icons["arrow-up-outline"].noFill = true
icons["arrow-down-outline"].noFill = true
icons["swap-vertical-outline"].noFill = true

export default function IonIcon(props) {
    let Elem = icons[props.name]
    return (
        <Elem {...props} viewBox="0 0  512 512" className={(Elem.noFill? css.noFill:"")+" "+css.ionIcon+" "+(props.className||"")} />
    )
}
