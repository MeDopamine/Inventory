import React, { useEffect, useState } from "react";
import { FormItem } from "./FormItem";
import { AddIcon } from "@chakra-ui/icons";
import {
    Box,
    Flex,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react";

export const PopupModal = ({ isRefresh, setIsRefresh, isEdit, idEdit }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalStatus, setModalStatus] = useState("");

    useEffect(() => {
        setModalStatus(isEdit);
    }, [isEdit]);
    useEffect(() => {
        if (modalStatus === "Add") {
            onOpen();
        }
        if (modalStatus === "Edit") {
            onOpen();
        }
    }, [modalStatus]);

    const handleModals = (status, id) => {
        if (status === "Add") {
            setModalStatus(status);
        }
    };

    const handleCloseModals = () => {
        setModalStatus("");
        onClose();
        setIsRefresh(!isRefresh);
    };

    return (
        <>
            <Flex
                direction="column"
                justifyContent="flex-end"
                alignItems="center"
                position="fixed"
                bottom="2rem"
                width="100%"
            >
                <Box direction="column" bg="slate.50">
                    <IconButton
                        isRound={true}
                        variant="solid"
                        colorScheme="teal"
                        aria-label="Add"
                        fontSize="20px"
                        size="lg"
                        icon={<AddIcon />}
                        onClick={() => handleModals("Add")}
                    />
                </Box>
            </Flex>
            <Modal
                closeOnOverlayClick={false}
                onClose={() => handleCloseModals()}
                isOpen={isOpen}
                size={"xl"}
                motionPreset="slideInBottom"
                isCentered
            >
                <ModalOverlay backdropFilter="blur(3px) " />
                <ModalContent maxH="900px" maxW="1200px">
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormItem
                            idEdit={idEdit}
                            handleCloseModals={handleCloseModals}
                            formStatus={modalStatus}
                        />
                    </ModalBody>
                    <ModalFooter></ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
