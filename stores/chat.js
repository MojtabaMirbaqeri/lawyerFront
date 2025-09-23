import { defineStore } from "pinia";
import { ref, computed } from "vue";


export const useChatStore = defineStore("chat",() => {
    const selectedRoom = ref(0)
    const chatRooms = ref()
    const roomInfo = ref()

    const selectRoom = (room) => {
        // eslint-disable-next-line no-const-assign
        selectedRoom.value = room.id
        roomInfo.value = room
        console.log(roomInfo.value);
    }

    

    return {selectRoom,selectedRoom,chatRooms,roomInfo}
})