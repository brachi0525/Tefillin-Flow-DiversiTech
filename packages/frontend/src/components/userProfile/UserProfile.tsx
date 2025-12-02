import React, { useEffect, useState } from 'react';
import {
  TextField,
  IconButton,
  Box,
  Typography,
  Avatar,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useSelector, useDispatch } from 'react-redux';
import { currentUser, setUser } from '../../features/user/userSlice';
import { User } from '../../features/user/userTypes';
import { useUpdateUser } from '../../services/userService';
import GenericLoading from '../generics/genericLoading/GenericLoading';

type EditableField = 'name' | 'email' | 'phone';

type UserProfileProps = {
  onClose?: () => void;
};

const UserProfile = ({ onClose }: UserProfileProps) => {
  const theme = useTheme();

  const GRAY_DARK = theme.palette.grey[700];
  const GRAY_MAIN = theme.palette.grey[500];
  const GRAY_LIGHT = theme.palette.grey[300];
  const GRAY_HOVER_BG = theme.palette.action.hover || '#f5f5f5';

  const user = useSelector(currentUser);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState<User | null>(user);
  const [updateUser] = useUpdateUser();

  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [originalValue, setOriginalValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key in EditableField]?: string }>({});

  useEffect(() => {
    if (user) setUserData(user);
  }, [user]);

  if (!userData) {
    return <GenericLoading/>;
  }

  const validateField = (fieldName: EditableField, value: string): string => {
    switch (fieldName) {
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'כתובת אימייל לא חוקית';
        break;
      }
      case 'phone': {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) return 'מספר טלפון חייב להכיל 10 ספרות';
        break;
      }
      case 'name':
        if (value.trim() === '') return 'יש להזין שם';
        break;
    }
    return '';
  };

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = event.target.name;

    if (fieldName === 'profileImage') {
      const uploadedFiles = event.target.files;
      if (uploadedFiles && uploadedFiles.length > 0) {
        const selectedFile = uploadedFiles[0];
        const fileReader = new FileReader();

        fileReader.onloadend = () => {
          const imageAsBase64 = fileReader.result as string;
          setUserData(prev => {
            if (!prev) return prev;
            const updated = { ...prev, profileImageUrl: imageAsBase64 };
            dispatch(setUser(updated));
            updateUser(updated).unwrap().catch(console.error);
            return updated;
          });
        };

        fileReader.readAsDataURL(selectedFile);
      }
    } else {
      const fieldValue = event.target.value;
      setUserData((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, [fieldName]: fieldValue };
        dispatch(setUser(updated));
        return updated;
      });
      setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleEditClick = (fieldName: EditableField) => {
    setEditingField(fieldName);
    setOriginalValue(userData[fieldName] || '');
  };

  const handleSaveField = async (fieldName: EditableField) => {
    const currentValue = userData[fieldName] || '';
    const errorMsg = validateField(fieldName, currentValue);

    if (errorMsg) {
      setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
      return;
    }

    if (currentValue === originalValue || isSaving) {
      setEditingField(null);
      return;
    }

    setIsSaving(true);
    try {
      await updateUser(userData).unwrap();
      setEditingField(null);
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = (fieldName: EditableField) => {
    setUserData((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [fieldName]: originalValue };
      dispatch(setUser(updated));
      return updated;
    });
    setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    setEditingField(null);
  };

  const renderField = (label: string, fieldName: EditableField) => {
    const value = userData[fieldName] || '';
    const isEditing = editingField === fieldName;
    const error = errors[fieldName];

    return (
      <Box
        key={fieldName}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          borderBottom: `1px solid ${GRAY_LIGHT}`,
          paddingBottom: 3,
          paddingTop: 3,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            minWidth: 55,
            fontWeight: 600,
            color: GRAY_DARK,
            fontSize: 13,
          }}
        >
          {label}:
        </Typography>

        {isEditing ? (
          <>
            <TextField
              name={fieldName}
              variant="standard"
              value={value}
              onChange={handleInputChange}
              onBlur={() => handleSaveField(fieldName)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveField(fieldName);
              }}
              autoFocus
              error={!!error}
              helperText={error}
              sx={{ minWidth: 170 }}
            />
            <IconButton
              onClick={() => handleSaveField(fieldName)}
              aria-label="שמור"
              sx={{
                padding: 1,
                minWidth: 20,
                minHeight: 20,
                color: GRAY_DARK,
                '&:hover': {
                  backgroundColor: GRAY_HOVER_BG,
                  color: GRAY_DARK,
                },
              }}
            >
              <CheckIcon color="success" />
            </IconButton>
            <IconButton
              onClick={() => handleCancelEdit(fieldName)}
              sx={{
                padding: 1,
                minWidth: 20,
                minHeight: 20,
                color: GRAY_DARK,
                '&:hover': {
                  backgroundColor: GRAY_HOVER_BG,
                  color: GRAY_DARK,
                },
              }}
              aria-label="ביטול"
            >
              <ClearIcon color="error" />
            </IconButton>
          </>
        ) : (
          <>
            <Typography
              variant="body1"
              sx={{
                flexGrow: 1.5,
                fontSize: 16,
                color: theme.palette.text.primary,
                userSelect: 'text',
              }}
            >
              {value}
            </Typography>
            <IconButton
              onClick={() => handleEditClick(fieldName)}
              aria-label={`ערוך ${label}`}
              disabled={editingField !== null && editingField !== fieldName}
              sx={{
                color: GRAY_DARK,
                '&:hover': {
                  backgroundColor: GRAY_HOVER_BG,
                  color: GRAY_DARK,
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        maxWidth: 450,
        margin: '4px auto',
        padding: 6,
        backgroundColor: 'transparent',
        boxShadow: 'none',
        borderRadius: 0,
        direction: 'rtl',
      }}
    >
      {onClose && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={onClose} aria-label="סגור">
            <ClearIcon />
          </IconButton>
        </Box>
      )}
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: 'center',
          marginBottom: 6,
          fontWeight: 700,
          color: GRAY_DARK,
          fontSize: 22,
        }}
      >
        פרטי משתמש
      </Typography>

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Avatar
          src={userData.profileImageUrl || undefined}
          alt={userData.name[0]}
          sx={{
            width: 110,
            height: 110,
            borderRadius: '50%',
            border: userData.profileImageUrl
              ? `3px solid ${GRAY_MAIN}`
              : `2px solid ${GRAY_MAIN}`,
            fontSize: userData.profileImageUrl ? 0 : 44,
            backgroundColor: userData.profileImageUrl ? 'transparent' : '#f8f4ec',
            color: userData.profileImageUrl ? 'transparent' : GRAY_DARK,
            boxShadow: userData.profileImageUrl
              ? `0 0 15px 3px rgba(150, 150, 150, 0.7)`
              : '0 1px 3px rgba(0,0,0,0.1)',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!userData.profileImageUrl && userData.name[0]}
        </Avatar>

        <label htmlFor="profileImageInput">
          <IconButton
            component="span"
            size="small"
            aria-label="העלה תמונה"
            sx={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              backgroundColor: 'white',
              borderRadius: '50%',
              padding: 0.5,
              boxShadow: '0 0 3px rgba(0,0,0,0.15)',
              color: GRAY_DARK,
              minWidth: 14,
              minHeight: 14,
              '&:hover': {
                backgroundColor: GRAY_HOVER_BG,
                color: GRAY_DARK,
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </label>

        {userData.profileImageUrl && (
          <IconButton
            size="small"
            onClick={async () => {
              setUserData((prev) => {
                if (!prev) return prev;
                const updated = { ...prev, profileImageUrl: '' };
                dispatch(setUser(updated));
                updateUser(updated).unwrap().catch(console.error);
                return updated;
              });
            }}
            sx={{ position: 'absolute', top: 8, right: 8, color: GRAY_DARK }}
            aria-label="מחק תמונה"
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        )}

        <input
          id="profileImageInput"
          type="file"
          name="profileImage"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleInputChange}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        {renderField('שם', 'name')}
        {renderField('אימייל', 'email')}
        {renderField('טלפון', 'phone')}
      </Box>
    </Box>
  );
};

export default UserProfile;
