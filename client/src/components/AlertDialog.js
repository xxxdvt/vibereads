import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import {Link, useNavigate} from "react-router-dom";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({isDialog, defState=true}) {
    const [open, setOpen] = React.useState(defState);
    const navigate = useNavigate();

    const handleClose = () => {
        setOpen(false);
    };
    const handleIncorrectData = () => {
        window.location.reload();
        setOpen(false);
    };

    const handleGoLogin = () => {
        setOpen(false);
        navigate('/login')
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Упс... Что-то пошло не так"}</DialogTitle>
                <DialogContent
                >
                    {isDialog ? (
                        <DialogContentText id="alert-dialog-slide-description">
                            Похоже, что вы не вошли в систему. Пожалуйста, войдите в свой аккаунт. Если у Вас до сих пор нет аккаунта,
                            зарегистрироваться можно <Link to={'/register'}>здесь</Link>
                        </DialogContentText>
                    ) : (
                        <DialogContentText id="alert-dialog-slide-description">
                            Похоже, что вы ввели неправильный логин либо пароль. Пожалуйста, проверьте ваши данные и повторите попытку!
                        </DialogContentText>
                    )}

                </DialogContent>
                <DialogActions>
                    {isDialog ? (
                        <>
                        <Button onClick={handleClose}>Закрыть</Button>
                        <Button onClick={handleGoLogin}>Войти</Button>
                        </>
                    ) : (
                        <Button onClick={handleIncorrectData}>ОК</Button>
                        )}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}