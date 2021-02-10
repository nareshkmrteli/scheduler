import { Container, Dialog, makeStyles, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useState } from 'react';
import { useSelector } from '../../redux/scheduler/scheduler';
import { AddOrRemove } from './addorupdate';
const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    tableRow:{
        padding:"5px",
        
    },
    tableCell:{
        padding:"5px",
        border:'1px black solid',
        fontSize:'.6em'
    }
    
    
  });


export function SchedulerTable(props){
    const lb=new Date(Date.now())
    const ub=new Date(Date.now())
    ub.setMonth(ub.getMonth()+3)
    const [formIntialValue, setFormIntialValue] = useState({})
    const [isUpdate, setIsUpdate] = useState(false)
    
    const [open, setOpen] = useState(true)
    const [month, setMonth] = useState(lb.getMonth())
    const [year, setYear] = useState(lb.getFullYear())
    const scheduler = useSelector((data)=>{return data})
    //time is 0-23
    //cell state is above explain as for color
    //day as 1-31 or what ever as per month
    function clickCallBack(year,month,day,time,cellState){
        const datetime=new Date()
        datetime.setFullYear(year,month,day)
        datetime.setHours(time)
        datetime.setMinutes(0)
        datetime.setSeconds(0)
        datetime.setMilliseconds(0)
        if(cellState==1){
            console.log(scheduler)
            for(let i=0;i<scheduler.length;i++){
                //start scheduler.startDateTime is unix time eoch
                if(scheduler[i].startDateTime.getTime()===datetime.getTime())
                {
                    setIsUpdate(true)
                    setFormIntialValue(scheduler[i])
                    setOpen(true)
                    break
                }
            }
        }else if(cellState==0){
            setIsUpdate(false)
            setFormIntialValue({startDateTime:datetime,endDateTime:datetime})
            setOpen(true)
        }
    }
    
    return(
        <Container>        
            <OptionSelectMonthDays setMonth={setMonth} setYear={setYear} month={month} year={year} />
            <CreateTable data={scheduler} lowerBoundDateTime={lb} upperBoundDateTime={ub} month={month} year={year} clickCallBack={clickCallBack} />
            <Dialog open={open} onClose={()=>setOpen(false)}>
                <AddOrRemove intialformvalue={formIntialValue} isupdate={isUpdate}/>
            </Dialog>
            <br/>
            <br/>
        </Container>
    )
}

function OptionSelectMonthDays({year,month,setYear,setMonth}){
    let months=[],years=[]
    for(let i=0;i<12;i++)
        months.push(<option value={i} >{i+1}</option>)
    const nowyear=new Date(Date.now()).getFullYear()
    for(let i=nowyear-2;i<=nowyear+2;i++)
        years.push(<option value={i}>{i}</option>)

    return(
        <>
        <br/>
        <Container component={Paper} style={{padding:'5px 5px',verticalAlign:'center'}}>
            <label>Month: </label>
            <Select native defaultValue={month} onChange={(e)=>setMonth(e.target.value)} align='center'>
                {months}
            </Select>
            <label>Year: </label>
            <Select native defaultValue={year} onChange={(e)=>{setYear(e.target.value)}} align='center'>
                {years}
            </Select>
        </Container>
        <br/>
        </>
    );
}
function daysInMonth (month, year) {
    return new Date(year, month+1, 0).getDate();
}
// if days 
// 0=avilable
// 1= booked
// 2=out of bound

function dataToMatrix(data,month,year,lowerBoundDateTime,upperBoundDateTime){
    const days=daysInMonth(month,year)
    let matrix=[]
    let datetime= new Date()
    datetime.setFullYear(year,month,1)
    datetime.setHours(0)
    datetime.setMinutes(0)
    datetime.setSeconds(0)
    datetime.setMilliseconds(0)
    
    // set matrix  according to upper and lower bound of date as 0=available and 2= out of bound
    for(var i=1;i<=days;i++){
        datetime.setDate(i)
        let row=[]
        for(var j=0;j<24;j++){
            datetime.setHours(j)
            if(datetime>=lowerBoundDateTime && datetime<=upperBoundDateTime){
                row.push(0)
            }
            else{
                row.push(2)
            }
        }
        matrix.push(row)
    }
    // integer value of start and last 
    let startThisMonth=new Date()
    startThisMonth.setFullYear(year,month,1)
    startThisMonth.setHours(0)
    startThisMonth.setMinutes(0)
    startThisMonth.setSeconds(0)
    startThisMonth.setMilliseconds(0)

    let endThisMonth=new Date()
    endThisMonth.setFullYear(year,month,days)
    endThisMonth.setHours(23)
    endThisMonth.setMinutes(59)
    endThisMonth.setSeconds(59)
    endThisMonth.setMilliseconds(999)
    // update matrix for already a schduled date and time
    for(let  i in data){
        const x=data[i]    
        x.startDateTime=new Date(x.startDateTime)
        x.endDateTime=new Date(x.endDateTime)
        //if either starting or end date exist in the current month
        if((x.startDateTime>=startThisMonth && x.startDateTime<=endThisMonth) || (x.endDateTime>=startThisMonth && x.endDateTime<=endThisMonth)){
            let start=x.startDateTime
            let end=x.endDateTime
            //if starting date is even before of this month than start with date 1/xx/xxxx
            if(x.startDateTime<startThisMonth)
                start=startThisMonth
            //if end date is even after of this month than end with date (31/28/29/30)/xx/xxxx
            if(x.endDateTime>endThisMonth)
                end=endThisMonth
            const shour=start.getHours()
            const sday=start.getDate()

            const ehour=end.getHours()
            const eday=end.getDate()
            
            for(i=sday;i<=eday;i++){
                for(j = (sday==i?shour:0);j<= (eday==i?ehour:23);j++){
                    matrix[i-1][j]=1
                }
            }
        }
    }
    return matrix
}
// 0=avilable
// 1= booked
// 2=out of bound
function CreateTable({data,month,year,lowerBoundDateTime,upperBoundDateTime,clickCallBack=console.log}){
    const matrix=dataToMatrix(data,month,year,lowerBoundDateTime,upperBoundDateTime)
    const classes = useStyles();
    const colormaping=['white','red','#eeeeee']
    return(
        <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="scheduler">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell} align="right">Date</TableCell>
            <TableCell className={classes.tableCell} align="right">12AM-1AM</TableCell>
            <TableCell className={classes.tableCell} align="right">1AM-2AM</TableCell>
            <TableCell className={classes.tableCell} align="right">2AM-3AM</TableCell>
            <TableCell className={classes.tableCell} align="right">3AM-4AM</TableCell>
            <TableCell className={classes.tableCell} align="right">4AM-5AM</TableCell>
            <TableCell className={classes.tableCell} align="right">5AM-6AM</TableCell>
            <TableCell className={classes.tableCell} align="right">6AM-7AM</TableCell>
            <TableCell className={classes.tableCell} align="right">7AM-8AM</TableCell>
            <TableCell className={classes.tableCell} align="right">8AM-9AM</TableCell>
            <TableCell className={classes.tableCell} align="right">9AM-10AM</TableCell>
            <TableCell className={classes.tableCell} align="right">10AM-11AM</TableCell>
            <TableCell className={classes.tableCell} align="right">11AM-12PM</TableCell>
            <TableCell className={classes.tableCell} align="right">12PM-1PM</TableCell>
            <TableCell className={classes.tableCell} align="right">1PM-2PM</TableCell>
            <TableCell className={classes.tableCell} align="right">2PM-3PM</TableCell>
            <TableCell className={classes.tableCell} align="right">3PM-4PM</TableCell>
            <TableCell className={classes.tableCell} align="right">4PM-5PM</TableCell>
            <TableCell className={classes.tableCell} align="right">5PM-6PM</TableCell>
            <TableCell className={classes.tableCell} align="right">6PM-7PM</TableCell>
            <TableCell className={classes.tableCell} align="right">7PM-8PM</TableCell>
            <TableCell className={classes.tableCell} align="right">8PM-9PM</TableCell>
            <TableCell className={classes.tableCell} align="right">9PM-10PM</TableCell>
            <TableCell className={classes.tableCell} align="right">10PM-11PM</TableCell>
            <TableCell className={classes.tableCell} align="right">11PM-12AM</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {matrix.map((row,index) => (
            <TableRow>
            
            <TableCell className={classes.tableCell} align='center' >{index+1}</TableCell>
            {row.map((cell,index2)=>(
                <TableCell key={index2} onClick={()=>clickCallBack(year,month,index+1,index2,cell)} style={{backgroundColor: colormaping[cell]}} className={classes.tableCell}></TableCell>    
            ))}
          </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    )
}
