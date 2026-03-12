import { View } from 'react-native';
import { Button } from 'antd';

import { modalStyles } from '../../AppStyles';

type ModalButtonsProps = {
  readonly updateItem?: (id: string) => void,
  readonly closeModal: () => void,
  readonly deleteItem?: (id: string) => void,
  readonly id: string
}

export default function ModalButtons({ updateItem, closeModal, deleteItem, id }: ModalButtonsProps) {
  return (
    <View style={modalStyles.modalActionButtons}>
      {updateItem && <Button style={modalStyles.modalButton} onClick={() => updateItem(id)}>Editar</Button>}
      {deleteItem && <Button style={modalStyles.modalButton} onClick={() => {
        closeModal();
        deleteItem?.(id)
      }}>Eliminar</Button>}
    </View>
  );
}
