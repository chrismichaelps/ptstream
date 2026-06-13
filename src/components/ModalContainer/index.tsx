import { Fragment, ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalProps,
} from "@nextui-org/react";

type Props = Omit<ModalProps, "children"> & {
  title?: string;
  bodyContent: ReactNode;
};

export const ModalContainer = ({ title, bodyContent, ...props }: Props) => (
  <Modal {...props}>
    <ModalContent>
      {() => (
        <Fragment>
          {title ? (
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
          ) : null}
          <ModalBody>{bodyContent}</ModalBody>
        </Fragment>
      )}
    </ModalContent>
  </Modal>
);

export default ModalContainer;
