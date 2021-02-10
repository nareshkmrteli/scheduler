const list_initial=[]
const store=window.localStorage

export function Reducer(state=list_initial,action){
    console.log(state)
    let newstate=[...state]
    switch(action.type){
        case "ADD":
            newstate=[...state,action.data]
            break
        case "UPDATE":
            for(let i=0;i<newstate.length;i++){
                if(newstate[i].startDateTime==action.data.startDateTime){
                    newstate[i]=action.data
                }
            }
            break
        case "DELETE":
            for(let i=0;i<newstate.length;i++){
                if(newstate[i].startDateTime==action.data.startDateTime){
                    newstate.splice(i, 1)
                }
            }
            break
        default:
            return JSON.parse(store.getItem('schedules')) || list_initial
            
    }
    store.setItem('schedules', JSON.stringify(newstate))
    return newstate
}