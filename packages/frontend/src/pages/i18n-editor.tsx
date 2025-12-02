import { useState, useEffect } from "react";
import {
  Box, Button, TextField, Select, MenuItem, Table, TableBody, TableCell,
  TableHead, TableRow, Typography, Dialog, DialogTitle, DialogContent,
  DialogActions, Paper, InputAdornment, Chip, Alert, Accordion,
  AccordionSummary, AccordionDetails, CircularProgress, FormControl,
  InputLabel, Card, CardContent, Stack, IconButton, Tooltip
} from "@mui/material";

import { flattenObject, useContent, useUpdateContent } from "../services/useContent";

interface TranslationData {
  [key: string]: string;
}

export default function I18nEditor() {
  const [lang, setLang] = useState("he");
  const [edited, setEdited] = useState<TranslationData>({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [backupMsg, setBackupMsg] = useState("");
  const [backupError, setBackupError] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const adminEmail = "admin@yourdomain.com";
  // קריאת הנתונים לשפה הנוכחית
  const { data: rawData = {}, isLoading, error, refetch } = useContent('/i18n', lang);
  const data = flattenObject(rawData);

  // עדכון תוכן לפי השפה
  const [updateContent, updateResult] = useUpdateContent(`/i18n`);

  useEffect(() => {
    refetch();
    setEdited({});
  }, [lang]);

  const handleChange = (key: string, value: string) => {
    setEdited(prev => ({ ...prev, [key]: value }));
  };

  const handleCancelSingleEdit = (key: string) => {
    setEdited(prev => {
      const newEdited = { ...prev };
      delete newEdited[key];
      return newEdited;
    });
    setBackupMsg(`השינוי ב-"${key}" בוטל`);
    setTimeout(() => setBackupMsg(""), 2000);
  };

  const handleSave = async () => {
    try {
      await updateContent({ ...data, ...edited }, adminEmail, lang);
      setEdited({});
      setOpen(false);
      refetch();
      setBackupMsg("השינויים נשמרו בהצלחה!");
      setBackupError(false);
    } catch (err) {
      setBackupMsg("שגיאה בשמירת השינויים");
      setBackupError(true);
    } finally {
      setTimeout(() => {
        setBackupMsg("");
        setBackupError(false);
      }, 3000);
    }
  };

  const handleCancel = () => {
    if (Object.keys(edited).length > 0) {
      setCancelDialogOpen(true);
    } else {
      setBackupMsg("אין שינויים לביטול");
      setTimeout(() => setBackupMsg(""), 2000);
    }
  };

  const confirmCancel = () => {
    setEdited({});
    setCancelDialogOpen(false);
    setBackupMsg("כל השינויים בוטלו בהצלחה");
    setTimeout(() => setBackupMsg(""), 3000);
  };

  const handleAddKey = () => {
    if (!newKey.trim()) return;
    setEdited(prev => ({ ...prev, [newKey]: newValue }));
    setNewKey("");
    setNewValue("");
    setOpen(false);
  };

  const getOriginalValue = (key: string) => {
    return data[key as keyof typeof data] || '';
  };

  const getCurrentValue = (key: string) => {
    return edited[key as keyof typeof edited] !== undefined
      ? edited[key as keyof typeof edited]
      : data[key as keyof typeof data] || '';
  };

  const filteredData = Object.entries({ ...data, ...edited }).filter(([key, value]) =>
    key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(value).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedData = filteredData.reduce((acc, [key, value]) => {
    const category = key.split('.')[0];
    if (!acc[category]) acc[category] = [];
    acc[category].push([key, String(value)]);
    return acc;
  }, {} as Record<string, Array<[string, string]>>);

  if (isLoading && Object.keys(data).length === 0) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>טוען נתונים...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
      <Typography variant="h4" mb={3}>
        עריכת טקסטים - {lang === 'he' ? 'עברית' : 'English'}
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>שפה</InputLabel>
              <Select
                value={lang}
                onChange={e => setLang(e.target.value)}
                label="שפה"
              >
                <MenuItem value="he">עברית</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>

            <TextField
              placeholder="חיפוש טקסטים..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              size="small"
              sx={{ minWidth: 250 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    🔍
                  </InputAdornment>
                ),
              }}
            />

            <Button variant="contained" onClick={() => setOpen(true)}>
              ➕ הוסף מפתח
            </Button>

            <Button
              variant="outlined"
              color="warning"
              onClick={handleCancel}
              disabled={Object.keys(edited).length === 0}
            >
              ❌ בטל הכל
            </Button>

            <Button
              variant="contained"
              color="success"
              onClick={handleSave}
              disabled={Object.keys(edited).length === 0 || isLoading}
            >
              💾 שמור שינויים ({Object.keys(edited).length})
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {String(error)}
        </Alert>
      )}

      {backupMsg && (
        <Alert severity={backupError ? "error" : "success"} sx={{ mb: 2 }}>
          {backupMsg}
        </Alert>
      )}

      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
        <Chip label={`סה"כ טקסטים: ${Object.keys(data).length}`} />
        <Chip label={`מוצגים: ${filteredData.length}`} />
        <Chip label={`נערכו: ${Object.keys(edited).length}`} color="primary" />
      </Stack>

      {Object.entries(groupedData).map(([category, items]) => (
        <Accordion key={category} sx={{ mb: 2 }}>
          <AccordionSummary>
            <Typography variant="h6">
              📁 {category} ({items.length} טקסטים)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '35%' }}>מפתח</TableCell>
                  <TableCell>ערך</TableCell>
                  <TableCell sx={{ width: 120 }}>סטטוס</TableCell>
                  <TableCell sx={{ width: 100 }}>פעולות</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {key}
                      </Typography>
                      {edited[key] && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          מקורי: "{getOriginalValue(key)}"
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={getCurrentValue(key)}
                        onChange={e => handleChange(key, e.target.value)}
                        fullWidth
                        multiline
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: edited[key] ? '#fff3cd' : 'transparent'
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {edited[key] && (
                        <Chip label="✏️ נערך" size="small" color="warning" />
                      )}
                    </TableCell>
                    <TableCell>
                      {edited[key] && (
                        <Tooltip title={`בטל שינוי ב-${key}`}>
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleCancelSingleEdit(key)}
                            sx={{ ml: 1 }}
                          >
                            ↶
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      ))}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>הוסף מפתח חדש</DialogTitle>
        <DialogContent>
          <TextField
            label="מפתח (לדוגמה: home.newSection.title)"
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
            fullWidth
            sx={{ mb: 2, mt: 1 }}
            helperText="השתמש בנקודות להפרדה בין רמות (לדוגמה: home.hero.title)"
          />
          <TextField
            label="ערך"
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>ביטול</Button>
          <Button onClick={handleAddKey} variant="contained" disabled={!newKey.trim()}>
            הוסף
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>⚠️ בטל את כל השינויים?</DialogTitle>
        <DialogContent>
          <Typography>האם אתה בטוח שברצונך לבטל את כל השינויים שלא נשמרו?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            יש לך {Object.keys(edited).length} שינויים שלא נשמרו שיאבדו לצמיתות.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>חזור לעריכה</Button>
          <Button onClick={confirmCancel} variant="contained" color="warning">
            כן, בטל הכל
          </Button>
        </DialogActions>
      </Dialog>

      {(isLoading || updateResult.isLoading) && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>שומר שינויים...</Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
