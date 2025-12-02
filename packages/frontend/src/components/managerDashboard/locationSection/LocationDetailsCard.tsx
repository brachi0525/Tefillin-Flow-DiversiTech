// import React from "react";
// import GenericButton from "../../generics/GenericButton";
// import { Location } from "../../../features/location/locationTypes";
// import styles from "../locationSection/locationOverview.styles";
// import { Drawer, useTheme } from "@mui/material";


// type LocationDetailsCardProps = {
//     selected: Location | null;
//     setSelected: (location: Location | null) => void;
//     handleRabbi: (id: string, rabbi: string) => void;
//     handleOpen: boolean;
// };

// const LocationDetailsCard: React.FC<LocationDetailsCardProps> = ({ selected, setSelected, handleRabbi, handleOpen }) => {
//     if (!selected) return null;

//     // const rabbis = ["הרב כהן", "הרב לוי", "הרב ישראלי"];
//     // const timeline = [
//     //     { date: "2024-06-01", action: "עודכן מלאי" },
//     //     { date: "2024-05-15", action: "הוקצה רב" }
//     // ];

//     const theme = useTheme();
//     const [open, setOpen] = React.useState(false);

//     const handleDrawerOpen = () => {
//         setOpen(true);
//     };
//     const handleDrawerClose = () => {
//         setOpen(false);
//     };

//     return (
//         <Drawer
//             sx={{
//                 flexShrink: 0,
//                 '& .MuiDrawer-paper': {
//                     boxSizing: 'border-box',
//                 },
//             }}
//             variant="persistent"
//             anchor="left"
//             open={true}
//         >
//             <h1>hello world</h1>
//             <button onClick={() => handleDrawerClose()}>close</button>
//         </Drawer>



//         // <div style={{ ...styles.detailsCard, marginTop: 32, marginRight: "auto", marginLeft: "auto" }}>
//         //     <GenericButton label="חזרה" onClick={() => setSelected(null)} variant="contained" />
//         //     <h3>{selected.name}</h3>
//         //     <div>
//         //         <b>עיר:</b> {selected.city} <b>כתובת:</b> {selected.address}
//         //     </div>
//         //     <div>
//         //         <b>רב:</b>
//         //         <select
//         //             value={selected.rabbiName}
//         //             onChange={e => handleRabbi(selected.id, e.target.value)}
//         //         >
//         //             {rabbis.map(r => (
//         //                 <option key={r}>{r}</option>
//         //             ))}
//         //         </select>
//         //     </div>
//         //     <div>
//         //         <b>טלפון:</b> {selected.phone}
//         //     </div>
//         //     <div>
//         //         <b>ציר זמן:</b>
//         //         <ul>
//         //             {timeline.map((t, i) => (
//         //                 <li key={i}>
//         //                     <b>{t.date}:</b> {t.action}
//         //                 </li>
//         //             ))}
//         //         </ul>
//         //     </div>
//         // </div>
//     );
// };

// export default LocationDetailsCard;




import List from '@mui/material/List';
import { Location } from '../../../features/location/locationTypes';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type LocationDetailsCardProps = {
    selected: Location | null;
    onDrawerClose: () => void;
    open: boolean;
};


const LocationDetailsCard: React.FC<LocationDetailsCardProps> = ({ selected, onDrawerClose, open }) => {

    if (!selected) return null;
    console.log(selected);
    return (
        <List>
            <IconButton onClick={() => onDrawerClose()}>
                <CloseIcon />
            </IconButton>
            <div>
            </div>
            <div>
                <b>:טלפון</b><br /> {selected.phone} <br />
                <b>:מלאי תפילין שהוקצו</b> <br />{ selected.countAll ?? 0} <br />
                <b>:תפילין במיקום</b> <br />{selected.countReady ?? 0} 
            </div>
        </List>
    );
};

export default LocationDetailsCard;