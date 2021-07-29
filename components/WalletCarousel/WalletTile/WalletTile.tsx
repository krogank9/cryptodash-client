import css from './WalletTile.module.scss'
import IonIcon from '../../IonIcon/IonIcon'
import { generateData } from '../../Graph/GenerateGraph.js'
import React, { Component } from 'react';
import Graph, { GraphWithResize } from '../../Graph/Graph'


class WalletTile extends React.Component {
    containerRef: React.RefObject<HTMLDivElement>;
    state: {
        graphOptions: {}
    }

    constructor(props) {
        super(props)
        this.containerRef = React.createRef()
        this.state = {
            graphOptions: {}
        }
    }

    componentDidMount() {
        let new_graphOptions = {
            width: this.containerRef.current.offsetWidth, height: 65,
            showGrid: false,
            showLabels: false,
            strokeWidth: 1.5,
            dataObjs: [
                { data: generateData(0.5, 0.5, 10, 2), color: "#5FA3D2" }
            ]
        }

        this.setState({graphOptions: new_graphOptions})
    }

    render() {
        return (
            <div className={css.walletTile} ref={this.containerRef}>
                <div className={css.walletTile__info}>
                    <div className={css.walletTile__crypto}>
                        <div className={css.walletTile__cryptoIcon}>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACv0lEQVR4AaxWA6xdQRB9URs7qW0rThvXiGvbdqPa/EZt27bNb9u83tOd4u733W16knc1u3Nmd2bOPp8scKpDLd2vUV/dr0GA7t/gPv9F6P71i+hHz/SNbDSGxvr+FxDQtC53Hqj71S/Q/OpD5kdjaQ7N/Xfiay1ra34N1nBnxcK52o/mkg/ypbxqPvG5BInUj3xJ74YR2LAzn5CkQCD1I5+GX8NOEitXIVcPgjiqz7nitluvdsBJfQ39cC9oIW2gBbWQSkeVNUHForoiJ+0NGHM4eVuYzzaCORaMi6NkglhTudUkqt2OvQkn+RnMF9s40QgihJP56bct4SEI2r4eUt1RLhXUszIrZsXpqAhWkgXr4z4wswROfpz07hGnUDhpkWkA4+ZsVAdm67C+neA10VNKrIjbR9KplPvwzigL885CWJ8Pg5XmiEDMUhhXxnv6Im4f6bdKAMb1aS6RkxcjbLwQ7fh7ro0C8uoK4qb831dqvU8HXBLry5HyDk8PBgQ8U0HcFECEUuvlRLgEpANaQFMR3NsAsQOODS20nVcAET46TuXz3wkCgsgpSAQzilEW1vswT3/ErRSAcX2qIC5K5cV3iJMnoCLM+8skW7F+oVIKrE/7IfJ/VDg6NZAL1HPXRruhH+8jowURoggV82/cnFXeHtAErCDJtZNqSgRw37MN9RN9eLvFwk56DAGS3O4Vx5IsixbN+OgZAHF7CpH9/VSVhUfiY95ZwFtvCIwLw0QHiBRJCZG3FId1hHFtCum9KDgPMNsgDZCSYqXDyHq1CwTrQzhXvbsoD6GAxs2ZUoeR8nHspL4CY4wLTHuYT9eBYD5cBf1kPxiXx4K6QQtupX4cS/0h8W8IJz8eTtZXend1X/u5+SbkNM2ayG+SzdSA1wl/n55Alye/SUb/RunAN8vp3zEZCl0z+ndOB7x7DgARoloEset8/QAAAABJRU5ErkJggg==" />
                        </div>
                        <div className={css.walletTile__cryptoText}>
                            <div className={css.walletTile__cryptoTextAmount}>1.952 BTC</div>
                            <div className={css.walletTile__cryptoTextName}>Bitcoin</div>
                        </div>
                    </div>
                    <div className={css.walletTile__currency + " show-1550-and-up"}>
                        <div className={css.walletTile__currencyAmount}>$39,034</div>
                        <div className={css.walletTile__currencyChange + " " + css.walletTile__currencyChange_positive}>
                            <span>1.2%</span><IonIcon name="arrow-up-outline" />
                        </div>
                    </div>
                </div>
                <div className={css.walletTile__graph}>
                    <GraphWithResize options={this.state.graphOptions} />
                </div>
            </div>
        )
    }
}

export default WalletTile;