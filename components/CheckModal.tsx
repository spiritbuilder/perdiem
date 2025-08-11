import { Modal, SafeAreaView, Text } from "react-native";

const CheckModal = ({ modal, time }: { modal: boolean; time: string }) => {
  return (
    <Modal animationType="fade" visible={modal}>
      <SafeAreaView>
        <Text>I am very cool {time}</Text>
      </SafeAreaView>
    </Modal>
  );
};


export default CheckModal
