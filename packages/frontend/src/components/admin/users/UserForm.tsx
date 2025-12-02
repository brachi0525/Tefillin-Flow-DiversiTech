import React from "react";
import { User, UserDTO, UserRole, UserStatus } from "../../../features/user/userTypes";
import { userSchema } from "../../../schemas/userSchema";
import { Location } from "../../../../../../types/locations";
import { FormField, GenericForm } from "../../genericForm/GenericForm";
import { useCreateUser, useUpdateUser } from "../../../services/userService";
import { useGetLocations } from "../../../services/locationService";

interface AddUserProps {
  user?: User;
  onClose: () => void;
  refetchRabbis?: () => void;
}

export const roleOptions = [
  { value: "system_admin", label: "מנהל מערכת" },
  { value: "administrator", label: "מנהל ראשי" },
  { value: "manager", label: "מנהל" },
  { value: "location_rabbi", label: "רב אזורי" },
  { value: "inventory_manager", label: "מנהל מלאי" },
  { value: "custom", label: "מותאם אישית" },
];

const statusOptions = [
  { value: UserStatus.ACTIVE, label: "פעיל" },
  { value: UserStatus.INACTIVE, label: "לא פעיל" },
];

const UserForm: React.FC<AddUserProps> = ({ user, onClose, refetchRabbis }) => {
  const [createUser] = useCreateUser();
  const [updateUser] = useUpdateUser();
  const { data: locations = [] } = useGetLocations();
  const initialData: UserDTO = {
    email: user?.email ?? "",
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    role: user?.role ?? ("" as UserRole),
    status: user?.status ?? UserStatus.INACTIVE,
    locationId: user?.locationId ?? undefined,
  };
  const locationOptions = locations.map((loc: Location) => ({
    value: loc.id,
    label: loc.name,
  }));
  const fields: FormField[] = [
    { name: "email", label: "אימייל", type: "text", disabled: (data) => !!user },
    { name: "name", label: "שם", type: "text" },
    { name: "phone", label: "טלפון", type: "text" },
    { name: "role", label: "תפקיד", type: "select", options: roleOptions },
    { name: "locationId", label: "מיקום", type: "select", options: locationOptions, showIf: (data) => data.role === UserRole.LOCATION_RABBI },
    { name: "status", label: "סטטוס", type: "radio", options: statusOptions },
  ];

  const handleSubmit = async (data: UserDTO) => {
    try {
      if (!user) {
        await createUser(data).unwrap();
      } else {
        await updateUser(data);
      }
      if (refetchRabbis) refetchRabbis();
      onClose();
    } catch (err: any) {
      if (err?.status === 409) {
        throw new Error("כתובת האימייל הזו כבר קיימת במערכת");
      } else {
        console.error("שגיאה בשליחה:", err);
      }
    }
  };

  return (
    <GenericForm<UserDTO> title={user ? "ערוך משתמש" : "הוסף משתמש חדש"} fields={fields} schema={userSchema} initialData={initialData} onSubmit={handleSubmit} onClose={onClose} />
  );
};

export default UserForm;
