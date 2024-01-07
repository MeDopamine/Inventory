import React, { useEffect, useState } from "react";
import { PopupModal } from "../components/PopupModal";
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputText } from "primereact/inputtext"
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { SelectButton } from 'primereact/selectbutton';
import { Center, Grid, GridItem, Box, Table, Thead, Tr, Td, Tbody, Select, Text } from "@chakra-ui/react";

const Home = () => {
    const [data, setData] = useState(null);
    const [isEdit, setIsEdit] = useState("");
    const [isRefresh, setIsRefresh] = useState(false);
    const [idEdit, setIdEdit] = useState();
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    console.log(filters);
    // console.log(filters);
    const columns = [
        { field: 'id', header: 'id' },
        { field: 'kodeProjek', header: 'Kode Projek' },
        { field: 'namaProjek', header: 'Nama Projek' },
        { field: 'inventorValue', header: 'Inventory Value' }
    ];
    const [sizeOptions] = useState([
        { label: 'Small', value: 'small' },
        { label: 'Normal', value: 'normal' },
        { label: 'Large', value: 'large' }
    ]);
    const [size, setSize] = useState(sizeOptions[1].value);
    useEffect(() => {
        fetchData();
        setIsEdit("");
    }, [isRefresh]);

    const fetchData = async () => {
        try {
            // const response = await fetch(`http://localhost:5000/products`);
            const response = await fetch(`http://localhost:4001/api/v1/inventory/data`);
            // const response = await fetch(`https://services.rwahyus.online/api/v1/products`);
            const jsonData = await response.json();
            console.log(jsonData);
            setData(jsonData);
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    };

    // const filteredData = data?.filter((data) => data.namaProjek === "Akses Tol Makassar New Port" && data.nomorPo === "4110001424" );

    const handleEditModals = (status, id) => {
        setIsEdit(status);
        setIdEdit(id);
    };

    // Menjumlahkan nilai grValue dari semua entitas data
    // const totalInventoryValue = data?.reduce((total, item) => {
    // // Konversi grValue ke float dan tambahkan ke total
    // console.log( parseFloat(item.inventoryValue));
    // return total + parseFloat(item.inventoryValue);
    // }, 0); // Nilai awal total adalah 0

    const totalInventoryValue = data?.reduce((accumulator, currentValue) => {
        // console.log(currentValue.inventorValue);
        // Pastikan currentValue adalah objek yang memiliki properti 'value' yang valid
        return accumulator + parseFloat(currentValue.inventorValue);
        // if ( currentValue !== null && 'inventoryValue' in currentValue) {
        //   return accumulator + parseFloat(currentValue.inventorValue);
        // } else {
        //   return accumulator;
        // }
    }, 0);
    const headerTable = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Data Inventory Wika</span>
        </div>
    );
    const footerTable = `In total there are ${data ? data.length : 0} products.`;

    return (
        <Box className="w-full">
            <Text>total summary inventory value: {totalInventoryValue}</Text>
            <Box p={4} mt={3} mb={20}>

                <InputText
                    onInput={(e) => setFilters({ global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS }, })}
                />
                <Box className="test-table-container">
                    <div className="flex justify-center mb-4">
                        <SelectButton value={size} onChange={(e) => setSize(e.value)} options={sizeOptions} />
                    </div>
                    <DataTable
                        value={data}
                        size={size}
                        // sortMode="multiple"
                        filters={filters}
                        // header={headerTable}
                        // footer={footerTable}
                        showGridlines
                        paginator
                        rows={5}
                        rowsPerPageOptions={[5, 10, 20, 100]}
                        totalRecords={1}
                    >
                        <Column field="id" header="No" filter filterPlaceholder="Search by nama projek" sortable/>
                    <Column field="kodeProjek" header="Kode Projek" sortable/>
                    <Column field="namaProjek" header="Nama Projek" sortable/>
                    <Column field="inventorValue" header="Inventory Value" sortable/>
                        {/* {columns?.map((col, i) => (
                            <Column key={col.field}  field={col.field} header={col.header} />
                        ))} */}

                    </DataTable>

                    {/* <Table variant="striped" colorScheme="gray" rounded="md" borderRadius='md' size='sm' className="test-table">
                    <Thead bg="blue.300" >
                        <Tr fontWeight='bold'>
                            <Td>No</Td>
                            <Td>kodeProjek</Td>
                            <Td>namaProjek</Td>
                            <Td>statusProjek</Td>
                            <Td>koedDivisi</Td>
                            <Td>namaDivisi</Td>
                            <Td>kodeDepartemen</Td>
                            <Td>namaDepartemen</Td>
                            <Td>kodeMaterialGrup</Td>
                            <Td>namaMaterialGrup</Td>
                            <Td>kodeMaterial</Td>
                            <Td>uom</Td>
                            <Td>nomorPo</Td>
                            <Td>tanggalPo</Td>
                            <Td>poQuantity</Td>
                            <Td>poPrice</Td>
                            <Td>poTotalValue</Td>
                            <Td>kodeVendor</Td>
                            <Td>namaVendor</Td>
                            <Td>kodeGr</Td>
                            <Td>tanggalGr</Td>
                            <Td>grQuantity</Td> 
                            <Td>grValue</Td>
                            <Td>outstandingGr</Td>
                            <Td>kodeGi</Td>
                            <Td>formattedTanggalGi</Td>
                            <Td>giQuantity</Td>
                            <Td>giValue</Td>
                            <Td>inventory</Td>
                            <Td>inventorValue</Td>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredData?.map((data, index) => (
                            <Tr key={data.id}>
                                <Td>{index + 1}</Td>
                                <Td>{data.kodeProjek}</Td>
                                <Td>{data.namaProjek}</Td>
                                <Td>{data.statusProjek}</Td>
                                <Td>{data.koedDivisi}</Td>
                                <Td>{data.namaDivisi}</Td>
                                <Td>{data.kodeDepartemen}</Td>
                                <Td>{data.namaDepartemen}</Td>
                                <Td>{data.kodeMaterialGrup}</Td>
                                <Td>{data.namaMaterialGrup}</Td>
                                <Td>{data.kodeMaterial}</Td>
                                <Td>{data.uom}</Td>
                                <Td>{data.nomorPo}</Td>
                                <Td>{new Date(data.tanggalPo).toLocaleDateString()}</Td> 
                                <Td>{data.poPrice}</Td>
                                <Td>{data.poTotalValue}</Td>
                                <Td>{data.kodeVendor}</Td>
                                <Td>{data.namaVendor}</Td>
                                <Td>{data.kodeGr}</Td>
                                <Td>{new Date(data.tanggalGr).toLocaleDateString()}</Td> 
                                <Td>{data.grQuantity}</Td> 
                                
                                <Td>{parseFloat(data.grQuantity)*parseFloat(data.poPrice)}</Td>
                                <Td>{data.outstandingGr}</Td>
                                <Td>{data.kodeGi}</Td>
                                <Td>{new Date(data.tanggalGi).toLocaleDateString()}</Td>
                                <Td>{data.giQuantity}</Td>
                                <Td>{data.giValue}</Td>
                                <Td>{data.inventory}</Td>
                                <Td>{typeof parseFloat(data.inventorValue)}</Td> 
                            </Tr>
                        ))}
                    </Tbody>
                </Table> */}

                </Box>

            </Box>

            <PopupModal
                isRefresh={isRefresh}
                setIsRefresh={setIsRefresh}
                isEdit={isEdit}
                idEdit={idEdit}
            />
        </Box>
    );
};

export default Home;
