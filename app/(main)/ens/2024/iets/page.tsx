'use client';

import { CustomerService } from '../../../../../demo/service/CustomerService';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useState } from 'react';
import type { Demo } from '../../../../../types/types';

const EmptyPage = () => {
    const [customers1, setCustomers1] = useState<Demo.Customer[]>([]);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');

    const clearFilter1 = () => {
        initFilters1();
    };

    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };

    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter1} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    useEffect(() => {
        setLoading2(true);

        CustomerService.getCustomersLarge().then((data) => {
            setCustomers1(getCustomers(data));
            setLoading1(false);
        });

        initFilters1();
    }, []);

    const getCustomers = (data: Demo.Customer[]) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
            return d;
        });
    };

    const formatDate = (value: Date) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            'country.name': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            },
            balance: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            status: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue1('');
    };

    const countryBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <React.Fragment>
                <img alt="flag" src={`/demo/images/flag/flag_placeholder.png`} className={`flag flag-${rowData.country.code}`} width={30} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{rowData.country.name}</span>
            </React.Fragment>
        );
    };

    const representativeBodyTemplate = (rowData: Demo.Customer) => {
        const representative = rowData.representative;
        return (
            <React.Fragment>
                <img
                    alt={representative.name}
                    src={`/demo/images/avatar/${representative.image}`}
                    onError={(e) => ((e.target as HTMLImageElement).src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')}
                    width={32}
                    style={{ verticalAlign: 'middle' }}
                />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{representative.name}</span>
            </React.Fragment>
        );
    };

    const dateBodyTemplate = (rowData: Demo.Customer) => {
        return formatDate(rowData.date);
    };

    const balanceBodyTemplate = (rowData: Demo.Customer) => {
        return formatCurrency(rowData.balance as number);
    };

    const statusBodyTemplate = (rowData: Demo.Customer) => {
        return <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>;
    };

    const activityBodyTemplate = (rowData: Demo.Customer) => {
        return <ProgressBar value={rowData.activity} showValue={false} style={{ height: '.5rem' }}></ProgressBar>;
    };

    const verifiedBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <i
                className={classNames('pi', {
                    'text-green-500 pi-check-circle': rowData.verified,
                    'text-pink-500 pi-times-circle': !rowData.verified
                })}
            ></i>
        );
    };

    const header1 = renderHeader1();

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
                        <h5>Filter Menu</h5>
                        <DataTable
                            value={customers1}
                            paginator
                            className="p-datatable-gridlines"
                            showGridlines
                            rows={10}
                            dataKey="id"
                            filters={filters1}
                            filterDisplay="menu"
                            loading={loading1}
                            responsiveLayout="scroll"
                            emptyMessage="No customers found."
                            header={header1}
                        >
                            <Column field="name" header="Name" sortable style={{ minWidth: '12rem' }} />
                            <Column header="Country" field="country.name" style={{ minWidth: '12rem' }} body={countryBodyTemplate} sortable />
                            <Column
                                header="Agent"
                                field="representative"
                                style={{ minWidth: '14rem' }}
                                body={representativeBodyTemplate}
                                sortable
                            />
                            <Column header="Date" field="date" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} sortable />
                            <Column header="Balance" field="balance" dataType="numeric" style={{ minWidth: '10rem' }} body={balanceBodyTemplate} sortable />
                            <Column field="status" header="Status" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} sortable />
                            <Column field="activity" header="Activity" style={{ minWidth: '12rem' }} body={activityBodyTemplate} sortable />
                            <Column field="verified" header="Verified" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={verifiedBodyTemplate} sortable />
                        </DataTable>
                    </div>
        </div>
        </div>
    );
};

export default EmptyPage;
