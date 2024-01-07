import React, { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Field, Form, Formik } from "formik";
import Compressor from "compressorjs"
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    useToast,
    Image,
    Box,
    Text,
    Flex,
    Center,
    Textarea
} from "@chakra-ui/react";
import bgimage from "../assets/image.svg";

export const FormItem = ({ idEdit, handleCloseModals, formStatus }) => {
    const toast = useToast(); 
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (formStatus === "Edit") {
            const fetchData = async () => {
                try {
                    // const response = await fetch(
                    //     `http://localhost:5000/products/${idEdit}`
                    // );
                    const response = await fetch(
                        `http://localhost:5000/api/v1/products/${idEdit}`
                    );
                    // const response = await fetch(
                    //     `https://services.rwahyus.online/api/v1/products/${idEdit}`
                    // );
                    const jsonData = await response.json();
                    setTitle(jsonData.name);
                    setDesc(jsonData.description);
                    setImage(jsonData.url);
                } catch (error) {
                    console.log("Error fetching data:", error);
                }
            };
            fetchData();
        }
    }, []);

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSubmit();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        handleCloseModals();
        const formData = new FormData();
        formData.append("file", file);
        console.log(formData);

        try {
            const response = await fetch(
                formStatus === "Edit"
                    ? `http://localhost:5000/api/v1/products/${idEdit}`
                    : "http://localhost:4001/api/v1/inventory/upload",
                {
                    method: formStatus === "Edit" ? "PATCH" : "POST",
                    body: formData,
                }
            )
            // .then(response => response.json())
            // .then(data => {
            //     if (data.message) {
            //         console.log(data.message); // Ini adalah pesan dari server
            //     }
            //     if (data.inventoryPromises) {
            //         console.log( data.inventoryPromises); // Ini adalah pesan yang Anda tambahkan
            //     }
            // })
            if (response.ok) {
                toast({
                    position: "top",
                    title: "Success",
                    description: `Yeay data berhasil ${formStatus === "Edit" ? "diperbarui" : "disimpan"}`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                throw new Error("Network response was not ok");
            }
        } catch (error) {
            console.log("Error:", error);
            toast({
                position: "top",
                title: "Error",
                description: "Yah error",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Menangani drop gambar
    const onDrop = useCallback(async (acceptedFiles) => {
        let acceptedFile = acceptedFiles[0];
        // const fileSizeInMB = acceptedFile.size / (1024 * 1024);
        // console.log(fileSizeInMB + " MB");
        console.log(acceptedFile.name);
        let reader = new FileReader();
        reader.readAsDataURL(acceptedFile);
        setFile(acceptedFile);
        // reader.onload = async () => {
        //     setImage(reader.result);
    
        //     try {
        //         const compressedFile = await new Promise((resolve, reject) => {
        //             new Compressor(acceptedFile, {
        //                 quality: 0.8,
        //                 convertSize: 2000000,
        //                 success(result) {
        //                     resolve(result);
        //                 },
        //                 error(error) {
        //                     reject(error);
        //                 },
        //             });
        //         });
    
        //         setFile(compressedFile);
        //         console.log(`(${compressedFile.size / (1024 * 1024)}) MB`);
        //     } catch (error) {
        //         console.error(error.message);
        //     }
        // };
    }, []);

    // Pengaturan useDropzone
    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: ['./csv'],
        noClick: false,
        noKeyboard: true,
    });
    return (
        <Formik>
            <Box className="flex justify-center items-center">
                <Form
                    onSubmit={handleSubmit}
                    onKeyDown={handleKeyDown}
                    className="my-7 p-[16px] w-5/6 border-8 bg-white border-slate-100 drop-shadow-md rounded-[24px]"
                >
                    <Flex className="space-x-4">
                        {/* Bagian Pertama */}
                        <Box className="flex justify-center items-center" flex="1">
                            <Box className="flex flex-col justify-between items-center h-full w-full p-3 pb-5">
                                <Button className="w-full" colorScheme="teal" type="submit">
                                    Submit
                                </Button>
                            </Box>
                        </Box>

                        {/* Bagian Kedua */}
                        <Box className="flex justify-center items-center" flex="1">
                            <Box className="flex flex-col justify-between bg-white items-center h-full w-full p-3 drop-shadow-md rounded-[8px]">
                                <Text className=" text-center font-semibold text-lg md:text-xl mb-4">
                                    Upload your image
                                </Text>
                                {/* Menggunakan getRootProps untuk dropzone */}
                                <Box
                                    {...getRootProps({
                                        className:
                                            "flex-col justify-center bg-gray-50 border-2 border-sky-200 w-3/4 border-dashed rounded-md mb-6",
                                    })}
                                >
                                    {/* Input untuk dropzone */}
                                        <Input {...getInputProps({ name: "image" })} />
                                    {/* Menampilkan gambar yang di-drop */}
                                    {/* <Image
                                        src={image ? image : bgimage}
                                        className="w-1/2 mx-auto mt-4"
                                        boxSize={image ? "200px" : null}
                                        objectFit={image ? "cover" : null}
                                    /> */}
                                    <Text className="text-slate-400 md:text-md text-center mt-2 text-sm">
                                        Drag & Drop your image here
                                    </Text>
                                    <Text className="text-center font-normal text-slate-400 text-xs mt-2 mb-2">
                                        Or
                                    </Text>
                                    {/* Tombol "Choose a file" */}
                                </Box>
                                <Center axis="both" className="mb-2">
                                    <Button
                                        colorScheme="cyan"
                                        onClick={open}
                                        className=" hover:bg-cyan-500 text-black font-normal rounded-lg w-full text-md"
                                    >
                                        Choose a file
                                    </Button>
                                </Center>
                            </Box>
                        </Box>
                    </Flex>
                </Form>
            </Box>
        </Formik>
    );
};
