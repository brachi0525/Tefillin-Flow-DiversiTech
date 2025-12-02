import React from "react";
import { GenericTable } from "../../generics/genericTable/GenericTable";
import { Location } from "../../../features/location/locationTypes";
// import GenericButton from "../../generics/GenericButton";



type LocationTableProps = {
    locations: Location[];
    isLoading: boolean;
    handleLocationSelect: (location: Location) => void;
};

const LocationTable: React.FC<LocationTableProps> = ({ locations, isLoading, handleLocationSelect }) => {

    const columns = [
        { key: "name", header: "שם מיקום", sortable: true },
        { key: "city", header: "עיר", sortable: true },
        { key: "rabbiName", header: "רב אחראי", sortable: true },
        { key: "phone", header: "טלפון" },
        { key: "isactive", header: "סטטוס", render: (item: Location) => item.isactive ? "פעיל" : "לא פעיל" },
        { key: "countAll", header: "מלאי תפילין", sortable: true }

        // {
        //     key: "actions",
        //     header: "",
        //     render: (item: Location) => (
        //         <GenericButton
        //             label="פרטים"
        //             onClick={() => handleLocationSelect(item)}
        //             variant="outlined"
        //         />
        //     )
        // }
    ];

    return (
        <div style={{ flexGrow: 1, }}>
            <GenericTable
                data={locations}
                columns={columns}
                keyExtractor={(item: Location) => item.id}
                loading={isLoading}
                searchPlaceholder="חפש מיקום/עיר/רב..."
                tableName='רשימת מיקומים'
            />
        </div>

    );
};

export default LocationTable;