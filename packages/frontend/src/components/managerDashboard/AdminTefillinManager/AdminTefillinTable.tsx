import React, { useState } from 'react';
import { IconButton, Dialog, DialogContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Tefillin } from '../../../features/tefillin/tefillinTypes';
import { Column } from '../../generics/genericTable/types';
// import AddTefillinForm from './AddTefillinForm';
import TefillinMediaUploader from '../../mediaProcessing/TefillinMediaUploader';
import GenericTefillinStatusTable from '../../tefillinDashboard/GenericTefillinStatusTable';

interface Props {
    rows: Tefillin[];
    onStatusChange?: (id: string, newStatus: string) => void;
}

const AdminTefillinTable: React.FC<Props> = ({ rows, onStatusChange }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleOpenForm = () => {
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
    };

    const sortedRows = [...rows].sort((a, b) =>
        (a.status || '').localeCompare(b.status || '')
    );

    const extraColumns: Column<Tefillin>[] = [
        {
            key: 'addTefillin',
            header: 'הוספת תפילין',
            align: 'center',
            render: () => (
                <IconButton
                    onClick={handleOpenForm}
                    sx={{
                        backgroundColor: 'transparent',
                        borderRadius: '50%',
                        transition: '0.2s',
                        '&:hover': {
                            backgroundColor: '#e0e0e0',
                        },
                        '&:active': {
                            backgroundColor: '#cfcfcf',
                        },
                    }}
                    size="small"
                >
                    <AddIcon sx={{ color: '#333' }} />
                </IconButton>
            ),
        },
        {
            /**
             * The key for the column that renders the image upload button.
             * The column is not displayed in the table, but is used to add a button to the table that allows the user to upload an image.
             */
            key: 'uploadImage',
            header: 'תמונה',
            align: 'center',
            render: (item) => (
                <TefillinMediaUploader id={item.id} onSuccess={() => console.log('ההעלאה הצליחה עבור', item.id)} />
            ),
        },
    ];

    return (
        <>
            {/*<GenericTefillinStatusTable
                rows={sortedRows}
                extraColumns={extraColumns}
            />
            <Dialog open={isFormOpen} onClose={handleCloseForm} maxWidth="md" fullWidth>
                <DialogContent>
                    {/* <AddTefillinForm onClose={handleCloseForm} onSubmit={function (data: Partial<Tefillin>): Promise<void> {

                        throw new Error('Function not implemented.');
                    }} /> }
                </DialogContent>
            </Dialog>
            */}
        </>
    );
};

export default AdminTefillinTable;
