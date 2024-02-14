<script setup lang="ts">
  import { ref, Ref, onMounted, toRaw, reactive, watchEffect } from 'vue'
  import { useTimer } from 'vue-timer-hook'
  import Header from '~/components/home-page-parts/Header.vue'
  import MobileNavbar from '~/components/home-page-parts/MobileNavbar.vue'
  import { screen } from '~/mixins/check-screen'
  import { getImage } from '~/mixins/get-icon'
  import EventTasks from '~/components/event-page-parts/EventTasks.vue'
  import MyTasks from '~/components/event-page-parts/MyTasks.vue'
  import AddNewEvent from '~/components/event-page-parts/AddNewEvent.vue'
  import { eventsInfo } from '~/stores/events'
  import { authInfo } from "~/stores/auth"
  import { profileData } from '~/stores/profile'
  import {ChevronUpDownIcon} from "@heroicons/vue/20/solid"
  import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/vue"
  import {TEvents} from "~/types"
  import InvitePeople from "~/components/event-page-parts/InvitePeople.vue"
  import DeleteInviteModal from '~/components/event-page-parts/DeleteInviteModal.vue'
  // import WarningModal from "~/components/home-page-parts/parts/WarningModal.vue"

  const { checkScreen } = screen.setup()
  const { getIcon } = getImage.setup()
  const event = eventsInfo()
  const auth = authInfo()
  const profile = profileData()
  const router = useRouter()
  const allUserEvents = toRaw(event.events)
  let eventsSelected = ref<TEvents[]>([])
  const allInvitation = reactive(toRaw(event.allInvitation))
  const selectedEvents: Ref<TEvents> = ref({
    _id: 0,
    name: '',
    date: ''
  })

  function getEventName() {
    eventsSelected.value = allUserEvents.map(event => ({
      name: event.name,
      _id: event._id,
      date: event.date
    }))

    if (eventsSelected.value.length > 0) {
      selectedEvents.value = eventsSelected.value[0]
    }
  }

  function getDate(taskDate: string)  {
    const date = new Date(taskDate)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  function getEventDate(eventDate: string) {
    const targetDate = new Date(eventDate)
    const currentTime = new Date()
    const timeDifference = targetDate - currentTime
    const timer = useTimer(new Date(Date.now() + timeDifference))
    return timer
  }

  onMounted(async() => {
    auth.setToken(null)
    if(auth.isAuthenticated) {
      // await event.getTasks()
      await event.getEvents()
      await event.getAllInvitation()
      await profile.getProfileInfo()
      if (profile.profileInfo.user_type === 'vendor') router.push({ path: '/' })
    } else {
      router.push({ path: '/' })
    }
    getEventName()
  })
</script>

<template>
  <Header />
  <div class="event-background">
    <div class="event-container">
      <div class="flex flex-col gap-3" :class="{ 'mobile-container': !checkScreen }">
        <p class="event-name">{{ selectedEvents.name }}</p>
        <p>{{ getDate(selectedEvents.date) }} 🎉</p>
      </div>
      <div class="flex gap-4 flex-wrap items-center" :class="{ 'justify-end': !checkScreen }">
        <div class="flex gap-8">
          <div v-if="!allInvitation[0]?.is_accepted" @click="event.showInvitationModal(selectedEvents.id)" class="flex items-center gap-4 take-event">
            <img :src="getIcon + 'Users.png'" />
            <p>Предлагать</p>
          </div>
          <div v-if="allInvitation[0]?.is_accepted" class="flex items-center gap-4 take-event relative">
            <img v-if="!allInvitation[0].invited_user.profile_image" :src="getIcon + 'Users.png'" />
            <img v-if="allInvitation[0].invited_user.profile_image" :src="allInvitation[0]?.invited_user.profile_image.file" />
            <p @click="event.showChangeInvitationModal(allInvitation[0]?.invited_user.full_name, allInvitation[0]?.id)">
              {{ allInvitation[0]?.invited_user.full_name }}
            </p>
            <div v-if="event.editInvidation" class="edit-invitation">
              <div class="flex items-center gap-4">
                <input type="checkbox" />
                <p class="edit-text">Может редактировать</p>
              </div>
              <div class="flex items-center gap-4">
                <img :src="getIcon + 'delete-item.png'" />
                <p @click="event.openDeleteModal" class="delete-text">Удалить</p>
              </div>
            </div>
          </div>
        </div>
        <Listbox as="div" v-model="selectedEvents">
          <div class="relative pills-content">
            <ListboxButton class="flex gap-4">
              <div class="flex items-center">
                <span class="block truncate">{{ selectedEvents.name }}</span>
              </div>
              <div class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            </ListboxButton>

            <transition
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
              <ListboxOptions
                  class="absolute left-0 top-12 z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption as="template" v-for="type in eventsSelected" :key="type.id" :value="type" v-slot="{ active, selected }">
                  <li :class="[active ? 'bg-gray-300 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                    <div class="flex items-center">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">{{ type.name }}</span>
                    </div>
                  </li>
                </ListboxOption>
                <div class="new-task">
                  <p @click="event.showAddEventModal">+ Добавить ивент</p>
                </div>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
        <div class="flex gap-3">
          <div class="flex flex-col">
            <p class="time-container">{{ getEventDate(selectedEvents.date).days }}</p>
            <p class="date-container">День</p>
          </div>
          <div class="flex flex-col">
            <p class="time-container">{{ getEventDate(selectedEvents.date).hours }}</p>
            <p class="date-container">Часы</p>
          </div>
          <div class="flex flex-col">
            <p class="time-container">{{ getEventDate(selectedEvents.date).minutes }}</p>
            <p class="date-container">Мин</p>
          </div>
          <div class="flex flex-col">
            <p class="time-container">{{ getEventDate(selectedEvents.date).seconds }}</p>
            <p class="date-container">Сек</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="event-content">
    <div class="h-screen">
      <EventTasks
          v-if="!event.showTaskList"
      />
      <MyTasks
          v-if="event.showTaskList"
          :currentEvent="selectedEvents"
      />
      <InvitePeople />
      <AddNewEvent v-if="event.showCreateEventModal" />
    </div>
    <DeleteInviteModal />
  </div>
<!--  <WarningModal />-->
  <MobileNavbar v-if="!checkScreen" />
</template>

<style scoped>
  .date-container {
    color: rgba(73, 81, 111, 0.60);
    text-align: center;
    font-family: 'Geologica';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    height: 100%;
  }
  .time-container {
    display: flex;
    flex: 0 1 25%;
    background-color: #404549;
    padding: 10px 12px;
    color: #fff;
    color: rgba(73, 81, 111, 0.80);
    text-align: center;
    font-family: 'ZCOOL QingKe HuangYou';
    font-size: 40px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    border-radius: 4px;
    background: linear-gradient(180deg, #FFF 0%, #FDFDFD 44.82%, #E5E4E4 100%);
    box-shadow: 0 1px 3px 0 #FFF inset;
    min-width: 70px;
    justify-content: center;
  }
  .event-name {
    color: #49516F;
    text-align: center;
    font-family: 'Geologica';
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
  }
  .new-task {
    display: flex;
    justify-content: center;
    padding: 9px 60px 9px 24px;
  }
  .new-task p {
    color: #FF385C !important;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    cursor: pointer;
  }
  .mobile-container {
    flex: 0 1 60%;
    height: 100%;
    justify-content: flex-start;
    margin: 20px 0 0 21px;
  }
  .delete-text {
    color: #FF385C !important;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .edit-text {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .edit-invitation {
    display: inline-flex;
    padding: 32px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 32px;
    border-radius: 24px;
    background: #FFF;
    box-shadow: 0 13px 23px 0 rgba(0, 0, 0, 0.06);
    position: absolute;
    top: 95%;
    right: 0;
    z-index: 99;
    min-width: max-content;
  }
  .pills-content {
    display: flex;
    padding: 16px 16px 16px 24px;
    align-items: flex-start;
    gap: 15px;
    border-radius: 14px;
    background: #F7F7F7;
  }
  .pills-content p {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    cursor: pointer;
  }
  .pills-content span {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .pills-content button {
    min-width: 200px;
  }
  .event-background {
    background: url("/event-background.png") no-repeat;
    background-size: cover;
    height: 186px;
  }
  .take-event {
    padding: 9px 16px 9px 9px;
    border-radius: 30px;
    background: #FFF;
    cursor: pointer;
  }
  .take-event p {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .take-event img {
    max-width: 40px;
    max-height: 40px;
  }
  .my-events-selected {
    max-width: 258px;
    max-height: 58px;
    padding: 16px 16px 20px 24px;
    border-radius: 14px;
    background: #FFF;
  }
  .my-events-selected p {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .event-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
  }
  .event-content {
    background: #F9F9F9;
    display: flex;
    justify-content: center;
    padding-top: 32px;
  }
  @media (max-width: 600px) {
    .event-content {
      height: auto;
      margin-bottom: 80px;
    }
    .event-container {
      padding: 20px;
    }
  }
</style>