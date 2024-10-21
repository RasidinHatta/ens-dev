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
    const [data, setData] = useState<CsvData[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        Papa.parse('/data.csv', {
            download: true,
            header: true,
            complete: (results) => {
                console.log(results.data); // Log parsed data
                setData(results.data as CsvData[]);
            },
            error: (error) => {
                console.error("Error fetching CSV:", error);
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

        // Function to convert the expired date string to a Date object

        if (!expiredDate) {
            return <Badge value="N/A" severity="info" />; // Handle undefined expired date
        }

        const expirationDate = convertToDate(expiredDate);
        const currentDate = new Date();

        let status: string;
        let severity: 'success' | 'warning' | 'danger' | 'info' | 'help' | undefined;

        if (expirationDate < currentDate) {
            status = "Expired";
            severity = 'danger';
        } else {
            status = "Good";
            severity = 'success';
        }
        rowData["Tank Status"] = status;

        return <Badge value={status + expirationDate} severity={severity} />;
    };

    const convertToDate = (dateStr: string): Date => {
        const [day, month, year] = dateStr.split('-');
        const monthMap: { [key: string]: number } = {
            'Jan': 0,
            'Feb': 1,
            'Mar': 2,
            'Apr': 3,
            'May': 4,
            'Jun': 5,
            'Jul': 6,
            'Aug': 7,
            'Sep': 8,
            'Oct': 9,
            'Nov': 10,
            'Dec': 11,
        };
        return new Date(Number(year), monthMap[month], Number(day));
    };


    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>IETS/WWTS</h5>
                    <p>Monitoring Page IETS/WWTS</p>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    {data.length === 0 ? (
                        <p>No data available.</p>
                    ) : (
                        <DataTable
                            value={data}
                            paginator
                            className="p-datatable-gridlines"
                            showGridlines
                            rows={10}
                            dataKey="No." // Adjust according to your unique identifier
                            filterDisplay="menu"
                            emptyMessage="No data found."
                            header={header}
                            globalFilter={globalFilterValue} // Apply global filter
                        >
                            <Column field="No." header="No." style={{ minWidth: '12rem' }} sortable />
                            <Column field="Serial No." header="Serial No." style={{ minWidth: '12rem' }} sortable />
                            <Column field="Expired Date" header="Expired Date" style={{ minWidth: '12rem' }} sortable />
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
