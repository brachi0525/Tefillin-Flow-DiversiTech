import { useState } from "react";
import { FormField, GenericForm } from "../../genericForm/GenericForm";
import { CreateLocationDto } from "../../../features/location/locationTypes";
import { useCreateLocation } from "../../../services/locationService";

interface creatLocationProps {
  onClose: () => void;
}

const LocationFrom: React.FC<creatLocationProps> = ({ onClose }) => {
  const [createLocation] = useCreateLocation();

  const initialData: CreateLocationDto = {
    name: "",
    phone: "",
    address: {
      country: "",
      city: "",
      street: "",
      houseNumber: "",
    },
  };

  const fields: FormField[] = [
    { name: "name", label: "אזור", type: "text" },
    { name: "phone", label: "טלפון", type: "text" },
    { name: "address.country", label: "מדינה", type: "text" },
    { name: "address.city", label: "עיר", type: "text" },
    { name: "address.street", label: "רחוב", type: "text" },
    { name: "address.houseNumber", label: "מספר בית", type: "text" }
  ];

  const handleSubmit = async (data: CreateLocationDto) => {
    try {
      console.log("data to create location", data);
      await createLocation(data as any);
    } catch (err: any) {
      console.error("שגיאה בשליחה:", err);
    }
  };

  return (
    <>
      <GenericForm<CreateLocationDto> title="הוסף מיקום" fields={fields} initialData={initialData} onSubmit={handleSubmit} onClose={onClose} />
    </>
  )
};
export default LocationFrom;