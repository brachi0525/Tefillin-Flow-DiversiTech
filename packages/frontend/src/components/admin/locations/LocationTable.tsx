import React, { useState } from "react";
import { Location, LocationInventoryItem } from "../../../features/location/locationTypes";

import { DeleteButton } from "../../../components/genericDeleteBtn/DeleteBtn";
import { UserRole } from "../../../features/user/userTypes";
import { User } from "../../../features/user/userTypes";
import { Box, Button, Dialog, DialogContent, Stack, Typography } from "@mui/material";
import LocationFrom from "../../../components/admin/locations/LocationForm";
import { AddLocationAltOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetUsersByRole } from "../../../services/userService";
import { useGetLocations, useRemoveLocation, useUpdateLocation, useUpdateLocationRabbi } from "../../../services/locationService";
import { GenericTable } from "../../generics/genericTable/GenericTable";

type Column<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
};

const LocationTable: React.FC = () => {
  const { data: locations = [], isLoading, error, refetch } = useGetLocations();
  const { data: rabbis = [], isLoading: isRabbiLoading, error: errorRabbi, refetch: refetchRabbis } = useGetUsersByRole(UserRole.LOCATION_RABBI);

  const [selected, setSelected] = useState(false);
  const [showCreateLocation, setShowCreateLcation] = useState(false);
  const [updateLocationRabbi] = useUpdateLocationRabbi();
  const [updateLocation] = useUpdateLocation();
  const [removeLocation] = useRemoveLocation();
  const locationsWithRabbis = (locId: string) => {
    const rabbi = rabbis.find((r: User) => r.locationId === locId);
    return rabbi?.name || "לא נמצא רב";
  };

  const handleCloseForm = () => {
    setShowCreateLcation(!showCreateLocation);
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
    { key: "name", header: "שם המיקום" },
    { key: "rabbiName", header: "רבי אחראי", render: (loc: Location) => (loc.rabbiName != "" ? loc.rabbiName : "ללא") },
    { key: "phone", header: "טלפון" },
    { key: "countAll", header: "מלאי תפילין" },

    {
      key: "actions",
      header: "פעולות",
      render: (loc: Location) => (
        <>
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: 1, alignItems: "center" }}>
            <select
              autoFocus
              style={{
                maxWidth: "100px",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
              value={""}
              onChange={(e) => handleOnChange(loc.id, e.target.value)}
            >
              <option value="" disabled hidden>
                בחר רבי
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
              customButton={<DeleteIcon style={{ color: "#bc4747ff" }} />}
            />
          </Box>
        </>
      ),
    },
  ];

  if (isLoading) return <div>טוען...</div>;
  if (error) return <div>שגיאה בטעינת נתונים</div>;

  return (
    <div>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, direction: "rtl", maxWidth: 1100, margin: "auto" }}>
        <Typography variant="h5" sx={{ paddingRight: "2.3cm" }}>
          ניהול מיקומי הפצה
        </Typography>

        <Button sx={{ ml: 11, gap: 1 }} variant="contained" color="primary" startIcon={<AddLocationAltOutlined />} onClick={handleCloseForm}>
          הוסף מיקום
        </Button>
      </Stack>

      <div style={{ maxWidth: 1100, margin: "auto" }}>
        <GenericTable tableName="" data={locations} columns={[...columns]} keyExtractor={(item: Location) => item.id} loading={isLoading} searchPlaceholder="חפש מיקום/עיר/רב..." />
      </div>

      <Dialog
        open={showCreateLocation}
        onClose={handleCloseForm}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <LocationFrom onClose={handleCloseForm} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationTable;