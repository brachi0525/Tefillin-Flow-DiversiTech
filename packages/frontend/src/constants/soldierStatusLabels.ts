import { CalendarToday, CheckCircle, Inventory2, LocationOn, Person, CancelOutlined } from "@mui/icons-material";

export const soldierStatusLabels = {
  registered: { label: 'הגיש בקשה', icon: CheckCircle },
  approved: { label: 'אושר', icon: Person },
  paid: { label: 'שילם', icon: Inventory2 },
  scheduled: { label: 'תיאם מסירה', icon: CalendarToday },
  received: { label: 'קיבל תפילין', icon: LocationOn },
  rejected: {  label: 'נדחה ', icon: CancelOutlined }
};