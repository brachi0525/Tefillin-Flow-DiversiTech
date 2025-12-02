
import React from "react";
import { Tooltip, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { DeleteButton } from "../../../components/genericDeleteBtn/DeleteBtn";
import { User } from "../../../features/user/userTypes";
import { useDeleteUser } from "../../../services/userService";

interface UserActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onDeleted?: () => void;
}

export const UserActions: React.FC<UserActionsProps> = ({ user, onEdit, onDeleted }) => {
  const [deleteUser] = useDeleteUser();

  return (
    <div style={{ display: "inline-flex", gap: 4 }}>
      <Tooltip title="עריכת משתמש" arrow>
        <span>
          <Button onClick={() => onEdit(user)}>
            <EditIcon style={{ color: "#1976d2" }} />
          </Button>
        </span>
      </Tooltip>
      <DeleteButton
        item={user}
        itemLabel={user.name}
        onDelete={async () => {
          await deleteUser(user.email).unwrap();
        }}
        onSuccess={onDeleted}
        buttonTooltip="מחיקת משתמש"
        dialogTitle="מחיקת משתמש"
        dialogContentPrefix="האם למחוק את המשתמש"
      />
    </div>
  );
};
