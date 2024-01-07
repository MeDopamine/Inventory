import { Request, Response } from "express";
import User from "../db/models/user";
import Vendor from "../db/models/vendor";
import Inventory from "../db/models/inventory";
import path from "path";
import fs from "fs";
import { UploadedFile } from "express-fileupload";
import xlsx from "xlsx";
import { Op } from "sequelize"
import { Sequelize } from "sequelize";
import databaseConfig from "../config/database";
// import t from "../config/transaction"

const inventoryContorller = {
    getTest: async (req: Request, res: Response) => {
        const indexPath = path.join(__dirname, "..", "index.html");
        return res.status(200).sendFile(indexPath);
    },
    getData: async (req: Request, res: Response) => {
        try {
            const response = await Inventory.findAll();
            console.log(response);
            
            res.json(response);
            // res.json({
            //     data: response,
            //     totalRecords: 100
            // });
        } catch (error) {
            console.log(error);
        }
    },
    saveData: async (req: Request, res: Response) => {
        const uploadedFile = req.files?.file as UploadedFile | undefined;

        if (!uploadedFile) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Dapatkan ekstensi file
        const ext = path.extname(uploadedFile.name);
        const fileName = path.basename(uploadedFile.name, ext);
        const currentTime = new Date();
        const hours = String(currentTime.getHours()).padStart(2, "0");
        const minutes = String(currentTime.getMinutes()).padStart(2, "0");
        const timeString = `${hours}-${minutes}`;

        // Buat nama unik untuk file dengan menggabungkan tanggal dan ekstensi
        const uniqueFileName = `${fileName}_${currentTime.toISOString().split("T")[0]}_${timeString}${ext}`;

        // Buat path lengkap untuk menyimpan file
        const filePath = `./public/files/${uniqueFileName}`;

        // Simpan file ke server menggunakan fs
        uploadedFile.mv(filePath, async (err) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            console.log(`File saved as ${filePath}`);

            // Baca file Excel yang baru saja diunggah
            const workbook = xlsx.readFile(filePath);

            // Assuming that the first sheet in the Excel file contains the data
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert the sheet to JSON
            const jsonData: any[] = xlsx.utils.sheet_to_json(sheet);
            console.log(`Convert the sheet to JSON: ${jsonData}`);
            // console.log('Convert the sheet to JSON: '+jsonData);

            // const sequelize = new Sequelize(databaseConfig);

            const propertiesToCheck = ["kodeProjek" /* tambahkan properti lainnya */];
            const isDataValid = jsonData.every((data) => propertiesToCheck.every((prop) => data.hasOwnProperty(prop)));

            if (!isDataValid) {
                console.log(`"Data is incomplete"`);
                fs.unlink(filePath, (err) => {
                    if (err) throw err;
                    console.log(`${filePath} was deleted`);
                });
                return res.status(400).json({ error: "Data is incomplete" });
            }

            try {
                const inventoryPromises = jsonData.map((data) => ({
                    kodeProjek: data.kodeProjek,
                    namaProjek: data.namaProjek,
                    statusProjek: data.statusProjek,
                    koedDivisi: data.koedDivisi,
                    namaDivisi: data.namaDivisi,
                    kodeDepartemen: data.kodeDepartemen,
                    namaDepartemen: data.namaDepartemen,
                    kodeMaterialGrup: data.kodeMaterialGrup,
                    namaMaterialGrup: data.namaMaterialGrup,
                    kodeMaterial: data.kodeMaterial,
                    namaMaterial: data.namaMaterial,
                    uom: data.uom,
                    nomorPo: data.nomorPo,
                    tanggalPo: data.tanggalPo,
                    poQuantity: data.poQuantity, // Mengganti koma dengan titik
                    poPrice: data.poPrice, // Mengganti koma dengan titik
                    poTotalValue: data.poTotalValue,
                    kodeVendor: data.kodeVendor,
                    namaVendor: data.namaVendor,
                    kodeGr: data.kodeGr,
                    tanggalGr: data.tanggalGr,
                    grQuantity: data.grQuantity, // Mengganti koma dengan titik
                    grValue: data.grValue, // Mengganti koma dengan titik
                    outstandingGr: data.outstandingGr, // Mengganti koma dengan titik
                    kodeGi: data.kodeGi,
                    tanggalGi: data.tanggalGi,
                    giQuantity: data.giQuantity, // Mengganti koma dengan titik
                    giValue: data.giValue, // Mengganti koma dengan titik
                    inventory: data.inventory, // Mengganti koma dengan titik
                    inventorValue: data.inventorValue, // Mengganti koma dengan titik
                }));

            //     console.log(`'inventoryPromises: ' ${inventoryPromises}`);
            //     const batchSize = 2;
            //     const totalBatches = Math.ceil(inventoryPromises.length / batchSize);

            //     // Mulai transaksi
            //     const transaction = await t
            //     // const t = await sequelize.transaction();

            //     try {
            //         for (let i = 0; i < totalBatches; i++) {
            //             const startIndex = i * batchSize;
            //             const endIndex = startIndex + batchSize;
            //             const batch = inventoryPromises.slice(startIndex, endIndex);

            //             await Inventory.bulkCreate(batch, { transaction: transaction });
            //         }

            //         // Commit transaksi jika berhasil
            //         await t.commit();

            //         res.status(200).json({
            //             message: "File uploaded and data inserted into the database successfully",
            //             inventoryPromises: inventoryPromises
            //         });
            //     } catch (error) {
            //         // Rollback transaksi jika terjadi kesalahan
            //         await t.rollback();
            //         console.log("Error in batch data insertion:", error);
            //         return res.status(500).json({
            //             message: "File failed to upload",
            //         });
            //     }
            // } catch (error) {
            //     fs.unlink(filePath, (err) => {
            //         if (err) throw err;
            //         console.log(`${filePath} was deleted`);
            //     });
            //     console.log(error);
            //     return res.status(500).json({
            //         message: "File failed to upload",
            //     });
            // }

                console.log(`'inventoryPromises: ' ${inventoryPromises}`);
                const batchSize = 1200;
                const totalBatches = Math.ceil(inventoryPromises.length / batchSize);
                for (let i = 0; i < totalBatches; i++) {
                        const startIndex = i * batchSize;
                        const endIndex = startIndex + batchSize;
                        const batch = inventoryPromises.slice(startIndex, endIndex);
        
                        try {
                            await Inventory.bulkCreate(batch);
                        } catch (error) {
                            // Handle error here (misalnya, Anda dapat melakukan rollback transaksi jika ada kesalahan)
                            // Anda juga dapat memberikan pesan error khusus dalam response jika Anda ingin
                            console.log("Error in batch data insertion:", error);
                        }
                    }
                // const batch = inventoryPromises.slice(0, 2);
                // Masukkan data User dan Vendor dalam satu transaksi
                // await Inventory.bulkCreate(inventoryPromises);

                res.status(200).json({
                    message: "File uploaded and data inserted into the database successfully",
                    inventoryPromises: inventoryPromises
                });
            } catch (error) {
                fs.unlink(filePath, (err) => {
                    if (err) throw err;
                    console.log(`${filePath} was deleted`);
                });
                console.log(error);
                // console.log("File failed to uploaded");
                
                return res.status(500).json({
                    message: "File failed to uploaded",
                });
            }

            
            
        });
    },
};

export default inventoryContorller;
