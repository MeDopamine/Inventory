import React, { useState, useEffect, cloneElement } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Panel } from "primereact/panel";
import { SelectButton } from "primereact/selectbutton";
import { Text, VStack } from "@chakra-ui/react";
import { Dropdown } from "primereact/dropdown";
import { Fieldset } from "primereact/fieldset";
import { AutoComplete } from "primereact/autocomplete";
import { Tag } from "primereact/tag";
import { blueGrey } from "@mui/material/colors";

export default function BasicFilterDemo() {
    const [data, setData] = useState(null);
    const [field, setField] = useState(null);
    const [columnMinWidths, setColumnMinWidths] = useState({}); // State untuk menyimpan lebar minimum kolom
    const [headerMinWidths, setHeaderMinWidths] = useState({}); // State untuk menyimpan lebar minimum kolom
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [opsiMultiselectNamaProjek, setOpsiMultiselectNamaProjek] = useState();
    const [opsiMultiselectNamaVendor, setOpsiMultiselectNamaVendor] = useState();
    const [opsiMultiselectKodeMaterial, setOpsiMultiselectKodeMaterial] = useState();
    const [opsiMultiselectNomorPo, setOpsiMultiselectNomorPo] = useState();
    const [subTotalValue, setSubTotalValue] = useState([]);
    const [subTotal, setSubTotal] = useState([...subTotalValue]);
    const [dates, setDates] = useState(null);
    const statusesName = [...new Set(data?.map((item) => item.statusProjek))];
    const divisiName = [...new Set(data?.map((item) => item.namaDivisi))];

    const [totalRecords, setTotalRecords] = useState(0);
    const [customers, setCustomers] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            namaProjek: { value: '', matchMode: 'contains' },
        }
    });

    let networkTimeout = null;

    useEffect(() => {
        loadLazyData();
        console.log(data);
    }, [lazyState]);

    // const loadLazyData = () => {
    //     setLoading(true);

    //     if (networkTimeout) {
    //         clearTimeout(networkTimeout);
    //     }

    //     //imitate delay of a backend call
    //     networkTimeout = setTimeout(() => {

    //         // CustomerService.getCustomers({ lazyEvent: JSON.stringify(lazyState) }).then((data) => {
    //         //     setTotalRecords(data.totalRecords);
    //         //     setCustomers(data.customers);
    //         //     setLoading(false);

    //         // });
    //         const response = await fetch(
    //             `http://localhost:4000/api/v1/inventory/data`
    //         );
    //         const jsonData = await response.json();
    //         const formatDate = (value) => {
    //             const date = new Date(value);
    //             const options = {
    //                 weekday: "short",
    //                 year: "numeric",
    //                 month: "short",
    //                 day: "numeric",
    //                 hour: "2-digit",
    //                 minute: "2-digit",
    //                 second: "2-digit",
    //                 timeZoneName: "short",
    //             };
    //             return date.toLocaleString("en-US", options);
    //         };

    //         const dataWithAdditionalFormattedData = jsonData.map((item) => {
    //             const tanggalGr = new Date(item.tanggalGr);
    //             const tanggalGi = new Date(item.tanggalGi);
    //             const selisihTanggal =
    //                 Math.abs(tanggalGr - tanggalGi) / (1000 * 60 * 60 * 24);
    //             const DOI = `${selisihTanggal} Hari`;
    //             return {
    //                 ...item,
    //                 DOI,
    //                 tanggalPo: new Date(formatDate(item.tanggalPo)),
    //                 tanggalGr: new Date(formatDate(item.tanggalGr)),
    //                 tanggalGi: new Date(formatDate(item.tanggalGi)),
    //                 inventory: parseFloat(item.inventory).toFixed(3),
    //                 // inventory: parseFloat(item.inventory)
    //             };
    //         });
    //         setData(dataWithAdditionalFormattedData);

    //         // Menghitung nilai unik dari properti 'namaProjek' setelah data tersedia
    //         const uniqueValuesNamaProjek = new Set(dataWithAdditionalFormattedData.map((item) => item.namaProjek));
    //         // Menghasilkan 'namaProjekMap' dari nilai-nilai unik
    //         const namaProjekMap = Array.from(uniqueValuesNamaProjek).map((namaProjek) => ({ namaProjek }));
    //         setOpsiMultiselectNamaProjek(namaProjekMap);

    //         const uniqueValuesNamaVendor = new Set(dataWithAdditionalFormattedData.map((item) => item.namaVendor));
    //         // Menghasilkan 'namaProjekMap' dari nilai-nilai unik
    //         const namaVendorMap = Array.from(uniqueValuesNamaVendor).map((namaVendor) => ({ namaVendor }));
    //         setOpsiMultiselectNamaVendor(namaVendorMap);

    //         const uniqueValuesKodeMaterial = new Set(dataWithAdditionalFormattedData.map((item) => item.kodeMaterial));
    //         // Menghasilkan 'namaProjekMap' dari nilai-nilai unik
    //         const kodeMaterialMap = Array.from(uniqueValuesKodeMaterial).map((kodeMaterial) => ({ kodeMaterial }));
    //         setOpsiMultiselectKodeMaterial(kodeMaterialMap);

    //         const uniqueValuesNomorPo = new Set(dataWithAdditionalFormattedData.map((item) => item.nomorPo));
    //         // Menghasilkan 'namaProjekMap' dari nilai-nilai unik
    //         const nomorPoMap = Array.from(uniqueValuesNomorPo).map((nomorPo) => ({ nomorPo }));
    //         setOpsiMultiselectNomorPo(nomorPoMap);

    //         const field =
    //             dataWithAdditionalFormattedData?.length > 0
    //                 ? Object.keys(dataWithAdditionalFormattedData[0])
    //                 : [];
    //         setField(field);

    //         // Menghentikan status loading
    //         setLoading(false);

    //     }, Math.random() * 1000 + 250);
    // };

    const loadLazyData = () => {
        setLoading(true);
    
        if (networkTimeout) {
            clearTimeout(networkTimeout);
        }

        // CustomerService.getCustomers({ lazyEvent: JSON.stringify(lazyState) }).then((data) => {
    //         //     setTotalRecords(data.totalRecords);
    //         //     setCustomers(data.customers);
    //         //     setLoading(false);

    //         // });
    
        // Imitate delay of a backend call
        networkTimeout = setTimeout(() => {
            // Fetch data from the API
            fetch("http://localhost:4000/api/v1/inventory/data")
                .then((response) => response.json())
                .then((jsonData) => {
                    const formatDate = (value) => {
                        const date = new Date(value);
                        const options = {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            timeZoneName: "short",
                        };
                        return date.toLocaleString("en-US", options);
                    };
    
                    const dataWithAdditionalFormattedData = jsonData.map((item) => {
                        const tanggalGr = new Date(item.tanggalGr);
                        const tanggalGi = new Date(item.tanggalGi);
                        const selisihTanggal =
                            Math.abs(tanggalGr - tanggalGi) / (1000 * 60 * 60 * 24);
                        const DOI = `${selisihTanggal} Hari`;
                        return {
                            ...item,
                            DOI,
                            tanggalPo: new Date(formatDate(item.tanggalPo)),
                            tanggalGr: new Date(formatDate(item.tanggalGr)),
                            tanggalGi: new Date(formatDate(item.tanggalGi)),
                            inventory: parseFloat(item.inventory).toFixed(3),
                        };
                    });
    
                    setData(dataWithAdditionalFormattedData);
                    setTotalRecords(100);
    
                    // Calculate unique values for the 'namaProjek' property after data is available
                    const uniqueValuesNamaProjek = new Set(dataWithAdditionalFormattedData.map((item) => item.namaProjek));
                    const namaProjekMap = Array.from(uniqueValuesNamaProjek).map((namaProjek) => ({ namaProjek }));
                    setOpsiMultiselectNamaProjek(namaProjekMap);
    
                    // Calculate unique values for the 'namaVendor' property
                    const uniqueValuesNamaVendor = new Set(dataWithAdditionalFormattedData.map((item) => item.namaVendor));
                    const namaVendorMap = Array.from(uniqueValuesNamaVendor).map((namaVendor) => ({ namaVendor }));
                    setOpsiMultiselectNamaVendor(namaVendorMap);

                    const uniqueValuesKodeMaterial = new Set(dataWithAdditionalFormattedData.map((item) => item.kodeMaterial));
                    // Menghasilkan 'namaProjekMap' dari nilai-nilai unik
                    const kodeMaterialMap = Array.from(uniqueValuesKodeMaterial).map((kodeMaterial) => ({ kodeMaterial }));
                    setOpsiMultiselectKodeMaterial(kodeMaterialMap);
    
                    const uniqueValuesNomorPo = new Set(dataWithAdditionalFormattedData.map((item) => item.nomorPo));
                    // Menghasilkan 'namaProjekMap' dari nilai-nilai unik
                    const nomorPoMap = Array.from(uniqueValuesNomorPo).map((nomorPo) => ({ nomorPo }));
                    setOpsiMultiselectNomorPo(nomorPoMap);
    
                    // Continue calculating unique values for other properties (kodeMaterial, nomorPo, etc.)
    
                    // Set the 'field' state
                    const field =
                        dataWithAdditionalFormattedData?.length > 0
                            ? Object.keys(dataWithAdditionalFormattedData[0])
                            : [];
                    setField(field);
    
                    // Stop loading
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                });
        }, Math.random() * 1000 + 250);
    };

    const onPage = (event) => {
        console.log(event);
        setlazyState(event);
    };

    const onSort = (event) => {
        setlazyState(event);
    };

    const onFilter = (event) => {
        console.log(event);
        event['first'] = 0;
        setlazyState(event);
    };

    const onSelectionChange = (event) => {
        const value = event.value;
        console.log(value);

        setSelectedCustomers(value);
        setSelectAll(value.length === totalRecords);
    };

    const onSelectAllChange = (event) => {
        const selectAll = event.checked;

        if (selectAll) {
            setSelectAll(true);
            setSelectedCustomers(data);
        } else {
            setSelectAll(false);
            setSelectedCustomers([]);
        }
    };

    const representativeBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <img alt={rowData.representative.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${rowData.representative.image}`} width={32} />
                <span>{rowData.representative.name}</span>
            </div>
        );
    };

    const countryBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <img alt="flag" src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-${rowData.country.code}`} style={{ width: '24px' }} />
                <span>{rowData.country.name}</span>
            </div>
        );
    };
    
    
    
    
    
    

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        kodeProjek: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        namaProjek: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        statusProjek: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
        namaDivisi: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        namaDepartemen: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        namaMaterialGrup: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        kodeMaterial: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        namaMaterial: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        uom: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        nomorPo: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        tanggalPo: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
        poQuantity: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        poPrice: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        poTotalValue: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        kodeVendor: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        namaVendor: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        kodeGr: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        tanggalGr: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
        grQuantity: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        grValue: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        outstandingGr: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        kodeGi: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        tanggalGi: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
        giQuantity: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        giValue: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        inventory: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        inventorValue: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        DOI: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
    });

    const columns = [
        { field: "kodeProjek", header: "Kode Projek" },
        { field: "namaProjek", header: "Nama Projek" },
        { field: "statusProjek", header: "Status Projek" },
        { field: "namaDivisi", header: "Nama Divisi" },
        { field: "namaDepartemen", header: "Nama Departemen" },
        { field: "namaMaterialGrup", header: "Nama Material Group" },
        { field: "kodeMaterial", header: "Kode Material" },
        { field: "namaMaterial", header: "Nama Material" },
        { field: "poQuantity", header: "Po Quantity" },
        { field: "uom", header: "UOM" },
        { field: "nomorPo", header: "Nomor Po" },
        { field: "tanggalPo", header: "Tanggal Po" },
        { field: "inventory", header: "Inventory" },
        { field: "poPrice", header: "Po Price" },
        { field: "inventorValue", header: "Inventory Value" },
        { field: "poTotalValue", header: "Po Total Value" },
        { field: "kodeVendor", header: "Kode Vendor" },
        { field: "DOI", header: "DOI" },
        { field: "namaVendor", header: "Nama Vendor" },
        { field: "kodeGr", header: "Kode Gr" },
        { field: "tanggalGr", header: "Tanggal Gr" },
        { field: "grQuantity", header: "Gr Quantity" },
        { field: "grValue", header: "Gr value" },
        { field: "outstandingGr", header: "Outstanding Gr" },
        { field: "kodeGi", header: "Kode Gi" },
        { field: "tanggalGi", header: "Tanggal Gi" },
        { field: "giQuantity", header: "Gi Quantity" },
        { field: "giValue", header: "Gi Value" },
    ];

    const [defaultColumns] = useState([
        { field: "namaProjek", header: "Nama Projek" },
        { field: "kodeMaterial", header: "Kode Material" },
        { field: "namaMaterial", header: "Nama Material" },
        { field: "poQuantity", header: "Po Quantity" },
        { field: "uom", header: "UOM" },
        { field: "inventory", header: "Inventory" },
        { field: "poPrice", header: "Po Price" },
        { field: "inventorValue", header: "Inventory Value" },
        { field: "DOI", header: "DOI" },
        { field: "namaVendor", header: "Nama Vendor" },
    ]);

    const [visibleColumns, setVisibleColumns] = useState([...defaultColumns]);
    const [visibleLabelMultiselectNamaProjek, setvisibleLabelMultiselectNamaProjek] = useState([]);
    const [visibleLabelMultiselectNamaVendor, setvisibleLabelMultiselectNamaVendor] = useState([]);
    const [visibleLabelMultiselectKodeMaterial, setvisibleLabelMultiselectKodeMaterial] = useState([]);
    const [visibleLabelMultiselectNomorPo, setvisibleLabelMultiselectNomorPo] = useState([]);

    const [subTotalInventoryValue, setSubTotalInventoryValue] = useState(0);

    const clearFilter = () => {
        initFilters();
    };

    const initFilters = () => {
        const filters = {};
        field.forEach((field) => {
            if (
                field === "tanggalPo" ||
                field === "tanggalGr" ||
                field === "tanggalGi"
            ) {
                filters[field] = {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
                };
            } else {
                filters[field] = {
                    operator: FilterOperator.OR,
                    constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
                };
            }
        });

        filters.global = { value: null, matchMode: FilterMatchMode.CONTAINS };

        setFilters(filters);
        setGlobalFilterValue("");
        setDates(null);
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        // console.log(e);
        let _filters = { ...filters };
        _filters["global"].value = value;
        setGlobalFilterValue(value);
        subTotalInventory();
        setFilters(_filters);
    };

    const onColumnToggle = (event) => {
        // console.log(event);
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol) => sCol.field === col.field));
        console.log(orderedSelectedColumns);
        setVisibleColumns(orderedSelectedColumns);
    };

    const onColumnToggleDate = (event) => {
        let selectedColumns = event.value;
        // console.log(selectedColumns);
        // console.log(typeof selectedColumns);
        // console.log(selectedColumns.toString());
        // console.log(typeof selectedColumns.toString());
        setDates(selectedColumns);

        let constraintValues = null;
        let filter = null;

        let _filters = { ...filters };

        if (selectedColumns[0] && selectedColumns[1]) {
            const startDate = selectedColumns[0].toLocaleDateString();
            const endDate = selectedColumns[1].toLocaleDateString();
            // console.log(startDate);
            // console.log(typeof startDate);
            // console.log(new Date(startDate));
            // console.log(typeof new Date(startDate));

            constraintValues = [
                {
                    value: new Date(startDate),
                    matchMode: FilterMatchMode.DATE_AFTER,
                },
                {
                    value: new Date(endDate),
                    matchMode: FilterMatchMode.DATE_BEFORE,
                },
            ];
        } else if (selectedColumns[0] !== null) {
            const startDate = selectedColumns[0].toLocaleDateString();
            // console.log(startDate);
            // console.log(typeof startDate);
            // console.log(new Date(startDate));
            // console.log(typeof new Date(startDate));

            constraintValues = [
                {
                    value: new Date(startDate),
                    matchMode: FilterMatchMode.DATE_IS,
                },
            ];
        } else {
            constraintValues = [{ value: null, matchMode: FilterMatchMode.DATE_IS }];
        }

        filter = {
            operator: FilterOperator.AND,
            constraints: constraintValues,
        };

        _filters["tanggalPo"] = filter;
        subTotalInventory()
        setFilters(_filters);
    };

    const handleNamaProjekToggle = (event) => {
        let selectedColumns = event.value;
        let filter = null;

        setvisibleLabelMultiselectNamaProjek(selectedColumns);
        const constraintValues = selectedColumns.map((item) => item.namaProjek);
        filter = {
            operator: FilterOperator.OR,
            constraints:
                constraintValues.length > 0
                    ? constraintValues.map((value) => ({
                        value,
                        matchMode: FilterMatchMode.CONTAINS,
                    }))
                    : [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        };

        let updatedFilters = { ...filters };
        updatedFilters["namaProjek"] = filter;
        setFilters(updatedFilters);
    };

    const handleNamaVendorToggle = (event) => {
        let selectedColumns = event.value;
        let filter = null;
        setvisibleLabelMultiselectNamaVendor(selectedColumns);
        const constraintValues = selectedColumns.map((item) => item.namaVendor);
        filter = {
            operator: FilterOperator.OR,
            constraints:
                constraintValues.length > 0
                    ? constraintValues.map((value) => ({
                        value,
                        matchMode: FilterMatchMode.CONTAINS,
                    }))
                    : [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        };

        let updatedFilters = { ...filters };
        updatedFilters["namaVendor"] = filter;
        setFilters(updatedFilters);
    };

    const handleKodeMaterialToggle = (event) => {
        let selectedColumns = event.value;
        let filter = null;
        setvisibleLabelMultiselectKodeMaterial(selectedColumns);
        const constraintValues = selectedColumns.map((item) => item.kodeMaterial);
        filter = {
            operator: FilterOperator.OR,
            constraints:
                constraintValues.length > 0
                    ? constraintValues.map((value) => ({
                        value,
                        matchMode: FilterMatchMode.CONTAINS,
                    }))
                    : [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        };

        let updatedFilters = { ...filters };
        updatedFilters["kodeMaterial"] = filter;
        setFilters(updatedFilters);
    };

    const handleNomorPoToggle = (event) => {
        let selectedColumns = event.value;
        let filter = null;
        setvisibleLabelMultiselectNomorPo(selectedColumns);
        const constraintValues = selectedColumns.map((item) => item.nomorPo);
        filter = {
            operator: FilterOperator.OR,
            constraints:
                constraintValues.length > 0
                    ? constraintValues.map((value) => ({
                        value,
                        matchMode: FilterMatchMode.CONTAINS,
                    }))
                    : [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        };

        let updatedFilters = { ...filters };
        updatedFilters["nomorPo"] = filter;
        setFilters(updatedFilters);
    };

    const calculateColumnMinWidth = (field) => {
        let minWidth = 10; // Lebar minimum default
        if (data) {
            data.map((rowData) => {
                const cellContent = rowData[field];
                // console.log(cellContent);
                if (cellContent && cellContent.length * 10 > minWidth) {
                    // Hitung lebar minimum berdasarkan panjang konten
                    minWidth = cellContent.length * 10;
                }
            });
        }
        return minWidth;
    };
    const calculateHeaderMinWidth = (header) => {
        let minWidth = 10; // Lebar minimum default
        if (columns) {
            columns.map((col) => {
                if (col.header === header) {
                    const cellContent = col.header;
                    if (cellContent && cellContent.length * 10 > minWidth) {
                        // Hitung lebar minimum berdasarkan panjang konten
                        minWidth = cellContent.length * 12;
                    }
                }
            });
        }
        return minWidth;
    };

    const formatDate = (value) => {
        // console.log(value);
        return value.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const dateBodyTemplate = (rowData, field) => {
        // console.log('ini field: ', field.field);
        let value = null;
        // console.log(formatDate(rowData.tanggalPo));
        // console.log(typeof rowData.tanggalPo);
        field.field === "tanggalPo"
            ? (value = formatDate(rowData.tanggalPo))
            : field.field === "tanggalGr"
                ? (value = formatDate(rowData.tanggalGr))
                : field.field === "tanggalGi"
                    ? (value = formatDate(rowData.tanggalGi))
                    : null;

        return value;
    };

    const statusBodyTemplate = (rowData) => {
        return <Text>{rowData.statusProjek}</Text>;
    };

    const divisiBodyTemplate = (rowData) => {
        return <Text>{rowData.namaDivisi}</Text>;
    };

    const dateFilterTemplate = (options) => {
        // console.log(options);
        // console.log(options.value);
        // console.log(typeof options.value);
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

    const statusRowFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statusesName}
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="Select One"
                className="p-column-filter"
                showClear
                style={{ minWidth: "12rem" }}
            />
        );
    };

    const divisiRowFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={divisiName}
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="Select One"
                className="p-column-filter"
                showClear
                style={{ minWidth: "12rem" }}
            />
        );
    };

    const formatCurrency = (value) => {
        const floatValue = parseFloat(value);
        return floatValue.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
        });
    };

    const totalProjek = () => {
        const uniqueProjects = new Set();

        data?.map((project) => {
            uniqueProjects.add(project.namaProjek);
            return project; // Kembalikan project untuk memenuhi sintaksis map
        });

        const total = uniqueProjects.size;

        return total;
    };

    const totalInventoryValue = () => {
        let totalValue = 0;

        data?.map((project) => {
            const inventoryValue = parseFloat(project.inventorValue);
            if (!isNaN(inventoryValue)) {
                totalValue += inventoryValue;
            }
            return project;
        });

        return formatCurrency(totalValue);
    };

    const subTotalInventory = () => {
        let totalValue = 0;

        data?.map((project) => {
            if (matchFilters(project)) {
                const inventoryValue = parseFloat(project.inventorValue);
                if (!isNaN(inventoryValue)) {
                    totalValue += inventoryValue;
                }
            }
        });

        setSubTotalInventoryValue(formatCurrency(totalValue));
    };

    // const matchFilters = (project) => {
    //     const globalFilter = filters.global.value;
    //     const namaProjekFilter = filters.namaProjek.constraints;
    //     const namaVendorFilter = filters.namaVendor.constraints;

    //     const isGlobalMatch =
    //         globalFilter == null ||
    //         project.namaProjek.toLowerCase().includes(globalFilter.toLowerCase()) ||
    //         project.namaVendor.toLowerCase().includes(globalFilter.toLowerCase());

    //     const isNamaProjekMatch = namaProjekFilter.some((filter) => filter.value === null || project.namaProjek.toLowerCase().includes(filter.value.toLowerCase()));
    //     const isNamaVendorMatch = namaVendorFilter.some((filter) => filter.value === null || project.namaVendor.toLowerCase().includes(filter.value.toLowerCase()));

    //     return (isGlobalMatch && isNamaProjekMatch && isNamaVendorMatch);
    // };
    const matchFilters = (project) => {
        const globalFilter = filters.global.value;
        const namaProjekFilter = filters.namaProjek.constraints;
        const namaVendorFilter = filters.namaVendor.constraints;
        const nomorPoFilter = filters.nomorPo.constraints;
        const kodeMaterialFilter = filters.kodeMaterial.constraints;
        // const tanggalPoFilter = filters.tanggalPo.constraints;
      
        const isGlobalMatch =
          globalFilter == null ||
          project.namaProjek.toLowerCase().includes(globalFilter.toLowerCase()) ||
          project.namaVendor.toLowerCase().includes(globalFilter.toLowerCase()) ||
          project.nomorPo.toLowerCase().includes(globalFilter.toLowerCase()) ||
          project.kodeMaterial.toLowerCase().includes(globalFilter.toLowerCase()) 
        //   project.tanggalPo.includes(globalFilter.toLowerCase());
      
        const isNamaProjekMatch = namaProjekFilter.some((filter) =>
          filter.value === null || project.namaProjek.toLowerCase().includes(filter.value.toLowerCase())
        );
        const isNamaVendorMatch = namaVendorFilter.some((filter) =>
          filter.value === null || project.namaVendor.toLowerCase().includes(filter.value.toLowerCase())
        );
        const isNomorPoMatch = nomorPoFilter.some((filter) =>
          filter.value === null || project.nomorPo.toLowerCase().includes(filter.value.toLowerCase())
        );
        const isKodeMaterialMatch = kodeMaterialFilter.some((filter) =>
          filter.value === null || project.kodeMaterial.toLowerCase().includes(filter.value.toLowerCase())
        );
        // const isTanggalPoMatch = tanggalPoFilter.some((filter) =>
        // //   filter.value === null || project.tanggalPo.includes(filter.value)
        // console.log(project.tanggalPo)
        // );
        // const isTanggalPoMatch = tanggalPoFilter.some((filter) =>{
        //     const startDate = filters.tanggalPo.constraints[0].value
        //     const endDate = filters.tanggalPo.constraints[1].value
        // });
        // console.log('startdate: '+ startDate);
        // if (filter.value !== null) {
            
        // }
        // console.log(filters.tanggalPo.constraints[0])
        // filter.value === null || formatDate(project.tanggalPo).includes(filter.value)
      
        return (isGlobalMatch && isNamaProjekMatch && isNamaVendorMatch && isNomorPoMatch && isKodeMaterialMatch);
      };
      
      


    const header = (
        <div className="flex justify-between items-center py-5">
            <div className="p-float-label grow max-w-[15rem] min-w-max">
                <Calendar
                    showIcon
                    inputId="date"
                    className="w-full"
                    value={dates}
                    onChange={onColumnToggleDate}
                    selectionMode="range"
                    readOnlyInput
                />
                <label htmlFor="date">Tanggal Po</label>
            </div>

            <div className="grow flex justify-center items-center">
                <span className="p-input-icon-left mr-3 w-1/2">
                    <i className="pi pi-search" />
                    <InputText
                        className="w-full"
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Keyword Search"
                    />
                </span>
                <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label="Clear"
                    outlined
                    onClick={clearFilter}
                />
            </div>

            <div className="flex align-items-center justify-content-end gap-2 max-w-[15rem] min-w-max grow">
                {/* <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
                <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
                <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" /> */}
            </div>
        </div>
    );

    const footer = (
        <div className="flex justify-between items-center">
            <div>
                <Text>Total Projek: {totalProjek()} </Text>
            </div>

            <div>
                <Text>Sub Total Inventory Value: {subTotalInventoryValue} </Text>
            </div>

            <div>
                <Text>Total Inventory Value: {totalInventoryValue()} </Text>
            </div>
        </div>
    );

    // const dt = useRef(null);

    // const cols = [
    //     { field: 'code', header: 'Code' },
    //     { field: 'name', header: 'Name' },
    //     { field: 'category', header: 'Category' },
    //     { field: 'quantity', header: 'Quantity' }
    // ];

    // const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    // const exportCSV = (selectionOnly) => {
    //     dt.current.exportCSV({ selectionOnly });
    // };

    // const exportPdf = () => {
    //     import('jspdf').then((jsPDF) => {
    //         import('jspdf-autotable').then(() => {
    //             const doc = new jsPDF.default(0, 0);

    //             doc.autoTable(exportColumns, products);
    //             doc.save('products.pdf');
    //         });
    //     });
    // };

    // const exportExcel = () => {
    //     import('xlsx').then((xlsx) => {
    //         const worksheet = xlsx.utils.json_to_sheet(products);
    //         const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    //         const excelBuffer = xlsx.write(workbook, {
    //             bookType: 'xlsx',
    //             type: 'array'
    //         });

    //         saveAsExcelFile(excelBuffer, 'products');
    //     });
    // };

    // const saveAsExcelFile = (buffer, fileName) => {
    //     import('file-saver').then((module) => {
    //         if (module && module.default) {
    //             let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    //             let EXCEL_EXTENSION = '.xlsx';
    //             const data = new Blob([buffer], {
    //                 type: EXCEL_TYPE
    //             });

    //             module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    //         }
    //     });
    // };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch(
    //                 `http://localhost:4000/api/v1/inventory/data`
    //             );
    //             const jsonData = await response.json();
    //             const formatDate = (value) => {
    //                 const date = new Date(value);
    //                 const options = {
    //                     weekday: "short",
    //                     year: "numeric",
    //                     month: "short",
    //                     day: "numeric",
    //                     hour: "2-digit",
    //                     minute: "2-digit",
    //                     second: "2-digit",
    //                     timeZoneName: "short",
    //                 };
    //                 return date.toLocaleString("en-US", options);
    //             };

    //             const dataWithAdditionalFormattedData = jsonData.map((item) => {
    //                 const tanggalGr = new Date(item.tanggalGr);
    //                 const tanggalGi = new Date(item.tanggalGi);
    //                 const selisihTanggal =
    //                     Math.abs(tanggalGr - tanggalGi) / (1000 * 60 * 60 * 24);
    //                 const DOI = `${selisihTanggal} Hari`;
    //                 return {
    //                     ...item,
    //                     DOI,
    //                     tanggalPo: new Date(formatDate(item.tanggalPo)),
    //                     tanggalGr: new Date(formatDate(item.tanggalGr)),
    //                     tanggalGi: new Date(formatDate(item.tanggalGi)),
    //                     inventory: parseFloat(item.inventory).toFixed(3),
    //                     // inventory: parseFloat(item.inventory)
    //                 };
    //             });
    //             setData(dataWithAdditionalFormattedData);

    //             // Menghitung nilai unik dari properti 'namaProjek' setelah data tersedia
    //             const uniqueValuesNamaProjek = new Set(dataWithAdditionalFormattedData.map((item) => item.namaProjek));
    //             // Menghasilkan 'namaProjekMap' dari nilai-nilai unik
    //             const namaProjekMap = Array.from(uniqueValuesNamaProjek).map((namaProjek) => ({ namaProjek }));
    //             setOpsiMultiselectNamaProjek(namaProjekMap);

    //             const uniqueValuesNamaVendor = new Set(dataWithAdditionalFormattedData.map((item) => item.namaVendor));
    //             // Menghasilkan 'namaProjekMap' dari nilai-nilai unik
    //             const namaVendorMap = Array.from(uniqueValuesNamaVendor).map((namaVendor) => ({ namaVendor }));
    //             setOpsiMultiselectNamaVendor(namaVendorMap);

    //             const uniqueValuesKodeMaterial = new Set(dataWithAdditionalFormattedData.map((item) => item.kodeMaterial));
    //             // Menghasilkan 'namaProjekMap' dari nilai-nilai unik
    //             const kodeMaterialMap = Array.from(uniqueValuesKodeMaterial).map((kodeMaterial) => ({ kodeMaterial }));
    //             setOpsiMultiselectKodeMaterial(kodeMaterialMap);

    //             const uniqueValuesNomorPo = new Set(dataWithAdditionalFormattedData.map((item) => item.nomorPo));
    //             // Menghasilkan 'namaProjekMap' dari nilai-nilai unik
    //             const nomorPoMap = Array.from(uniqueValuesNomorPo).map((nomorPo) => ({ nomorPo }));
    //             setOpsiMultiselectNomorPo(nomorPoMap);

    //             const field =
    //                 dataWithAdditionalFormattedData?.length > 0
    //                     ? Object.keys(dataWithAdditionalFormattedData[0])
    //                     : [];
    //             setField(field);

    //             // Menghentikan status loading
    //             setLoading(false);
    //         } catch (error) {
    //             console.log("Error fetching data:", error);
    //         }
    //     };

    //     fetchData(); // Panggil fetchData saat komponen pertama kali dirender
    // }, []);

    useEffect(() => {
        subTotalInventory();
        // console.log(data);
        console.log(filters);
    }, [data, filters]);

    useEffect(() => {
        // Fungsi ini akan dijalankan ketika data berubah
        // Anda dapat menggunakan ref untuk mengakses nilai dalam Column
        if (data) {
            const newColumnMinWidths = {};
            const newHeaderMinWidths = {};
            visibleColumns.map((col) => {
                // console.log(col.header);
                newColumnMinWidths[col.field] = calculateColumnMinWidth(col.field);
                newHeaderMinWidths[col.header] = calculateHeaderMinWidth(col.header);
            });
            setColumnMinWidths(newColumnMinWidths);
            // setHeaderMinWidths(newHeaderMinWidths);
            // console.log(newColumnMinWidths);
            // console.log(newHeaderMinWidths);
        }
    }, [data, visibleColumns]);

    useEffect(() => {
        // Fungsi ini akan dijalankan ketika data berubah
        // Anda dapat menggunakan ref untuk mengakses nilai dalam Column
        if (data) {
            const newHeaderMinWidths = {};
            columns.map((col) => {
                newHeaderMinWidths[col.header] = calculateHeaderMinWidth(col.header);
            });
            setHeaderMinWidths(newHeaderMinWidths);
            // console.log(newHeaderMinWidths);
        }
    }, [data]);

    return (
        <div className="card">
            <DataTable value={data} lazy filterDisplay="row" dataKey="id" paginator
                    first={lazyState.first} rows={10} totalRecords={totalRecords} onPage={onPage}
                    onSort={onSort} sortField={lazyState.sortField} sortOrder={lazyState.sortOrder}
                    onFilter={onFilter} filters={lazyState.filters} loading={loading} tableStyle={{ minWidth: '75rem' }}
                    selection={selectedCustomers} onSelectionChange={onSelectionChange} selectAll={selectAll} onSelectAllChange={onSelectAllChange}>
                {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} /> */}
                <Column field="namaProjek" header="Name" sortable filter filterPlaceholder="Search" />
                {/* <Column field="company" sortable filter header="Company" filterPlaceholder="Search" /> */}
            </DataTable>
        </div>
        // <div className="card">
        //     <Panel header="All Data" className="m-9" toggleable>
        //         <div className="card">
        //             <Fieldset legend="Filter" className="px-7 pb-7" toggleable>
        //                 <div className="card">
        //                     <div className="flex justify-between items-center w-full pt-4 space-x-5">
        //                         <div className="p-float-label grow">
        //                             <MultiSelect
        //                                 filter
        //                                 resetFilterOnHide
        //                                 maxSelectedLabels={9}
        //                                 value={visibleColumns}
        //                                 options={columns}
        //                                 optionLabel="header"
        //                                 onChange={onColumnToggle}
        //                                 className="w-full sm:w-20rem"
        //                                 display="chip"
        //                             />
        //                             <label htmlFor="ms-cities">Column</label>
        //                         </div>
        //                     </div>
        //                     <div className="flex justify-between items-center w-full pt-8 space-x-5">
        //                         <div className="p-float-label grow max-w-[53rem]">
        //                             <MultiSelect
        //                                 filter
        //                                 resetFilterOnHide
        //                                 maxSelectedLabels={3}
        //                                 value={visibleLabelMultiselectNamaProjek}
        //                                 options={opsiMultiselectNamaProjek}
        //                                 optionLabel="namaProjek"
        //                                 onChange={handleNamaProjekToggle}
        //                                 className="w-full sm:w-20rem"
        //                                 display="chip"
        //                             />
        //                             <label htmlFor="ms-cities">Nama Projek</label>
        //                         </div>
        //                         <div className="p-float-label grow max-w-[51rem] ">
        //                             <MultiSelect
        //                                 filter
        //                                 resetFilterOnHide
        //                                 maxSelectedLabels={3}
        //                                 value={visibleLabelMultiselectNamaVendor}
        //                                 options={opsiMultiselectNamaVendor}
        //                                 optionLabel="namaVendor"
        //                                 onChange={handleNamaVendorToggle}
        //                                 className="w-full sm:w-20rem"
        //                                 display="chip"
        //                             />
        //                             <label htmlFor="ms-cities">Nama Vendor</label>
        //                         </div>
        //                     </div>
        //                     <div className="flex justify-between items-center w-full pt-8 space-x-5">
        //                         <div className="p-float-label grow max-w-[53rem]">
        //                             <MultiSelect
        //                                 filter
        //                                 resetFilterOnHide
        //                                 maxSelectedLabels={6}
        //                                 value={visibleLabelMultiselectKodeMaterial}
        //                                 options={opsiMultiselectKodeMaterial}
        //                                 optionLabel="kodeMaterial"
        //                                 onChange={handleKodeMaterialToggle}
        //                                 className="w-full sm:w-20rem overflow-y-auto"
        //                                 display="chip"
        //                             />
        //                             <label htmlFor="ms-cities">Kode Material</label>
        //                         </div>
        //                         <div className="p-float-label grow max-w-[51rem]">
        //                             <MultiSelect
        //                                 filter
        //                                 resetFilterOnHide
        //                                 maxSelectedLabels={6}
        //                                 value={visibleLabelMultiselectNomorPo}
        //                                 options={opsiMultiselectNomorPo}
        //                                 optionLabel="nomorPo"
        //                                 onChange={handleNomorPoToggle}
        //                                 className="w-full sm:w-20rem"
        //                                 display="chip"
        //                             />
        //                             <label htmlFor="ms-cities">Nomor PO</label>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </Fieldset>
        //         </div>
        //         <DataTable
        //             scrollable
        //             columnResizeMode="expand"
        //             resizableColumns
        //             showGridlines
        //             removableSort
        //             dataKey="id"
        //             value={data}
        //             sortMode="multiple"
        //             scrollHeight="1000px"
        //             filters={filters}
        //             size={"small"}
        //             paginator
        //             rows={10}
        //             rowsPerPageOptions={[5, 10, 20, 50, 100]}
        //             header={header}
        //             footer={footer}
        //             loading={loading}
        //             emptyMessage="No data found."
        //             globalFilterFields={field}
        //         >
        //             {visibleColumns.map((col) =>
        //                 col.field === "namaProjek" || col.field === "namaVendor" ? (
        //                     <Column
        //                         key={col.field}
        //                         field={col.field}
        //                         header={col.header}
        //                         filterMenuStyle={{ width: "auto" }}
        //                         filter
        //                         style={{ minWidth: `${columnMinWidths[col.field]}px` }}
        //                         sortable
        //                     />
        //                 ) : col.field === "uom" ? (
        //                     <Column
        //                         key={col.field}
        //                         field={col.field}
        //                         header={col.header}
        //                         filterMenuStyle={{ width: "auto" }}
        //                         filter
        //                         style={{ minWidth: `${columnMinWidths[col.field]}px` }}
        //                         sortable
        //                     />
        //                 ) : col.field === "poQuantity" || col.field === "inventory" ? (
        //                     <Column
        //                         key={col.field}
        //                         field={col.field}
        //                         header={col.header}
        //                         filterMenuStyle={{ width: "auto" }}
        //                         filter
        //                         style={{
        //                             minWidth: `${columnMinWidths[col.field]}px`,
        //                             textAlign: "right",
        //                         }}
        //                         sortable
        //                         body={(rowData) => {
        //                             const formatDecimal = parseFloat(rowData[col.field]).toFixed(
        //                                 3
        //                             );
        //                             const formattedValue = parseFloat(
        //                                 formatDecimal
        //                             ).toLocaleString("id-ID", {
        //                                 style: "currency",
        //                                 currency: "IDR",
        //                                 minimumFractionDigits: 3,
        //                                 maximumFractionDigits: 3,
        //                             });
        //                             const value = formattedValue.replace("Rp", "");
        //                             // return formatDecimal;
        //                             return value;
        //                         }}
        //                     />
        //                 ) : col.field === "tanggalPo" ? (
        //                     <Column
        //                         key={col.field}
        //                         field={col.field}
        //                         header={col.header}
        //                         filterField="tanggalPo"
        //                         dataType="date"
        //                         style={{ minWidth: `${columnMinWidths[col.field]}px` }}
        //                         body={dateBodyTemplate}
        //                         filter
        //                         filterElement={dateFilterTemplate}
        //                         sortable
        //                     />
        //                 ) : col.field === "tanggalGi" ? (
        //                     <Column
        //                         key={col.field}
        //                         field={col.field}
        //                         header={col.header}
        //                         filterField="tanggalGi"
        //                         dataType="date"
        //                         style={{ minWidth: `${columnMinWidths[col.field]}px` }}
        //                         body={dateBodyTemplate}
        //                         filter
        //                         filterElement={dateFilterTemplate}
        //                         sortable
        //                     />
        //                 ) : col.field === "tanggalGr" ? (
        //                     <Column
        //                         key={col.field}
        //                         field={col.field}
        //                         header={col.header}
        //                         filterField="tanggalGr"
        //                         dataType="date"
        //                         style={{ minWidth: `${columnMinWidths[col.field]}px` }}
        //                         body={dateBodyTemplate}
        //                         filter
        //                         filterElement={dateFilterTemplate}
        //                         sortable
        //                     />
        //                 ) : col.field === "statusProjek" ? (
        //                     <Column
        //                         key={col.field}
        //                         field={col.field}
        //                         header={col.header}
        //                         filterMenuStyle={{ width: "14rem" }}
        //                         style={{ minWidth: "12rem" }}
        //                         body={statusBodyTemplate}
        //                         filter
        //                         filterElement={statusRowFilterTemplate}
        //                         showFilterMenu={true}
        //                     />
        //                 ) : col.field === "namaDivisi" ? (
        //                     <Column
        //                         key={col.field}
        //                         field={col.field}
        //                         header={col.header}
        //                         filterMenuStyle={{ width: "14rem" }}
        //                         style={{ minWidth: "12rem" }}
        //                         body={divisiBodyTemplate}
        //                         filter
        //                         filterElement={divisiRowFilterTemplate}
        //                         showFilterMenu={true}
        //                     />
        //                 ) : col.field === "poPrice" ||
        //                     col.field === "inventorValue" ||
        //                     col.field === "poTotalValue" ? (
        //                     <Column
        //                         key={col.field}
        //                         field={col.field}
        //                         header={col.header}
        //                         filterMenuStyle={{ width: "auto" }}
        //                         filter
        //                         style={{
        //                             minWidth: `${columnMinWidths[col.field]}px`,
        //                             textAlign: "right",
        //                         }}
        //                         sortable
        //                         // body={(rowData) => (formatCurrency(rowData[col.field]) + ' = ' +  formatCurrency( Math.floor( parseFloat( rowData[col.field]) )))}
        //                         body={(rowData) =>
        //                             formatCurrency(Math.floor(parseFloat(rowData[col.field])))
        //                         }
        //                     />
        //                 ) : (
        //                     <Column
        //                         key={col.field}
        //                         field={col.field}
        //                         header={col.header}
        //                         showFilterMenu={true}
        //                         filterMenuStyle={{ width: "auto" }}
        //                         filter
        //                         filterPlaceholder="Search"
        //                         style={{ minWidth: `${headerMinWidths[col.header]}px` }}
        //                         sortable
        //                     />
        //                 )
        //             )}
        //         </DataTable>
        //     </Panel>
        // </div>
    );
}
