import React, { useState } from "react";
import { Location, LocationInventoryItem } from "../../features/location/locationTypes";

import { DeleteButton } from "../../components/genericDeleteBtn/DeleteBtn";
import { UserRole } from "../../features/user/userTypes";
import { User } from "../../features/user/userTypes";
import { Button } from "@mui/material";

import LocationFrom from "../../components/admin/locations/LocationForm";
import { useGetLocations, useRemoveLocation, useUpdateLocation, useUpdateLocationRabbi } from "../../services/locationService";
import { useGetUsersByRole } from "../../services/userService";
import { GenericTable } from "../../components/generics/genericTable/GenericTable";

const timeline = [
  { date: "2024-06-01", action: "עודכן מלאי" },
  { date: "2024-05-15", action: "הוקצה רב" },
];

type Column<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
};

const LocationOverview: React.FC = () => {
  const { data: locations = [], isLoading, error, refetch } = useGetLocations();
  const { data: rabbis = [], isLoading: isRabbiLoading, error: errorRabbi } = useGetUsersByRole(UserRole.LOCATION_RABBI);
  const [showCreateLocation, setShowCreateLcation] = useState(true)
  const [selected, setSelected] = useState(false);
  const [updateLocationRabbi] = useUpdateLocationRabbi();
  const [updateLocation] = useUpdateLocation();
  const [removeLocation] = useRemoveLocation();
  const locationsWithRabbis = (locId: string) => {
    const rabbi = rabbis.find((r: User) => r.locationId === locId);
    return rabbi?.name || "לא נמצא רב";
  };

  const handleCloseForm = () => {
    setShowCreateLcation(false);
  };

  const handleOnChange = async (locId: string, rabbiEmail: string) => {
    console.log("Changing rabbi for location:", locId, "to email:", rabbiEmail);
    await updateLocationRabbi(locId, rabbiEmail);
    setSelected(false);
  };


  const handleOtherItem = (id: string, item: string, value: number) => {
    const loc = locations.find((l) => l.id === id);
    if (loc) {
      updateLocation({
        ...loc,
        inventory: {
          ...loc.inventory,
          otherItems: {
            ...((loc.inventory && loc.inventory.otherItems) || {}),
            [item]: value,
          },
        },
      });
      setSelected({
        ...loc,
        inventory: {
          ...loc.inventory,
          otherItems: {
            ...((loc.inventory && loc.inventory.otherItems) || {}),
            [item]: value,
          },
        },
      });
    }
  };

  const columns: Column<Location>[] = [
    { key: "country", header: "מדינה", sortable: true, render: (loc: Location) => (loc.address.country) },
    {
      key: "address",
      header: "כתובת",
      render: (loc: Location) => (
        <>
          {loc.address.street} {loc.address.houseNumber}, {loc.address.city}, {loc.address.country}
        </>
      ),
    },
    { key: "rabbiName", header: "רבי אחראי", render: (loc: Location) => (loc.rabbiName != "" ? loc.rabbiName : "") },
    { key: "phone", header: "טלפון" },
    {
      key: "actions",
      header: "פעולות",
      render: (loc: Location) => (
        <>
          <select
            autoFocus
            style={{
              maxWidth: "100px", // מגביל את הרוחב
              width: "100%", // יתפוס את כל הרוחב של ההורה עד ל־maxWidth
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              marginLeft: "7px",
            }}
            value={""}
            onChange={(e) => handleOnChange(loc.id, e.target.value)}
          >
            <option value="" disabled hidden>
              שינוי רבי
            </option>
            {rabbis.map((rabbi: User) => (
              <option key={rabbi.email} value={rabbi.email}>
                {rabbi.name}
              </option>
            ))}
          </select>
          <DeleteButton
            item={loc}
            itemLabel={loc.name}
            onDelete={async () => {
              try {
                await removeLocation(loc.id);
                await refetch();
              } catch (err: any) {
                alert(err?.data?.message || err?.error || "אירעה שגיאה לא ידועה במחיקה");
              }
            }}
            buttonTooltip="מחק מיקום"
            dialogTitle="מחיקת מיקום"
            dialogContentPrefix="האם למחוק את המיקום"
            customButton={
              <Button variant="outlined" color="error">
                מחק מיקום
              </Button>
            }
          />
        </>
      ),
    },
  ];

  if (isLoading) return <div >טוען...</div>;
  if (error) return <div>שגיאה בטעינת נתונים</div>;

  return (
    <div>
      <h2 >ניהול מיקומי הפצה</h2>
      <Button>הוסף מיקום
        <LocationFrom onClose={handleCloseForm} />
      </Button>

      <div style={{ maxWidth: 1100, margin: "auto" }}>
        <GenericTable tableName="locationOverview" data={locations} columns={[...columns]} keyExtractor={(item: Location) => item.id} loading={isLoading} searchPlaceholder="חפש מיקום/עיר/רב..." />
      </div>

      {/* {selected && (
        <div style={{ ...styles.detailsCard, marginTop: 32, marginInline: "auto" }}>
          <GenericButton label="חזרה" onClick={() => setSelected(null)} variant="contained" />
          <h3>{selected.name}</h3>
          <div>
            <b>עיר:</b> {selected.city} <b>כתובת:</b> {selected.address} 
          </div>
          <div>
            <b>רב:</b>
            <select style={styles.select} value={selected.rabbiName} onChange={(e) => handleRabbi(selected.id, e.target.value)}>
              {rabbis.map((rabbi: string) => (
                <option key={rabbi}>{rabbi}</option>
              ))}
            </select>
          </div>
          <div>
            <b>טלפון:</b> {selected.phone}
          </div>
          <div style={styles.invBox}>
            <b>מלאי:</b>
            {selected.inventory &&
              Object.entries(selected.inventory)
                .filter(([k, v]) => k !== "otherItems" && typeof v === "number")
                .map(([k, v]) => (
                  <span key={k} style={styles.invItem}>
                    {k}: {v}
                  </span>
                ))}
            {selected.inventory?.otherItems &&
              Object.entries(selected.inventory.otherItems).map(([k, v]) => (
                <span key={k} style={styles.invItem}>
                  {k}: {v}
                </span>
              ))}
          </div>
          <div>
            <b>ציר זמן:</b>
            <ul style={styles.timeline}>
              {timeline.map((t, i) => (
                <li key={i}>
                  <b>{t.date}:</b> {t.action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default LocationOverview;