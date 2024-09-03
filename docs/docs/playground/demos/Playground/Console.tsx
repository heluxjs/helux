import React from 'react'
import * as helux from 'helux'
import { Hook, Console, Decode } from 'console-feed';
import './index.less';

class HeluxConsole extends React.Component<any, { logs: any[] }> {
  state = {
    logs: [],
  }

  componentDidMount() {
    Hook(window.console, (log) => {
      this.setState(({ logs }) => ({ logs: [...logs, Decode(log)] }))
    });
    console.log(`Welcome to helux playground (helux ver: ${helux.cst.VER})^_^`);
  }

  render() {
    const clear = () => this.setState({ logs: [] });
    return (
      <div className="liveConsoleWrap">
        <button type="button" style={{ position: 'absolute', right: '12px', top: '1px', zIndex: 2000 }} onClick={clear}>clear</button>
        <div className="liveConsole">
          <Console logs={this.state.logs} variant="dark" />
        </div>
      </div>
    )
  }
}

export default React.memo(HeluxConsole);
