import { Button, Container, Grid } from '@material-ui/core';
import { TextField } from 'final-form-material-ui';
import React from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch } from '../../redux/scheduler/scheduler';

export function AddOrRemove({intialformvalue,isupdate}){
    const schedulerDispatch=useDispatch()
    function onSubmit(formdata){
        if(formdata.actionType!='cancel'){
            delete formdata.actionType
            if(!isupdate)
                schedulerDispatch({type:"ADD",data:formdata})
            else
                schedulerDispatch({type:"UPDATE",data:formdata})
        }else{
            schedulerDispatch({type:"DELETE",data:formdata})
        }
    }
    return(
        <Container>
            <Form
                onSubmit={onSubmit}
                initialValues={intialformvalue}
                render={({handleSubmit,form,submitting,values})=>(
                    <form onSubmit={handleSubmit}>
                        <br/>
                        <Grid container alignContent='space-between' spacing={2}>
                        <Grid item sm={12}>
                            <Field name='startDateTime' disabled fullWidth={true} defaultValue={'ddd'} value={values.startDateTime}  label='Date and Time' component={TextField}/>
                        </Grid>
                            <Field name='endDateTime' hidden value={values.endDateTime} component='input' />
                        <Grid item sm={12}>
                            <Field name='name' fullWidth={true} label='Name' required value={values.name} component={TextField}/>
                        </Grid>
                        <Grid item sm={12}>
                            <Field name='mobile'  fullWidth={true} label='Mobile Number' required value={values.mobile} component={TextField}/>
                        </Grid>
                        <Grid item sm={12}>
                            <Button type='submit' onClick={()=>form.change('actionType','add')} variant='contained' color='primary' name='submit'>{isupdate?'Update':'Add' }</Button>
                            <span> </span>
                            {
                                isupdate && <Button type='delete' onClick={()=>form.change('actionType','cancel')} variant='contained' color='secondary' name='cancel'>Cancel</Button>
                            }
                        </Grid>
                        </Grid>
                        <br/>
                    </form>
                )}
            />
        </Container>
    )
}