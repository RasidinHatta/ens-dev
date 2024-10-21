"use client";

import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge'; // Import the Badge component
import Papa from 'papaparse';

// Define an interface for the CSV data structure
interface CsvData {
    "No.": string;
    "Serial No.": string;
    "Expired Date": string;
    "Location": string;
    "Type": string;
    "Tank Status": string;
}

const EmptyPage = () => {
    const [blockAData, setBlockAData] = useState<CsvData[]>([]);
    const [blockBData, setBlockBData] = useState<CsvData[]>([]);
    const [blockA1Data, setBlockA1Data] = useState<CsvData[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        // Fetch Block A CSV
        Papa.parse('/blockA.csv', {
            download: true,
            header: true,
            complete: (results) => {
                const parsedData = results.data as CsvData[];
                const filteredData = parsedData.filter((row) => row["Expired Date"] && row["Expired Date"].trim() !== '');
                setBlockAData(filteredData);
            },
            error: (error) => {
                console.error("Error fetching Block A CSV:", error);
            }
        });

        // Fetch Block A1 CSV
        Papa.parse('/blockA1.csv', {
            download: true,
            header: true,
            complete: (results) => {
                const parsedData = results.data as CsvData[];
                const filteredData = parsedData.filter((row) => row["Expired Date"] && row["Expired Date"].trim() !== '');
                setBlockA1Data(filteredData);
            },
            error: (error) => {
                console.error("Error fetching Block B CSV:", error);
            }
        });

        // Fetch Block B CSV
        Papa.parse('/blockB.csv', {
            download: true,
            header: true,
            complete: (results) => {
                const parsedData = results.data as CsvData[];
                const filteredData = parsedData.filter((row) => row["Expired Date"] && row["Expired Date"].trim() !== '');
                setBlockBData(filteredData);
            },
            error: (error) => {
                console.error("Error fetching Block B CSV:", error);
            }
        });
    }, []);

    const clearFilter = () => {
        setGlobalFilterValue('');
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    // Custom body template for the "Tank Status" column using PrimeReact Badge
    const tankStatusBodyTemplate = (rowData: CsvData) => {
        const expiredDate = rowData["Expired Date"];

        if (!expiredDate) {
            return null; // Handle undefined expired date
        }

        const expirationDate = convertToDate(expiredDate);
        const currentDate = new Date();

        let status: string;
        let severity: 'success' | 'warning' | 'danger' | 'info' | 'help' | undefined;

        if (!expirationDate || expirationDate < currentDate) {
            status = "Expired";
            severity = 'danger';
        } else {
            status = "Good";
            severity = 'success';
        }
        rowData["Tank Status"] = status;
        return <Badge value={status} severity={severity} />;
    };

    const convertToDate = (dateStr: string): Date | null => {
        if (!dateStr || typeof dateStr !== 'string' || !dateStr.includes('/')) {
            return null; // Return null if the date string is invalid
        }
        const [year, month, day] = dateStr.split('/');
        return new Date(Number(year), Number(month) - 1, Number(day));
    };

    const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0'); // Get day and add leading zero if needed
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
        const year = date.getFullYear();
        return `${day}/${month}/${year}`; // Return in DD/MM/YYYY format
    };

    const dateBodyTemplate = (rowData: CsvData) => {
        const date = convertToDate(rowData["Expired Date"]);
        return date ? formatDate(date) : null;
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>IETS/WWTS</h5>
                    <p>Monitoring Page IETS/WWTS</p>
                </div>
            </div>
            
            {/* Block A DataTable */}
            <div className="col-12">
                <div className="card">
                    <h5>Block A</h5>
                    {blockAData.length === 0 ? (
                        <p>No data available for Block A.</p>
                    ) : (
                        <DataTable
                            value={blockAData}
                            paginator
                            className="p-datatable-gridlines"
                            showGridlines
                            rows={10}
                            dataKey="No."
                            filterDisplay="menu"
                            emptyMessage="No data found."
                            header={header}
                            globalFilter={globalFilterValue}
                        >
                            <Column field="No." header="No." style={{ minWidth: '12rem' }} sortable />
                            <Column field="Serial No." header="Serial No." style={{ minWidth: '12rem' }} sortable />
                            <Column field="Expired Date" header="Expired Date" style={{ minWidth: '12rem' }} body={dateBodyTemplate} sortable />
                            <Column field="Location" header="Location" style={{ minWidth: '12rem' }} sortable />
                            <Column field="Type" header="Type" style={{ minWidth: '12rem' }} sortable />
                            <Column field="Tank Status" header="Tank Status" style={{ minWidth: '12rem' }} body={tankStatusBodyTemplate} sortable />
                        </DataTable>
                    )}
                </div>
            </div>

            {/* Block A1 DataTable */}
            <div className="col-12">
                <div className="card">
                    <h5>Block A1</h5>
                    {blockAData.length === 0 ? (
                        <p>No data available for Block A.</p>
                    ) : (
                        <DataTable
                            value={blockA1Data}
                            paginator
                            className="p-datatable-gridlines"
                            showGridlines
                            rows={10}
                            dataKey="No."
                            filterDisplay="menu"
                            emptyMessage="No data found."
                            header={header}
                            globalFilter={globalFilterValue}
                        >
                            <Column field="No." header="No." style={{ minWidth: '12rem' }} sortable />
                            <Column field="Serial No." header="Serial No." style={{ minWidth: '12rem' }} sortable />
                            <Column field="Expired Date" header="Expired Date" style={{ minWidth: '12rem' }} body={dateBodyTemplate} sortable />
                            <Column field="Location" header="Location" style={{ minWidth: '12rem' }} sortable />
                            <Column field="Type" header="Type" style={{ minWidth: '12rem' }} sortable />
                            <Column field="Tank Status" header="Tank Status" style={{ minWidth: '12rem' }} body={tankStatusBodyTemplate} sortable />
                        </DataTable>
                    )}
                </div>
            </div>

            {/* Block B DataTable */}
            <div className="col-12">
                <div className="card">
                    <h5>Block B</h5>
                    {blockBData.length === 0 ? (
                        <p>No data available for Block B.</p>
                    ) : (
                        <DataTable
                            value={blockBData}
                            paginator
                            className="p-datatable-gridlines"
                            showGridlines
                            rows={10}
                            dataKey="No."
                            filterDisplay="menu"
                            emptyMessage="No data found."
                            header={header}
                            globalFilter={globalFilterValue}
                        >
                            <Column field="No." header="No." style={{ minWidth: '12rem' }} sortable />
                            <Column field="Serial No." header="Serial No." style={{ minWidth: '12rem' }} sortable />
                            <Column field="Expired Date" header="Expired Date" style={{ minWidth: '12rem' }} body={dateBodyTemplate} sortable />
                            <Column field="Location" header="Location" style={{ minWidth: '12rem' }} sortable />
                            <Column field="Type" header="Type" style={{ minWidth: '12rem' }} sortable />
                            <Column field="Tank Status" header="Tank Status" style={{ minWidth: '12rem' }} body={tankStatusBodyTemplate} sortable />
                        </DataTable>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmptyPage;
