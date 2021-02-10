import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { AddOrRemove } from './addorupdate';
import { SchedulerTable } from './schduletable';

export function Scheduler(){
    const {path,url}=useRouteMatch()
    return(
            <Switch>
                <Route exact path={`${path}/`}>
                    <SchedulerTable/>
                </Route>
               <Route exact path={`${path}/scheduletable`}>
                    <AddOrRemove/>
                </Route>
            </Switch>   
    
        );
}