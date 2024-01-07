import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

export default function AdvancedFilterDemo() {
    const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/v1/inventory/data`);
                const jsonData = await response.json();
                const formatDate = (value) => {
                    const date = new Date(value);
                    const options = {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        timeZoneName: 'short',
                    };
                    return date.toLocaleString('en-US', options);
                };
                
                // Mengubah format tanggal dalam data
                const formattedData = jsonData.map((item) => ({
                    ...item,
                    namaProjek: item.namaProjek+"/test",
                    tanggalPo: new Date(formatDate(item.tanggalPo))
                    // tanggalPo: formatDate(item.tanggalPo)
                }));
    
                setCustomers(formattedData);
                // setCustomers(jsonData);
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };
    
        fetchData();
        setLoading(false);
        initFilters();
    }, []);
    // console.log(customers);

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            namaProjek: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            tanggalPo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        });
        setGlobalFilterValue('');
    };
    // console.log(filters);

    // const formatDate = (value) => {
    //     return value.toLocaleDateString('en-US', {
    //         day: '2-digit',
    //         month: '2-digit',
    //         year: 'numeric'
    //     });
    // };

    // const formatDate = (value) => {
    //     const date = new Date(value);
    //     const options = {
    //         weekday: 'short',
    //         year: 'numeric',
    //         month: 'short',
    //         day: 'numeric',
    //         timeZoneName: 'short',
    //     };
    //     return date.toLocaleString('en-US', options);
    // };

    const formatDate = (value) => {
        console.log(value);
    
        return value.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });
      };
    
    // const dateBodyTemplate = (rowData) => {
    //     return formatDate(rowData.tanggalPo);
    // };
    const dateBodyTemplate = (rowData) => {
        console.log(formatDate(rowData.tanggalPo));
        console.log(typeof rowData.tanggalPo);
    
        return formatDate(rowData.tanggalPo);
    };
    // const dateBodyTemplate = (rowData) => {
    //     if (rowData.tanggalPo) {
    //         console.log(rowData.tanggalPo);
    //         console.log(typeof rowData.tanggalPo);
    //         // Parsing tanggal dari format 'yyyy-mm-dd'
    //         // const parts = rowData.tanggalPo.split('-');
    //         // const year = parseInt(parts[0], 10);
    //         // const month = parseInt(parts[1], 10) - 1; // Bulan dimulai dari 0 (0 = Januari, 1 = Februari, dst.)
    //         // const day = parseInt(parts[2], 10);
    
    //         // const date = new Date(year, month, day);
    //         const date = new Date(rowData.tanggalPo);
    //         // console.log( formatDate(date));
    //         return formatDate(date)
            
    //         // return formatDate(rowData.tanggalPo);
            
    //         // return formatDate(date);
    //     } else {
    //         return ""; // Atau tampilkan teks kosong jika rowData.tanggalPo kosong
    //     }
    // };

    const nameBodyTemplate = (rowData) => {
        if (rowData.namaProjek) {
            // console.log(rowData.namaProjek);
            return rowData.namaProjek+'/ea'
        }
    }
    
    
    // const dateFilterTemplate = (options) => {
    //     console.log(options.value);
    //     return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="dd/mm/yy" placeholder="" mask="99/99/9999" />;
    // };
    const dateFilterTemplate = (options) => {
        // console.log(options.value);
        return (
          <Calendar
            value={options.value}
            onChange={(e) => options.filterCallback(e.value, options.index)}
            dateFormat="mm/dd/yy"
            placeholder="mm/dd/yyyy"
            mask="99/99/9999"
          />
        );
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

    return (
        <div className="card">
            <DataTable value={customers} paginator showGridlines rows={10} loading={loading} dataKey="id" 
                    filters={filters} globalFilterFields={['namaProjek', 'tanggalPo']} header={header}
                    emptyMessage="No customers found.">
                <Column field='namaProjek'  header="Name" filter filterPlaceholder="Search by name" body={nameBodyTemplate} style={{ minWidth: '12rem' }} />
                {/* <Column  header="Name" filter filterPlaceholder="Search by name" body={(rowData) => rowData.namaProjek} style={{ minWidth: '12rem' }} /> */}
                <Column field='tanggalPo' header="Tanggal PO" filterField="tanggalPo" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate} />
                {/* <Column header="Date" filterField="date" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate} /> */}
                {/* <Column  header="Name" filter filterPlaceholder="Search by name" body={(rowData) => {{return rowData.namaProjek + '/test' }} } style={{ minWidth: '12rem' }} /> */}
                {/* <Column field="tanggalPo" header="Date" filterField="date" dataType="date" body={(rowData) => rowData.tanggalPo} style={{ minWidth: '10rem' }}  filter filterElement={dateFilterTemplate} /> */}
            </DataTable>
        </div>
    );
}



