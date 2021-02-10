import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Scheduler } from './pages/scheduler/scheduler';
import { SchedulerContext } from './redux/scheduler/scheduler';

function App() {
  const {path}=useRouteMatch()
  const theme = createMuiTheme({
    spacing:8,
    mixins:{
      toolbar:{
        minHeight: 35
        }
     },
     typography:{
       fontSize:14,
     }
    })

  return (
  <ThemeProvider theme={theme}>
  <SchedulerContext>
    <Switch>
      <Route path={`${path}`}>
        <Scheduler/>
      </Route>
    </Switch>
  </SchedulerContext>
  </ThemeProvider>
  );
}

export default App;
