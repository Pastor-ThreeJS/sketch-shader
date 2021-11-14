import React from 'react';
import World from './World';
import './App.css';
interface StateProps { }
interface StaState {
  development: boolean
}

export default class App extends React.Component<StateProps, StaState> {
  constructor(props: StateProps) {
    super(props);
    this.state = {
      development: false,
    };
  }

  componentDidMount() {

    //判定开发环境
    if (process.env.NODE_ENV === "development") {
      console.log("开发环境");
      this.setState({ development: true });
    } else {
      console.log("生产环境");
      this.setState({ development: false });
    }

    this.Init();
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <div id="app" style={{ position: "fixed", left: 0, top: 0, width: "100%", height: "100%", zIndex: 0, display: "block" }}>
          <div id="Stats-output"></div>
          <div id="WebGL-output" style={{ position: "fixed", left: 0, top: 0, width: "100%", height: "100%", zIndex: 0, display: "block" }} />
          {this.RenderConsole()}
        </div>
      </div >
    )
  }

  RenderConsole(): JSX.Element {
    if (this.state.development)
      return (
        <div>
          <div id="ButtonGtroup" >
          </div>
        </div >
      )
    else
      return (
        <div></div>)
  }

  Init() {
    let world = new World();
    world.Init();

  }

}