import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalProps,
} from "@nextui-org/react";
import { Fragment } from "react/jsx-runtime";
import { useImperativeHandle, forwardRef } from "react";

export interface ModalContainerRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
}

type Props = ModalProps & {
  title?: string;
  bodyContent: JSX.Element;
};

export const ModalContainer = forwardRef<ModalContainerRef, Props>(
  ({ title, bodyContent, ...props }, ref) => {
    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          // This would need to be handled by the parent component
          // since NextUI Modal doesn't expose imperative methods directly
          console.log("Modal open requested");
        },
        close: () => {
          // This would need to be handled by the parent component
          console.log("Modal close requested");
        },
        toggle: () => {
          // This would need to be handled by the parent component
          console.log("Modal toggle requested");
        },
        isOpen: () => {
          return props.isOpen || false;
        },
      }),
      [props.isOpen]
    );

    return (
      <Modal {...props}>
        <ModalContent>
          {(onClose) => (
            <Fragment>
              {title ? (
                <ModalHeader className="flex flex-col gap-1">
                  {title}
                </ModalHeader>
              ) : null}
              <ModalBody>{bodyContent}</ModalBody>
            </Fragment>
          )}
        </ModalContent>
      </Modal>
    );
  }
);

ModalContainer.displayName = "ModalContainer";

export default ModalContainer;
