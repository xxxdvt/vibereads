import React from 'react'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import {ToggleButton} from "@mui/material";
import {blue, yellow} from "@mui/material/colors";

const Toggle = ({ value, onChange }) => (

    <ToggleButton
        value="check"
        id="toggler"
        onClick={onChange}
        checked={value}
        size='large'
        sx = { { border: 0, padding: 0} }
    >
        {(value === false) ? (
            <DarkModeOutlinedIcon sx={{ color: blue[800] }} />
        ) : (<LightModeOutlinedIcon sx={{ color: yellow[700]}} />)
        }
    </ToggleButton>
)

export default Toggle