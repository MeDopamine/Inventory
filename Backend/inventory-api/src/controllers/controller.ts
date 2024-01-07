import { Request, Response } from "express";
import User from "../db/models/user";
import Vendor from "../db/models/vendor";
import path from "path";
import fs from "fs";
import { UploadedFile } from "express-fileupload";
import xlsx from "xlsx";
import {Op} from "sequelize"

const UserController = {
    getTest: async (req: Request, res: Response) => {
        const indexPath = path.join(__dirname, "..", "index.html");
        return res.status(200).sendFile(indexPath);
    },
    getData: async (req: Request, res: Response) => {
        try {
            const response = await Vendor.findAll();
            res.json(response);
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
        const uniqueFileName = `${fileName}_${currentTime.toISOString().split("T")[0]
            }_${timeString}${ext}`;

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

            const propertiesToCheck = ["firstName", "lastName", "nik", "namaVendor", "kodeVendor" /* tambahkan properti lainnya */];
            const isDataValid = jsonData.every((data) => propertiesToCheck.every((prop) => data.hasOwnProperty(prop)));

            if (!isDataValid) {
                console.log("Data is incomplete");
                fs.unlink(filePath, (err) => {
                    if (err) throw err;
                    console.log(`${filePath} was deleted`);
                });
                return res.status(400).json({ error: "Data is incomplete" });
            }

            try {
                const existingUsers = await User.findAll({
                    where: {
                        [Op.or]: jsonData.map((data) => ({
                            firstName: data.firstName,
                            lastName: data.lastName,
                            nik: data.nik,
                        })),
                    },
                });
        
                const existingVendors = await Vendor.findAll({
                    where: {
                        [Op.or]: jsonData.map((data) => ({
                            namaVendor: data.namaVendor,
                            kodeVendor: data.kodeVendor,
                        })),
                    },
                });
                const userPromises = jsonData
                    .map((data) => ({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        nik: data.nik,
                    }));

                const vendorPromises = jsonData
                    .map((data) => ({
                        namaVendor: data.namaVendor,
                        kodeVendor: data.kodeVendor,
                    }));
                    existingUsers.forEach((user) => {
                        userPromises.splice(
                            userPromises.findIndex(
                                (data) =>
                                    data.firstName === user.firstName &&
                                    data.lastName === user.lastName &&
                                    data.nik === user.nik
                            ),
                            1
                        );
                    });
            
                    existingVendors.forEach((vendor) => {
                        vendorPromises.splice(
                            vendorPromises.findIndex(
                                (data) =>
                                    data.namaVendor === vendor.namaVendor &&
                                    data.kodeVendor === vendor.kodeVendor
                            ),
                            1
                        );
                    });

                // Masukkan data User dan Vendor dalam satu transaksi
                await User.bulkCreate(userPromises);
                await Vendor.bulkCreate(vendorPromises);

                res.status(200).json({
                    message: "File uploaded and data inserted into the database successfully",
                });
            } catch (error) {
                return res.status(500).json(error);
            }
        });
    },
};

export default UserController;
