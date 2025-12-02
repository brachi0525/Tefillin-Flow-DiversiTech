import { JSX, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Dialog, DialogContent, Stack, Typography } from "@mui/material";
import { PersonAddAltOutlined } from "@mui/icons-material";
import { User, UserRole } from "../../../features/user/userTypes";
import { roleOptions } from "./UserForm";
import UserForm from "./UserForm";
import { useGetAll, useGetUsersByRole } from "../../../services/userService";
import { Column } from "../../generics/genericTable/types";
import { GenericTable } from "../../generics/genericTable/GenericTable";
import { UserActions } from "./UserActions";

export default function UserManagement(): JSX.Element {
  const dispatch = useDispatch();
  const { data: users, isLoading, error } = useGetAll();
  const { refetch: refetchRabbis } = useGetUsersByRole(UserRole.LOCATION_RABBI);

  const [showAddUser, setShowAddUser] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);

  const handleAddUserClick = () => {
    setUserToEdit(undefined);
    setShowAddUser(true);
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setShowAddUser(true);
  };

  const handleCloseForm = () => {
    setShowAddUser(false);
    setUserToEdit(undefined);
  };

  const roleLabels: Record<string, string> = Object.fromEntries(
    roleOptions.map(({ value, label }) => [value, label])
  );

  const columns: Column<User>[] = [
    { key: "name", header: "שם משתמש", sortable: true, searchable: true },
    {
      key: "role",
      header: "תפקיד",
      render: (user: User) => roleLabels[user.role] || user.role,
    },
    {
      key: "status",
      header: "סטטוס",
      render: (user: User) => (user.status === "active" ? "פעיל" : "לא פעיל"),
    },
    {
      key: "actions",
      header: "פעולות",
      render: (user: User) => <UserActions user={user} onEdit={handleEditUser} />,
    },
  ];

  if (isLoading) return <div>טוען נתונים...</div>;
  if (error) return <div>שגיאה בטעינת הנתונים</div>;

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={0} sx={{ mb: 2, direction: "rtl", mr: 12 }}>
        <Typography variant="h5">ניהול משתמשים</Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddUserClick}
          sx={{ transform: "translateX(-4.7cm)" }}
        >
          <PersonAddAltOutlined sx={{ ml: 1, gap: 1 }} />
          הוסף משתמש
        </Button>
      </Stack>

      <GenericTable<User>
        tableName="טבלת משתמשים"
        data={(users as { users?: User[] })?.users ?? []}
        columns={columns}
        keyExtractor={(item: User, idx: number) => item.id || `${item.phone ?? "no-phone"}-${idx}`}
        searchable
        filterable
        striped
        hoverable
        compact={false}
        searchPlaceholder="חפש משתמשים..."
      />

      <Dialog
        open={showAddUser}
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
          <UserForm user={userToEdit} onClose={handleCloseForm} refetchRabbis={refetchRabbis} />
        </DialogContent>
      </Dialog>
    </>
  );
}
