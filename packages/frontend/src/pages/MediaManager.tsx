import { useState, useMemo } from "react";
import {
  Box, Button, TextField, Table, TableBody, TableCell, TableHead,
  TableRow, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  Paper, Chip, IconButton, Tooltip, Switch, CircularProgress, Stack,
  Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useContent, useUpdateContent } from "../services/useContent";

interface MediaItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "image" | "video";
  order: number;
  isActive: boolean;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MediaManager() {
  const { data = { items: [] }, isLoading, refetch } = useContent("/media") as any;
  const [updateMedia, updateResult] = useUpdateContent("/media");

  const [edited, setEdited] = useState<Partial<MediaItem>>({});
  const [open, setOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState("");
  const adminEmail = "admin@yourdomain.com";

  const mediaItems: MediaItem[] = data.items || [];

  const path = "all";

  const filteredItems = useMemo(() => {
    return mediaItems
      .filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.location?.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => (a.location || "").localeCompare(b.location || ""));
  }, [mediaItems, search]);

  const groupedByLocation = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      const key = item.location || "other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, MediaItem[]>);
  }, [filteredItems]);

  const handleChange = (key: keyof MediaItem, value: any) => {
    setEdited((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedItems = mediaItems.map((item) =>
        item.id === edited.id ? { ...item, ...edited, updatedAt: new Date().toISOString() } : item
      );
      await updateMedia({ items: updatedItems, settings: data.settings }, adminEmail,path);
      setEdited({});
      setOpen(false);
      refetch();
    } catch (err) {
      console.error("❌ Error saving media:", err);
    }
  };

  const handleAddNew = async () => {
    const newItem: MediaItem = {
      id: Date.now().toString(),
      title: edited.title || "כותרת חדשה",
      description: edited.description || "",
      url: edited.url || "",
      type: edited.type || "image",
      order: mediaItems.length + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      location: edited.location || "gallery",
    };
    const updatedItems = [...mediaItems, newItem];
    await updateMedia({ items: updatedItems, settings: data.settings }, adminEmail ,path);
    setEdited({});
    setOpen(false);
    refetch();
  };

  const handleDelete = async (id: string) => {
    const updatedItems = mediaItems.filter((item) => item.id !== id);
    await updateMedia({ items: updatedItems, settings: data.settings }, adminEmail ,path);
    refetch();
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>טוען מדיה...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
      <Typography variant="h4" mb={3}>
        ניהול מדיה
      </Typography>

      <Stack direction="row" spacing={2} mb={3} alignItems="center">
        <TextField
          label="חיפוש..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 300 }}
        />
        <Chip label={`סה"כ פריטים: ${mediaItems.length}`} />
        <Chip label={`מוצגים: ${filteredItems.length}`} color="primary" />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setIsAdding(true); setOpen(true); }}
        >
          הוסף פריט חדש
        </Button>
      </Stack>

      {Object.entries(groupedByLocation).map(([location, items]) => (
        <Accordion key={location} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              📂 {location} ({items.length} פריטים)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>תצוגה</TableCell>
                  <TableCell>כותרת</TableCell>
                  <TableCell>סוג</TableCell>
                  <TableCell>פעיל</TableCell>
                  <TableCell>פעולות</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.type === "image" ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minWidth={140} minHeight={140}>
                          <img src={item.url} alt={item.title} style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, margin: 4, border: '1px solid #ddd', display: 'block' }} />
                        </Box>
                      ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" minWidth={140} minHeight={140}>
 <iframe
    src={item.url}
    title={item.title}
    width="120"
    height="60"
    allow="autoplay"
    style={{ border: "none" }}
  />                        </Box>
                      )}
                    </TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>
                      <Switch
                        checked={item.isActive}
                        onChange={async () => {
                          const updatedItems = mediaItems.map((m) =>
                            m.id === item.id ? { ...m, isActive: !m.isActive } : m
                          );
                           await updateMedia({ items: updatedItems, settings: data.settings }, adminEmail ,path);
                          refetch();
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="עריכה">
                        <IconButton color="primary" onClick={() => { setEdited(item); setIsAdding(false); setOpen(true); }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="מחיקה">
                        <IconButton color="error" onClick={() => handleDelete(item.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* דיאלוג עריכה / הוספה */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isAdding ? "הוסף פריט חדש" : "ערוך פריט"}</DialogTitle>
        <DialogContent>
          <TextField
            label="כותרת"
            fullWidth
            value={edited.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="תיאור"
            fullWidth
            multiline
            rows={3}
            value={edited.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="URL"
            fullWidth
            value={edited.url || ""}
            onChange={(e) => handleChange("url", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="מיקום"
            fullWidth
            value={edited.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>ביטול</Button>
          <Button
            variant="contained"
            onClick={isAdding ? handleAddNew : handleSave}
            color="success"
          >
            שמור
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
