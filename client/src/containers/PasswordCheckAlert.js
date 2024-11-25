import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import AlertDialogSlide from "../components/AlertDialog";

export default function PasswordCheckAlert() {
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [alertFlag, setAlertFlag] = useState(false);

    const handleClose = () => {
        setOpen(false);
        navigate('/profile')
    };

    async function handleSubmitPass() {
        const response = await fetch('http://127.0.0.1:5000/api/current_user/check-password', {
            "method": "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({password}),

        })
        if (response.status !== 200) {
            setAlertFlag(true);
            setOpen(false);
        } else {
            setOpen(false);
        }
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
            >
                <DialogTitle>Подтвердите пароль для продолжения</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="pass"
                        label="Пароль"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отменить</Button>
                    <Button onClick={handleSubmitPass}>Подтвердить</Button>
                </DialogActions>
            </Dialog>
            {alertFlag && (
                <AlertDialogSlide isDialog={false}/>
            )}
        </React.Fragment>
    );
}

