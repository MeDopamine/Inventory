import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Text } from "@chakra-ui/react";
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';

export default function BasicFilterDemo() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        // namaProjek: { value: null, matchMode: FilterMatchMode.CONTAINS },
        namaProjek: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        // namaProjek: { operator: FilterOperator.OR, constraints: [''] },
        // namaVendor: { value: null, matchMode: FilterMatchMode.CONTAINS },
        namaVendor: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        poPrice: { value: null, matchMode: FilterMatchMode.CONTAINS },
        inventorValue: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [defaultColumns] = useState([
        { field: 'namaProjek', header: 'Nama Projek' },
        { field: 'poPrice', header: 'Po Price' },
        { field: 'inventorValue', header: 'Inventory Value' },
        { field: 'namaVendor', header: 'Nama Vendor' },
    ]);
    // const [nameFilterValue, setNameFilterValue] = useState('');
    const [subTotalInventoryValue, setSubTotalInventoryValue] = useState(0);
    const [nameFilterValue, setNameFilterValue] = useState(['']);
    const [opsiMultiselectNamaVendor, setOpsiMultiselectNamaVendor] = useState();
    const [visibleLabelMultiselectNamaVendor, setvisibleLabelMultiselectNamaVendor] = useState([]);

    // const onNameFilterChange = (e, index) => {
    //     const value = e.target.value;
    //     console.log(value);
    //     const updatedFilters = { ...filters };
    //     updatedFilters.namaProjek.constraints[index] = { value, matchMode: FilterMatchMode.CONTAINS };
    
    //     // Buat salinan dari array nameFilterValue
    //     let updatedNameFilterValue = [...nameFilterValue];
    
    //     // Setel nilai yang sesuai dalam array pada indeks yang ditentukan
    //     updatedNameFilterValue[index] = value;
    
    //     setNameFilterValue(updatedNameFilterValue);
    //     console.log(updatedNameFilterValue);
    //     setFilters(updatedFilters);
    // };

    // const onNameFilterChange = (e, index) => {
    //     const value = e.target.value;
    //     const updatedFilters = { ...filters };
    //     updatedFilters.namaProjek.constraints[index] = { value, matchMode: FilterMatchMode.CONTAINS };
    
    //     const updatedNameFilterValue = [...nameFilterValue];
    //     updatedNameFilterValue[index] = value;
    
    //     setNameFilterValue(updatedNameFilterValue);
    //     console.log(updatedNameFilterValue); // Anda bisa mencetak yang diperbarui di sini
    //     console.log(nameFilterValue); // Anda bisa mencetak yang diperbarui di sini
    //     setFilters(updatedFilters);
    // };

    

    // const onNameFilterChange = (e, index) => {
    //     const value = e.target.value;
    //     console.log(value);
    //     const updatedFilters = { ...filters };
    //     updatedFilters.namaProjek.constraints[index] = { value, matchMode: FilterMatchMode.CONTAINS };
    //     const updatedNameFilterValue = [...nameFilterValue]
    //     updatedNameFilterValue[index] = value
    //     setNameFilterValue(updatedNameFilterValue);
    //     console.log(nameFilterValue);
    //     setFilters(updatedFilters);
    // };

    const onNameFilterChange = (e) => {
        console.log('a');
        const value = e.target.value;
        console.log(value);
        let _filters = { ...filters };
        // console.log(_filters);
        // console.log(_filters['namaProjek'].constraints[0].value);

        // _filters['namaProjek'].value = value;
        _filters['namaProjek'].constraints[0].value = value;

        setNameFilterValue(value);
        // totalInventoryValue();
        setFilters(_filters);
        console.log(filters);
    };

    

    const addNamaProjekFilter = () => {
        const updatedFilters = { ...filters };
        updatedFilters.namaProjek.constraints.push({ value: '', matchMode: FilterMatchMode.CONTAINS });
        setFilters(updatedFilters);
    };

    const removeNamaProjekFilter = (index) => {
        const updatedFilters = { ...filters };
        updatedFilters.namaProjek.constraints.splice(index, 1);
        setFilters(updatedFilters);
    };


    const nameFilterTemplate = (options) => {
        // console.log(options);
        return <InputText value={nameFilterValue} onChange={onNameFilterChange} />;
        // return <InputText value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
    };

    // const onNameVendorFilterChange = (e, index) => {
    //     console.log(e);
    //     options.filterCallback(e.value, index);
    //     console.log('a');
    //     totalInventoryValue(); // Memanggil totalInventoryValue() saat ada perubahan pada input
    // };

    // const nameVendorFilterTemplate = (options) => {
    //     // console.log(options);
    //     // return <InputText value={options.value} onChange={(e) => onNameVendorFilterChange(e, options.index)}/>;
    //     return <InputText 
    //                 value={options.value !== null ? options.value : ' '}
    //                 // value={options.value ?? ''} 
    //                 // onChange={(e) => options.filterCallback(e.value, options.index)}
    //                 onChange={(e) => onNameVendorFilterChange(e, options.index)}
    //             />;
    // };
    const handleNamaVendorToggle = (event) => {
        let selectedColumns = event.value;
        console.log(selectedColumns);
        let filter = null
        setvisibleLabelMultiselectNamaVendor(selectedColumns);
        const constraintValues = selectedColumns.map(item => item.namaVendor);
        console.log(constraintValues);
        filter = {
            operator: FilterOperator.OR,
            constraints: constraintValues.length > 0
                ? constraintValues.map(value => ({ value, matchMode: FilterMatchMode.CONTAINS }))
                : [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        };

        let updatedFilters = { ...filters };
        updatedFilters['namaVendor'] = filter;
        setFilters(updatedFilters);
    };

    const nameVendorFilterTemplate = (options, index) => {
        return <MultiSelect
        filter   
        maxSelectedLabels={1}
        value={visibleLabelMultiselectNamaVendor}
        options={opsiMultiselectNamaVendor}
        optionLabel="namaVendor" 
        onChange={handleNamaVendorToggle} className="w-full sm:w-20rem"  />
        // return <MultiSelect value={options.value} options={representatives} itemTemplate={representativesItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />;
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setGlobalFilterValue(value);
        // totalInventoryValue();
        setFilters(_filters); // Pindahkan ini ke akhir, agar filterChanges hanya diperbarui setelah semua perubahan
    };

    const formatCurrency = (value) => {
        const floatValue = parseFloat(value)
        return floatValue.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    };

    const totalInventoryValue = () => {
        let totalValue = 0;

        data?.forEach((project) => {
            if (matchFilters(project)) {
                const inventoryValue = parseFloat(project.inventorValue);
                if (!isNaN(inventoryValue)) {
                    totalValue += inventoryValue;
                }
            }
        });

        setSubTotalInventoryValue( formatCurrency(totalValue));
    };

    const matchFilters = (project) => {
        const globalFilter = filters.global.value;
        const namaProjekFilter = filters.namaProjek.constraints;
        const namaVendorFilter = filters.namaVendor.constraints;
        // console.log(namaProjekFilter);
        // const namaProjekFilter = filters.namaProjek.value;
        const poPriceFilter = filters.poPrice.value;

        const isGlobalMatch = 
            globalFilter == null ||
            project.namaProjek.toLowerCase().includes(globalFilter.toLowerCase()) ||
            project.namaVendor.toLowerCase().includes(globalFilter.toLowerCase()) ||
            project.poPrice.toLowerCase().includes(globalFilter.toLowerCase());

        // const isNamaProjekMatch = 
        //     namaProjekFilter == null || 
        //     project.namaProjek.toLowerCase().includes(namaProjekFilter.toLowerCase());
        const isNamaProjekMatch = 
            namaProjekFilter.some(filter => 
                filter.value === null || 
                project.namaProjek.toLowerCase().includes(filter.value.toLowerCase())
            );
        const isNamaVendorkMatch = 
            namaVendorFilter.some(filter => 
                filter.value === null || 
                project.namaVendor.toLowerCase().includes(filter.value.toLowerCase())
            );
        const isPoPriceMatch = poPriceFilter == null || project.poPrice.toLowerCase().includes(poPriceFilter.toLowerCase());

        return isGlobalMatch && isNamaProjekMatch && isPoPriceMatch && isNamaVendorkMatch;
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const renderFooter = () => {
        return (
            <div className="flex justify-between items-center">
                <div>
                    <Text>Total Projek: {totalProjek()} </Text>
                </div>

                <div>
                    <Text>Total Inventory Value: {subTotalInventoryValue} </Text>
                </div>
            </div>
        );
    };

    const totalProjek = () => {
        const uniqueProjects = new Set();

        data?.map((project) => {
            uniqueProjects.add(project.namaProjek);
            return project;
        });

        const total = uniqueProjects.size;

        return total;
    };

    useEffect(() => {
        const totalInventoryValue = () => {
            let totalValue = 0;

            data?.forEach((project) => {
                if (matchFilters(project)) {
                    const inventoryValue = parseFloat(project.inventorValue);
                    if (!isNaN(inventoryValue)) {
                        totalValue += inventoryValue;
                    }
                }
            });

            setSubTotalInventoryValue( formatCurrency(totalValue));
        };
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/v1/inventory/data`);
                const jsonData = await response.json();
                setData(jsonData);
                setLoading(false);
                totalInventoryValue();
                let totalValue = 0;

                data?.forEach((project) => {
                    if (matchFilters(project)) {
                        const inventoryValue = parseFloat(project.inventorValue);
                        if (!isNaN(inventoryValue)) {
                            totalValue += inventoryValue;
                        }
                    }
                });

                setSubTotalInventoryValue( formatCurrency(totalValue));

                const uniqueValuesNamaVendor = new Set(jsonData.map(item => item.namaVendor));
                // Menghasilkan 'namaProjekMap' dari nilai-nilai unik
                const namaVendorMap = Array.from(uniqueValuesNamaVendor).map(namaVendor => ({ namaVendor }));
                setOpsiMultiselectNamaVendor(namaVendorMap);
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        totalInventoryValue();
    }, [data, filters]);

    const header = renderHeader();
    const footer = renderFooter();

    return (
        <div className="card">
            <DataTable value={data} paginator rows={10} dataKey="id" filters={filters} filterDisplay='row' loading={loading}
                globalFilterFields={['namaProjek', 'namaVendor', 'poPrice', 'poValue']} header={header} footer={footer} emptyMessage="No customers found.">
                {defaultColumns.map((col) => (
                    col.field == 'namaProjek' 
                    ? 
                    <Column key={col.field} field={col.field} header={col.header} filterMenuStyle={{ width: 'auto' }} filter filterElement={nameFilterTemplate} sortable />
                    :
                    col.field == 'namaVendor' 
                        ? 
                        <Column key={col.field} field={col.field} header={col.header}  filter filterElement={nameVendorFilterTemplate} sortable />
                        :
                        <Column key={col.field} field={col.field} header={col.header} filterMenuStyle={{ width: 'auto' }} filter sortable />
                ))}
            </DataTable>
        </div>
    );
}

// import React, { useState, useEffect } from 'react';
// import { FilterMatchMode, FilterOperator } from 'primereact/api';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { InputText } from 'primereact/inputtext';
// import { Text } from "@chakra-ui/react";

// export default function BasicFilterDemo() {
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [globalFilterValue, setGlobalFilterValue] = useState('');
//     const [filters, setFilters] = useState({
//         global: { value: null, matchMode: FilterMatchMode.CONTAINS },
//         // namaProjek: { value: null, matchMode: FilterMatchMode.CONTAINS },
//         namaProjek: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
//         namaVendor: { value: null, matchMode: FilterMatchMode.CONTAINS },
//         poPrice: { value: null, matchMode: FilterMatchMode.CONTAINS },
//         inventorValue: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     });
//     const [defaultColumns] = useState([
//         { field: 'namaProjek', header: 'Nama Projek' },
//         { field: 'poPrice', header: 'Po Price' },
//         { field: 'inventorValue', header: 'Inventory Value' },
//         { field: 'namaVendor', header: 'Nama Vendor' },
//     ]);
//     const [subTotalInventoryValue, setSubTotalInventoryValue] = useState(0);
//     const [nameFilterValue, setNameFilterValue] = useState('');

//     const totalInventoryValue = () => {
//         let totalValue = 0;
//         console.log(data);
//         data?.forEach((project) => {
//             if (matchFilters(project)) {
//                 const inventoryValue = parseFloat(project.inventorValue);
//                 if (!isNaN(inventoryValue)) {
//                     totalValue += inventoryValue;
//                 }
//             }
//         });

//         setSubTotalInventoryValue(formatCurrency(totalValue));
//     };

//     const formatCurrency = (value) => {
//         const floatValue = parseFloat(value)
//         return floatValue.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
//     };

//     const matchFilters = (project) => {
//         const globalFilter = filters.global.value;
//         const namaProjekFilter = filters.namaProjek.constraints;
//         const poPriceFilter = filters.poPrice.value;

//         const isGlobalMatch =
//             globalFilter == null ||
//             project.namaProjek.toLowerCase().includes(globalFilter.toLowerCase()) ||
//             project.poPrice.toLowerCase().includes(globalFilter.toLowerCase());

//         const isNamaProjekMatch =
//             namaProjekFilter.some(filter =>
//                 filter.value === null ||
//                 project.namaProjek.toLowerCase().includes(filter.value.toLowerCase())
//             );
//         const isPoPriceMatch = poPriceFilter == null || project.poPrice.toLowerCase().includes(poPriceFilter.toLowerCase());

//         return isGlobalMatch && isNamaProjekMatch && isPoPriceMatch;
//     };

//     const onNameFilterChange = (e) => {
//         const value = e.target.value;
//         let _filters = { ...filters };
//         _filters['namaProjek'].constraints[0].value = value;
//         setNameFilterValue(value);
//         setFilters(_filters);
//     };

//     const nameFilterTemplate = (options) => {
//         return <InputText value={nameFilterValue} onChange={onNameFilterChange} />;
//     };

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch(`http://localhost:4000/api/v1/inventory/data`);
//                 const jsonData = await response.json();
//                 setData(jsonData);
//                 setLoading(false);
//             } catch (error) {
//                 console.log("Error fetching data:", error);
//             }
//         };

//         fetchData()
//     }, []);

//     useEffect(() => {
//         totalInventoryValue();
//     }, [data, filters]);

//     const onGlobalFilterChange = (e) => {
//         const value = e.target.value;
//         let _filters = { ...filters };
//         _filters['global'].value = value;
//         setGlobalFilterValue(value);
//         setFilters(_filters);
//     };

//     const renderHeader = () => {
//         return (
//             <div className="flex justify-content-end">
//                 <span className="p-input-icon-left">
//                     <i className="pi pi-search" />
//                     <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
//                 </span>
//             </div>
//         );
//     };

//     const renderFooter = () => {
//         return (
//             <div className="flex justify-between items-center">
//                 <div>
//                     <Text>Total Projek: {totalProjek()} </Text>
//                 </div>

//                 <div>
//                     <Text>Total Inventory Value: {subTotalInventoryValue} </Text>
//                 </div>
//             </div>
//         );
//     };

//     const totalProjek = () => {
//         const uniqueProjects = new Set();

//         data?.map((project) => {
//             uniqueProjects.add(project.namaProjek);
//             return project;
//         });

//         const total = uniqueProjects.size;

//         return total;
//     };

//     const header = renderHeader();
//     const footer = renderFooter();

//     return (
//         <div className="card">
//             <DataTable value={data} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
//                 globalFilterFields={['namaProjek', 'namaVendor', 'poPrice']} header={header} footer={footer} emptyMessage="No customers found.">
//                 {defaultColumns.map((col) => (
//                     col.field === 'namaProjek'
//                         ?
//                         <Column key={col.field} field={col.field} header={col.header} filterMenuStyle={{ width: 'auto' }} filter filterElement={nameFilterTemplate} sortable />
//                         :
//                         <Column key={col.field} field={col.field} header={col.header} filterMenuStyle={{ width: 'auto' }} filter sortable />
//                 ))}
//             </DataTable>
//         </div>
//     );
// }

